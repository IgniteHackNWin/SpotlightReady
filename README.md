# SpotlightReady 🎤

> **AI-Powered Immersive Performance Simulation Engine**

SpotlightReady is a real-time performance simulation + analytics platform that helps users rehearse high-stakes scenarios — **job interviews, public speeches, pitches** — using live AI analysis and structured post-session intelligence.

This is **not** a chatbot. This is **not** a grammar checker.  
This is a **performance rehearsal engine**.

---

## ✅ Current Status (March 2026 — Hackathon Dev)

**Fully working end-to-end:**
- 🏠 Landing page with mode selection (Interview / Speech / Pitch)
- ⚙️ Session setup — role, difficulty, duration config
- 🎤 Live session — AI-generated questions, real-time metrics display
- 📊 AI-powered performance report with scores, feedback, improvement plan
- 🗄️ MongoDB Atlas persistence (sessions + reports saved)
- 🤖 Groq LLM integration (llama-3.1-8b-instant + llama-3.3-70b-versatile)

**Report sections working:**
- Overall Score Card (0–100) + tier (Beginner / Developing / Proficient / Expert)
- Speech Analytics (WPM, filler words, rhythm, stutters)
- Visual Presence (eye contact, head stability, expressiveness)
- Content Intelligence (relevance, structure, depth, missed points)
- Grammar & Language (corrections, vocabulary upgrades)
- Session Replay timeline
- Improvement Plan (drills + retry recommendation)

**Coming next:**
- Webcam + microphone real data capture (MediaPipe, Web Speech API)
- Confidence & flow scoring from actual audio/video
- PDF report export

---

## 🗂️ Monorepo Structure

```
SpotlightReady/
├── frontend/      → Next.js 14 App Router (Simulation UI + Report pages)
├── backend/       → Express.js API (Sessions, Reports, AI orchestration)
├── shared/        → Shared TypeScript types (SessionData, PerformanceReport, etc.)
└── docs/          → Architecture, ideation, and planning docs
```

---

## 🏗️ System Architecture

| Layer | Package | Tech |
|-------|---------|------|
| **UI** | `frontend` | Next.js 14, Tailwind CSS, Zustand |
| **API** | `backend` | Express.js, MongoDB Atlas, tsx watch |
| **AI** | `backend/src/ai/` | Groq API (llama models via openai SDK) |
| **Types** | `shared` | TypeScript interfaces shared across packages |

**AI Pipeline (2 LLM calls per session):**
1. `transcriptEvaluator` → `llama-3.3-70b-versatile` — scores content, grammar, missed points
2. `feedbackGenerator` → `llama-3.1-8b-instant` — generates improvement drills + plan

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8 → `npm install -g pnpm`
- MongoDB Atlas account (free M0 tier)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Install dependencies
```bash
pnpm install
```

### 2. Set up environment variables
Create `backend/.env`:
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=spotlightready
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Run in development
```bash
# Terminal 1 — Backend
pnpm --filter backend dev

# Terminal 2 — Frontend  
pnpm --filter frontend dev
```

- Frontend → http://localhost:3000
- Backend → http://localhost:4000
- Health check → http://localhost:4000/health
- Groq key test → http://localhost:4000/health/test-groq

---

## 🎯 Feature Status

- [x] Landing page — mode selection (Interview / Speech / Pitch)
- [x] Session setup — role, topic, difficulty, duration
- [x] Live session — AI questions, timer, real-time metrics UI
- [x] Session submission + processing screen
- [x] AI report generation (Groq LLM)
- [x] Report page — score card, speech analytics, content intelligence, grammar, improvement plan
- [x] MongoDB persistence (sessions + reports)
- [ ] Webcam capture — MediaPipe eye contact / head tracking
- [ ] Microphone capture — Web Speech API transcript + WPM
- [ ] Confidence scoring from real audio/video data
- [ ] PDF report export

---

## 📊 Scoring Model

| Category | Weight | Source |
|----------|--------|--------|
| Speech Delivery | 30/100 | AI transcript analysis |
| Visual Presence | 20/100 | Webcam (coming soon) |
| Content Quality | 30/100 | AI content evaluation |
| Confidence & Flow | 20/100 | Combined metrics |

---

## 🌿 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code only |
| `develop` | Integration branch — all PRs merge here |
| `feature/*` | Individual features |
| `fix/*` | Bug fixes |
| `release/*` | Release prep |

**Never push directly to `main`.**  
All work → `feature/*` → PR to `develop` → PR to `main` for releases.

---

## 🧑‍💻 Team

| Name | Role |
|------|------|
| Yuvraj | Lead Developer |
| Riya | Co-Developer |

---

## 📄 License

Private – Hackathon project. All rights reserved.
