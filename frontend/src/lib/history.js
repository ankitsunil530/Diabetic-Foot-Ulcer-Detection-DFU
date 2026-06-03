const KEY = 'dfu.history.v1'
const MAX_ITEMS = 50
const THUMB_MAX_DIM = 256 // px — longest edge of stored preview
const MIN_ITEMS_ON_QUOTA = 5 // never prune below this on quota errors

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persist items, surviving QuotaExceededError. On quota failure we drop the
 * oldest entries and retry, so a successful analysis is never reported as
 * failed just because history storage is full. Returns true on success.
 */
function writeAll(items) {
  let toStore = items
  while (toStore.length >= MIN_ITEMS_ON_QUOTA) {
    try {
      localStorage.setItem(KEY, JSON.stringify(toStore))
      return true
    } catch (err) {
      const isQuota =
        err &&
        (err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
          err.code === 22)
      if (!isQuota) return false
      // Drop the oldest half and retry.
      toStore = toStore.slice(Math.ceil(toStore.length / 2))
    }
  }
  // Last resort: try to keep only the newest item.
  try {
    localStorage.setItem(KEY, JSON.stringify(toStore.slice(-1)))
    return true
  } catch {
    return false
  }
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
  return writeAll(items.slice(-MAX_ITEMS))
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

/**
 * Downscale an image file to a small JPEG thumbnail (longest edge
 * THUMB_MAX_DIM) so stored history previews stay tiny and don't blow the
 * localStorage quota. Falls back to the raw data URL if canvas encoding
 * is unavailable.
 */
async function fileToThumbnailDataUrl(file) {
  const rawDataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed reading file'))
    reader.readAsDataURL(file)
  })

  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Failed decoding image'))
      image.src = rawDataUrl
    })

    const { width, height } = img
    if (!width || !height) return rawDataUrl

    const scale = Math.min(1, THUMB_MAX_DIM / Math.max(width, height))
    const w = Math.round(width * scale)
    const h = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return rawDataUrl
    ctx.drawImage(img, 0, 0, w, h)

    return canvas.toDataURL('image/jpeg', 0.7)
  } catch {
    // If anything goes wrong, fall back to the original data URL.
    return rawDataUrl
  }
}

export async function attachPreviewDataUrl(item, file) {
  if (!file) return item
  const previewDataUrl = await fileToThumbnailDataUrl(file)
  return { ...item, previewDataUrl }
}