import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useApp } from './AppContext'
import { supabase } from './lib/supabase'

export const strata = ['1', '2', '2Б'] as const
export type Stratum = typeof strata[number]
export type Pupil = { id: string; name: string; stratum: Stratum | null; xp: number; completed: number; lastLesson: string | null }
export type Homework = { id: string; title: string; stratum: Stratum; lesson: number; due: string; archived: boolean; done: boolean; submitted: number }
type Snapshot = {
  isAdmin: boolean; stratum: Stratum | null; roster: Pupil[]; homework: Homework[]
  completedLessons: number[]; owned: string[]; coins: number; gems: number
  days: { day: string; lessons: number; xp: number }[]
}

export function schoolDate(offset = 0) {
  const at = new Date(Date.now() + offset * 86400000)
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at)
}

type School = Snapshot & {
  self: Pupil; streak: number; avatar: string; setAvatar: (value: string) => void
  mutate: (method: string, params: Record<string, unknown>) => Promise<boolean>
  reload: () => Promise<void>
}
const Context = createContext<School | null>(null)

export function SchoolProvider({ id, children }: { id: string; children: ReactNode }) {
  const { logout, showToast } = useApp()
  const [data, setData] = useState<Snapshot | null>(null)
  const [error, setError] = useState('')
  const [choice, setChoice] = useState(() => localStorage.getItem('shkolo-avatar-' + id) || '')
  const version = useRef(0)
  const reload = useCallback(async () => {
    const request = ++version.current
    try {
      const result = await supabase.rpc('school_snapshot')
      if (result.error || !result.data) throw new Error()
      if (version.current === request) { setData(result.data); setError('') }
    } catch {
      if (version.current === request) setError('Не удалось загрузить данные школы. Проверь подключение и попробуй ещё раз.')
    }
  }, [])
  useEffect(() => {
    void reload()
    window.addEventListener('focus', reload)
    return () => { ++version.current; window.removeEventListener('focus', reload) }
  }, [reload])
  const mutate: School['mutate'] = async (method, params) => {
    try {
      const { error } = await supabase.rpc(method, params)
      if (error) {
        showToast('Не удалось сохранить', error.code === 'P0001' || error.code === '42501' ? error.message : 'Повтори попытку.')
        if (error.code === '42501') await reload()
        return false
      }
      await reload()
      return true
    } catch {
      showToast('Нет связи со школой', 'Проверь подключение и повтори попытку.')
      return false
    }
  }
  const self = data?.roster.find(p => p.id === id)
  if (!data || !self) return <main className="auth-loading"><span className="brand-wordmark">школо<span>!</span></span>
    {error ? <><p role="alert">{error}</p><button className="primary-button" onClick={reload}>Повторить</button></> : <p>Загружаем профиль…</p>}
    <button className="text-button" onClick={logout}>Выйти</button></main>
  let streak = 0
  let offset = data.days[0]?.day === schoolDate() ? 0 : -1
  for (const entry of data.days) {
    if (entry.day !== schoolDate(offset--)) break
    streak++
  }
  const setAvatar = (value: string) => { localStorage.setItem('shkolo-avatar-' + id, value); setChoice(value) }
  return <Context.Provider value={{ ...data, self, streak, avatar: choice || self.name.slice(0,2).toUpperCase(), setAvatar, mutate, reload }}>
    {error && <div className="school-error" role="alert">{error} <button onClick={reload}>Повторить</button></div>}
    {children}
  </Context.Provider>
}
export function useSchool() {
  const school = useContext(Context)
  if (!school) throw new Error('SchoolProvider is required')
  return school
}
