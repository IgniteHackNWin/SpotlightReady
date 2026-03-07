import { v4 as uuidv4 } from 'uuid'
import { evaluateTranscript, compressTranscript } from './transcriptEvaluator'
import { generateFeedback } from './feedbackGenerator'
import {
  computeSpeechAnalytics,
  computeVisualPresence,
  computeScoreBreakdown,
  generateReplayMarkers,
  buildOverallSummary,
} from './scoringEngine'
import type { SessionData, PerformanceReport } from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Report Orchestrator
// Single entry point: SessionData → PerformanceReport
// Makes exactly 2 LLM calls per session (transcript eval + feedback gen)
// Everything else is deterministic math
// ─────────────────────────────────────────────────────────────────────────────

export async function generateReport(session: SessionData): Promise<PerformanceReport> {
  console.log(`[Report] Generating for session ${session.sessionId}`)

  // ── 1. Deterministic analytics (no AI, instant) ───────────────────────────
  const speechAnalytics = computeSpeechAnalytics(session)
  const visualPresence = computeVisualPresence(session)

  // ── 2. LLM Call 1: Transcript Evaluation (SMART model) ───────────────────
  const compressed = compressTranscript(session.transcript)
  const lastMetrics = session.metricsTimeline[session.metricsTimeline.length - 1]
  const avgConfidence =
    session.metricsTimeline.reduce((sum, t) => sum + t.confidenceScore, 0) /
    (session.metricsTimeline.length || 1)

  const { contentIntelligence, grammarLanguage } = await evaluateTranscript({
    config: session.config,
    transcriptText: compressed,
    totalWords: lastMetrics?.currentWPM
      ? Math.round((lastMetrics.currentWPM / 60) * session.durationSeconds)
      : 0,
    fillerCount: speechAnalytics.totalFillerWords,
    topFillers: Object.keys(speechAnalytics.fillerWordBreakdown).slice(0, 3),
    durationSeconds: session.durationSeconds,
    questionTimings: session.questionTimings,
  })

  // ── 3. Score Breakdown (math) ─────────────────────────────────────────────
  const scoreBreakdown = computeScoreBreakdown(
    speechAnalytics,
    visualPresence,
    contentIntelligence,
    Math.round(avgConfidence),
    session.durationSeconds
  )

  // ── 4. Overall Summary (math + text) ─────────────────────────────────────
  const overallSummary = buildOverallSummary(
    scoreBreakdown,
    speechAnalytics,
    visualPresence,
    contentIntelligence
  )

  // ── 5. LLM Call 2: Feedback & Improvement Plan (FAST model) ──────────────
  const improvementPlan = await generateFeedback({
    breakdown: scoreBreakdown,
    topStrengths: overallSummary.topStrengths,
    topWeaknesses: overallSummary.topImprovements,
    fillerCount: speechAnalytics.totalFillerWords,
    averageWPM: speechAnalytics.averageWPM,
    eyeContactPercent: visualPresence.averageEyeContactPercent,
    mode: session.config.mode,
  })

  // ── 6. Replay Markers (math) ──────────────────────────────────────────────
  const replayMarkers = generateReplayMarkers(session, speechAnalytics)

  console.log(`[Report] Done. Score: ${scoreBreakdown.total}/100 (${overallSummary.tier})`)

  return {
    reportId: uuidv4(),
    sessionId: session.sessionId,
    userId: session.userId,
    generatedAt: new Date().toISOString(),
    overallSummary,
    speechAnalytics,
    visualPresence,
    contentIntelligence,
    grammarLanguage,
    replayMarkers,
    improvementPlan,
    totalScore: scoreBreakdown.total,
    scoreBreakdown,
  }
}
