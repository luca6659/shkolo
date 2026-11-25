import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { subjects } from './data'
import { supabase } from './lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { PageId, ShopItem, Subject } from './types'

type Toast = { title: string; text?: string } | null
type User = { name: string; email: string }

function profileFromAuth(authUser: SupabaseUser): User {
  const email = authUser.email ?? ''
  const metadataName = authUser.user_metadata?.name
  return { name: typeof metadataName === 'string' && metadataName.trim() ? metadataName : email.split('@')[0], email }
}

function authError(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Email или пароль не совпадают. Проверь данные.'
  if (/email not confirmed/i.test(message)) return 'Email ещё не подтверждён. Зарегистрируйся снова, чтобы получить код.'
  if (/user already registered/i.test(message)) return 'Такой аккаунт уже есть. Перейди ко входу.'
  if (/token.*expired|invalid.*token|otp.*expired/i.test(message)) return 'Код неверный или устарел. Запроси новый.'
  if (/rate limit|too many requests/i.test(message)) return 'Слишком много попыток. Подожди минуту и повтори.'
  if (/failed to fetch|network/i.test(message)) return 'Нет соединения с сервером. Проверь интернет.'
  return message
}

type AppContextValue = {
  user: User | null
  authReady: boolean
  passwordRecovery: boolean
  resetPassword: (email: string) => Promise<string | null>
  updatePassword: (password: string) => Promise<string | null>
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  verifyEmail: (email: string, code: string) => Promise<string | null>
  resendCode: (email: string) => Promise<string | null>
  logout: () => Promise<void>
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
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [passwordRecovery, setPasswordRecovery] = useState(false)
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
  const [avatar, setAvatar] = useState(() => stored('avatar', 'АК'))
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

  useEffect(() => {
    let active = true
    const applyUser = (authUser: SupabaseUser | null) => {
      if (!active) return
      const nextUser = authUser ? profileFromAuth(authUser) : null
      setUser(nextUser)
      if (nextUser) setAvatar(nextUser.name.slice(0, 2).toUpperCase())
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error) applyUser(data.session?.user ?? null)
      if (active) setAuthReady(true)
    }).catch(() => { if (active) setAuthReady(true) })
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
      applyUser(session?.user ?? null)
    })
    return () => { active = false; data.subscription.unsubscribe() }
  }, [])

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/` })
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось отправить письмо.')
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (!error) setPasswordRecovery(false)
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось изменить пароль.')
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось войти. Попробуй ещё раз.')
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), password,
        options: { data: { name: name.trim() } },
      })
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось создать аккаунт. Попробуй ещё раз.')
    }
  }

  const verifyEmail = async (email: string, code: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code, type: 'signup' })
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось подтвердить код.')
    }
  }

  const resendCode = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() })
      return error ? authError(error.message) : null
    } catch (error) {
      return authError(error instanceof Error ? error.message : 'Не удалось отправить код.')
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null); setPage('home'); setLessonOpen(false)
  }

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
    user, authReady, passwordRecovery, resetPassword, updatePassword, login, register, verifyEmail, resendCode, logout,
    page, setPage, subject, setSubjectId, lessonOpen, activeLessonId, completedLessons,
    startLesson: (lessonId = 4) => { setActiveLessonId(lessonId); setLessonOpen(true) }, closeLesson: () => setLessonOpen(false),
    coins, gems, xp, streak, completed, finishLesson, buyItem, owned, avatar, setAvatar,
    dark, setDark, sound, setSound, notifications, setNotifications, parentMode, setParentMode,
    toast, showToast,
  }), [user, authReady, passwordRecovery, page, subject, lessonOpen, activeLessonId, completedLessons, coins, gems, xp, streak, completed, owned, avatar, dark, sound, notifications, parentMode, toast])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
