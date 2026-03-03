import type {
  SessionData,
  SpeechAnalytics,
  VisualPresence,
  ScoreBreakdown,
  ReplayMarker,
  OverallSummary,
  PerformanceTier,
  ContentIntelligence,
} from '@spotlightready/shared'
import { scoreTotier, WPM_THRESHOLDS } from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Scoring Engine – Pure math, zero AI tokens
// Computes everything deterministically from the session metrics timeline
// ─────────────────────────────────────────────────────────────────────────────

export function computeSpeechAnalytics(session: SessionData): SpeechAnalytics {
  const timeline = session.metricsTimeline
  const lastMetrics = timeline[timeline.length - 1]

  // WPM from last snapshot
  const averageWPM = lastMetrics?.currentWPM || 0

  // Filler words
  const totalFillerWords = lastMetrics?.fillerWordCount || 0
  const fillerWordBreakdown = lastMetrics?.fillerWordBreakdown || {}

  // Repeated words from last snapshot
  const repeatedWords = (lastMetrics?.repetitions || []).map((r) => ({
    word: r.word,
    count: r.count,
  }))

  // Detect long pauses from WPM dips in the timeline
  const longPauses: Array<{ startMs: number; durationMs: number }> = []
  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1]
    const curr = timeline[i]
    if (prev.currentWPM > 0 && curr.currentWPM === 0) {
      longPauses.push({ startMs: curr.timestampMs, durationMs: 2000 })
    }
  }

  // Rhythm: how stable was the WPM? Lower variance = better rhythm
  const wpms = timeline.map((t) => t.currentWPM).filter((w) => w > 0)
  const avgWpm = wpms.reduce((a, b) => a + b, 0) / (wpms.length || 1)
  const variance = wpms.reduce((a, b) => a + Math.pow(b - avgWpm, 2), 0) / (wpms.length || 1)
  const rhythmConsistencyScore = Math.max(0, Math.min(100, 100 - Math.sqrt(variance)))

  return {
    averageWPM,
    totalFillerWords,
    fillerWordBreakdown,
    repeatedWords,
    longPauses,
    rhythmConsistencyScore: Math.round(rhythmConsistencyScore),
    stutterCount: 0, // TODO: detect from transcript gaps
  }
}

export function computeVisualPresence(session: SessionData): VisualPresence {
  const timeline = session.metricsTimeline
  if (timeline.length === 0) {
    return {
      averageEyeContactPercent: 0,
      eyeContactDips: [],
      headStabilityScore: 0,
      expressivenessScore: 0,
      postureStabilityScore: -1,
    }
  }

  const eyeScores = timeline.map((t) => t.eyeContactScore)
  const avgEye = Math.round(eyeScores.reduce((a, b) => a + b, 0) / eyeScores.length)

  // Dips = eye contact drops below 40% for > 2 consecutive samples
  const dips: Array<{ timestampMs: number; durationMs: number }> = []
  let dipStart: number | null = null
  for (const snap of timeline) {
    if (snap.eyeContactScore < 40) {
      if (dipStart === null) dipStart = snap.timestampMs
    } else {
      if (dipStart !== null) {
        dips.push({ timestampMs: dipStart, durationMs: snap.timestampMs - dipStart })
        dipStart = null
      }
    }
  }

  return {
    averageEyeContactPercent: avgEye,
    eyeContactDips: dips,
    headStabilityScore: Math.min(100, avgEye + 10),  // proxy for now
    expressivenessScore: 70,  // TODO: from face landmark variance
    postureStabilityScore: -1,
  }
}

