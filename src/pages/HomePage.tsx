import { useRef, useState, type PointerEvent } from 'react'
import { BookOpen, Check, ChevronRight, Crown, Flame, Headphones, Lock, MessageCircle, Mic2, Play, ShieldCheck, Sparkles, Star, Swords, Target, Trophy, Zap } from 'lucide-react'
import { useApp } from '../AppContext'
import { Progress } from '../components/UI'

const levels = [
  { id: 1, title: 'Warm-up', icon: Check },
  { id: 2, title: 'New words', icon: Check },
  { id: 3, title: 'Listen up!', icon: Headphones },
  { id: 4, title: 'Small talk', icon: MessageCircle },
  { id: 5, title: 'Grammar boost', icon: Star },
  { id: 6, title: 'Real-life talk', icon: Lock },
  { id: 7, title: 'Sound natural', icon: Mic2 },
  { id: 8, title: 'Speaking final', icon: Trophy },
]

function DraggableSticker({ text, className, onClick }: { text: string; className: string; onClick: () => void }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
  }
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return
    setOffset({ x: drag.current.ox + event.clientX - drag.current.x, y: drag.current.oy + event.clientY - drag.current.y })
  }
  return <button className={`hero-sticker ${className}`} style={{ transform: `translate(${offset.x}px, ${offset.y}px) rotate(var(--sticker-rotate))` }} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onClick={onClick} aria-label={`${text}. Стикер можно перетаскивать`}>{text}</button>
}

export default function HomePage() {
  const { startLesson, setPage, subject, showToast, completedLessons } = useApp()
  const nextLesson = levels.find((level) => !completedLessons.includes(level.id))?.id ?? 8

  return (
    <div className="home-layout">
      <section className="learning-column">
        <div className="unit-banner">
          <div>
            <button className="unit-back" onClick={() => setPage('subjects')}><BookOpen size={17} /> A2 · {subject.name}</button>
            <h1>Small talk,<br />big energy</h1>
            <p>От «hello» до настоящих диалогов — без зубрёжки</p>
          </div>
          <img src="/mascot.svg" alt="Арабский студент в академической шапочке" />
          <DraggableSticker text="ENGLISH ERA" className="sticker-one" onClick={() => showToast('Твоя English era', 'Сегодня говорим увереннее, чем вчера')} />
          <DraggableSticker text="SPEAK UP!" className="sticker-two" onClick={() => showToast('Speak up!', 'Громче, смелее и без страха ошибиться')} />
        </div>

        <button className="primary-button continue-button" onClick={() => startLesson(nextLesson)}>
          <Play size={20} fill="currentColor" /> Продолжить: {levels[nextLesson - 1].title}
          <span>6 заданий</span>
        </button>

        <div className="learning-path" aria-label="Карта уроков английского">
          <svg className="path-line" viewBox="0 0 500 860" preserveAspectRatio="none" aria-hidden="true"><path d="M250 18 C90 80 95 150 250 210 C405 270 405 345 250 405 C95 465 95 540 250 600 C405 660 405 735 250 842" /></svg>
          {levels.map((level, index) => {
            const Icon = level.icon
            const status = completedLessons.includes(level.id) ? 'done' : level.id === nextLesson ? 'current' : level.id > nextLesson ? 'locked' : 'open'
            return <div className={`level-row level-position-${index % 4}`} key={level.id}>
              <button className={`level-node level-${status}`} aria-label={`${level.title}: ${status === 'locked' ? 'закрыто' : status === 'done' ? 'пройдено' : 'доступно'}`} onClick={() => status === 'locked' ? showToast('Пока locked', 'Сначала пройди предыдущие уровни') : startLesson(level.id)}>
                <Icon size={status === 'current' ? 30 : 26} strokeWidth={2.7} />
                {status === 'current' && <span className="level-pulse" />}
              </button>
              <div className="level-caption"><strong>{level.title}</strong><span>{status === 'done' ? 'Пройдено · 6 заданий' : status === 'current' ? 'Сейчас · 6 заданий' : status === 'locked' ? 'Пройди предыдущий урок' : '6 заданий'}</span></div>
            </div>
          })}
        </div>
      </section>

      <aside className="home-sidebar">
        <section className="side-block streak-block">
          <div className="side-title"><span><Flame size={21} /> Твой вайб</span><button onClick={() => setPage('profile')}>Всё</button></div>
          <div className="streak-summary"><strong>12</strong><div><b>дней подряд</b><span>Рекорд — 18 дней</span></div></div>
          <div className="week-days">{['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((day, index) => <div key={`${day}-${index}`}><span className={index < 5 ? 'day-done' : index === 5 ? 'day-today' : ''}>{index < 5 ? <Check size={14} /> : day}</span><small>{index === 5 ? 'сегодня' : ''}</small></div>)}</div>
        </section>
        <section className="side-block daily-goal"><div className="side-title"><span><Target size={21} /> Цель на день</span><b>2 / 3</b></div><Progress value={66} /><p>Ещё один урок — и daily goal в кармане!</p></section>
        <section className="side-block quest-block">
          <div className="side-title"><span><Zap size={21} /> Daily quests</span><span className="quest-time">6 ч 24 мин</span></div>
          <div className="quest-item"><span className="quest-icon"><BookOpen size={20} /></span><div><b>Выучи 10 новых слов</b><Progress value={60} color="yellow" /><small>6 / 10 · награда 30 монет</small></div></div>
          <div className="quest-item"><span className="quest-icon"><Sparkles size={20} /></span><div><b>Заработай 40 XP</b><Progress value={75} color="yellow" /><small>30 / 40 · награда 10 монет</small></div></div>
          <div className="quest-item"><span className="quest-icon"><ShieldCheck size={20} /></span><div><b>5 ответов без ошибок</b><Progress value={40} color="yellow" /><small>2 / 5 · награда 1 кристалл</small></div></div>
        </section>
        <button className="battle-promo" onClick={() => setPage('leaderboard')}><span className="battle-promo-icon"><Swords size={28} /></span><span><b>Word battle</b><small>Покажи, чей English сильнее</small></span><ChevronRight size={20} /></button>
        <div className="league-mini"><Crown size={22} /><span><b>Gold league</b><small>До повышения: 220 XP</small></span><Progress value={78} color="yellow" /></div>
      </aside>
    </div>
  )
}
