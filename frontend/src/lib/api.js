const DEFAULT_BASE_URL = 'http://127.0.0.1:5000'

function getBaseUrl() {
  const fromEnv = import.meta.env?.VITE_API_BASE_URL
  return (fromEnv && String(fromEnv).trim()) || DEFAULT_BASE_URL
}

async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, error: text || 'Invalid JSON response' }
  }
}

export async function healthCheck() {
  const res = await fetch(`${getBaseUrl()}/api/health`)
  const data = await safeJson(res)
  if (!res.ok || !data.ok) throw new Error(data.error || 'Health check failed')
  return data
}

export async function predictImage(file) {
  if (!file) throw new Error('Please select an image file.')
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`${getBaseUrl()}/api/predict`, {
    method: 'POST',
    body: form,
  })

  const data = await safeJson(res)
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Prediction failed')
  }
  return data
}
