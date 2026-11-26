import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { strata, useSchool, type Stratum } from '../SchoolContext'
import { Avatar, EmptyState, PageHeading } from '../components/UI'

export default function LeaderboardPage() {
  const { self, roster, stratum, isAdmin } = useSchool()
  const [choice,setChoice] = useState<Stratum>(stratum ?? '1')
  const current = isAdmin ? choice : stratum
  const ranked = roster.filter(p => current && p.stratum === current && p.xp > 0)
  return <div className="page-container school-page">
    <PageHeading title="Рейтинг" text="Опыт за пройденные уроки в твоей страте" />
    {isAdmin && <div className="class-tabs">{strata.map(s => <button key={s} className={s === current ? 'active' : ''} onClick={() => setChoice(s)}>Страта {s}</button>)}</div>}
    <section className="profile-section"><div className="section-title"><h2>{current ? 'Страта ' + current : 'Моя страта'}</h2><Trophy /></div>
      {ranked.length ? ranked.map(p => <div className="school-row" key={p.id}><strong>{ranked.findIndex(other => other.xp === p.xp) + 1}</strong><Avatar text={p.name.slice(0,2).toUpperCase()} /><div><b>{p.name}{p.id === self.id ? ' (ты)' : ''}</b></div><strong>{p.xp} XP</strong></div>) :
      <EmptyState title="Рейтинг пока пуст" text={current ? 'Первый завершённый урок принесёт XP и место в рейтинге.' : 'Рейтинг появится после распределения в страту.'} />}
    </section>
  </div>
}
