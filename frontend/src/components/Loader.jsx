import { Loader2 } from 'lucide-react'

export default function Loader({ title = 'Loading', steps = [], activeStep = 0 }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary dark:bg-blue-950/40">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Please wait…
          </div>
        </div>
      </div>

      {!!steps.length && (
        <ol className="grid gap-2">
          {steps.map((s, idx) => {
            const state =
              idx < activeStep ? 'done' : idx === activeStep ? 'active' : 'todo'
            const dot =
              state === 'done'
                ? 'bg-success'
                : state === 'active'
                  ? 'bg-primary'
                  : 'bg-slate-300 dark:bg-slate-700'
            const text =
              state === 'done'
                ? 'text-slate-700 dark:text-slate-200'
                : state === 'active'
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
            return (
              <li key={s} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                <span className={`text-sm ${text}`}>{s}</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

