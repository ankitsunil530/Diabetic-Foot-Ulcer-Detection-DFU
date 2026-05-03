const styles = {
  neutral:
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  success:
    'bg-green-50 text-success border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/60',
  warning:
    'bg-yellow-50 text-amber-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-200 dark:border-yellow-900/60',
  danger:
    'bg-red-50 text-danger border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/60',
  primary:
    'bg-blue-50 text-primary border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900/60',
}

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

