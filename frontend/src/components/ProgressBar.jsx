export default function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(1, Number(value) || 0))
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${Math.round(v * 100)}%` }}
      />
    </div>
  )
}

