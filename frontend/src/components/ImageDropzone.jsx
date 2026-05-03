import { useMemo, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
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

export default function ImageDropzone({ value, onChange }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const subtitle = useMemo(() => {
    return 'JPG/PNG • Max 5MB'
  }, [])

  function pick() {
    inputRef.current?.click()
  }

  function setFile(file) {
    onChange?.(file || null)
  }

  function onFileChange(e) {
    const file = e.target.files?.[0] || null
    setFile(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0] || null
    if (file) setFile(file)
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function onDragLeave() {
    setDragActive(false)
  }

  return (
    <Card
      className={`p-0 transition ${dragActive ? 'ring-2 ring-primary/40' : ''}`}
    >
      <div
        className="grid gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800 dark:bg-slate-950"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary shadow-soft dark:bg-slate-900/60 dark:shadow-none">
          <ImagePlus
            className={`h-5 w-5 transition ${dragActive ? 'scale-110' : ''}`}
            aria-hidden="true"
          />
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
            Choose file
          </Button>
        </div>
      </div>
    </Card>
  )
}

