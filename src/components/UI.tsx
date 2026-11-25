import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Progress({ value, color = 'green', className = '' }: { value: number; color?: 'green' | 'yellow' | 'blue'; className?: string }) {
  return (
    <div className={`progress-track ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`progress-fill progress-${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Avatar({ text, color = '#73BF75', size = 'md' }: { text: string; color?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <span className={`avatar avatar-${size}`} style={{ backgroundColor: color }} aria-hidden="true">{text}</span>
}

export function Modal({ open, onClose, title, children, className = '' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = oldOverflow
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`modal-panel ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Закрыть"><X size={22} /></button>
        {children}
      </section>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button className={`toggle ${checked ? 'toggle-on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <span />
    </button>
  )
}

export function PageHeading({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <div><h1>{title}</h1><p>{text}</p></div>
      {action}
    </div>
  )
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><img src="/mascot.svg" alt="Талисман Школо" /><h3>{title}</h3><p>{text}</p></div>
}
