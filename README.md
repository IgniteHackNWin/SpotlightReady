# SpotlightReady 🎤

> **AI-Powered Immersive Performance Simulation Engine**

SpotlightReady is a real-time performance simulation + analytics platform that helps users rehearse high-stakes scenarios — **job interviews, public speeches, pitches** — using live audio-video analysis and structured post-session intelligence.

This is **not** a chatbot. This is **not** a grammar checker.  
This is a **performance rehearsal engine**.

---

## 🗂️ Monorepo Structure

```
SpotlightReady/
├── frontend/            → Next.js 14 App (Simulation UI + Analytics)
├── backend/             → Node.js + Express API (Session management, scoring)
├── mastra-agents/       → Mastra AI Agents (Question gen, Evaluation, Feedback)
├── n8n-workflows/       → n8n automation workflows (Reports, Email, Storage)
├── shared/              → Shared TypeScript types & utilities
└── docs/                → Architecture, ideation, and planning docs
```

---

## 🏗️ System Architecture

| Layer | Package | Responsibility |
|-------|---------|----------------|
| **Layer 1** – Simulation Engine | `frontend` | Immersive UI, mode selection, session UX |
| **Layer 2** – Real-Time Engine | `frontend` | WebRTC, MediaPipe, Web Speech API, live metrics |
| **Layer 3** – AI Evaluation | `mastra-agents` | Question gen, transcript analysis, scoring, feedback |
| **Layer 4** – Automation & Reports | `n8n-workflows` | PDF reports, email delivery, session storage, reminders |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8 → `npm install -g pnpm`
- MongoDB (local or Atlas)

### Install dependencies
```bash
pnpm install
```

### Set up environment variables
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp mastra-agents/.env.example mastra-agents/.env
```
Fill in your API keys (MongoDB URI, Mastra API key, etc.)

### Run in development
```bash
pnpm dev                 # Frontend + Backend concurrently
pnpm dev:frontend        # Frontend only
pnpm dev:backend         # Backend only
pnpm dev:agents          # Mastra agents only
```

---

## 🎯 MVP Scope

- [x] Interview Mode
- [x] Speech Mode  
- [ ] Live 6 metrics (Timer, Pace, Filler, Repetition, Eye Contact, Confidence)
- [ ] Transcript capture
- [ ] Post-session structured scoring (7 sections)
- [ ] Session replay with markers
- [ ] Mastra AI evaluation pipeline
- [ ] n8n report + email workflow

---

## 📊 Scoring Model

| Category | Weight |
|----------|--------|
| Speech Delivery | 30% |
| Visual Presence | 20% |
| Content Quality | 30% |
| Confidence & Flow | 20% |

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
