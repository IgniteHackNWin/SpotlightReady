import { callLLM, FAST_MODEL } from './client'
import type { ImprovementPlan, ScoreBreakdown } from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Feedback Generator
//
// Input:  score breakdown (numbers only) + top weak areas  ~300 tokens
// Output: ImprovementPlan                                   ~400 tokens
// Model:  FAST (writing task, not analysis)
// ─────────────────────────────────────────────────────────────────────────────

interface FeedbackInput {
  breakdown: ScoreBreakdown
  topStrengths: string[]
  topWeaknesses: string[]
  fillerCount: number
  averageWPM: number
  eyeContactPercent: number
  mode: 'interview' | 'speech'
}

const SYSTEM = `You are a world-class performance coach. Generate a personalized improvement plan.
Return ONLY valid JSON:
{
  "drills": [
    {
      "title": "short drill name",
      "description": "exactly what to do, specific and actionable",
      "estimatedMinutes": 5,
      "targetArea": "speech|visual|content|confidence"
    }
  ],
  "retryRecommendation": "one paragraph: when to retry, what to focus on",
  "estimatedScoreImprovement": 8,
  "personalizedSuggestions": ["specific suggestion 1", "specific suggestion 2"]
}
Always give exactly 3 drills. Reference the actual numbers provided. Be specific, not generic.`

export async function generateFeedback(input: FeedbackInput): Promise<ImprovementPlan> {
  const user = `Performance scores:
- Speech Delivery: ${input.breakdown.speechDelivery}/30 (pace, fillers, pauses)
- Visual Presence: ${input.breakdown.visualPresence}/20 (eye contact, stability)
- Content Quality: ${input.breakdown.contentQuality}/30 (relevance, structure, depth)
- Confidence & Flow: ${input.breakdown.confidenceFlow}/20
- TOTAL: ${input.breakdown.total}/100

Key metrics: ${input.averageWPM} WPM | ${input.fillerCount} filler words | ${input.eyeContactPercent}% eye contact
Strengths: ${input.topStrengths.join(', ')}
Needs work: ${input.topWeaknesses.join(', ')}
Mode: ${input.mode}`

  const result = await callLLM<ImprovementPlan>(SYSTEM, user, FAST_MODEL)
  return result
}
