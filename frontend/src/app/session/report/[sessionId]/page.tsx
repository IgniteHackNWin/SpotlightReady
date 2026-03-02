'use client'

import { useEffect } from 'react'
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

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((r) => r.data)

/**
 * POST-SESSION REPORT PAGE
 * 7 structured sections – deep, educational, data-driven
 */
export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  const { data: report, isLoading, error } = useSWR<PerformanceReport>(
    sessionId ? `/api/reports/${sessionId}` : null,
    fetcher,
    { refreshInterval: 3000 }   // poll until report is ready
  )

  if (isLoading || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading your report...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-accent-red">Failed to load report. Please try again.</div>
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
