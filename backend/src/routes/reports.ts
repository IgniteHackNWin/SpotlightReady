import { Router } from 'express'
import { Report } from '../db/models/Report'
import type { ApiResponse, PerformanceReport } from '@spotlightready/shared'

export const reportsRouter = Router()

// GET /api/reports/:sessionId  – Get report for a session
reportsRouter.get('/:sessionId', async (req, res) => {
  try {
    const report = await Report.findOne({ sessionId: req.params.sessionId })
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found or still processing' })
    }
    return res.json({ success: true, data: report.toJSON() })
  } catch (err) {
    console.error('[GET /api/reports/:sessionId]', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch report' })
  }
})

// POST /api/reports  – Called by n8n webhook to store AI-generated report
reportsRouter.post('/', async (req, res) => {
  try {
    const reportData: PerformanceReport = req.body
    const report = new Report({
      ...reportData,
      generatedAt: new Date().toISOString(),
    })
    await report.save()
    return res.status(201).json({ success: true, data: { reportId: report.id } })
  } catch (err) {
    console.error('[POST /api/reports]', err)
    return res.status(500).json({ success: false, error: 'Failed to store report' })
  }
})

// GET /api/reports?userId=xxx  – All reports for a user (history)
reportsRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query param required' })
    }
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('sessionId totalScore overallSummary scoreBreakdown generatedAt')
    return res.json({ success: true, data: reports.map((r) => r.toJSON()) })
  } catch (err) {
    console.error('[GET /api/reports]', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch reports' })
  }
})
