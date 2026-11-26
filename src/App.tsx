import { useEffect, useState } from 'react'
import { Bell, BookOpen, Check, ChevronDown, Coins, Crown, Flame, Gem, Home, Medal, Settings, ShoppingBag, Sparkles, Swords, Trophy, Users } from 'lucide-react'
import { AppProvider, useApp } from './AppContext'
import Lesson from './components/Lesson'
import { Avatar, Progress } from './components/UI'
import ClassPage from './pages/ClassPage'
import HomePage from './pages/HomePage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import ShopPage from './pages/ShopPage'
import SubjectsPage from './pages/SubjectsPage'
import type { PageId } from './types'
import './App.css'

const navigation: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Дом', icon: Home },
  { id: 'subjects', label: 'Навыки', icon: BookOpen },
  { id: 'shop', label: 'Магазин', icon: ShoppingBag },
  { id: 'leaderboard', label: 'Рейтинг', icon: Trophy },
  { id: 'class', label: 'Группа', icon: Users },
  { id: 'profile', label: 'Профиль', icon: Settings },
]

const pageTitles: Record<PageId, string> = { home: 'Твой English era', subjects: 'Навыки английского', shop: 'Drop shop', leaderboard: 'English league', class: 'Кабинет преподавателя', profile: 'Твой профиль' }

function Shell() {
  const { user, page, setPage, coins, gems, streak, avatar, lessonOpen, toast, showToast, xp } = useApp()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unread, setUnread] = useState(true)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [page])

  const goTo = (id: PageId) => { setPage(id); setNotificationsOpen(false) }

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <button className="brand" onClick={() => goTo('home')} aria-label="школо! — на главную"><span className="brand-wordmark">школо<span>!</span><small>english, но по кайфу</small></span><i>GO<br />SAY<br />HI</i></button>
        <nav className="side-nav" aria-label="Основная навигация">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => goTo(item.id)}><Icon size={23} strokeWidth={page === item.id ? 2.7 : 2.2} /><span>{item.label}</span>{item.id === 'class' && <small>24</small>}</button> })}</nav>
        <div className="sidebar-bottom">
          <button className="sidebar-battle" onClick={() => goTo('leaderboard')}><span><Swords size={24} /></span><div><b>Word battle</b><small>Вызвать друга</small></div></button>
          <div className="sidebar-league"><div><Crown size={19} /><b>Gold talkers</b><span>7 место</span></div><Progress value={72} color="yellow" /><small>До финала 2 дня</small></div>
        </div>
      </aside>

      <header className="mobile-header">
        <button className="mobile-brand" onClick={() => goTo('home')} aria-label="школо! — на главную"><b>школо<span>!</span></b></button>
        <div><span><Flame size={19} />{streak}</span><span><Coins size={19} />{coins}</span><button className="icon-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Уведомления"><Bell size={21} />{unread && <i />}</button></div>
      </header>

      <div className="app-content">
        <header className="topbar">
          <div><h2>{pageTitles[page]}</h2>{page === 'home' && <button onClick={() => goTo('subjects')}>English · A2 <ChevronDown size={15} /></button>}</div>
          <div className="topbar-actions">
            <button className="currency-pill streak-pill" onClick={() => goTo('profile')} title="Серия дней"><Flame size={21} /><b>{streak}</b></button>
            <button className="currency-pill coins-pill" onClick={() => goTo('shop')} title="Монеты"><Coins size={21} /><b>{coins.toLocaleString('ru')}</b></button>
            <button className="currency-pill gems-pill" onClick={() => goTo('shop')} title="Кристаллы"><Gem size={20} /><b>{gems}</b></button>
            <div className="notification-wrap">
              <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Уведомления" aria-expanded={notificationsOpen}><Bell size={22} />{unread && <i />}</button>
              {notificationsOpen && <div className="notifications-panel"><div><h3>Уведомления</h3><button onClick={() => { setUnread(false); showToast('Все уведомления прочитаны') }} aria-label="Прочитать все"><Check size={18} /></button></div><button onClick={() => { goTo('home'); setUnread(false) }}><span className="notice-icon notice-fire"><Flame size={22} /></span><span><b>Не потеряй серию!</b><small>Пройди один урок сегодня, чтобы сохранить 12 дней подряд.</small><em>10 минут назад</em></span></button><button onClick={() => { goTo('leaderboard'); setUnread(false) }}><span className="notice-icon notice-trophy"><Medal size={22} /></span><span><b>Новый турнир</b><small>Weekly English Cup уже начался. Помоги своей команде!</small><em>1 час назад</em></span></button></div>}
            </div>
            <button className="top-profile" onClick={() => goTo('profile')}><Avatar text={avatar} size="sm" /><span><b>{user.name}</b><small>Уровень {Math.floor(xp / 500) + 1}</small></span><ChevronDown size={16} /></button>
          </div>
        </header>

        <main className="main-content">
          {page === 'home' && <HomePage />}
          {page === 'subjects' && <SubjectsPage />}
          {page === 'shop' && <ShopPage />}
          {page === 'leaderboard' && <LeaderboardPage />}
          {page === 'class' && <ClassPage />}
          {page === 'profile' && <ProfilePage />}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Мобильная навигация">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => goTo(item.id)}><Icon size={22} /><span>{item.label}</span></button> })}</nav>

      {toast && <div className="app-toast" role="status"><span><Sparkles size={22} /></span><div><b>{toast.title}</b>{toast.text && <p>{toast.text}</p>}</div></div>}
      {lessonOpen && <Lesson />}
    </div>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
