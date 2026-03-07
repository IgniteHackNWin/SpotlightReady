'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionConfig, LiveMetrics, TimestampedMetrics } from '@spotlightready/shared'
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
 * - No grammar corrections, no detailed scoring, no complex charts
 * - Only shows: Timer | Pace | Filler Count | Repetitions | Eye Contact | Confidence
 */
export default function LiveSessionPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const { config: storeConfig, sessionId: storeSessionId, setConfig, setSessionData } = useSessionStore()
  const [activeConfig, setActiveConfig] = useState<SessionConfig | null>(storeConfig)

  // Hydrate config from sessionStorage when Zustand store is empty
  // (happens on hard refresh or direct URL navigation)
  useEffect(() => {
    if (!storeConfig) {
      try {
        const raw = sessionStorage.getItem('spotlightready:config')
        if (raw) {
          const cfg = JSON.parse(raw) as SessionConfig
          setConfig(cfg)
          setActiveConfig(cfg)
        } else {
          router.replace('/')
        }
      } catch {
        router.replace('/')
      }
    }
    startCamera()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep local activeConfig in sync if store updates
  useEffect(() => {
    if (storeConfig) setActiveConfig(storeConfig)
  }, [storeConfig])

  const { metrics, transcript, startListening, stopListening } = useSpeechAnalysis(activeConfig)
  const { eyeMetrics, startTracking, stopTracking } = useEyeTracking(videoRef)

  const [isStarted, setIsStarted] = useState(false)
  const startedAtRef = useRef<string>('')

  // Use backend-assigned sessionId (from createSession call in setup page)
  // Fall back to a local UUID if backend was unreachable
  const sessionIdRef = useRef<string>(storeSessionId ?? crypto.randomUUID())

  // ── Metrics timeline capture ───────────────────────────────────────────────
  // Accumulate snapshots every 5s so the scoring engine has real data to work with
  const metricsSnapshotsRef = useRef<TimestampedMetrics[]>([])
  // Always-fresh ref to latest compositeMetrics (avoids stale closure in interval)
  const latestCompositeRef = useRef<LiveMetrics | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      console.error('Camera/mic access denied')
    }
  }

  // Snapshot interval — every 5s save current compositeMetrics with elapsed timestamp
  useEffect(() => {
    if (!isStarted) return
    const interval = setInterval(() => {
      if (!latestCompositeRef.current) return
      const startMs = new Date(startedAtRef.current).getTime()
      metricsSnapshotsRef.current.push({
        ...latestCompositeRef.current,
        timestampMs: Date.now() - startMs,
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [isStarted])

  const handleStart = () => {
    startedAtRef.current = new Date().toISOString()
    metricsSnapshotsRef.current = []   // reset on each new session start
    setIsStarted(true)
    startListening()
    startTracking()
  }

  const handleEnd = async () => {
    stopListening()
    stopTracking()

    const endedAt = new Date().toISOString()
    const startedAt = startedAtRef.current || endedAt
    const durationSeconds = Math.round(
      (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000
    )
    const userId = localStorage.getItem('sr_uid') ?? 'anon'

    setSessionData({
      sessionId: sessionIdRef.current,
      userId,
      config: activeConfig!,
      startedAt,
      endedAt,
      durationSeconds,
      transcript,
      metricsTimeline: metricsSnapshotsRef.current,
      recordingUrl: null,
    })
    router.push('/session/processing')
  }

  // Composite live metrics including eye tracking
  const compositeMetrics: LiveMetrics = {
    ...metrics,
    eyeContactScore: eyeMetrics.score,
    eyeContactStatus: eyeMetrics.status,
  }
  // Keep ref in sync so the snapshot interval always reads latest values
  latestCompositeRef.current = compositeMetrics

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

        {/* Center – Question display (interview mode only) */}
        {activeConfig?.mode === 'interview' && (
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
