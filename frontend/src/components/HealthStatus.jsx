import { useEffect, useState } from 'react'
import { healthCheck } from '../lib/api.js'
import Badge from './Badge.jsx'
import Skeleton from './Skeleton.jsx'

export default function HealthStatus() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let active = true
    healthCheck()
      .then((d) => {
        if (!active) return
        setState({ status: 'ok', time: d.time })
      })
      .catch(() => {
        if (!active) return
        setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }

  if (state.status === 'ok') {
    return (
      <div className="flex items-center gap-2">
        <Badge tone="success">Backend online</Badge>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {state.time}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge tone="danger">Backend offline</Badge>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Start backend at <span className="font-semibold">localhost:5000</span> or
        set <span className="font-semibold">VITE_API_BASE_URL</span>
      </div>
    </div>
  )
}

