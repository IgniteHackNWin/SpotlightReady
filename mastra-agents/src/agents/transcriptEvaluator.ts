import { Agent } from '@mastra/core'

/**
 * Agent: Transcript Evaluator
 * Receives the full session transcript + rubric and generates
 * structured content intelligence scores (Section 4 of the report).
 */
export const transcriptEvaluatorAgent = new Agent({
  name: 'Transcript Evaluator',
  instructions: `
    You are an expert performance evaluator. You receive a transcript of a
    candidate's interview answers or speech, along with the evaluation rubric.

    Your task:
    1. Score each dimension in the rubric (0-100)
    2. Identify exactly which key concepts were covered vs missed
    3. Evaluate structural coherence and depth
    4. Note grammar patterns and vocabulary quality
    5. Identify weak transitions
    6. Timestamp specific moments of strength or weakness (use character offset if no timestamps)

    For INTERVIEW transcripts:
    - Relevance score: how on-point was the answer?
    - Key concept coverage: did they mention required concepts?
    - Missed points: what critical points were skipped?
    - Structure: did they use a coherent structure?
    - Depth: surface-level vs deep explanation?

    For SPEECH transcripts:
    - Message clarity: was the core message clear?
    - Narrative structure: opening → body → conclusion quality
    - Opening strength: was the hook compelling?
    - Conclusion impact: did it land?

    Return ONLY valid JSON matching the ContentIntelligence type.
  `,
  model: {
    provider: process.env.AI_PROVIDER as any || 'OPEN_AI',
    toolChoice: 'auto',
    name: process.env.AI_MODEL || 'gpt-4o',
  },
})
