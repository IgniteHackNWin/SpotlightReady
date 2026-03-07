// ─────────────────────────────────────────────────────────────────────────────
// SpotlightReady – Shared Types
// Single source of truth for all data structures used across frontend, backend,
// and mastra-agents packages.
// ─────────────────────────────────────────────────────────────────────────────

// ── Session Modes ─────────────────────────────────────────────────────────────
export type SessionMode = 'interview' | 'speech'

// ── Difficulty / Experience ────────────────────────────────────────────────────
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior' | 'lead'

// ── Performance Tier ──────────────────────────────────────────────────────────
export type PerformanceTier = 'Beginner' | 'Developing' | 'Competent' | 'Confident' | 'Executive'

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SESSION CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface InterviewConfig {
  mode: 'interview'
  role: string               // e.g. "SDE – Java"
  experienceLevel: ExperienceLevel
  companyType: string        // e.g. "startup", "faang", "mid-size"
  difficulty: DifficultyLevel
  timeLimitMinutes: number   // per question
  totalQuestions: number
}

export interface SpeechConfig {
  mode: 'speech'
  topic: string
  audienceSize: 'small' | 'medium' | 'large' | 'virtual'
  durationMinutes: number
  formality: 'formal' | 'informal'
  teleprompterEnabled: boolean
  /** Full speech script pasted by user — used for teleprompter display */
  teleprompterScript?: string
  /** Teleprompter scroll speed in words-per-minute (default 150) */
  teleprompterSpeed?: number
}

export type SessionConfig = InterviewConfig | SpeechConfig

// ─────────────────────────────────────────────────────────────────────────────
// LIVE SESSION METRICS  (Layer 2 – Real-Time Performance Engine)
// ─────────────────────────────────────────────────────────────────────────────

export interface LiveMetrics {
  /** Elapsed time in seconds */
  elapsedSeconds: number

  /** Words per minute – current rolling window */
  currentWPM: number
  /** 'fast' | 'ideal' | 'slow' */
  paceStatus: 'fast' | 'ideal' | 'slow'

  /** Running total filler word count */
  fillerWordCount: number
  /** Map of filler word → count e.g. { um: 3, like: 7 } */
  fillerWordBreakdown: Record<string, number>

  /** Words repeated above threshold with suggested alternatives */
  repetitions: RepetitionAlert[]

  /** 0–100 */
  eyeContactScore: number
  eyeContactStatus: 'maintaining' | 'looking-away'

  /** Composite 0–100 */
  confidenceScore: number
}

export interface RepetitionAlert {
  word: string
  count: number
  suggestions: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION DATA  (what gets stored after session ends)
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionData {
  sessionId: string
  userId: string
  config: SessionConfig
  startedAt: string   // ISO timestamp
  endedAt: string     // ISO timestamp
  durationSeconds: number

  /** Full transcript with word-level timestamps */
  transcript: TranscriptSegment[]

  /** Snapshot metrics timeline (sampled every Xs during session) */
  metricsTimeline: TimestampedMetrics[]

  /** Per-question time + speech breakdown (interview mode only) */
  questionTimings?: QuestionTiming[]

  /** Raw recording reference (storage URL or null if not stored) */
  recordingUrl: string | null
}

export interface TranscriptSegment {
  text: string
  startMs: number
  endMs: number
  confidence: number
}

export interface TimestampedMetrics extends LiveMetrics {
  timestampMs: number
}

/** Time and speech data captured per interview question */
export interface QuestionTiming {
  questionIndex: number
  questionText: string
  startMs: number
  endMs: number
  durationSeconds: number
  transcriptText: string
  fillerCount: number
  avgWPM: number
}

// ─────────────────────────────────────────────────────────────────────────────
// POST-SESSION REPORT  (Layer 3 – AI Evaluation Layer output)
// ─────────────────────────────────────────────────────────────────────────────

export interface PerformanceReport {
  reportId: string
  sessionId: string
  userId: string
  generatedAt: string

  /** Section 1 */
  overallSummary: OverallSummary

  /** Section 2 */
  speechAnalytics: SpeechAnalytics

  /** Section 3 */
  visualPresence: VisualPresence

  /** Section 4 – AI powered (Mastra) */
  contentIntelligence: ContentIntelligence

  /** Section 5 */
  grammarLanguage: GrammarLanguage

  /** Section 6 */
  replayMarkers: ReplayMarker[]

  /** Section 7 */
  improvementPlan: ImprovementPlan

