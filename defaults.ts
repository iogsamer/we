export type ToastType = 'ok' | 'err' | 'info'
export interface ToastItem { id: number; msg: string; type: ToastType }

type Listener = (toasts: ToastItem[]) => void

let _toasts: ToastItem[]  = []
let _listeners: Listener[] = []
let _nextId = 0

function _notify() { _listeners.forEach(l => l([..._toasts])) }

export const toast = {
  show(msg: string, type: ToastType = 'ok', duration = 3500) {
    const id = _nextId++
    _toasts = [..._toasts.slice(-4), { id, msg, type }]   // max 5
    _notify()
    setTimeout(() => {
      _toasts = _toasts.filter(t => t.id !== id)
      _notify()
    }, duration)
  },
  ok:   (msg: string, d?: number) => toast.show(msg, 'ok',   d),
  err:  (msg: string, d?: number) => toast.show(msg, 'err',  d),
  info: (msg: string, d?: number) => toast.show(msg, 'info', d),
  subscribe(listener: Listener) {
    _listeners = [..._listeners, listener]
    return () => { _listeners = _listeners.filter(l => l !== listener) }
  },
}
