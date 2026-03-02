import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// ─────────────────────────────────────────────────────────────────────────────
// LLM Client – OpenAI-compatible, works with:
//   • Groq      (GROQ_API_KEY)       baseURL: https://api.groq.com/openai/v1
//   • Featherless(FEATHERLESS_API_KEY) baseURL: https://api.featherless.ai/v1
//   • OpenAI    (OPENAI_API_KEY)      default
//
// Set LLM_PROVIDER=groq | featherless | openai in .env
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDERS = {
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || '',
    // Fast model for simple tasks (question gen, feedback writing)
    fastModel: 'llama-3.1-8b-instant',
    // Smart model for evaluation (content scoring)
    smartModel: 'llama-3.3-70b-versatile',
  },
  featherless: {
    baseURL: 'https://api.featherless.ai/v1',
    apiKey: process.env.FEATHERLESS_API_KEY || '',
    fastModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    smartModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
  },
  openai: {
    baseURL: undefined,
    apiKey: process.env.OPENAI_API_KEY || '',
    fastModel: 'gpt-4o-mini',
    smartModel: 'gpt-4o',
  },
}

const provider = (process.env.LLM_PROVIDER || 'groq') as keyof typeof PROVIDERS
const config = PROVIDERS[provider]

export const llmClient = new OpenAI({
  apiKey: config.apiKey,
  baseURL: config.baseURL,
})

export const FAST_MODEL = config.fastModel
export const SMART_MODEL = config.smartModel

// Helper: call LLM and parse JSON response
export async function callLLM<T>(
  systemPrompt: string,
  userMessage: string,
  model: string = FAST_MODEL
): Promise<T> {
  const response = await llmClient.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  })

  const text = response.choices[0]?.message?.content || '{}'
  return JSON.parse(text) as T
}
