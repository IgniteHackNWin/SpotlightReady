import { callLLM, SMART_MODEL } from './client'
import type {
  TranscriptSegment,
  SessionConfig,
  ContentIntelligence,
  GrammarLanguage,
} from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Evaluator
//
// KEY OPTIMIZATION: We don't send the raw transcript.
// We send a COMPRESSED version + pre-computed metrics from the client.
// This keeps input tokens minimal (~600-800 tokens max).
//
// Input:  compressed transcript + pre-computed metrics  ~700 tokens
// Output: ContentIntelligence + GrammarLanguage          ~500 tokens
// Model:  SMART (needs genuine understanding)
// ─────────────────────────────────────────────────────────────────────────────

interface EvalInput {
  config: SessionConfig
  transcriptText: string   // compressed, deduped
  totalWords: number
  fillerCount: number
  topFillers: string[]
  durationSeconds: number
}

interface EvalOutput {
  contentIntelligence: ContentIntelligence
  grammarLanguage: GrammarLanguage
}

const INTERVIEW_SYSTEM = `You are an expert technical interview evaluator.
Analyze the candidate's response and return ONLY valid JSON with this exact structure:
{
  "contentIntelligence": {
    "type": "interview",
    "relevanceScore": 0-100,
    "keyConceptCoverage": 0-100,
    "missedPoints": ["point1", "point2"],
    "structureScore": 0-100,
    "depthScore": 0-100,
    "feedback": "2-3 sentence coaching feedback"
  },
  "grammarLanguage": {
    "topErrors": [],
    "correctedSentences": [{"original": "...", "corrected": "..."}],
    "vocabularyUpgrades": [{"word": "...", "suggestions": ["better1", "better2"]}],
    "weakTransitions": ["transition phrase that was weak"]
  }
}
Be specific and evidence-based. Reference actual content from the transcript.`

const SPEECH_SYSTEM = `You are an expert speech coach and communication analyst.
Analyze the speech and return ONLY valid JSON with this exact structure:
{
  "contentIntelligence": {
    "type": "speech",
    "messageClarityScore": 0-100,
    "narrativeStructureScore": 0-100,
    "openingStrengthScore": 0-100,
    "conclusionImpactScore": 0-100,
    "emotionalEnergyTrend": "rising|flat|declining|variable",
    "feedback": "2-3 sentence coaching feedback"
  },
  "grammarLanguage": {
    "topErrors": [],
    "correctedSentences": [{"original": "...", "corrected": "..."}],
    "vocabularyUpgrades": [{"word": "...", "suggestions": ["better1", "better2"]}],
    "weakTransitions": ["transition phrase that was weak"]
  }
}
Be specific and evidence-based. Reference actual content from the transcript.`

export function compressTranscript(segments: TranscriptSegment[]): string {
  // Join all segments, clean up repeated whitespace
  const full = segments.map((s) => s.text).join(' ')
  // Truncate to ~400 words max to control token spend
  const words = full.split(/\s+/)
  if (words.length > 400) {
    return words.slice(0, 200).join(' ') + ' [...] ' + words.slice(-100).join(' ')
  }
  return full
}

export async function evaluateTranscript(input: EvalInput): Promise<EvalOutput> {
  const system = input.config.mode === 'interview' ? INTERVIEW_SYSTEM : SPEECH_SYSTEM

  const topicLine =
    input.config.mode === 'interview'
      ? `Role: ${(input.config as any).role}, Difficulty: ${(input.config as any).difficulty}`
      : `Topic: ${(input.config as any).topic}, Audience: ${(input.config as any).audienceSize}`

  const user = `${topicLine}
Duration: ${Math.floor(input.durationSeconds / 60)}m ${input.durationSeconds % 60}s
Total words: ${input.totalWords} (${Math.round((input.totalWords / input.durationSeconds) * 60)} WPM)
Filler words: ${input.fillerCount} (top: ${input.topFillers.join(', ')})

TRANSCRIPT:
${input.transcriptText}`

  return callLLM<EvalOutput>(system, user, SMART_MODEL)
}
