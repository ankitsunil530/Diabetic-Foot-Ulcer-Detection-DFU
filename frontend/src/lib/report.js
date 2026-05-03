import { jsPDF } from 'jspdf'
import { formatDateTime, formatPercent } from './format.js'

export function downloadPdfReport(item) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Diabetic Foot Ulcer Detection — Report', 40, 52)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 74)

  doc.setTextColor(30)
  doc.setFontSize(12)
  doc.text(`Filename: ${item?.filename || '—'}`, 40, 112)
  doc.text(`Timestamp: ${formatDateTime(item?.createdAt)}`, 40, 132)
  doc.text(`Label: ${item?.label || '—'}`, 40, 152)
  doc.text(`Confidence: ${formatPercent(item?.confidence)}`, 40, 172)
  doc.text(`Severity: ${item?.severity || '—'}`, 40, 192)

  doc.setDrawColor(220)
  doc.roundedRect(40, 220, 515, 240, 10, 10)
  doc.setFont('helvetica', 'bold')
  doc.text('Explanation (placeholder)', 54, 244)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60)
  const expl = String(item?.explanation || '—')
  const lines = doc.splitTextToSize(expl, 485)
  doc.text(lines, 54, 264)

  doc.setTextColor(90)
  doc.setFontSize(10)
  doc.text(
    'Disclaimer: For screening support only. Always rely on clinical judgement.',
    40,
    790,
  )

  doc.save(`dfu-report-${item?.id || 'result'}.pdf`)
}

