import { useId, useMemo, useRef, useState } from 'react'
import { AlertCircle, ImagePlus } from 'lucide-react'
import Card from './Card.jsx'
import Button from './Button.jsx'

const ACCEPT = ['image/jpeg', 'image/png']
const MAX_BYTES = 5 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' }
  if (!ACCEPT.includes(file.type))
    return { ok: false, error: 'Only JPG/PNG images are allowed.' }
  if (file.size > MAX_BYTES)
    return { ok: false, error: 'Max file size is 5MB.' }
  return { ok: true }
}

export default function ImageDropzone({ value, onChange, error: externalError }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [internalError, setInternalError] = useState('')
  const errorId = useId()

  const subtitle = useMemo(() => 'JPG/PNG • Max 5MB', [])

  // An error passed in by the parent (e.g. an upload/analysis failure) takes
  // precedence over the dropzone's own client-side validation message.
  const error = externalError || internalError

  function pick() {
    inputRef.current?.click()
  }

  // Single entry point for every way a file can arrive (picker or drop). It
  // validates here so an invalid file never leaves the dropzone, and the error
  // is shown inline with a clear recovery path instead of a transient toast.
  function handleFile(file) {
    if (!file) {
      setInternalError('')
      onChange?.(null)
      return
    }
    const result = validateImageFile(file)
    if (!result.ok) {
      setInternalError(result.error)
      onChange?.(null)
      return
    }
    setInternalError('')
    onChange?.(file)
  }

  function onFileChange(e) {
    handleFile(e.target.files?.[0] || null)
    // Reset so picking the same file again re-fires change (e.g. after a fix).
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files?.[0] || null)
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function onDragLeave() {
    setDragActive(false)
  }

  const regionTone = error
    ? 'border-red-300 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30'
    : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'

  const ringTone = dragActive
    ? 'ring-2 ring-primary/40'
    : error
      ? 'ring-2 ring-red-400/40'
      : ''

  return (
    <Card className={`p-0 transition ${ringTone}`}>
      <div
        className={`grid gap-3 rounded-2xl border border-dashed p-5 text-center transition ${regionTone}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="group"
        aria-label="Image upload"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={onFileChange}
        />

        <div
          className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl shadow-soft dark:shadow-none ${
            error
              ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300'
              : 'bg-white text-primary dark:bg-slate-900/60'
          }`}
        >
          {error ? (
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ImagePlus
              className={`h-5 w-5 transition ${dragActive ? 'scale-110' : ''}`}
              aria-hidden="true"
            />
          )}
        </div>

        <div>
          <div className="text-sm font-semibold">
            {value ? value.name : 'Drag & drop an image'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="secondary" onClick={pick} type="button">
            {error ? 'Choose a different file' : 'Choose file'}
          </Button>
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </Card>
  )
}
