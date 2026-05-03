export function clamp01(value) {
  const v = Number(value)
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(1, v))
}

export function getSeverity({ label, confidence }) {
  const c = clamp01(confidence)
  const isUlcer = String(label || '').toLowerCase() === 'ulcer'
  if (!isUlcer) return { level: 'Mild', tone: 'success' }
  if (c >= 0.87) return { level: 'Severe', tone: 'danger' }
  if (c >= 0.72) return { level: 'Moderate', tone: 'warning' }
  return { level: 'Mild', tone: 'warning' }
}

export function getRecommendation({ label, severity }) {
  const isUlcer = String(label || '').toLowerCase() === 'ulcer'
  if (!isUlcer) {
    return [
      'Maintain foot hygiene and daily inspection.',
      'Keep skin moisturized; avoid walking barefoot.',
      'If symptoms worsen, consult a clinician.',
    ]
  }

  if (severity === 'Severe') {
    return [
      'Seek medical evaluation promptly.',
      'Avoid pressure on the affected area (offloading).',
      'Keep the wound clean and covered; do not self-treat aggressively.',
    ]
  }

  if (severity === 'Moderate') {
    return [
      'Schedule a clinical assessment soon.',
      'Reduce pressure on the area; consider protective footwear.',
      'Clean gently and monitor for infection signs (redness, warmth, discharge).',
    ]
  }

  return [
    'Monitor closely and keep the area clean and dry.',
    'Avoid friction/pressure; use supportive footwear.',
    'If pain, swelling, or discharge appears, consult a clinician.',
  ]
}

export function getDummyExplanation({ label }) {
  const isUlcer = String(label || '').toLowerCase() === 'ulcer'
  if (isUlcer) {
    return 'The model detected visual patterns consistent with ulcer-like regions (texture discontinuity, localized discoloration, and irregular boundaries). This is a demo explanation placeholder.'
  }
  return 'The model found no strong ulcer-like patterns in the image. This is a demo explanation placeholder.'
}

