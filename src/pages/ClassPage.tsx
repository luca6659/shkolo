import { useState, type FormEvent } from 'react'
import { BarChart3, BookOpen, CalendarDays, Check, ChevronDown, Clipboard, Clock3, Copy, Plus, Search, Users, X } from 'lucide-react'
import { students } from '../data'
import { useApp } from '../AppContext'
import { Avatar, Modal, PageHeading, Progress } from '../components/UI'
import type { Assignment } from '../types'

const initialAssignments: Assignment[] = [
  { id: 1, title: 'Small talk · урок 4', subject: 'Speaking', deadline: 'Сегодня, 20:00', done: 18, total: 24 },
  { id: 2, title: 'Phrasal verbs · тренажёр', subject: 'Vocabulary', deadline: '25 ноября', done: 12, total: 24 },
  { id: 3, title: 'Present Simple · 10 заданий', subject: 'Grammar', deadline: '27 ноября', done: 6, total: 24 },
]

export default function ClassPage() {
  const { showToast } = useApp()
  const [tab, setTab] = useState('overview')
  const [assignments, setAssignments] = useState(initialAssignments)
  const [assignmentOpen, setAssignmentOpen] = useState(false)
  const [classOpen, setClassOpen] = useState(false)
  const [className, setClassName] = useState('Speak Up · A2')
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Speaking')
  const [deadline, setDeadline] = useState('2026-11-26')
  const [newClass, setNewClass] = useState('')

  const addAssignment = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    setAssignments((items) => [{ id: Date.now(), title: title.trim(), subject, deadline: new Date(`${deadline}T12:00:00`).toLocaleDateString('ru', { day: 'numeric', month: 'long' }), done: 0, total: 24 }, ...items])
    setTitle(''); setAssignmentOpen(false)
    showToast('Задание опубликовано', 'Ученики получат уведомление')
  }

  const createClass = (event: FormEvent) => {
    event.preventDefault()
    if (!newClass.trim()) return
    setClassName(newClass.trim()); setNewClass(''); setClassOpen(false)
    showToast('Класс создан', 'Код приглашения: SCH-512')
  }

  const copyCode = async () => {
    try { await navigator.clipboard.writeText('SHKOLO-5A') } catch { /* clipboard may be unavailable in preview */ }
    showToast('Код скопирован', 'SHKOLO-5A')
  }

  return (
    <div className="page-container class-page">
      <PageHeading title="Мой класс" text="Задания, успеваемость и прогресс учеников" action={<button className="primary-button compact" onClick={() => setAssignmentOpen(true)}><Plus size={20} />Создать задание</button>} />
      <section className="class-header">
        <div className="class-title"><span className="class-emblem"><Users size={32} /></span><div><h2>{className}</h2><p>24 ученика · English club</p></div></div>
        <button className="class-code" onClick={copyCode}><span>Код группы</span><b>SHKOLO-5A</b><Copy size={18} /></button>
        <button className="secondary-button" onClick={() => setClassOpen(true)}><Plus size={18} />Новая группа</button>
      </section>
      <div className="class-tabs" role="tablist">{[['overview','Обзор'],['homework','Домашние задания'],['students','Ученики']].map(([id,name]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{name}</button>)}</div>

      {tab === 'overview' && <>
        <div className="class-metrics">
          <div><span><BookOpen size={23} /></span><p>Уроков за неделю</p><b>186</b><small>+12% к прошлой</small></div>
          <div><span><BarChart3 size={23} /></span><p>Средняя точность</p><b>84%</b><small>+3% к прошлой</small></div>
          <div><span><Clock3 size={23} /></span><p>Время занятий</p><b>32 ч</b><small>у всего класса</small></div>
          <div><span><Check size={23} /></span><p>Сдали домашку</p><b>75%</b><small>18 из 24 учеников</small></div>
        </div>
        <div className="class-dashboard">
          <section className="class-activity"><div className="section-title"><div><h2>Активность класса</h2><p>Пройденные уроки за неделю</p></div><span className="chart-legend"><i />Уроки</span></div><div className="bar-chart">{[['Пн',42],['Вт',68],['Ср',54],['Чт',82],['Пт',74],['Сб',34],['Вс',22]].map(([day,value]) => <div key={String(day)}><span className="bar-value">{value}</span><div className="bar-track"><i style={{ height: `${value}%` }} /></div><b>{day}</b></div>)}</div></section>
          <section className="attention-list"><div className="section-title"><h2>Нужно внимание</h2><span>3 темы</span></div>{[['Small talk','Speaking · 62% точности',62],['Word stress','Pronunciation · 68% точности',68],['Irregular verbs','Grammar · 71% точности',71]].map(([name,text,value]) => <button key={String(name)} onClick={() => { setTitle(`Повторение: ${name}`); setAssignmentOpen(true) }}><div><b>{name}</b><small>{text}</small></div><Progress value={Number(value)} color="yellow" /><Plus size={18} /></button>)}</section>
        </div>
      </>}

      {(tab === 'overview' || tab === 'homework') && <section className="assignments-section">
        <div className="section-title"><h2>{tab === 'homework' ? 'Все задания' : 'Текущие задания'}</h2><span>{assignments.length}</span></div>
        <div className="assignment-list">{assignments.map((assignment) => <article key={assignment.id}><span className="assignment-book"><BookOpen size={23} /></span><div className="assignment-info"><b>{assignment.title}</b><small>{assignment.subject}</small></div><span className="assignment-deadline"><CalendarDays size={17} />{assignment.deadline}</span><div className="assignment-progress"><b>{assignment.done} / {assignment.total}</b><Progress value={(assignment.done / assignment.total) * 100} /></div><button className="icon-button" onClick={() => showToast(assignment.title, `${assignment.done} из ${assignment.total} учеников выполнили задание`)} aria-label="Подробнее о задании"><ChevronDown size={19} /></button></article>)}</div>
      </section>}

      {(tab === 'overview' || tab === 'students') && <section className="students-section">
        <div className="section-title"><h2>Прогресс учеников</h2><label className="student-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти ученика" aria-label="Найти ученика" />{search && <button onClick={() => setSearch('')} aria-label="Очистить поиск"><X size={16} /></button>}</label></div>
        <div className="students-table"><div className="student-row student-head"><span>Ученик</span><span>Уроки</span><span>Опыт</span><span>Успеваемость</span><span>Активность</span></div>{students.filter((student) => student.name.toLowerCase().includes(search.toLowerCase())).map((student, index) => <button className="student-row" key={student.name} onClick={() => showToast(student.name, `${student.lessons} уроков · ${student.xp} XP · успеваемость ${student.progress}%`)}><span><Avatar text={student.avatar} color={['#73BF75','#7AB6EF','#D994C7','#E5A461','#8D83D8'][index]} /><b>{student.name}</b></span><span>{student.lessons}</span><span>{student.xp} XP</span><span><Progress value={student.progress} /><small>{student.progress}%</small></span><span>{student.status}</span></button>)}</div>
      </section>}

      <Modal open={assignmentOpen} onClose={() => setAssignmentOpen(false)} title="Новое задание" className="form-modal">
        <h2>Создать задание</h2><p>Выбери тему и срок — ученики увидят задание на главной.</p>
        <form onSubmit={addAssignment}>
          <label>Название задания<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Например, Ordering coffee" autoFocus /></label>
          <label>Навык<select value={subject} onChange={(event) => setSubject(event.target.value)}>{['Speaking', 'Listening', 'Vocabulary', 'Grammar', 'Reading', 'Pronunciation'].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Срок выполнения<input required type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
          <div className="assignment-format"><Clipboard size={21} /><span><b>Адаптивный набор заданий</b><small>Сложность изменится под уровень каждого ученика</small></span></div>
          <button className="primary-button" type="submit">Опубликовать задание</button>
        </form>
      </Modal>
      <Modal open={classOpen} onClose={() => setClassOpen(false)} title="Новая группа" className="form-modal small-modal">
        <h2>Новая English-группа</h2><p>После создания ты получишь код для учеников.</p>
        <form onSubmit={createClass}><label>Название и уровень<input required value={newClass} onChange={(event) => setNewClass(event.target.value)} placeholder="Например, Talk Club · B1" autoFocus /></label><button className="primary-button" type="submit">Создать группу</button></form>
      </Modal>
    </div>
  )
}
