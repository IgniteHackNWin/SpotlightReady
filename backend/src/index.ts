import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './db/connect'
import { sessionsRouter } from './routes/sessions'
import { reportsRouter } from './routes/reports'
import { healthRouter } from './routes/health'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Validate Groq key at startup (shows first 8 chars only — safe to log)
const groqKey = process.env.GROQ_API_KEY || ''
if (!groqKey) {
  console.error('❌ GROQ_API_KEY is missing from .env!')
} else {
  console.log(`🔑 Groq key loaded: ${groqKey.substring(0, 8)}... (${groqKey.length} chars)`)
}

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/health', healthRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/reports', reportsRouter)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// ── Boot ───────────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 SpotlightReady API running on http://localhost:${PORT}`)
  })
}

start()
