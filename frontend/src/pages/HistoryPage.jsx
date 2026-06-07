import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Trash2 } from 'lucide-react'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import { formatDateTime, formatPercent } from '../lib/format.js'
import { clearHistory, listHistory } from '../lib/history.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'ulcer', label: 'Ulcer' },
  { key: 'normal', label: 'Normal' },
]

function toneForLabel(label) {
  return String(label || '').toLowerCase() === 'ulcer' ? 'danger' : 'success'
}

/**
 * History thumbnail that degrades gracefully when the stored preview is
 * missing or fails to decode (onError), instead of rendering a broken image.
 */
function Thumb({ src }) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) {
    return (
      <div className="grid h-24 place-items-center text-xs text-slate-400">
        No image
      </div>
    )
  }
  return (
    <img
      src={src}
      alt=""
      className="h-24 w-full object-cover"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  )
}

export default function HistoryPage() {
  const [filter, setFilter] = useLocalStorageState('dfu.history.filter', 'all')
  const items = listHistory()

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((x) => String(x.label || '').toLowerCase() === filter)
  }, [items, filter])

  function onClear() {
    clearHistory()
    window.location.reload()
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            History
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Past predictions stored locally in your browser.
          </p>
        </div>
        <Button variant="danger" onClick={onClear} disabled={!items.length}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
            Filter
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? 'primary' : 'secondary'}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {!filtered.length ? (
        <Card className="p-8">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            No results
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Run an analysis to populate history.
          </p>
          <div className="mt-4">
            <Link to="/analyze">
              <Button>Start analysis</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((it) => (
            <Card
              key={it.id}
              className="p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none"
            >
              <div className="grid gap-3 md:grid-cols-[96px_1fr_auto] md:items-center">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <Thumb src={it.previewDataUrl} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={toneForLabel(it.label)}>
                      {String(it.label || '—').toUpperCase()}
                    </Badge>
                    {!!it.severity && <Badge tone="neutral">{it.severity}</Badge>}
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(it.createdAt)}
                    </div>
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {it.filename}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Confidence: {formatPercent(it.confidence)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/results/${it.id}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

