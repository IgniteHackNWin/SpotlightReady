# n8n Workflows

This directory contains all n8n automation workflow definitions for SpotlightReady.

## Workflows

| File | Trigger | Purpose |
|------|---------|---------|
| `session-report-pipeline.json` | Webhook (POST from backend) | Full report generation pipeline |
| `email-report.json` | Called by pipeline | Email PDF report to user |
| `schedule-reminder.json` | Scheduled / cron | Retry reminders after X days |
| `progress-tracker.json` | Called by pipeline | Update user performance history |

## Setup

1. Import each `.json` file into your n8n instance via **Settings → Import workflow**
2. Configure credentials:
   - MongoDB connection (for direct DB writes if needed)
   - SMTP / SendGrid (for emails)
   - SpotlightReady API URL (for webhook callbacks)
3. Activate each workflow

## Session Report Pipeline Flow

```
[Webhook: POST /webhook/session-complete]
    │
    ▼
[Extract session data]
    │
    ▼
[Call Mastra: Rubric Creator]
    │
    ▼
[Call Mastra: Transcript Evaluator]
    │
    ▼
[Call Mastra: Feedback Generator]
    │
    ▼
[Compute Score Breakdown]
    │
    ├──▶ [POST to /api/reports  – Store in MongoDB]
    │
    ├──▶ [Generate PDF Report]
    │       │
    │       └──▶ [Email PDF to user]
    │
    └──▶ [Schedule reminder (X days)]
```

## Environment Variables needed in n8n

```
SPOTLIGHTREADY_API_URL=http://your-backend-url
MASTRA_API_URL=http://your-mastra-url
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=noreply@spotlightready.com
```
