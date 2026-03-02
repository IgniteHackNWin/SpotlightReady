'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionConfig, LiveMetrics } from '@spotlightready/shared'
import { LiveMetricsHUD } from '@/components/live/LiveMetricsHUD'
import { SessionTimer } from '@/components/live/SessionTimer'
import { QuestionCard } from '@/components/live/QuestionCard'
import { useSessionStore } from '@/store/sessionStore'
import { useSpeechAnalysis } from '@/hooks/useSpeechAnalysis'
import { useEyeTracking } from '@/hooks/useEyeTracking'

/**
 * LIVE SESSION PAGE  (Layer 2 – Real-Time Performance Engine)
 *
 * Design principle: MINIMAL. Non-distracting. Awareness only.
 * - No grammar corrections
 * - No detailed scoring
 * - No complex charts
 *
 * Only shows: Timer | Pace | Filler Count | Repetitions | Eye Contact | Confidence
 */
export default function LiveSessionPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const { config, setSessionData, endSession } = useSessionStore()
  const { metrics, transcript, startListening, stopListening } = useSpeechAnalysis(config)
  const { eyeMetrics, startTracking, stopTracking } = useEyeTracking(videoRef)

  const [isStarted, setIsStarted] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())

  useEffect(() => {
    if (!config) {
      router.replace('/')
      return
    }
    startCamera()
  }, [config])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      console.error('Camera/mic access denied')
    }
  }

  const handleStart = () => {
    setIsStarted(true)
    startListening()
    startTracking()
  }

  const handleEnd = async () => {
    stopListening()
    stopTracking()

    const sessionData = {
      sessionId,
      config: config!,
      transcript,
      metricsTimeline: [],  // populated by useSpeechAnalysis
      recordingUrl: null,
    }

    setSessionData(sessionData)
    router.push('/session/processing')
  }

  // Composite live metrics including eye tracking
  const compositeMetrics: LiveMetrics = {
    ...metrics,
    eyeContactScore: eyeMetrics.score,
    eyeContactStatus: eyeMetrics.status,
  }

  return (
    <main className="relative min-h-screen bg-surface-950 overflow-hidden">
      {/* Camera feed – full background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-surface-950/70" />

      {/* Live HUD – positioned to not block camera */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Live</span>
          </div>
          <SessionTimer isRunning={isStarted} />
          <button
            onClick={handleEnd}
            className="px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-white/70 hover:text-white text-sm transition-colors"
          >
            End Session
          </button>
        </div>

        {/* Center – Question display (interview mode) */}
        {config?.mode === 'interview' && (
          <div className="flex-1 flex items-center justify-center px-8">
            <QuestionCard />
          </div>
        )}

        {/* Bottom – Live metrics HUD */}
        <div className="p-4">
          <LiveMetricsHUD metrics={compositeMetrics} isActive={isStarted} />
        </div>
      </div>

      {/* Start overlay */}
      {!isStarted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-950/90">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Ready?</h2>
            <p className="text-white/50 mb-8">Microphone and camera are active</p>
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-all hover:scale-105"
            >
              Start Session
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
