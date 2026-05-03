export function formatPercent(value) {
  const v = Number(value)
  if (!Number.isFinite(v)) return '—'
  return `${Math.round(v * 100)}%`
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

