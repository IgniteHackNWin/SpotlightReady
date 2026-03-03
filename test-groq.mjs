import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Read .env manually
const envPath = join(dirname(fileURLToPath(import.meta.url)), 'backend', '.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
)

const key = env.GROQ_API_KEY
console.log('Key starts with:', key?.substring(0, 12) + '...')
console.log('Key length:', key?.length)

const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Say "key works" in 3 words.' }],
    max_tokens: 20,
  }),
})

const data = await res.json()
if (res.ok) {
  console.log('✅ KEY WORKS! Response:', data.choices[0].message.content)
} else {
  console.log('❌ KEY FAILED:', res.status, data.error?.message)
}