  /** Weighted total score 0–100 */
  totalScore: number
  scoreBreakdown: ScoreBreakdown
}

// ── Section 1 ─────────────────────────────────────────────────────────────────
export interface OverallSummary {
  totalScore: number
  tier: PerformanceTier
  topStrengths: string[]
  topImprovements: string[]
}

// ── Section 2 ─────────────────────────────────────────────────────────────────
export interface SpeechAnalytics {
  averageWPM: number
  totalFillerWords: number
  fillerWordBreakdown: Record<string, number>
  /** Words repeated above threshold */
  repeatedWords: Array<{ word: string; count: number }>
  /** Pauses > threshold (ms) with timestamps */
  longPauses: Array<{ startMs: number; durationMs: number }>
  rhythmConsistencyScore: number  // 0–100
  stutterCount: number
}

// ── Section 3 ─────────────────────────────────────────────────────────────────
export interface VisualPresence {
  averageEyeContactPercent: number
  eyeContactDips: Array<{ timestampMs: number; durationMs: number }>
  headStabilityScore: number      // 0–100
  expressivenessScore: number     // 0–100
  postureStabilityScore: number   // 0–100 (optional, -1 if not tracked)
}

// ── Section 4 ─────────────────────────────────────────────────────────────────
export type ContentIntelligence = InterviewContentScore | SpeechContentScore

export interface QuestionBreakdown {
  questionIndex: number
  questionText: string
  durationSeconds: number
  answerScore: number
  feedback: string
  issues: string[]
}

export interface InterviewContentScore {
  type: 'interview'
  relevanceScore: number
  keyConceptCoverage: number
  missedPoints: string[]
  structureScore: number
  depthScore: number
  feedback: string
  questionBreakdowns?: QuestionBreakdown[]
}

export interface SpeechContentScore {
  type: 'speech'
  messageClarityScore: number
  narrativeStructureScore: number
  openingStrengthScore: number
  conclusionImpactScore: number
  emotionalEnergyTrend: 'rising' | 'flat' | 'declining' | 'variable'
  feedback: string
}

// ── Section 5 ─────────────────────────────────────────────────────────────────
export interface GrammarLanguage {
  topErrors: GrammarError[]
  correctedSentences: Array<{ original: string; corrected: string }>
  vocabularyUpgrades: Array<{ word: string; suggestions: string[] }>
  weakTransitions: string[]
}

export interface GrammarError {
  type: string
  message: string
  context: string
  timestampMs: number
}

// ── Section 6 ─────────────────────────────────────────────────────────────────
export type ReplayMarkerType =
  | 'filler-spike'
  | 'confidence-dip'
  | 'eye-contact-drop'
  | 'weak-answer'
  | 'long-pause'
  | 'strength-moment'

export interface ReplayMarker {
  type: ReplayMarkerType
  timestampMs: number
  durationMs: number
  label: string
  severity: 'low' | 'medium' | 'high'
}

// ── Section 7 ─────────────────────────────────────────────────────────────────
export interface ImprovementPlan {
  drills: Drill[]
  retryRecommendation: string
  estimatedScoreImprovement: number  // e.g. +12 points
  personalizedSuggestions: string[]
}

export interface Drill {
  title: string
  description: string
  estimatedMinutes: number
  targetArea: 'speech' | 'visual' | 'content' | 'confidence'
}

// ── Score Breakdown ────────────────────────────────────────────────────────────
export interface ScoreBreakdown {
  speechDelivery: number   // 0–30
  visualPresence: number   // 0–20
  contentQuality: number   // 0–30
  confidenceFlow: number   // 0–20
  total: number            // 0–100
}

// ─────────────────────────────────────────────────────────────────────────────
// API TYPES  (shared request / response contracts)
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateSessionRequest {
  userId: string
  config: SessionConfig
}

export interface CreateSessionResponse {
  sessionId: string
  questions?: string[]   // pre-generated for interview mode
}

export interface SubmitSessionRequest {
  sessionId: string
  sessionData: Omit<SessionData, 'sessionId' | 'userId'>
}

export interface SubmitSessionResponse {
  reportId: string
  status: 'processing' | 'ready'
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

/** Maps a total score (0–100) to a performance tier */
export function scoreTotier(score: number): PerformanceTier {
  if (score < 30) return 'Beginner'
  if (score < 50) return 'Developing'
  if (score < 65) return 'Competent'
  if (score < 80) return 'Confident'
  return 'Executive'
}

/** Default filler words list */
export const FILLER_WORDS = [
  'um', 'uh', 'like', 'basically', 'actually', 'literally',
  'you know', 'right', 'okay', 'so', 'well', 'kind of', 'sort of',
] as const

/** WPM thresholds */
export const WPM_THRESHOLDS = {
  tooSlow: 100,
  idealMin: 120,
  idealMax: 160,
  tooFast: 180,
} as const
