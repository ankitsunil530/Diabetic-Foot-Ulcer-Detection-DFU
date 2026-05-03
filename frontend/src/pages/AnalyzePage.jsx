import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, RotateCcw } from 'lucide-react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Loader from '../components/Loader.jsx'
import Skeleton from '../components/Skeleton.jsx'
import ImageDropzone, { validateImageFile } from '../components/ImageDropzone.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { predictImage } from '../lib/api.js'
import { attachPreviewDataUrl, createHistoryItem, saveHistoryItem } from '../lib/history.js'
import { getDummyExplanation, getSeverity } from '../lib/ai.js'

const STEPS = ['Uploading…', 'Processing…', 'Predicting…']

export default function AnalyzePage() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ state: 'idle' })
  const [activeStep, setActiveStep] = useState(0)
  const toast = useToast()
  const navigate = useNavigate()

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function onFileSelected(next) {
    if (!next) {
      setFile(null)
      return
    }
    const v = validateImageFile(next)
    if (!v.ok) {
      toast.push({ tone: 'warning', title: 'Invalid file', message: v.error })
      setFile(null)
      return
    }
    setFile(next)
  }

  async function onAnalyze() {
    const v = validateImageFile(file)
    if (!v.ok) {
      toast.push({ tone: 'warning', title: 'Invalid file', message: v.error })
      return
    }

    setStatus({ state: 'loading' })
    setActiveStep(0)
    let succeeded = false

    const t1 = window.setTimeout(() => setActiveStep(1), 450)
    const t2 = window.setTimeout(() => setActiveStep(2), 900)

    try {
      const res = await predictImage(file)
      const pred = res?.prediction || {}
      const sev = getSeverity({ label: pred.label, confidence: pred.confidence })
      const enrichedPrediction = {
        ...pred,
        severity: sev.level,
        explanation: getDummyExplanation({ label: pred.label }),
      }

      const base = createHistoryItem({ file, prediction: enrichedPrediction })
      const item = await attachPreviewDataUrl(base, file)
      saveHistoryItem(item)
      toast.push({
        tone: 'success',
        title: 'Analysis complete',
        message: `Saved to history • ${item.label}`,
      })
      succeeded = true
      navigate(`/results/${item.id}`)
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Prediction failed. Please try again.'
      setStatus({ state: 'error', message })
      toast.push({ tone: 'danger', title: 'Analysis failed', message })
    } finally {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      if (succeeded) setStatus({ state: 'idle' })
    }
  }

  function onReset() {
    setFile(null)
    setStatus({ state: 'idle' })
    setActiveStep(0)
  }

  const canAnalyze = !!file && status.state !== 'loading'

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Analyze
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Drag & drop an image and run the AI model. Only JPG/PNG, up to 5MB.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3">
          <ImageDropzone value={file} onChange={onFileSelected} />

          <div className="flex gap-2">
            <Button onClick={onAnalyze} disabled={!canAnalyze} className="flex-1">
              Analyze
            </Button>
            <Button
              variant="secondary"
              onClick={onReset}
              disabled={!file && status.state !== 'error'}
              title="Reset"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {status.state === 'error' && (
            <Card className="p-4">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                Error
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {status.message}
              </div>
              <div className="mt-3">
                <Button onClick={onAnalyze}>Retry</Button>
              </div>
            </Card>
          )}
        </div>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Image className="h-4 w-4 text-primary" aria-hidden="true" />
            Preview
          </div>

          <div className="mt-4">
            {!file ? (
              <div className="grid gap-3">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={previewUrl}
                    alt="Selected"
                    className="max-h-[380px] w-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            )}
          </div>

          {status.state === 'loading' && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <Loader title="Analyzing image" steps={STEPS} activeStep={activeStep} />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
