const DEFAULT_BASE_URL = 'https://ankitsunil530-dfu-backend.hf.space'

function getBaseUrl() {
  const fromEnv = import.meta.env?.VITE_API_BASE_URL
  return (fromEnv && String(fromEnv).trim()) || DEFAULT_BASE_URL
}

// ------------------ Safe JSON ------------------
async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return {
      ok: false,
      error: text || 'Invalid JSON response from server',
    }
  }
}

// ------------------ Health Check ------------------
export async function healthCheck() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/health`)
    const data = await safeJson(res)

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Health check failed')
    }

    return data
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Server not reachable'
    )
  }
}

// ------------------ Predict Image ------------------
export async function predictImage(file) {
  if (!file) throw new Error('Please select an image file.')

  const form = new FormData()
  form.append('image', file)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000) // 20s timeout

    const res = await fetch(`${getBaseUrl()}/api/predict`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const data = await safeJson(res)

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Prediction failed')
    }

    // 🔥 Normalize response (VERY IMPORTANT)
    return {
      ok: true,
      prediction: data.prediction,   // "Ulcer" / "Normal"
      stage: data.stage,
      confidence: data.confidence,
      risk_level: data.risk_level,
      advice: data.advice,
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timeout. Server is slow or busy.')
    }

    throw new Error(
      err instanceof Error ? err.message : 'Prediction failed'
    )
  }
}