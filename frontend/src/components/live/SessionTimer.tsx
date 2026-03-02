'use client'

import { useEffect, useState } from 'react'

interface Props {
  isRunning: boolean
}

export function SessionTimer({ isRunning }: Props) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="font-mono text-2xl font-bold text-white tabular-nums">
      {mm}:{ss}
    </div>
  )
}
