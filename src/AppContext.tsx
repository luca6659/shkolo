import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { subjects } from './data'
import type { PageId, ShopItem, Subject } from './types'

type Toast = { title: string; text?: string } | null
type User = { name: string }

type AppContextValue = {
  user: User
  page: PageId
  setPage: (page: PageId) => void
  subject: Subject
  setSubjectId: (id: string) => void
  lessonOpen: boolean
  activeLessonId: number
  completedLessons: number[]
  startLesson: (lessonId?: number) => void
  closeLesson: () => void
  coins: number
  gems: number
  xp: number
  streak: number
  completed: number
  finishLesson: (earnedXp: number, earnedCoins: number) => void
  buyItem: (item: ShopItem) => boolean
  owned: string[]
  avatar: string
  setAvatar: (avatar: string) => void
  dark: boolean
  setDark: (value: boolean) => void
  sound: boolean
  setSound: (value: boolean) => void
  notifications: boolean
  setNotifications: (value: boolean) => void
  parentMode: boolean
  setParentMode: (value: boolean) => void
  toast: Toast
  showToast: (title: string, text?: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function stored<T>(key: string, initial: T): T {
  try {
    const value = localStorage.getItem(`shkolo-${key}`)
    return value ? JSON.parse(value) : initial
  } catch {
    return initial
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const user: User = { name: 'Ученик' }
  const [page, setPage] = useState<PageId>('home')
  const [subjectId, setSubjectId] = useState('speaking')
  const [lessonOpen, setLessonOpen] = useState(false)
  const [activeLessonId, setActiveLessonId] = useState(4)
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => stored('completed-lessons', [1, 2, 3]))
  const [coins, setCoins] = useState(() => stored('coins', 1280))
  const [gems, setGems] = useState(() => stored('gems', 46))
  const [xp, setXp] = useState(() => stored('xp', 1280))
  const [streak] = useState(12)
  const [completed, setCompleted] = useState(() => stored('completed', 34))
  const [owned, setOwned] = useState<string[]>(() => stored('owned', []))
  const [avatar, setAvatar] = useState(() => stored('avatar', 'УЧ'))
  const [dark, setDark] = useState(() => stored('dark', false))
  const [sound, setSound] = useState(() => stored('sound', true))
  const [notifications, setNotifications] = useState(() => stored('notifications', true))
  const [parentMode, setParentMode] = useState(false)
  const [toast, setToast] = useState<Toast>(null)

  const subject = subjects.find((item) => item.id === subjectId) ?? subjects[0]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('shkolo-dark', JSON.stringify(dark))
  }, [dark])

  useEffect(() => { localStorage.setItem('shkolo-coins', JSON.stringify(coins)) }, [coins])
  useEffect(() => { localStorage.setItem('shkolo-gems', JSON.stringify(gems)) }, [gems])
  useEffect(() => { localStorage.setItem('shkolo-xp', JSON.stringify(xp)) }, [xp])
  useEffect(() => { localStorage.setItem('shkolo-completed', JSON.stringify(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('shkolo-completed-lessons', JSON.stringify(completedLessons)) }, [completedLessons])
  useEffect(() => { localStorage.setItem('shkolo-owned', JSON.stringify(owned)) }, [owned])
  useEffect(() => { localStorage.setItem('shkolo-avatar', JSON.stringify(avatar)) }, [avatar])
  useEffect(() => { localStorage.setItem('shkolo-sound', JSON.stringify(sound)) }, [sound])
  useEffect(() => { localStorage.setItem('shkolo-notifications', JSON.stringify(notifications)) }, [notifications])

  const showToast = (title: string, text?: string) => {
    setToast({ title, text })
    window.setTimeout(() => setToast(null), 3200)
  }

  const buyItem = (item: ShopItem) => {
    if (owned.includes(item.id)) {
      showToast('Уже в коллекции', 'Этот предмет можно найти в профиле')
      return false
    }
    const balance = item.currency === 'coins' ? coins : gems
    if (balance < item.price) {
      showToast('Не хватает валюты', 'Проходи уроки и выполняй квесты')
      return false
    }
    if (item.currency === 'coins') setCoins((value) => value - item.price)
    else setGems((value) => value - item.price)
    setOwned((items) => [...items, item.id])
    if (item.category === 'avatar') setAvatar(item.id === 'fox' ? 'ЛО' : 'СП')
    showToast('Покупка готова!', `${item.name} уже в твоей коллекции`)
    return true
  }

  const finishLesson = (earnedXp: number, earnedCoins: number) => {
    setXp((value) => value + earnedXp)
    setCoins((value) => value + earnedCoins)
    setCompleted((value) => value + 1)
    setCompletedLessons((items) => items.includes(activeLessonId) ? items : [...items, activeLessonId])
  }

  const value = useMemo<AppContextValue>(() => ({
    user,
    page, setPage, subject, setSubjectId, lessonOpen, activeLessonId, completedLessons,
    startLesson: (lessonId = 4) => { setActiveLessonId(lessonId); setLessonOpen(true) }, closeLesson: () => setLessonOpen(false),
    coins, gems, xp, streak, completed, finishLesson, buyItem, owned, avatar, setAvatar,
    dark, setDark, sound, setSound, notifications, setNotifications, parentMode, setParentMode,
    toast, showToast,
  }), [page, subject, lessonOpen, activeLessonId, completedLessons, coins, gems, xp, streak, completed, owned, avatar, dark, sound, notifications, parentMode, toast])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
