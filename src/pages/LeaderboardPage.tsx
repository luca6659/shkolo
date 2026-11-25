import { useEffect, useState } from 'react'
import { Check, ChevronRight, Crown, Flame, Medal, Shield, Sparkles, Swords, Timer, Trophy, Users, Zap } from 'lucide-react'
import { leaders } from '../data'
import { useApp } from '../AppContext'
import { Avatar, Modal, PageHeading, Progress } from '../components/UI'

export default function LeaderboardPage() {
  const { xp, showToast } = useApp()
  const [scope, setScope] = useState('friends')
  const [league, setLeague] = useState('gold')
  const [battleOpen, setBattleOpen] = useState(false)
  const [battleState, setBattleState] = useState<'search' | 'play' | 'result'>('search')
  const [answer, setAnswer] = useState<number | null>(null)
  const [time, setTime] = useState(20)

  useEffect(() => {
    if (!battleOpen || battleState !== 'search') return
    const timer = window.setTimeout(() => setBattleState('play'), 1200)
    return () => window.clearTimeout(timer)
  }, [battleOpen, battleState])

  useEffect(() => {
    if (!battleOpen || battleState !== 'play' || answer !== null) return
    if (time <= 0) { setAnswer(-1); return }
    const timer = window.setTimeout(() => setTime((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [battleOpen, battleState, answer, time])

  const startBattle = () => {
    setBattleState('search'); setAnswer(null); setTime(20); setBattleOpen(true)
  }
  const chooseAnswer = (value: number) => {
    if (answer !== null) return
    setAnswer(value)
    window.setTimeout(() => setBattleState('result'), 700)
  }

  const scopedLeaders = leaders.map((leader, index) => ({
    ...leader,
    className: scope === 'global' ? ['Berlin', 'London', 'Warsaw', 'Prague', 'Paris', 'Madrid', 'Lisbon'][index] : scope === 'level' ? `Level ${leader.className}` : leader.className,
  }))

  return (
    <div className="page-container leaderboard-page">
      <PageHeading title="English league" text="Прокачивай английский, собирай XP и залетай выше" action={<button className="primary-button compact" onClick={startBattle}><Swords size={19} />Word battle</button>} />
      <section className="league-banner">
        <div className="league-emblem"><Crown size={43} /></div>
        <div><span>Текущая лига</span><h2>Gold talkers</h2><p>Топ-3 перейдут в Diamond speakers</p></div>
        <div className="league-timer"><Timer size={19} /><span>До конца недели</span><b>2 дня 14 часов</b></div>
        <button className="icon-button" onClick={() => showToast('Как работают лиги', 'Каждую неделю лучшие игроки поднимаются выше, а недельный XP обнуляется')} aria-label="Правила лиги"><ChevronRight size={24} /></button>
      </section>
      <div className="league-selector">
        {[['bronze', 'Bronze'], ['silver', 'Silver'], ['gold', 'Gold'], ['diamond', 'Diamond']].map(([id, name]) => <button key={id} className={`${league === id ? 'active' : ''} league-${id}`} onClick={() => { setLeague(id); if (id !== 'gold') showToast(`${name} league`, id === 'diamond' ? 'Попади в топ-3 Gold, чтобы открыть её' : 'Ты уже прошёл эту лигу') }}><Shield size={18} />{name}</button>)}
      </div>

      <div className="leaderboard-layout">
        <section className="leaderboard-table">
          <div className="scope-tabs" role="tablist">{[['friends', 'Друзья'], ['level', 'Мой уровень'], ['global', 'Global']].map(([id, name]) => <button key={id} role="tab" aria-selected={scope === id} className={scope === id ? 'active' : ''} onClick={() => setScope(id)}>{name}</button>)}</div>
          <div className="leaders-list">
            {scopedLeaders.map((leader, index) => <div className={`leader-row ${leader.me ? 'leader-me' : ''}`} key={leader.name}>
              <span className={`leader-place place-${index + 1}`}>{index < 3 ? <Medal size={24} /> : index + 1}</span>
              <Avatar text={leader.avatar} color={leader.color} />
              <div><b>{leader.name}</b><small>{leader.className}</small></div>
              <strong>{(leader.me ? xp : leader.xp).toLocaleString('ru')} <small>XP</small></strong>
            </div>)}
          </div>
          <div className="promotion-note"><Sparkles size={18} />Ещё 220 XP — и ты войдёшь в зону повышения</div>
        </section>

        <aside className="tournament-panel">
          <span className="tournament-label"><Trophy size={17} />Турнир недели</span>
          <h2>Weekly English Cup</h2><p>Проходи разговорные челленджи и набирай XP для своей команды.</p>
          <div className="tournament-prize"><span><Crown size={32} /></span><div><small>Награда</small><b>500 монет + 20 кристаллов</b></div></div>
          <div className="tournament-team"><div><Users size={18} /><b>Team Speak Up</b></div><span>4 280 XP</span><Progress value={72} color="yellow" /><small>Цель команды: 6 000 XP</small></div>
          <button className="yellow-button" onClick={() => showToast('Ты в игре!', 'XP из новых уроков уже засчитывается команде')}>Помочь команде<Zap size={18} /></button>
          <button className="duel-link" onClick={startBattle}><Swords size={20} /><span><b>Word battle</b><small>Демо-дуэль · один быстрый вопрос</small></span><ChevronRight size={20} /></button>
        </aside>
      </div>

      <Modal open={battleOpen} onClose={() => setBattleOpen(false)} title="Word battle" className="battle-modal">
        {battleState === 'search' && <div className="battle-search"><div className="versus-avatars"><Avatar text="АК" size="lg" /><span><Swords size={30} /></span><div className="search-avatar"><Users size={35} /></div></div><h2>Ищем соперника…</h2><p>Демо-подбор игрока с похожим уровнем английского</p><div className="loading-dots"><i /><i /><i /></div></div>}
        {battleState === 'play' && <div className="battle-play"><div className="battle-score"><div><Avatar text="АК" /><b>Ты</b><span>{answer === 18 ? 1 : 0}</span></div><strong>1 : 5</strong><div><Avatar text="АВ" color="#7AB6EF" /><b>Артём</b><span>0</span></div></div><div className="battle-timer"><Timer size={18} /><b>0:{String(time).padStart(2, '0')}</b><Progress value={(time / 20) * 100} color={time < 6 ? 'yellow' : 'green'} /></div><span className="question-tag">Демо-дуэль · Vocabulary</span><h2>Что значит<br /><b>“It’s not my cup of tea”?</b></h2><div className="battle-options">{[['Мне это не по душе', 18], ['Я не пью чай', 9], ['Это не моя чашка', 3]].map(([label, value]) => <button key={String(label)} className={answer === value ? 'correct' : answer !== null && value === 18 ? 'correct' : ''} onClick={() => chooseAnswer(Number(value))}>{label}{answer !== null && value === 18 && <Check size={20} />}</button>)}</div></div>}
        {battleState === 'result' && <div className="battle-result"><span className={`result-medal ${answer === 18 ? '' : 'result-try'}`}>{answer === 18 ? <Trophy size={48} /> : <Flame size={48} />}</span><h2>{answer === 18 ? 'Word wizard!' : 'Почти получилось!'}</h2><p>{answer === 18 ? 'Идиома разгадана — раунд за тобой!' : '«It’s not my cup of tea» значит «Мне это не по душе».'}</p><button className="primary-button" onClick={startBattle}>Сыграть ещё<Swords size={18} /></button></div>}
      </Modal>
    </div>
  )
}
