'use client'

import { useEffect, useState, useRef } from 'react'
import type { SessionConfig } from '@spotlightready/shared'

interface Props {
  config: SessionConfig
  onStart: () => void
  isLoading?: boolean
}

export function PreparationScreen({ config, onStart, isLoading = false }: Props) {
  const [cameraReady, setCameraReady] = useState(false)
  const [micReady, setMicReady] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream
        setCameraReady(true)
        setMicReady(true)
      })
      .catch(() => {
        console.warn('Could not access camera/mic')
      })
  }, [])

  const handleStart = () => {
    setCountdown(3)
    let c = 3
    const interval = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c === 0) {
        clearInterval(interval)
        onStart()
      }
    }, 1000)
  }

  const modeLabel = config.mode === 'interview'
    ? `${(config as any).role} – ${(config as any).difficulty}`
    : `${(config as any).topic}`

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Almost Ready</h1>
        <p className="text-white/40 text-sm">{modeLabel}</p>
      </div>

      {/* Camera preview */}
      <div className="relative rounded-2xl overflow-hidden bg-surface-900 aspect-video border border-surface-700">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
            Requesting camera access...
          </div>
        )}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950/80">
            <span className="text-7xl font-bold text-white animate-fade-in">{countdown}</span>
          </div>
        )}
      </div>

      {/* Checks */}
      <div className="flex gap-4">
        <StatusPill label="Camera" ok={cameraReady} />
        <StatusPill label="Microphone" ok={micReady} />
      </div>

      <button
        onClick={handleStart}
        disabled={!cameraReady || countdown !== null || isLoading}
        className="w-full py-4 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:scale-[1.02] disabled:hover:scale-100"
      >
        {isLoading
          ? 'Preparing session…'
          : countdown !== null
          ? `Starting in ${countdown}...`
          : 'Begin Session'}
      </button>
    </div>
  )
}

function StatusPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${
      ok ? 'border-accent-green/30 bg-accent-green/10 text-accent-green' : 'border-surface-700 bg-surface-800 text-white/40'
    }`}>
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-accent-green' : 'bg-surface-600'}`} />
      {label}
    </div>
  )
}
