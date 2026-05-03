import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Download,
  Flame,
  HelpCircle,
  History,
  Image as ImageIcon,
  ThermometerSun,
  ZoomIn,
} from 'lucide-react'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Modal from '../components/Modal.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { getRecommendation, getSeverity } from '../lib/ai.js'
import { formatDateTime, formatPercent } from '../lib/format.js'
import { getHistoryItem } from '../lib/history.js'
import { downloadPdfReport } from '../lib/report.js'

function SeverityPill({ severity }) {
  const tone =
    severity === 'Severe' ? 'danger' : severity === 'Moderate' ? 'warning' : 'success'
  return (
    <Badge tone={tone}>
      <Flame className="h-3.5 w-3.5" /> {severity}
    </Badge>
  )
}

export default function ResultPage() {
  const { id } = useParams()
  const toast = useToast()
  const item = getHistoryItem(id)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [heatmapOn, setHeatmapOn] = useState(false)

  const severity = useMemo(() => {
    if (!item) return { level: 'Mild', tone: 'success' }
    if (item.severity) return { level: item.severity, tone: 'neutral' }
    return getSeverity({ label: item.label, confidence: item.confidence })
  }, [item])

  const recommendation = useMemo(() => {
    if (!item) return []
    return getRecommendation({ label: item.label, severity: severity.level })
  }, [item, severity.level])

  if (!item) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Result not found
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            This result is not available in local history.
          </p>
        </div>
        <Link to="/history">
          <Button>Go to history</Button>
        </Link>
      </div>
    )
  }

  function onDownload() {
    try {
      downloadPdfReport(item)
      toast.push({ tone: 'success', title: 'Report downloaded' })
    } catch (e) {
      toast.push({
        tone: 'danger',
        title: 'Could not generate report',
        message: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Result
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {item.filename} • {formatDateTime(item.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onDownload}>
            <Download className="h-4 w-4" /> Download report
          </Button>
          <Link to="/analyze">
            <Button>Analyze another</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              Uploaded image
            </div>
            <Button variant="ghost" onClick={() => setZoomOpen(true)}>
              <ZoomIn className="h-4 w-4" /> Zoom
            </Button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div className="relative">
              <img
                src={item.previewDataUrl || ''}
                alt=""
                className="max-h-[420px] w-full object-contain"
              />
              {heatmapOn && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-red-500/25 via-yellow-400/15 to-transparent" />
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Heatmap overlay (placeholder)
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setHeatmapOn((v) => !v)}
            >
              {heatmapOn ? 'Hide overlay' : 'Show overlay'}
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                Prediction
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.label === 'ulcer' ? 'danger' : 'success'}>
                  {String(item.label || '—').toUpperCase()}
                </Badge>
                <SeverityPill severity={severity.level} />
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  Confidence
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {formatPercent(item.confidence)}
                </div>
              </div>
              <ProgressBar value={item.confidence} />
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <div className="flex items-center gap-2 font-extrabold">
                <ThermometerSun className="h-4 w-4 text-warning" /> Severity
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {severity.level} (heuristic mapping for demo)
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              Why this prediction?
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.explanation ||
                'This is a placeholder explanation. Integrate your XAI method (e.g., Grad-CAM) and backend explanation fields for production.'}
            </p>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Recommendations
            </div>
            <ul className="mt-2 grid list-disc gap-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {recommendation.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Link to="/history">
                <Button variant="secondary">
                  <History className="h-4 w-4" /> History
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title="Image zoom">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="text-sm font-extrabold">Image zoom</div>
          <Button variant="ghost" onClick={() => setZoomOpen(false)}>
            Close
          </Button>
        </div>
        <div className="bg-slate-50 p-4 dark:bg-slate-950">
          <img
            src={item.previewDataUrl || ''}
            alt=""
            className="max-h-[70vh] w-full rounded-2xl object-contain"
          />
        </div>
      </Modal>
    </div>
  )
}

