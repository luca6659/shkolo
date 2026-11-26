import { useState } from 'react'
import { Users } from 'lucide-react'
import { strata, useSchool, type Stratum } from '../SchoolContext'
import { useApp } from '../AppContext'
import { lessons } from '../lessons'
import { Avatar, EmptyState, PageHeading } from '../components/UI'

export default function ClassPage() {
  const { self, roster, homework, stratum, isAdmin, completedLessons } = useSchool()
  const { startLesson } = useApp()
  const [choice, setChoice] = useState<Stratum>('1')
  const current = isAdmin ? choice : stratum
  const members = roster.filter(p => p.stratum === current)
  const tasks = homework.filter(h => h.stratum === current && !h.archived)
  const next = lessons.find(l => !completedLessons.includes(l.id))?.id ?? 8
  return <div className="page-container school-page">
    <PageHeading title="Моя страта" text="Ученики и домашние задания по английскому" />
    {isAdmin && <div className="class-tabs">{strata.map(s => <button key={s} className={s === current ? 'active' : ''} onClick={() => setChoice(s)}>Страта {s}</button>)}</div>}
    {!current ? <EmptyState title="Ты пока без страты" text="Администратор добавит тебя в группу. Уроки на карте уже доступны." /> : <>
      <section className="class-header"><div className="class-title"><span className="class-emblem"><Users /></span><div><h2>Страта {current}</h2><p>Учеников в группе · {members.length}</p></div></div></section>
      <section className="profile-section"><h2>Домашние задания</h2>{!tasks.length && <p>Заданий пока нет.</p>}
        {tasks.map(h => <article className="school-row" key={h.id}><div><b>{h.title}</b><small>{lessons.find(l => l.id === h.lesson)?.title} · до {h.due.split('-').reverse().join('.')}</small></div>
          {stratum === current && (h.done ? <span>Выполнено</span> : h.lesson <= next ? <button className="secondary-button" onClick={() => startLesson(h.lesson)}>Начать урок</button> : <small>Откроется после урока {h.lesson - 1}</small>)}
          {isAdmin && <small>Сдали {h.submitted} из {members.length}</small>}
        </article>)}
      </section>
      <section className="profile-section"><h2>Ученики</h2>{members.length ? members.map(p => <div className="school-row" key={p.id}><Avatar text={p.name.slice(0,2).toUpperCase()} /><div><b>{p.name}{p.id === self.id ? ' (ты)' : ''}</b><small>Пройдено уроков · {p.completed}</small></div><strong>{p.xp} XP</strong></div>) : <p>В этой страте пока нет учеников.</p>}</section>
    </>}
  </div>
}
