import { useEffect, useRef, useState } from 'react'
import { Bell, BookOpen, CalendarDays, Check, ChevronRight, Coins, Download, Flame, Gem, LogOut, Moon, Music2, ShieldCheck, Sparkles, Trophy, Volume2, Zap } from 'lucide-react'
import SchoolAdmin from '../components/SchoolAdmin'
import { useSchool } from '../SchoolContext'
import { useApp } from '../AppContext'
import { Avatar, PageHeading, Progress, Toggle } from '../components/UI'

export default function ProfilePage() {
  const { user, logout, dark, setDark, sound, setSound, notifications, setNotifications, parentMode, setParentMode, showToast } = useApp()
  const { self: { xp, completed }, coins, gems, streak, avatar, setAvatar, stratum, isAdmin, owned, completedLessons } = useSchool()
  const [adminOpen, setAdminOpen] = useState(false)
  const adminPanel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (adminOpen) adminPanel.current?.scrollIntoView({ block: 'start' })
  }, [adminOpen])
  const badges = [
    { name: 'Первый урок', earned: completed > 0, icon: BookOpen },
    { name: 'Первые 100 XP', earned: xp >= 100, icon: Zap },
    { name: 'Карта пройдена', earned: completedLessons.length === 8, icon: Trophy },
  ]
  const initials = user?.name.slice(0,2).toUpperCase() || ''
  const [timeLimit, setTimeLimit] = useState(45)
  const level = Math.floor(xp / 500) + 1
  const levelProgress = ((xp % 500) / 500) * 100

  const downloadReport = () => {
    const content = `Отчёт Школо\nУченик: ${user?.name}\nEmail: ${user?.email}\nУровень: ${level}\nОпыт: ${xp} XP\nУроков пройдено: ${completed}\nСерия: ${streak} дней\nЛимит времени: ${timeLimit} минут`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'Отчёт Школо.txt'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Отчёт сохранён', 'Файл с успехами ученика загружен')
  }

  return (
    <div className="page-container profile-page">
      <PageHeading title="Профиль" text="Твои достижения, награды и настройки" />
      <section className="profile-hero">
        <div className="profile-avatar-wrap"><Avatar text={avatar} size="xl" /><span className="profile-avatar-badge"><Sparkles size={18} /></span></div>
        <div className="profile-info"><div className="profile-name"><h2>{user?.name}</h2><span>{stratum ? 'Страта ' + stratum : 'Без страты'}</span></div><p>{user?.email}</p><div className="level-line"><b>Уровень {level}</b><span>{xp % 500} / 500 XP</span></div><Progress value={levelProgress} /></div>
        <div className="profile-currencies"><span><Coins size={20} />{coins}</span><span><Gem size={20} />{gems}</span></div>
      </section>

      <div className="profile-stats">
        <div><span className="stat-icon stat-orange"><Flame size={24} /></span><b>{streak}</b><p>дней подряд</p></div>
        <div><span className="stat-icon stat-blue"><Zap size={24} /></span><b>{xp.toLocaleString('ru')}</b><p>всего XP</p></div>
        <div><span className="stat-icon stat-green"><BookOpen size={24} /></span><b>{completed}</b><p>уроков пройдено</p></div>
        <div><span className="stat-icon stat-yellow"><Trophy size={24} /></span><b>{completedLessons.length} / 8</b><p>уроков на карте</p></div>
      </div>

      <div className="profile-columns">
        <section className="profile-section achievements-section">
          <div className="section-title"><h2>Достижения</h2><span>{badges.filter(b => b.earned).length} из {badges.length}</span></div>
          <div className="badges-grid">{badges.map(({name, earned, icon: Icon}) => <div className={earned ? '' : 'badge-locked'} key={name}><span className="achievement-badge"><Icon size={30}/></span><b>{name}</b><small>{earned ? 'Получено' : 'Ещё впереди'}</small></div>)}</div>
          <div className="avatar-picker"><h3>Аватар</h3><div>{Array.from(new Set([initials, ...(owned.includes('fox') ? ['ЛО'] : []), ...(owned.includes('owl') ? ['СП'] : [])])).map((item, index) => <button key={item} className={avatar === item ? 'selected' : ''} onClick={() => { setAvatar(item); showToast('Аватар обновлён') }}><Avatar text={item} color={['#73BF75','#E7A25C','#82A5E8','#C78ACE'][index]} />{avatar === item && <Check size={15} />}</button>)}</div></div>
        </section>

        <section className="profile-section settings-section">
          <div className="section-title"><h2>Настройки</h2></div>
          <div className="setting-row"><span className="setting-icon"><Bell size={21} /></span><div><b>Напоминания</b><small>Не потеряй серию!</small></div><Toggle checked={notifications} onChange={setNotifications} label="Напоминания" /></div>
          <div className="setting-row"><span className="setting-icon">{sound ? <Volume2 size={21} /> : <Music2 size={21} />}</span><div><b>Звуки</b><small>Эффекты и озвучка заданий</small></div><Toggle checked={sound} onChange={setSound} label="Звуки" /></div>
          <div className="setting-row"><span className="setting-icon"><Moon size={21} /></span><div><b>Тёмная тема</b><small>Комфортно заниматься вечером</small></div><Toggle checked={dark} onChange={setDark} label="Тёмная тема" /></div>
          <div className="setting-row"><span className="setting-icon"><ShieldCheck size={21} /></span><div><b>Родительский режим</b><small>Отчёты и лимит времени</small></div><Toggle checked={parentMode} onChange={setParentMode} label="Родительский режим" /></div>
          {parentMode && <div className="parent-panel">
            <div><CalendarDays size={20} /><b>Лимит: {timeLimit} минут в день</b></div>
            <input aria-label="Лимит времени в минутах" type="range" min="15" max="120" step="15" value={timeLimit} onChange={(event) => setTimeLimit(Number(event.target.value))} />
            <div className="range-labels"><span>15 мин</span><span>120 мин</span></div>
            <button className="secondary-button" onClick={downloadReport}><Download size={17} />Скачать отчёт</button>
          </div>}
          <button className="settings-link" onClick={() => showToast('Данные профиля', `${user?.name} · ${user?.email}`)}><span>Личные данные и безопасность</span><ChevronRight size={19} /></button>
          {isAdmin && <button className="settings-link" aria-expanded={adminOpen} onClick={() => setAdminOpen(!adminOpen)}><span>Администрирование</span><ChevronRight size={19} /></button>}
          <button className="settings-link logout-link" onClick={logout}><span><LogOut size={17} /> Выйти из аккаунта</span><ChevronRight size={19} /></button>
        </section>
      </div>
      {isAdmin && adminOpen && <div ref={adminPanel} className="school-admin-anchor"><SchoolAdmin /></div>}
    </div>
  )
}
