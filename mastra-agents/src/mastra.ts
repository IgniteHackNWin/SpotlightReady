import { Mastra } from '@mastra/core'
import { questionGeneratorAgent } from './agents/questionGenerator'
import { rubricCreatorAgent } from './agents/rubricCreator'
import { transcriptEvaluatorAgent } from './agents/transcriptEvaluator'
import { feedbackGeneratorAgent } from './agents/feedbackGenerator'

export const mastra = new Mastra({
  agents: {
    questionGenerator: questionGeneratorAgent,
    rubricCreator: rubricCreatorAgent,
    transcriptEvaluator: transcriptEvaluatorAgent,
    feedbackGenerator: feedbackGeneratorAgent,
  },
})
