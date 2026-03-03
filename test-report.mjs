// Trigger report regeneration and poll until ready
const SESSION_ID = '69a58b3bfb74ca6186d09e4e'
const BASE = 'http://localhost:4000/api'

async function poll(attempt = 1) {
  if (attempt > 10) { console.log('❌ Gave up after 10 attempts'); process.exit(1) }
  console.log(`Polling attempt ${attempt}...`)
  const r = await fetch(`${BASE}/reports/${SESSION_ID}`)
  if (r.ok) {
    const data = await r.json()
    console.log('✅ Report ready!')
    console.log('   Score:', data.data?.totalScore)
    console.log('   Feedback:', data.data?.overallFeedback?.substring(0, 100) + '...')
    console.log(`\n👉 Open: http://localhost:3000/session/report/${SESSION_ID}`)
    return
  }
  await new Promise(res => setTimeout(res, 8000))
  return poll(attempt + 1)
}

console.log('Triggering regeneration...')
const res = await fetch(`${BASE}/sessions/${SESSION_ID}/regenerate`, { method: 'POST' })
console.log('Trigger response:', res.status)
console.log('Waiting for AI to generate report...')
await new Promise(res => setTimeout(res, 10000))
await poll()
