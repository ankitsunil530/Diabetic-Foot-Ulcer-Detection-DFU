const KEY = 'dfu.history.v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function listHistory() {
  return readAll().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

export function getHistoryItem(id) {
  if (!id) return null
  return readAll().find((x) => x.id === id) || null
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}

export function saveHistoryItem(item) {
  const items = readAll()
  items.push(item)
  writeAll(items.slice(-50))
}

export function createHistoryItem({ file, prediction }) {
  const id =
    (crypto?.randomUUID && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id,
    createdAt: new Date().toISOString(),
    filename: file?.name || prediction?.filename || 'image',
    label: prediction?.label || 'unknown',
    confidence: Number(prediction?.confidence ?? 0),
    previewDataUrl: null,
    severity: prediction?.severity || null,
    explanation: prediction?.explanation || null,
  }
}

export async function attachPreviewDataUrl(item, file) {
  if (!file) return item
  const previewDataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed reading file'))
    reader.readAsDataURL(file)
  })
  return { ...item, previewDataUrl }
}
