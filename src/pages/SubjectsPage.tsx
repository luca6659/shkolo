import { useState } from 'react'
import { BookOpen, Check, ChevronDown, ChevronRight, Headphones, Languages, Lock, MessageCircle, Mic2, Sparkles, Volume2 } from 'lucide-react'
import { subjects } from '../data'
import { useApp } from '../AppContext'
import { PageHeading, Progress } from '../components/UI'

const icons: Record<string, typeof Languages> = {
  speaking: MessageCircle, listening: Headphones, words: BookOpen,
  grammar: Languages, reading: BookOpen, pronunciation: Mic2,
}

export default function SubjectsPage() {
  const { setSubjectId, setPage, showToast } = useApp()
  const [level, setLevel] = useState('A2')
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
        action={<label className="grade-select"><span>Уровень</span><select value={level} onChange={(event) => { setLevel(event.target.value); showToast(`Уровень ${event.target.value}`, 'Сложность и темы уже обновлены') }}>{['A1','A2','B1','B2'].map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={17} /></label>}
      />
      <div className="adaptive-note"><Sparkles size={20} /><span><b>AI-подбор заданий</b> понимает, где ты спотыкаешься, и адаптирует темп</span><strong>NO BORING</strong></div>
      <div className="subjects-grid">
        {subjects.map((subject) => {
          const Icon = icons[subject.id] ?? Volume2
          const isExpanded = expanded === subject.id
          return (
            <article className={`subject-card ${isExpanded ? 'subject-expanded' : ''}`} key={subject.id} style={{ '--subject': subject.color, '--subject-soft': subject.soft } as React.CSSProperties}>
              <div className="subject-main">
                <span className="subject-icon"><Icon size={29} strokeWidth={2.2} /></span>
                <div className="subject-copy"><h2>{subject.name}</h2><p>{subject.description}</p></div>
                <span className="subject-percent">{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} color={subject.id === 'listening' ? 'blue' : 'green'} />
              <div className="subject-meta"><span>{subject.lessons} уроков пройдено</span><button onClick={() => setExpanded(isExpanded ? '' : subject.id)} aria-expanded={isExpanded}>{isExpanded ? 'Скрыть' : 'Темы'}<ChevronDown size={16} /></button></div>
              {isExpanded && (
                <div className="topic-list">
                  {subject.topics.map((topic, index) => <div key={topic}><span className={index < 2 ? 'topic-done' : index === 2 ? 'topic-current' : 'topic-locked'}>{index < 2 ? <Check size={14} /> : index === 2 ? index + 1 : <Lock size={12} />}</span><b>{topic}</b><small>{index < 2 ? 'Готово' : index === 2 ? 'В процессе' : 'Закрыто'}</small></div>)}
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
