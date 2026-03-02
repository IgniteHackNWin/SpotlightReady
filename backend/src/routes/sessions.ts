import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Session } from '../db/models/Session'
import { Report } from '../db/models/Report'
import { generateReport } from '../ai/reportOrchestrator'
import { generateQuestions } from '../ai/questionGenerator'
import type { ApiResponse, CreateSessionResponse, SubmitSessionResponse } from '@spotlightready/shared'

export const sessionsRouter: express.Router = express.Router()

// POST /api/sessions  – Create a new session + pre-generate questions
sessionsRouter.post('/', async (req, res) => {
  try {
    const { userId, config } = req.body
    if (!userId || !config) {
      return res.status(400).json({ success: false, error: 'userId and config are required' })
    }

    let questions: string[] = []
    if (config.mode === 'interview') {
      try {
        questions = await generateQuestions(config)
      } catch (err) {
        console.error('[questionGenerator] failed, using fallback', err)
        questions = [`Tell me about yourself and why you're interested in this ${config.role} role.`]
      }
    }

    const response: ApiResponse<CreateSessionResponse> = {
      success: true,
      data: { sessionId: uuidv4(), questions },
    }
    return res.status(201).json(response)
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return res.status(500).json({ success: false, error: 'Failed to create session' })
  }
})

// POST /api/sessions/:id/submit  – Submit completed session + trigger report generation
sessionsRouter.post('/:id/submit', async (req, res) => {
  try {
    const { sessionData, userId } = req.body
    const session = new Session({ userId, ...sessionData })
    await session.save()

    const response: ApiResponse<SubmitSessionResponse> = {
      success: true,
      data: { reportId: session.id, status: 'processing' },
    }
    res.status(202).json(response)

    // Generate report in background — respond first, process after
    setImmediate(async () => {
      try {
        const sessionDoc = { ...sessionData, sessionId: session.id, userId }
        const report = await generateReport(sessionDoc)
        const reportDoc = new Report(report)
        await reportDoc.save()
        console.log(`[Report] Saved for session ${session.id}`)
      } catch (err) {
        console.error('[Report generation failed]', err)
      }
    })
  } catch (err) {
    console.error('[POST /api/sessions/:id/submit]', err)
    return res.status(500).json({ success: false, error: 'Failed to submit session' })
  }
})

// GET /api/sessions/:id
sessionsRouter.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' })
    return res.json({ success: true, data: session.toJSON() })
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch session' })
  }
})

// GET /api/sessions?userId=xxx
sessionsRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' })
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 }).limit(20)
    return res.json({ success: true, data: sessions.map((s) => s.toJSON()) })
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch sessions' })
  }
})
