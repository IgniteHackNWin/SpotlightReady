import express from 'express'
import nodemailer from 'nodemailer'
import { Report } from '../db/models/Report'
import type { ApiResponse, PerformanceReport } from '@spotlightready/shared'

export const reportsRouter: express.Router = express.Router()

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

// POST /api/reports/:sessionId/email  – Send report to user email
reportsRouter.post('/:sessionId/email', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, error: 'email is required' })

    const report = await Report.findOne({ sessionId: req.params.sessionId })
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' })

    const r = report.toJSON() as any
    const tier = r.overallSummary?.tier ?? 'N/A'
    const score = r.totalScore ?? r.scoreBreakdown?.total ?? 0
    const strengths = (r.overallSummary?.topStrengths ?? []).map((s: string) => `<li>✅ ${s}</li>`).join('')
    const improvements = (r.overallSummary?.topImprovements ?? []).map((s: string) => `<li>⚠️ ${s}</li>`).join('')
    const drills = (r.improvementPlan?.drills ?? []).map((d: any) =>
      `<li><strong>${d.title}</strong> (${d.estimatedMinutes} min) — ${d.description}</li>`
    ).join('')

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Inter,sans-serif;background:#0a0a0f;color:#fff;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;font-weight:800;margin:0;">
        Spotlight<span style="color:#607dff;">Ready</span>
      </h1>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:6px;">AI Performance Report</p>
    </div>

    <div style="background:#1a1a24;border:1px solid #2e2e4a;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 8px;">Overall Score</p>
      <div style="font-size:72px;font-weight:900;color:#607dff;line-height:1;">${score}</div>
      <div style="font-size:16px;color:rgba(255,255,255,0.6);margin-top:8px;">${tier}</div>
    </div>

    <div style="background:#111118;border:1px solid #24243a;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h3 style="color:#00e676;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Top Strengths</h3>
      <ul style="margin:0;padding-left:20px;color:rgba(255,255,255,0.7);font-size:14px;line-height:1.8;">${strengths || '<li>Keep practicing!</li>'}</ul>
    </div>

    <div style="background:#111118;border:1px solid #24243a;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h3 style="color:#ffab00;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Areas to Improve</h3>
      <ul style="margin:0;padding-left:20px;color:rgba(255,255,255,0.7);font-size:14px;line-height:1.8;">${improvements || '<li>Great job overall!</li>'}</ul>
    </div>

    <div style="background:#111118;border:1px solid #24243a;border-radius:12px;padding:24px;margin-bottom:32px;">
      <h3 style="color:#607dff;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Your Improvement Drills</h3>
      <ul style="margin:0;padding-left:20px;color:rgba(255,255,255,0.7);font-size:14px;line-height:2.0;">${drills || '<li>No drills generated yet.</li>'}</ul>
    </div>

    ${r.improvementPlan?.retryRecommendation ? `
    <div style="background:rgba(96,125,255,0.08);border:1px solid rgba(96,125,255,0.25);border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;color:rgba(255,255,255,0.8);font-size:14px;">
        <strong style="color:#607dff;">💡 Retry Recommendation:</strong><br/>
        ${r.improvementPlan.retryRecommendation}
      </p>
    </div>` : ''}

    <div style="text-align:center;padding-top:24px;border-top:1px solid #24243a;">
      <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
        SpotlightReady · AI Performance Simulation Engine · Hackathon 2026
      </p>
    </div>
  </div>
</body>
</html>`

    const fromAddr = process.env.EMAIL_FROM || ''
    const fromPass = process.env.EMAIL_PASS || ''

    if (!fromAddr || !fromPass) {
      // No email config — still return success in dev so the UI flow works
      console.warn('[Email] EMAIL_FROM / EMAIL_PASS not set — skipping send, returning success')
      return res.json({ success: true, data: { message: 'dev mode — email not configured' } })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: fromAddr, pass: fromPass },
    })

    await transporter.sendMail({
      from: `"SpotlightReady" <${fromAddr}>`,
      to: email,
      subject: `Your SpotlightReady Report — ${score}/100 · ${tier}`,
      html,
    })

    console.log(`[Email] Report sent to ${email} for session ${req.params.sessionId}`)
    return res.json({ success: true, data: { message: 'Email sent' } })
  } catch (err) {
    console.error('[POST /api/reports/:sessionId/email]', err)
    return res.status(500).json({ success: false, error: 'Failed to send email' })
  }
})
