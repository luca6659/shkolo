import { useState, type FormEvent } from 'react'
import { Archive, Download, RotateCcw, Search, Users } from 'lucide-react'
import { lessons } from '../lessons'
import { schoolDate, strata, useSchool, type Pupil, type Stratum } from '../SchoolContext'
import { useApp } from '../AppContext'

function downloadRoster(rows: Pupil[]) {
  const escape = (value: string) => {
    const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value
    return '"' + safe.replaceAll('"','""') + '"'
  }
  const data = [['Имя','Страта','XP','Пройдено уроков','Последний урок'], ...rows.map(p =>
    [p.name,p.stratum ?? '',String(p.xp),String(p.completed),p.lastLesson ? new Date(p.lastLesson).toLocaleDateString('ru-RU', {timeZone:'Europe/Moscow'}) : ''])]
  const url = URL.createObjectURL(new Blob(['\uFEFF' + data.map(row => row.map(escape).join(';')).join('\r\n')], {type:'text/csv;charset=utf-8'}))
  const link = document.createElement('a')
  link.href = url
  link.download = 'Ученики школо.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function SchoolAdmin() {
  const { isAdmin, roster, homework, mutate, reload } = useSchool()
  const { showToast } = useApp()
  const [tab,setTab] = useState('Ученики')
  const [filter,setFilter] = useState('Все')
  const [query,setQuery] = useState('')
  const [tier,setTier] = useState<Stratum>('1')
  const [lesson,setLesson] = useState(1)
  const [due,setDue] = useState(schoolDate())
  const [title,setTitle] = useState('')
  const [draftId,setDraftId] = useState(() => crypto.randomUUID())
  const [busy,setBusy] = useState(false)
  if (!isAdmin) return null
  const filtered = roster.filter(p => (filter === 'Все' || (p.stratum ?? 'Без страты') === filter) && p.name.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')))
  async function save(method: string, params: Record<string, unknown>, message: string) {
    if (busy) return false
    setBusy(true)
    try {
      const ok = await mutate(method,params)
      if (ok) showToast(message)
      return ok
    } finally { setBusy(false) }
  }
  async function publish(event: FormEvent) {
    event.preventDefault()
    if (await save('school_publish',{p_id:draftId,p_title:title,p_stratum:tier,p_lesson:lesson,p_due:due},'Задание опубликовано')) {
      setTitle('')
      setDraftId(crypto.randomUUID())
    }
  }
  return <section className="profile-section school-admin" aria-label="Администрирование">
    <div className="section-title"><h2>Администрирование</h2><button className="icon-button" aria-label="Обновить данные школы" onClick={reload}><RotateCcw size={18}/></button></div>
    <div className="class-tabs">{['Ученики','Задания','Архив'].map(t => <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === 'Ученики' ? <>
      <div className="school-counts">{strata.map(s => <button key={s} onClick={() => setFilter(s)}><Users size={18}/><span>Страта {s}</span><b>{roster.filter(p => p.stratum === s).length}</b></button>)}</div>
      <div className="school-filters"><label><Search size={16}/> Поиск по имени<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Имя ученика"/></label>
        <label>Группа<select value={filter} onChange={e => setFilter(e.target.value)}>{['Все','Без страты',...strata].map(s => <option key={s}>{s}</option>)}</select></label></div>
      <div className="section-title"><strong>Найдено · {filtered.length}</strong><button className="secondary-button" disabled={!filtered.length} onClick={() => downloadRoster(filtered)}><Download size={16}/> Скачать CSV</button></div>
      {!filtered.length && <p>По этим условиям учеников нет.</p>}
      {filtered.map(p => <div key={p.id} className="school-row"><div><b>{p.name}</b><small>{p.xp} XP · уроков {p.completed}</small><small>{p.lastLesson ? 'Последний урок ' + new Date(p.lastLesson).toLocaleDateString('ru') : 'Ещё не начинал занятия'}</small></div>
        <select aria-label={'Страта ученика ' + p.name} value={p.stratum ?? ''} disabled={busy} onChange={e => void save('school_move',{p_pupil:p.id,p_stratum:e.target.value || null},'Страта обновлена')}><option value="">Без страты</option>{strata.map(s => <option key={s} value={s}>Страта {s}</option>)}</select>
      </div>)}
    </> : <>
      {tab === 'Задания' && <form className="school-form" onSubmit={publish}><h3>Новое задание</h3>
        <label>Название<input required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label>Страта<select value={tier} onChange={e => setTier(e.target.value as Stratum)}>{strata.map(s => <option key={s}>{s}</option>)}</select></label>
        <label>Урок<select value={lesson} onChange={e => setLesson(Number(e.target.value))}>{lessons.map(l => <option key={l.id} value={l.id}>{l.id}. {l.title}</option>)}</select></label>
        <label>Срок сдачи<input required type="date" value={due} min={schoolDate()} onChange={e => setDue(e.target.value)} /></label>
        <button className="primary-button compact" disabled={busy || !title.trim()}>Опубликовать</button></form>}
      <h3>{tab === 'Архив' ? 'Архив заданий' : 'Опубликованные задания'}</h3>
      {!homework.some(h => h.archived === (tab === 'Архив')) && <p>Здесь пока нет заданий.</p>}
      {homework.filter(h => h.archived === (tab === 'Архив')).map(h => <article className="school-row" key={h.id}><div><b>{h.title}</b><small>Страта {h.stratum} · до {h.due.split('-').reverse().join('.')} · сдали {h.submitted} из {roster.filter(p => p.stratum === h.stratum).length}</small></div>
        <button className="secondary-button" disabled={busy} onClick={() => save('school_archive',{p_id:h.id,p_archived:!h.archived},h.archived ? 'Задание восстановлено' : 'Задание в архиве')}><Archive size={16}/>{h.archived ? 'Восстановить' : 'В архив'}</button></article>)}
    </>}
  </section>
}
