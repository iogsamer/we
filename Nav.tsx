import { useEffect, useState } from 'react'
import { toast, type ToastItem } from '../toast'

const ICONS: Record<string, string> = { ok: '✅', err: '❌', info: '🔔' }

export function Toasts() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    return toast.subscribe(setItems)
  }, [])

  if (!items.length) return null

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span aria-hidden="true">{ICONS[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
