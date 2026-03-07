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

  // WPM: average across all snapshots where user was speaking (>0 WPM)
  // Using last snapshot alone gives a distorted reading if the user paused at the end
  const speakingSnapshots = timeline.filter((t) => t.currentWPM > 0)
  const averageWPM = speakingSnapshots.length > 0
    ? Math.round(speakingSnapshots.reduce((a, t) => a + t.currentWPM, 0) / speakingSnapshots.length)
    : (lastMetrics?.currentWPM || 0)

  // Filler words — always take from last snapshot (running total)
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

  // Head stability = inverse of eye-score variance
  // High variance → head is moving around or looking away repeatedly → lower stability
  const eyeVariance = eyeScores.reduce((acc, s) => acc + Math.pow(s - avgEye, 2), 0) / eyeScores.length
  const headStabilityScore = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(eyeVariance))))

  // Expressiveness = moderate variance is good (too flat = robotic, too erratic = nervous)
  // Sweet spot: stdDev around 15–25 → maps to ~80
  const eyeStdDev = Math.sqrt(eyeVariance)
  const expressivenessScore = Math.max(0, Math.min(100, Math.round(
    eyeStdDev < 5 ? 40 :       // flat/frozen face
    eyeStdDev < 15 ? 60 :      // slightly expressive
    eyeStdDev < 30 ? 80 :      // good natural variation
    eyeStdDev < 45 ? 65 :      // getting erratic
    40                          // very erratic
  )))

  // Dips = eye contact drops below 40% for consecutive samples
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
    headStabilityScore,
    expressivenessScore,
    postureStabilityScore: -1,
  }
}

export function computeScoreBreakdown(
  speech: SpeechAnalytics,
  visual: VisualPresence,
  content: ContentIntelligence,
  avgConfidence: number,
  durationSeconds: number
): ScoreBreakdown {
  const hasSpeech = speech.averageWPM > 0 || speech.totalFillerWords > 0

  // ── Speech Delivery (30 pts) — EARNED model ──────────────────
  // No speech = 0. Points are earned not deducted from a full bucket.
  let speechDelivery = 0
  if (hasSpeech) {
    // Pace score: ideal WPM range (120–160) earns 12 pts, partial credit outside
    let paceScore = 12
    if (speech.averageWPM > WPM_THRESHOLDS.tooFast || speech.averageWPM < WPM_THRESHOLDS.tooSlow) paceScore = 4
    else if (speech.averageWPM < WPM_THRESHOLDS.idealMin || speech.averageWPM > WPM_THRESHOLDS.idealMax) paceScore = 8

    // Filler rate score: penalise by RATE not raw count (1 filler/100 words is fine, 1 per 5 is bad)
    const totalWords = Math.max(1, Math.round((speech.averageWPM / 60) * durationSeconds))
    const fillerRate = speech.totalFillerWords / totalWords  // 0.0 – 1.0
    const fillerScore = Math.round(Math.max(0, 12 * (1 - fillerRate * 20)))  // 20+ fillers per 100w → 0

    // Rhythm/pause score: up to 6 pts
    const rhythmScore = Math.round((speech.rhythmConsistencyScore / 100) * 6)

    speechDelivery = Math.min(30, paceScore + fillerScore + rhythmScore)
  }

  // ── Visual Presence (20 pts) ─────────────────────────────────
  // Eye contact is the primary signal (14 pts), head stability is secondary (6 pts)
  const eyePts = Math.round((visual.averageEyeContactPercent / 100) * 14)
  const stabPts = Math.round((visual.headStabilityScore / 100) * 6)
  const visualPresence = Math.min(20, eyePts + stabPts)

  // ── Content Quality (30 pts) — MOST IMPORTANT ────────────────
  // Content is zero if no speech was captured (fallback eval sends 0s).
  // In interview mode: relevance + key-concept + structure + depth are equal weight.
  // Bonus: penalise further if fewer than half the expected questions were addressed.
  let contentQuality = 0
  if (content.type === 'interview') {
    const avg = (content.relevanceScore + content.keyConceptCoverage + content.structureScore + content.depthScore) / 4
    contentQuality = Math.round((avg / 100) * 30)
  } else {
    const avg = (content.messageClarityScore + content.narrativeStructureScore + content.openingStrengthScore + content.conclusionImpactScore) / 4
    contentQuality = Math.round((avg / 100) * 30)
  }
  // Hard gate: if there was no speech the content evaluation is meaningless → 0
  if (!hasSpeech) contentQuality = 0

  // ── Confidence & Flow (20 pts) ──────────────────────────────
  // avgConfidence is already WPM-gated on the client, so 0 WPM → ~0 here
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
  const hasSpeech = speech.averageWPM > 0 || speech.totalFillerWords > 0

  // No speech at all — return a clear diagnostic instead of misleading scores
  if (!hasSpeech) {
    return {
      totalScore: breakdown.total,
      tier,
      topStrengths: ['Camera was active and eye tracking captured visual data'],
      topImprovements: [
        'No speech was captured — grant microphone permission and use Chrome or Edge',
        'Content is the most important scoring dimension (30 pts) — speak your answers clearly',
        'Confidence & Flow (20 pts) is zero when no words are spoken',
      ],
    }
  }

  const strengths: string[] = []
  const improvements: string[] = []

  // Content first — most important (30 pts)
  if (breakdown.contentQuality >= 22) strengths.push('Well-structured, relevant and in-depth content')
  else if (breakdown.contentQuality >= 14) improvements.push('Increase answer depth — add specific examples and evidence')
  else improvements.push('Content quality is the biggest gap — focus on relevance, structure and depth')

  // Speech delivery (30 pts)
  const fillerRate = speech.totalFillerWords / Math.max(1, Math.round((speech.averageWPM / 60) * 60))
  if (breakdown.speechDelivery >= 22) strengths.push(`Clean delivery at ${speech.averageWPM} WPM with minimal fillers`)
  else if (speech.averageWPM === 0) improvements.push('Pace undetectable — ensure microphone is working')
  else if (fillerRate > 0.1) improvements.push(`High filler word rate ("um", "like", "basically") — ${speech.totalFillerWords} counted`)
  else improvements.push(`Pace needs work (${speech.averageWPM} WPM — ideal is 120–160 WPM)`)

  // Visual presence (20 pts)
  if (breakdown.visualPresence >= 15) strengths.push(`Strong eye contact at ${visual.averageEyeContactPercent}%`)
  else improvements.push(`Eye contact at ${visual.averageEyeContactPercent}% — aim for 70%+ to build trust`)

  // Confidence & flow (20 pts)
  if (breakdown.confidenceFlow >= 15) strengths.push('Confident, steady delivery with good flow')
  else improvements.push('Confidence and flow — reduce hesitations and filler words')

  if (strengths.length === 0) strengths.push('Session completed — data captured for improvement')

  return {
    totalScore: breakdown.total,
    tier,
    topStrengths: strengths.slice(0, 3),
    topImprovements: improvements.slice(0, 3),
  }
}
