import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, Coins, Heart, Lightbulb, RotateCcw, Sparkles, Star, Trophy, Volume2, X } from 'lucide-react'
import { useSchool } from '../SchoolContext'
import { useApp } from '../AppContext'
import { Modal, Progress } from './UI'
import { lessons } from '../lessons'

export default function Lesson() {
  const { closeLesson, sound, setPage, activeLessonId } = useApp()
  const { mutate } = useSchool()
  const [attempt, setAttempt] = useState(() => crypto.randomUUID())
  const [answers, setAnswers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const lesson = lessons.find((item) => item.id === activeLessonId) ?? lessons[0]
  const questions = lesson.questions
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [input, setInput] = useState('')
  const [pairs, setPairs] = useState<Record<string, string>>({})
  const [activeLeft, setActiveLeft] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const question = questions[index]
  const pairLeft = question.kind === 'pairs' ? question.answer.split(';').map((pair) => pair.split('=')[0]) : []
  const pairRight = question.kind === 'pairs' ? question.answer.split(';').map((pair) => pair.split('=')[1]).sort(() => activeLessonId % 2 ? -1 : 1) : []

  const ready = question.kind === 'input' ? input.trim().length > 0 : question.kind === 'pairs' ? Object.keys(pairs).length === 3 : selected.length > 0
  const progress = ((index + (checked ? 1 : 0)) / questions.length) * 100
  const earnedXp = hearts ? score * 10 : 0
  const earnedCoins = hearts ? score * 5 : 0

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !result) setConfirmClose(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [result])

  const speak = (rate = 0.9) => {
    if (!sound || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(question.answer)
    const voices = window.speechSynthesis.getVoices()
    const preferredNames = ['Google US English', 'Microsoft Ava', 'Microsoft Jenny', 'Samantha', 'Daniel', 'Google UK English Female']
    const voice = preferredNames.map((name) => voices.find((item) => item.name.includes(name))).find(Boolean)
      ?? voices.find((item) => item.lang === 'en-US')
      ?? voices.find((item) => item.lang.startsWith('en'))
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = rate
    utterance.pitch = 1.03
    utterance.volume = 0.9
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const playFeedback = (kind: 'correct' | 'wrong') => {
    if (!sound) return
    try {
      const AudioContextClass = window.AudioContext
      const context = new AudioContextClass()
      const notes = kind === 'correct' ? [523.25, 659.25, 783.99] : [293.66, 261.63]
      notes.forEach((frequency, noteIndex) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const start = context.currentTime + noteIndex * 0.09
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, start)
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(kind === 'correct' ? 0.075 : 0.045, start + 0.018)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2)
        oscillator.connect(gain); gain.connect(context.destination)
        oscillator.start(start); oscillator.stop(start + 0.21)
      })
      window.setTimeout(() => void context.close(), 700)
    } catch { /* audio feedback is optional when Web Audio is unavailable */ }
  }

  const checkAnswer = () => {
    let answer = selected
    if (question.kind === 'input') answer = input.trim().toLowerCase().replace(/\s/g, '')
    if (question.kind === 'pairs') answer = Object.entries(pairs).map(([key, value]) => `${key}=${value}`).sort().join(';')
    const expected = question.kind === 'pairs' ? question.answer.split(';').sort().join(';') : question.answer
    const isCorrect = answer === expected
    setAnswers(current => [...current, answer])
    setCorrect(isCorrect)
    setChecked(true)
    playFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((value) => value + 1)
    else setHearts((value) => Math.max(0, value - 1))
  }

  const next = async () => {
    if (hearts === 0 || index === questions.length - 1) {
      if (hearts > 0) {
        setSaving(true)
        const saved = await mutate('school_finish', { p_attempt: attempt, p_lesson: activeLessonId, p_answers: answers })
        setSaving(false)
        setSaveError(!saved)
        if (!saved) return
      }
      setResult(true)
      return
    }
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setIndex((value) => value + 1)
    setSelected(''); setInput(''); setPairs({}); setActiveLeft(''); setChecked(false); setCorrect(false)
  }

  const restart = () => {
    setAttempt(crypto.randomUUID()); setAnswers([]); setSaveError(false)
    setIndex(0); setSelected(''); setInput(''); setPairs({}); setActiveLeft(''); setChecked(false); setCorrect(false); setHearts(5); setScore(0); setResult(false)
  }

  const choosePairRight = (right: string) => {
    if (!activeLeft || checked) return
    setPairs((current) => {
      const cleaned = Object.fromEntries(Object.entries(current).filter(([, value]) => value !== right))
      return { ...cleaned, [activeLeft]: right }
    })
    setActiveLeft('')
  }

  const confetti = useMemo(() => Array.from({ length: 32 }, (_, item) => ({ id: item, left: (item * 37) % 100, delay: (item % 8) * 0.07, color: ['#c8f547', '#f3c13a', '#ff7b9c', '#f7f5ed'][item % 4] })), [])

  if (result) {
    const failed = hearts === 0
    return <div className="lesson-overlay result-overlay">
      <div className="confetti" aria-hidden="true">{confetti.map((item) => <i key={item.id} style={{ left: `${item.left}%`, animationDelay: `${item.delay}s`, background: item.color }} />)}</div>
      <section className="lesson-result">
        <div className="result-mascot"><img src="/mascot.svg" alt="Талисман Школо поздравляет с завершением урока" /><span><Trophy size={30} /></span></div>
        <span className="result-eyebrow">{failed ? 'GOOD PRACTICE' : 'LESSON COMPLETE!'}</span>
        <h1>{failed ? 'Ещё один реп!' : score >= 5 ? 'You nailed it!' : 'Nice progress!'}</h1>
        <p>{failed ? 'Ошибки — часть процесса. Повтори урок, и фразы станут ещё понятнее.' : 'Ещё немного — и ты заговоришь свободнее, увереннее и без подсказок.'}</p>
        <div className="result-stars">{[0, 1, 2].map((item) => <Star key={item} size={66} fill={item < Math.max(1, Math.round((score / questions.length) * 3)) ? 'currentColor' : 'none'} className={item < Math.max(1, Math.round((score / questions.length) * 3)) ? 'star-earned' : 'star-empty'} />)}</div>
        <div className="result-rewards"><div><Sparkles size={24} /><span><small>Опыт</small><b>+{earnedXp} XP</b></span></div><div><Coins size={24} /><span><small>Монеты</small><b>+{earnedCoins}</b></span></div><div><Check size={24} /><span><small>Точность</small><b>{Math.round((score / questions.length) * 100)}%</b></span></div></div>
        {score === 6 && <p>Без ошибок · +1 кристалл</p>}
        <button className="primary-button result-main-button" onClick={() => { closeLesson(); setPage('home') }}>Вернуться к карте<ArrowRight size={20} /></button>
        <button className="text-button" onClick={restart}><RotateCcw size={17} />Пройти ещё раз</button>
      </section>
    </div>
  }

  return <div className="lesson-overlay">
    <header className="lesson-header">
      <button className="icon-button" onClick={() => setConfirmClose(true)} aria-label="Выйти из урока"><X size={25} /></button>
      <div className="lesson-progress"><Progress value={progress} /><span>{index + 1} / {questions.length}</span></div>
      <div className="lesson-hearts" aria-label={`${hearts} жизней`}><Heart size={25} fill="currentColor" /><b>{hearts}</b></div>
    </header>
    {checked && <div className={`answer-splash ${correct ? 'splash-correct' : 'splash-wrong'}`} aria-hidden="true"><span>{correct ? <Check size={54} strokeWidth={3.2} /> : <X size={54} strokeWidth={3.2} />}</span><b>{correct ? 'NICE!' : 'OOPS!'}</b></div>}
    <main className="lesson-main">
      <div className="lesson-question" key={index}>
        <span className="lesson-label"><BookOpen size={17} />{question.label}</span>
        <h1>{question.title}</h1>
        {question.kind === 'picture' && <div className="conversation-picture" role="img" aria-label="Два друга договариваются о встрече"><div className="chat-avatar">YOU</div><div><span>Wanna hang out later?</span><b>6 PM?</b></div><div className="chat-avatar friend">BFF</div></div>}
        {question.kind === 'audio' && <div className="audio-player"><button className={`audio-button ${speaking ? 'is-speaking' : ''}`} onClick={() => speak()} disabled={!sound}><Volume2 size={35} /><span><b>{sound ? speaking ? 'Playing…' : 'Listen up!' : 'Включи звук в профиле'}</b><small>{sound ? 'Естественный темп · en-US' : 'Для аудио нужен звук'}</small></span><div className="sound-wave" aria-hidden="true">{[1, 2, 3, 4, 5].map((bar) => <i key={bar} />)}</div></button><button className="audio-speed" onClick={() => speak(0.68)} disabled={!sound} aria-label="Прослушать медленно">0.75×<small>медленно</small></button></div>}
        {question.kind === 'input' && <div className="answer-input-wrap"><input className="answer-input" value={input} onChange={(event) => setInput(event.target.value)} disabled={checked} placeholder="Type the word…" aria-label="Твой ответ" autoFocus /><span>{question.hint}</span></div>}
        {(question.kind === 'choice' || question.kind === 'boolean' || question.kind === 'picture' || question.kind === 'audio') && <div className={`answer-options ${question.kind === 'boolean' ? 'boolean-options' : ''}`}>{question.options?.map((option, optionIndex) => <button key={option} className={`${selected === option ? 'selected' : ''} ${checked && option === question.answer ? 'answer-correct' : ''} ${checked && selected === option && !correct ? 'answer-wrong' : ''}`} onClick={() => !checked && setSelected(option)} disabled={checked}><span className="option-marker">{question.kind === 'boolean' ? option === 'Верно' ? <Check size={20} /> : <X size={20} /> : String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>}
        {question.kind === 'pairs' && <div className="pairs-game"><div>{pairLeft.map((left) => <button key={left} className={`${activeLeft === left ? 'active' : ''} ${pairs[left] ? 'paired' : ''}`} disabled={checked} onClick={() => setActiveLeft(left)}><b>{left}</b><small>{pairs[left] ? 'соединено ✓' : 'выбери пару'}</small></button>)}</div><div>{pairRight.map((right) => <button key={right} className={Object.values(pairs).includes(right) ? 'paired' : ''} disabled={checked} onClick={() => choosePairRight(right)}>{right}</button>)}</div></div>}
      </div>
    </main>
    <footer className={`lesson-footer ${checked ? correct ? 'feedback-correct' : 'feedback-wrong' : ''}`}>
      {checked ? <div className="answer-feedback"><span>{correct ? <Check size={28} /> : <Lightbulb size={28} />}</span><div><h2>{correct ? ['Nailed it!', 'Exactly!', 'So good!'][index % 3] : 'Разберём вместе'}</h2><p>{question.explanation}</p></div></div> : <div className="lesson-tip"><Lightbulb size={19} /><span>{question.kind === 'pairs' ? 'Выбери слово слева, затем его перевод справа' : 'Думай как в реальном диалоге, а не как в учебнике'}</span></div>}
      {!checked ? <button className="primary-button check-button" disabled={!ready} onClick={checkAnswer}>Проверить</button> : <button className={`primary-button check-button ${!correct ? 'wrong-next' : ''}`} disabled={saving} onClick={next}>{saving ? 'Сохраняем…' : saveError ? 'Повторить сохранение' : index === questions.length - 1 || hearts === 0 ? 'Завершить' : 'Продолжить'}<ArrowRight size={19} /></button>}
    </footer>
    <Modal open={confirmClose} onClose={() => setConfirmClose(false)} title="Выйти из урока" className="confirm-modal">
      <img src="/mascot.svg" alt="Талисман Школо" /><h2>Уже уходишь?</h2><p>Прогресс этого урока не сохранится, но твоя серия останется на месте.</p><button className="primary-button" onClick={() => setConfirmClose(false)}>Остаться и учиться</button><button className="text-button danger-text" onClick={closeLesson}>Выйти из урока</button>
    </Modal>
  </div>
}
