import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Headphones, Languages, MessageCircle, Mic2, Volume2 } from 'lucide-react'
import { lessons } from '../lessons'
import { useSchool } from '../SchoolContext'
import { subjects } from '../data'
import { useApp } from '../AppContext'
import { PageHeading, Progress } from '../components/UI'

const icons: Record<string, typeof Languages> = {
  speaking: MessageCircle, listening: Headphones, words: BookOpen,
  grammar: Languages, reading: BookOpen, pronunciation: Mic2,
}

export default function SubjectsPage() {
  const { setSubjectId, setPage } = useApp()
  const { completedLessons } = useSchool()
  const [expanded, setExpanded] = useState('speaking')

  const openSubject = (id: string) => {
    setSubjectId(id)
    setPage('home')
  }

  return (
    <div className="page-container skills-page">
      <PageHeading
        title="Твой английский"
        text="Не зубри. Говори, слушай и собирай свой English skill set"
      />
      <div className="subjects-grid">
        {subjects.map((subject) => {
          const relevantLessons = lessons.filter(l => subject.lessonIds.includes(l.id))
          const done = relevantLessons.filter(l => completedLessons.includes(l.id)).length
          const percent = Math.round(100 * done / relevantLessons.length)
          const Icon = icons[subject.id] ?? Volume2
          const isExpanded = expanded === subject.id
          return (
            <article className={`subject-card ${isExpanded ? 'subject-expanded' : ''}`} key={subject.id} style={{ '--subject': subject.color, '--subject-soft': subject.soft } as React.CSSProperties}>
              <div className="subject-main">
                <span className="subject-icon"><Icon size={29} strokeWidth={2.2} /></span>
                <div className="subject-copy"><h2>{subject.name}</h2><p>{subject.description}</p></div>
                <span className="subject-percent">{percent}%</span>
              </div>
              <Progress value={percent} color={subject.id === 'listening' ? 'blue' : 'green'} />
              <div className="subject-meta"><span>Пройдено {done} из {relevantLessons.length}</span><button onClick={() => setExpanded(isExpanded ? '' : subject.id)} aria-expanded={isExpanded}>{isExpanded ? 'Скрыть' : 'Темы'}<ChevronDown size={16} /></button></div>
              {isExpanded && (
                <div className="topic-list">
                  {relevantLessons.map(l => <div key={l.id}><b>{l.title}</b><small>{completedLessons.includes(l.id) ? 'Пройдено' : 'Урок ' + l.id}</small></div>)}
                  <button className="secondary-button" onClick={() => openSubject(subject.id)}>Прокачать навык<ChevronRight size={17} /></button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
