import { callLLM, FAST_MODEL } from './client'
import type { InterviewConfig, SpeechConfig } from '@spotlightready/shared'

// ─────────────────────────────────────────────────────────────────────────────
// Question Generator
// Input:  SessionConfig (role, difficulty, experience)  ~200 tokens
// Output: { questions: string[] }                       ~200 tokens
// Model:  FAST (simple generation task)
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM = `You are an expert technical interviewer. Generate realistic interview questions.
Return ONLY valid JSON: { "questions": ["q1", "q2", ...] }
No explanations, no preamble.`

export async function generateQuestions(config: InterviewConfig): Promise<string[]> {
  const user = `Generate ${config.totalQuestions} interview questions for:
Role: ${config.role}
Experience: ${config.experienceLevel}
Company type: ${config.companyType}
Difficulty: ${config.difficulty}
Mix: 60% technical, 40% behavioral. Make them progressively harder.`

  const result = await callLLM<{ questions: string[] }>(SYSTEM, user, FAST_MODEL)
  return result.questions || []
}

// ─────────────────────────────────────────────────────────────────────────────
// Speech Topic Opener
// For speech mode: generate a strong opening line suggestion
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSpeechOpener(config: SpeechConfig): Promise<string> {
  const SPEECH_SYS = `You are a speechwriting coach. Return JSON: { "opener": "..." }`
  const user = `Generate a compelling opening line for a speech on: "${config.topic}"
Audience: ${config.audienceSize}, Tone: ${config.formality}.
One powerful sentence that hooks attention immediately.`

  const result = await callLLM<{ opener: string }>(SPEECH_SYS, user, FAST_MODEL)
  return result.opener || ''
}
