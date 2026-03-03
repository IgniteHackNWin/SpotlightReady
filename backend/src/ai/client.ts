import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

// process.cwd() = backend/ directory (where tsx runs from)
// This is always reliable regardless of how tsx resolves import.meta.url
const ENV_PATH = path.join(process.cwd(), '.env')

// Initial load
dotenv.config({ path: ENV_PATH })

const FAST_MODEL = 'llama-3.1-8b-instant'
const SMART_MODEL = 'llama-3.3-70b-versatile'

export { FAST_MODEL, SMART_MODEL }

function getGroqKey(): string {
  // Always re-read .env so key changes don't require a restart
  dotenv.config({ path: ENV_PATH, override: true })
  const key = process.env.GROQ_API_KEY || ''
  console.log(`[LLM] Using key: ${key.substring(0, 8)}... from ${ENV_PATH}`)
  return key
}

// Helper: call LLM and parse JSON response
export async function callLLM<T>(
  systemPrompt: string,
  userMessage: string,
  model: string = FAST_MODEL
): Promise<T> {
  const apiKey = getGroqKey()
  const llmClient = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' })
  console.log(`[LLM] Calling ${model}...`)

  const response = await llmClient.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.4,
    // NOTE: response_format omitted — not all Groq models support it
    // We extract JSON manually from the response text
  })

  const raw = response.choices[0]?.message?.content || '{}'
  console.log(`[LLM] Response received (${raw.length} chars)`)

  // Extract JSON even if model wraps it in markdown code block
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/({[\s\S]*})/)
  const text = jsonMatch ? jsonMatch[1].trim() : raw.trim()

  try {
    return JSON.parse(text) as T
  } catch (err) {
    console.error(`[LLM] JSON parse failed. Raw response:\n${raw}`)
    throw new Error(`LLM returned invalid JSON: ${(err as Error).message}`)
  }
}
