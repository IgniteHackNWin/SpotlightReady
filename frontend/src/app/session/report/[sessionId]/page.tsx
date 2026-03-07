'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { OverallScoreCard } from '@/components/report/OverallScoreCard'
import { SpeechAnalyticsSection } from '@/components/report/SpeechAnalyticsSection'
import { VisualPresenceSection } from '@/components/report/VisualPresenceSection'
import { ContentIntelligenceSection } from '@/components/report/ContentIntelligenceSection'
import { GrammarSection } from '@/components/report/GrammarSection'
import { ReplaySection } from '@/components/report/ReplaySection'
import { ImprovementPlanSection } from '@/components/report/ImprovementPlanSection'
import type { PerformanceReport } from '@spotlightready/shared'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json()).then((r) => r.success && r.data ? r.data : null)

/**
 * POST-SESSION REPORT PAGE
 * 7 structured sections + nav back to home + email report
 */
export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [timedOut, setTimedOut] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [pollingEnabled, setPollingEnabled] = useState(true)

  // ── Email modal state ───────────────────────────────────────────────────────
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const { data: report, mutate } = useSWR<PerformanceReport | null>(
    sessionId ? `/api/reports/${sessionId}` : null,
    fetcher,
    { refreshInterval: pollingEnabled ? 3000 : 0 }
  )

  useEffect(() => {
    if (report) setPollingEnabled(false)
  }, [report])

  useEffect(() => {
    if (report) return
    timeoutRef.current = setTimeout(() => setTimedOut(true), 90_000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [report])

  const handleRetry = async () => {
    setRetrying(true)
    setTimedOut(false)
    setPollingEnabled(true)
    try {
      await fetch(`${API}/sessions/${sessionId}/regenerate`, { method: 'POST' })
      setTimeout(() => mutate(), 5000)
    } catch {}
    setRetrying(false)
  }

  const handleSendEmail = async () => {
    if (!email || !report) return
    setEmailSending(true)
    setEmailStatus('idle')
    try {
      const res = await fetch(`${API}/reports/${sessionId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      setEmailStatus(json.success ? 'sent' : 'error')
    } catch {
      setEmailStatus('error')
    }
    setEmailSending(false)
  }

  if (!report) {
    if (timedOut) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-surface-950">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Report taking too long</h2>
            <p className="text-white/50 text-sm mb-6">
              The AI analysis didn&apos;t complete in time. Check microphone permissions and
              try again — Chrome / Edge work best for voice capture.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
              >
                {retrying ? 'Retrying…' : 'Retry Report'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white/70 font-semibold rounded-xl transition-colors"
              >
                ← Home
              </button>
            </div>
          </div>
        </main>
      )
    }
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-surface-700" />
            <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 animate-spin" />
          </div>
          <p className="text-white font-medium mb-1">Generating your report…</p>
          <p className="text-white/40 text-sm">AI is analysing your session</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-950 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Top navigation bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between animate-fade-in">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
          >
            ← Home
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/session/setup?mode=interview')}
              className="px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-white/70 hover:text-white text-sm transition-colors"
            >
              🔁 Retry Session
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-colors"
            >
              📧 Email Report
            </button>
          </div>
        </div>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center animate-fade-in">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">
            Performance Report
          </p>
          <h1 className="text-4xl font-bold text-white">Session Complete</h1>
        </div>

        {/* Section 1 */}
        <OverallScoreCard summary={report.overallSummary} breakdown={report.scoreBreakdown} />
        {/* Section 2 */}
        <SpeechAnalyticsSection data={report.speechAnalytics} />
        {/* Section 3 */}
        <VisualPresenceSection data={report.visualPresence} />
        {/* Section 4 */}
        <ContentIntelligenceSection data={report.contentIntelligence} />
        {/* Section 5 */}
        <GrammarSection data={report.grammarLanguage} />
        {/* Section 6 */}
        <ReplaySection sessionId={sessionId} markers={report.replayMarkers} />
        {/* Section 7 */}
        <ImprovementPlanSection plan={report.improvementPlan} />

        {/* ── Bottom action bar ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pb-4">
          <button
            onClick={() => router.push('/session/setup?mode=interview')}
            className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-all hover:scale-[1.02]"
          >
            🔁 Start New Session
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-white/70 hover:text-white font-semibold text-lg transition-all"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-8 py-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-white/70 hover:text-white font-semibold text-lg transition-all"
          >
            📧 Email My Report
          </button>
        </div>
      </div>

      {/* ── Email Modal ───────────────────────────────────────────────────── */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowEmailModal(false) }}
        >
          <div className="glass-card w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">📧 Email Your Report</h2>
              <button
                onClick={() => { setShowEmailModal(false); setEmailStatus('idle') }}
                className="text-white/40 hover:text-white transition-colors text-xl"
              >✕</button>
            </div>

            {emailStatus === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-white font-semibold text-lg mb-2">Report sent!</p>
                <p className="text-white/50 text-sm">Check your inbox at <span className="text-brand-400">{email}</span></p>
                <button
                  onClick={() => { setShowEmailModal(false); setEmailStatus('idle') }}
                  className="mt-6 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors"
                >Done</button>
              </div>
            ) : (
              <>
                <p className="text-white/50 text-sm mb-6">
                  We&apos;ll send your full 7-section performance report to your inbox. No account needed.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-800 border border-surface-700 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                  {emailStatus === 'error' && (
                    <p className="text-accent-red text-sm">Failed to send. Check your email and try again.</p>
                  )}
                  <button
                    onClick={handleSendEmail}
                    disabled={emailSending || !email}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                  >
                    {emailSending ? 'Sending…' : 'Send Report →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
