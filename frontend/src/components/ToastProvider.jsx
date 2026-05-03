import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

function toneToIcon(tone) {
  const cls = 'h-4 w-4'
  if (tone === 'success') return <CheckCircle2 className={cls} />
  if (tone === 'warning') return <AlertTriangle className={cls} />
  if (tone === 'danger') return <XCircle className={cls} />
  return <Info className={cls} />
}

function toneToClasses(tone) {
  if (tone === 'success')
    return 'border-green-200 bg-green-50 text-green-900 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-100'
  if (tone === 'warning')
    return 'border-yellow-200 bg-yellow-50 text-amber-950 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-100'
  if (tone === 'danger')
    return 'border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100'
  return 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id =
      (crypto?.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const item = {
      id,
      title: toast?.title || 'Notice',
      message: toast?.message || '',
      tone: toast?.tone || 'info',
      durationMs: typeof toast?.durationMs === 'number' ? toast.durationMs : 3500,
    }
    setToasts((prev) => [...prev, item].slice(-5))
    if (item.durationMs > 0) {
      window.setTimeout(() => remove(id), item.durationMs)
    }
    return id
  }, [remove])

  const api = useMemo(() => ({ push, remove }), [push, remove])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid w-[min(360px,calc(100vw-2rem))] gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-2xl border p-3 shadow-soft dark:shadow-none ${toneToClasses(t.tone)}`}
            role="status"
            aria-live="polite"
          >
            <div className="mt-0.5">{toneToIcon(t.tone)}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              {!!t.message && (
                <div className="mt-0.5 text-sm opacity-90">{t.message}</div>
              )}
            </div>
            <button
              className="rounded-lg p-1 opacity-70 hover:opacity-100"
              onClick={() => remove(t.id)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

