'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
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

// Only return data if the report actually exists (not 404/null)
const fetcher = (url: string) =>
  fetch(url).then((r) => r.json()).then((r) => r.success && r.data ? r.data : null)

/**
 * POST-SESSION REPORT PAGE
 * 7 structured sections – deep, educational, data-driven
 */
export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [timedOut, setTimedOut] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [pollingEnabled, setPollingEnabled] = useState(true)

  const { data: report, isLoading, mutate } = useSWR<PerformanceReport | null>(
    sessionId ? `/api/reports/${sessionId}` : null,
    fetcher,
    { refreshInterval: pollingEnabled ? 3000 : 0 }
  )

  // Stop polling once report arrives
  useEffect(() => {
    if (report) setPollingEnabled(false)
  }, [report])

  // Timeout after 90s — report generation should never take longer
  useEffect(() => {
    if (report) return
    timeoutRef.current = setTimeout(() => setTimedOut(true), 90_000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [report])

  const handleRetry = async () => {
    setRetrying(true)
    setTimedOut(false)
    try {
      // Hit the regenerate endpoint then resume polling
      await fetch(`${API}/sessions/${sessionId}/regenerate`, { method: 'POST' })
      setTimeout(() => mutate(), 5000) // give AI 5s head start then resume poll
    } catch {}
    setRetrying(false)
  }

  if (!report) {
    if (timedOut) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-surface-950">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Report taking too long</h2>
            <p className="text-white/50 text-sm mb-6">
              The AI analysis didn&apos;t complete in time. This can happen if the microphone
              didn&apos;t capture audio, or the AI service was temporarily unavailable.
            </p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {retrying ? 'Retrying...' : 'Retry Report Generation'}
            </button>
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
          <p className="text-white font-medium mb-1">Generating your report...</p>
          <p className="text-white/40 text-sm">AI is analysing your session</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-950 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">
            Performance Report
          </p>
          <h1 className="text-4xl font-bold text-white">Session Complete</h1>
        </div>

        {/* Section 1: Overall Score */}
        <OverallScoreCard summary={report.overallSummary} breakdown={report.scoreBreakdown} />

        {/* Section 2: Speech Analytics */}
        <SpeechAnalyticsSection data={report.speechAnalytics} />

        {/* Section 3: Visual Presence */}
        <VisualPresenceSection data={report.visualPresence} />

        {/* Section 4: Content Intelligence */}
        <ContentIntelligenceSection data={report.contentIntelligence} />

        {/* Section 5: Grammar & Language */}
        <GrammarSection data={report.grammarLanguage} />

        {/* Section 6: Replay */}
        <ReplaySection sessionId={sessionId} markers={report.replayMarkers} />

        {/* Section 7: Improvement Plan */}
        <ImprovementPlanSection plan={report.improvementPlan} />
      </div>
    </main>
  )
}
