'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionConfig, LiveMetrics, TimestampedMetrics, QuestionTiming } from '@spotlightready/shared'
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

  // ── Per-question timings ───────────────────────────────────────────────────
  const questionTimingsRef = useRef<QuestionTiming[]>([])
  const sessionStartMsRef = useRef<number>(0)
  const latestTranscriptRef = useRef<string>('')
  const latestFillerRef = useRef<number>(0)
  const latestWPMRef = useRef<number>(0)

  const handleTimingsUpdate = useCallback((timings: QuestionTiming[]) => {
    questionTimingsRef.current = timings
  }, [])

  const [teleprompterPos, setTeleprompterPos] = useState(0)

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

  // Teleprompter auto-scroll
  useEffect(() => {
    if (!isStarted) return
    const cfg = activeConfig as any
    if (!cfg?.teleprompterEnabled || !cfg?.teleprompterScript || cfg?.mode !== 'speech') return
    const speed: number = cfg.teleprompterSpeed ?? 150
    const wordCount = (cfg.teleprompterScript as string).split(/\s+/).filter(Boolean).length
    if (!wordCount) return
    const totalMs = (wordCount / speed) * 60000
    const startTime = Date.now()
    const iv = setInterval(() => {
      setTeleprompterPos(Math.min(100, ((Date.now() - startTime) / totalMs) * 100))
    }, 200)
    return () => clearInterval(iv)
  }, [isStarted, activeConfig]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    startedAtRef.current = new Date().toISOString()
    sessionStartMsRef.current = Date.now()
    metricsSnapshotsRef.current = []   // reset on each new session start
    questionTimingsRef.current = []
    setTeleprompterPos(0)
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
      questionTimings: questionTimingsRef.current,
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
  latestTranscriptRef.current = transcript.map((s) => s.text).join(' ')
  latestFillerRef.current = metrics.fillerWordCount
  latestWPMRef.current = metrics.currentWPM

  const teleScript = (activeConfig as any)?.teleprompterScript as string | undefined
  const teleEnabled = (activeConfig as any)?.teleprompterEnabled === true && !!teleScript && activeConfig?.mode === 'speech'

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

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center px-8">
          {activeConfig?.mode === 'interview' && (
            <QuestionCard
              onTimingsUpdate={handleTimingsUpdate}
              transcriptGetter={() => latestTranscriptRef.current}
              fillerGetter={() => latestFillerRef.current}
              wpmGetter={() => latestWPMRef.current}
              sessionStartMs={sessionStartMsRef.current}
            />
          )}

          {activeConfig?.mode === 'speech' && teleEnabled && isStarted && (
            <div className="w-full max-w-2xl glass-card p-6 overflow-hidden relative" style={{ maxHeight: '45vh' }}>
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-surface-900 to-transparent z-10 pointer-events-none" />
              <div
                className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap transition-transform duration-300"
                style={{ transform: `translateY(-${teleprompterPos * 2}px)` }}
              >
                {teleScript}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-2 left-4 right-4 h-1 bg-surface-700 rounded-full z-20">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${teleprompterPos}%` }} />
              </div>
            </div>
          )}

          {activeConfig?.mode === 'speech' && !teleEnabled && (
            <div className="glass-card max-w-2xl w-full p-8 text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Your Topic</p>
              <p className="text-2xl text-white font-medium">{(activeConfig as any).topic}</p>
            </div>
          )}
        </div>

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
            <p className="text-white/50 mb-8">
              {activeConfig?.mode === 'speech' && (activeConfig as any).teleprompterEnabled
                ? 'Teleprompter will auto-scroll when you start'
                : 'Microphone and camera are active'}
            </p>
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
