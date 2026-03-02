import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { Session } from '../db/models/Session'
import type { ApiResponse, CreateSessionResponse, SubmitSessionResponse } from '@spotlightready/shared'

export const sessionsRouter = Router()

// POST /api/sessions  – Create a new session (pre-session)
sessionsRouter.post('/', async (req, res) => {
  try {
    const { userId, config } = req.body

    if (!userId || !config) {
      return res.status(400).json({ success: false, error: 'userId and config are required' })
    }

    // Session is created on the client; we just acknowledge and pre-generate
    // questions (interview mode) via mastra-agents webhook or direct call
    const sessionId = uuidv4()

    const response: ApiResponse<CreateSessionResponse> = {
      success: true,
      data: {
        sessionId,
        // Questions will be populated by the Mastra agent pipeline
        questions: [],
      },
    }

    return res.status(201).json(response)
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return res.status(500).json({ success: false, error: 'Failed to create session' })
  }
})

// POST /api/sessions/:id/submit  – Submit completed session data
sessionsRouter.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params
    const { sessionData, userId } = req.body

    const session = new Session({
      userId,
      ...sessionData,
    })
    await session.save()

    const response: ApiResponse<SubmitSessionResponse> = {
      success: true,
      data: {
        reportId: session.id,
        status: 'processing',
      },
    }

    // TODO: Trigger n8n webhook to start report generation pipeline
    // await triggerN8nWorkflow(session.toJSON())

    return res.status(202).json(response)
  } catch (err) {
    console.error('[POST /api/sessions/:id/submit]', err)
    return res.status(500).json({ success: false, error: 'Failed to submit session' })
  }
})

// GET /api/sessions/:id  – Fetch a single session
sessionsRouter.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }
    return res.json({ success: true, data: session.toJSON() })
  } catch (err) {
    console.error('[GET /api/sessions/:id]', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch session' })
  }
})

// GET /api/sessions?userId=xxx  – Fetch all sessions for a user
sessionsRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query param is required' })
    }
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 }).limit(20)
    return res.json({ success: true, data: sessions.map((s) => s.toJSON()) })
  } catch (err) {
    console.error('[GET /api/sessions]', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch sessions' })
  }
})