export function computeScoreBreakdown(
  speech: SpeechAnalytics,
  visual: VisualPresence,
  content: ContentIntelligence,
  avgConfidence: number
): ScoreBreakdown {
  // ── Speech Delivery (30 pts) ─────────────────────────────────
  let speechDelivery = 30
  // Deduct for pace issues
  if (speech.averageWPM > WPM_THRESHOLDS.tooFast || speech.averageWPM < WPM_THRESHOLDS.tooSlow) {
    speechDelivery -= 5
  }
  // Deduct for filler words (up to -10)
  speechDelivery -= Math.min(10, speech.totalFillerWords)
  // Deduct for long pauses
  speechDelivery -= Math.min(5, speech.longPauses.length)
  speechDelivery = Math.max(0, Math.round(speechDelivery))

  // ── Visual Presence (20 pts) ─────────────────────────────────
  const visualPresence = Math.round((visual.averageEyeContactPercent / 100) * 20)

  // ── Content Quality (30 pts) ─────────────────────────────────
  let contentQuality = 0
  if (content.type === 'interview') {
    contentQuality = Math.round(
      ((content.relevanceScore + content.keyConceptCoverage + content.structureScore + content.depthScore) / 400) * 30
    )
  } else {
    contentQuality = Math.round(
      ((content.messageClarityScore + content.narrativeStructureScore + content.openingStrengthScore + content.conclusionImpactScore) / 400) * 30
    )
  }

  // ── Confidence & Flow (20 pts) ──────────────────────────────
  const confidenceFlow = Math.round((avgConfidence / 100) * 20)

  const total = speechDelivery + visualPresence + contentQuality + confidenceFlow

  return { speechDelivery, visualPresence, contentQuality, confidenceFlow, total }
}

export function generateReplayMarkers(
  session: SessionData,
  speech: SpeechAnalytics
): ReplayMarker[] {
  const markers: ReplayMarker[] = []

  for (const snap of session.metricsTimeline) {
    // Filler spike
    if (snap.fillerWordCount > 0 && snap.fillerWordCount % 5 === 0) {
      markers.push({
        type: 'filler-spike',
        timestampMs: snap.timestampMs,
        durationMs: 2000,
        label: `${snap.fillerWordCount} filler words`,
        severity: snap.fillerWordCount > 10 ? 'high' : 'medium',
      })
    }

    // Confidence dip
    if (snap.confidenceScore < 40) {
      markers.push({
        type: 'confidence-dip',
        timestampMs: snap.timestampMs,
        durationMs: 3000,
        label: `Confidence dropped to ${snap.confidenceScore}`,
        severity: 'medium',
      })
    }

    // Eye contact drop
    if (snap.eyeContactScore < 35) {
      markers.push({
        type: 'eye-contact-drop',
        timestampMs: snap.timestampMs,
        durationMs: 2000,
        label: 'Eye contact lost',
        severity: 'low',
      })
    }
  }

  // Long pauses
  speech.longPauses.forEach((pause) => {
    markers.push({
      type: 'long-pause',
      timestampMs: pause.startMs,
      durationMs: pause.durationMs,
      label: `${(pause.durationMs / 1000).toFixed(1)}s pause`,
      severity: pause.durationMs > 5000 ? 'high' : 'low',
    })
  })

  return markers
}

export function buildOverallSummary(
  breakdown: ScoreBreakdown,
  speech: SpeechAnalytics,
  visual: VisualPresence,
  content: ContentIntelligence
): OverallSummary {
  const tier: PerformanceTier = scoreTotier(breakdown.total)

  const strengths: string[] = []
  const improvements: string[] = []

  if (breakdown.speechDelivery >= 22) strengths.push('Strong speech delivery and pace control')
  else improvements.push(`Pace control (${speech.averageWPM} WPM, ${speech.totalFillerWords} fillers)`)

  if (breakdown.visualPresence >= 15) strengths.push(`Excellent eye contact (${visual.averageEyeContactPercent}%)`)
  else improvements.push(`Eye contact (${visual.averageEyeContactPercent}% — aim for 70%+)`)

  if (breakdown.contentQuality >= 22) strengths.push('Well-structured, relevant content')
  else improvements.push('Content depth and structure')

  if (breakdown.confidenceFlow >= 15) strengths.push('Confident and steady delivery')
  else improvements.push('Overall confidence and flow')

  // Ensure we have at least 1 of each
  if (strengths.length === 0) strengths.push('Completed the full session — first step taken')
  if (improvements.length === 0) improvements.push('Keep pushing for consistency')

  return {
    totalScore: breakdown.total,
    tier,
    topStrengths: strengths.slice(0, 3),
    topImprovements: improvements.slice(0, 3),
  }
}
