import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, MailCheck, RotateCcw, Sparkles, UserRound } from 'lucide-react'
import { useApp } from '../AppContext'

export default function AuthScreen() {
  const { login, register, verifyEmail, resendCode } = useApp()
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const switchMode = (next: 'login' | 'register') => {
    setMode(next); setError(''); setNotice(''); setCode('')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(''); setNotice('')
    if (mode === 'verify') {
      if (code.length !== 6) { setError('Введи все 6 цифр из письма.'); return }
      setBusy(true)
      const problem = await verifyEmail(email, code)
      setBusy(false)
      if (problem) setError(problem)
      return
    }
    if (mode === 'register' && name.trim().length < 2) { setError('Напиши имя — минимум 2 символа.'); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Проверь email: кажется, в нём опечатка.'); return }
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов.'); return }
    setBusy(true)
    const problem = mode === 'login' ? await login(email, password) : await register(name, email, password)
    setBusy(false)
    if (problem) setError(problem)
    else if (mode === 'register') { setMode('verify'); setCooldown(60) }
  }

  const resend = async () => {
    if (cooldown > 0 || busy) return
    setBusy(true); setError(''); setNotice('')
    const problem = await resendCode(email)
    setBusy(false)
    if (problem) setError(problem)
    else { setNotice('Новый код уже летит на почту.'); setCooldown(60); setCode('') }
  }

  return <main className="auth-screen">
    <section className="auth-story">
      <button className="brand auth-brand" aria-label="школо!"><span className="brand-wordmark">школо<span>!</span><small>english, но по кайфу</small></span><i>GO<br />SAY<br />HI</i></button>
      <div className="auth-story-copy"><span className="auth-eyebrow"><Sparkles size={16} /> YOUR ENGLISH ERA STARTS HERE</span><h1>Не просто учи.<br /><em>Заговаривай.</em></h1><p>Короткие уроки, реальные диалоги и английский, который не страшно использовать.</p></div>
      <div className="auth-mascot-wrap"><div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><img src="/mascot.svg" alt="Талисман Школо" className="auth-mascot" /><div className="auth-chat"><span>today's vibe</span><b>“One lesson.<br />Zero awkwardness.”</b><i>let's go! ↗</i></div></div>
      <div className="auth-proof"><span><b>6</b>навыков</span><span><b>5 мин</b>в день</span><span><b>∞</b>новых слов</span></div>
    </section>
    <section className="auth-form-side">
      <div className="auth-mobile-brand"><span className="brand-wordmark">школо<span>!</span><small>english, но по кайфу</small></span></div>
      <div className="auth-form-card">
        {mode !== 'verify' ? <>
          <div className="auth-tabs" role="tablist" aria-label="Авторизация"><button role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Вход</button><button role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Регистрация</button></div>
          <div className="auth-heading"><span className="auth-kicker">{mode === 'login' ? 'С ВОЗВРАЩЕНИЕМ' : 'ПЕРВЫЙ ШАГ'}</span><h2>{mode === 'login' ? 'Снова на связи!' : 'Создай свой аккаунт'}</h2><p>{mode === 'login' ? 'Продолжи с того места, где остановился.' : 'Имя, почта, пароль — и код из письма.'}</p></div>
        </> : <div className="auth-heading verify-heading"><span className="verify-icon"><MailCheck size={30} /></span><span className="auth-kicker">ПРОВЕРЬ ПОЧТУ</span><h2>Код уже в письме</h2><p>Отправили 6 цифр на <b>{email}</b>. Введи их ниже, чтобы подтвердить аккаунт.</p></div>}

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && <label className="auth-field"><span>Как тебя зовут?</span><div><UserRound size={20} /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Амир" autoComplete="name" /></div></label>}
          {mode !== 'verify' ? <>
            <label className="auth-field"><span>Email</span><div><Mail size={20} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></div></label>
            <label className="auth-field"><span>Пароль</span><div><LockKeyhole size={20} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Минимум 6 символов" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
          </> : <label className="auth-field code-field"><span>Код подтверждения</span><div><MailCheck size={22} /><input className="otp-input" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" autoComplete="one-time-code" autoFocus aria-label="Шестизначный код" /></div></label>}
          {error && <div className="auth-error" role="alert">{error}</div>}
          {notice && <div className="auth-notice" role="status"><Check size={16} />{notice}</div>}
          <button className="auth-submit" disabled={busy}>{busy ? <span className="auth-spinner" /> : mode === 'verify' ? <Check size={21} /> : <ArrowRight size={21} />}{busy ? 'Секунду…' : mode === 'login' ? 'Войти в Школо' : mode === 'register' ? 'Получить код на почту' : 'Подтвердить и начать'}</button>
        </form>
        {mode === 'verify' && <><button className="resend-code" onClick={resend} disabled={cooldown > 0 || busy}><RotateCcw size={16} />{cooldown > 0 ? `Отправить снова через ${cooldown} c` : 'Отправить код повторно'}</button><button className="auth-back" onClick={() => switchMode('register')}>← Изменить email или пароль</button></>}
        <p className="auth-legal">{mode === 'verify' ? 'Письмо может оказаться в спаме. Код действует ограниченное время.' : 'Безопасная авторизация через Supabase. Пароль не сохраняется на устройстве.'}</p>
      </div>
      <p className="auth-footnote">Сделано с зелёной энергией <span>✳</span></p>
    </section>
  </main>
}
