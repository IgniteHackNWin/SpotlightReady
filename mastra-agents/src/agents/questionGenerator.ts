import { Agent } from '@mastra/core'
import { z } from 'zod'
import type { InterviewConfig } from '@spotlightready/shared'

/**
 * Agent: Question Generator
 * Generates contextual, difficulty-appropriate interview questions
 * based on role, experience, and company type.
 */
export const questionGeneratorAgent = new Agent({
  name: 'Question Generator',
  instructions: `
    You are an expert technical interviewer at a top-tier tech company.
    Your job is to generate relevant, realistic interview questions tailored to the
    candidate's role, experience level, difficulty setting, and company type.

    Rules:
    - Questions must be progressively challenging based on difficulty
    - Mix behavioral (STAR format) and technical questions appropriately
    - For senior roles, include system design and leadership questions
    - For fresher/junior, focus on fundamentals and problem solving
    - Each question should have a clear, unambiguous intent
    - Return ONLY the list of questions, no preamble
  `,
  model: {
    provider: process.env.AI_PROVIDER as any || 'OPEN_AI',
    toolChoice: 'auto',
    name: process.env.AI_MODEL || 'gpt-4o',
  },
})

export interface GenerateQuestionsInput {
  config: InterviewConfig
}

export interface GenerateQuestionsOutput {
  questions: string[]
  rubricHints: string[]
}
