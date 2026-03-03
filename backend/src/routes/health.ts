import { Router } from 'express'
import dotenv from 'dotenv'
import path from 'path'

const ENV_PATH = path.join(process.cwd(), '.env')

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'SpotlightReady API', timestamp: new Date().toISOString() })
})

// Raw fetch to Groq — same as the curl in docs — no SDK involved
healthRouter.get('/test-groq', async (_req, res) => {
  dotenv.config({ path: ENV_PATH, override: true })
  const key = process.env.GROQ_API_KEY || ''
  if (!key) return res.json({ ok: false, error: 'GROQ_API_KEY missing from .env', envPath: ENV_PATH })

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Say OK in one word.' }],
      max_tokens: 5,
    }),
  })

  const data = await response.json() as any
  if (response.ok) {
    res.json({ ok: true, keyPrefix: key.substring(0, 8) + '...', reply: data.choices?.[0]?.message?.content })
  } else {
    res.json({ ok: false, keyPrefix: key.substring(0, 8) + '...', error: data.error?.message, envPath: ENV_PATH })
  }
})

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SpotlightReady API',
    timestamp: new Date().toISOString(),
  })
})

// Test the current Groq key without exposing it
healthRouter.get('/test-key', async (_req, res) => {
  dotenv.config({ path: ENV_PATH, override: true })
  const key = process.env.GROQ_API_KEY || ''
  if (!key) return res.json({ ok: false, error: 'No key in .env' })

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5,
      }),
    })
    const data = await r.json() as any
    if (r.ok) {
      res.json({ ok: true, keyPrefix: key.substring(0, 8) + '...', model: data.model })
    } else {
      res.json({ ok: false, keyPrefix: key.substring(0, 8) + '...', error: data.error?.message })
    }
  } catch (e: any) {
    res.json({ ok: false, error: e.message })
  }
})
