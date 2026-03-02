import { create } from 'zustand'
import type { SessionConfig, SessionData, PerformanceReport } from '@spotlightready/shared'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

/** Anonymous userId – persisted in localStorage, survives page refresh */
function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'ssr'
  const stored = localStorage.getItem('sr_uid')
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem('sr_uid', id)
  return id
}

interface SessionState {
  // Pre-session
  config: SessionConfig | null
  sessionId: string | null      // backend-assigned session UUID
  questions: string[]           // interview questions from AI

  // Post-session
  sessionData: SessionData | null
  report: PerformanceReport | null
  reportId: string | null

  // Actions
  setConfig: (config: SessionConfig) => void
  setSessionData: (data: SessionData) => void
  setReport: (report: PerformanceReport) => void
  /** Call POST /api/sessions to create session + fetch questions */
  createSession: (config: SessionConfig) => Promise<string>
  /** Call POST /api/sessions/:id/submit to trigger AI report gen */
  submitSession: () => Promise<string | null>
  reset: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  config: null,
  sessionId: null,
  questions: [],
  sessionData: null,
  report: null,
  reportId: null,

  setConfig: (config) => set({ config }),
  setSessionData: (sessionData) => set({ sessionData }),
  setReport: (report) => set({ report }),

  createSession: async (config: SessionConfig) => {
    const userId = getOrCreateUserId()
    set({ config })

    try {
      const res = await fetch(`${API}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, config }),
      })
      const json = await res.json()
      if (json.success) {
        set({ sessionId: json.data.sessionId, questions: json.data.questions ?? [] })
        return json.data.sessionId as string
      }
    } catch (err) {
      console.error('[createSession]', err)
    }

    // Fallback: generate a local sessionId if backend is down
    const fallbackId = crypto.randomUUID()
    set({ sessionId: fallbackId, questions: [] })
    return fallbackId
  },

  submitSession: async () => {
    const { sessionData, sessionId } = get()
    if (!sessionData) return null

    const userId = getOrCreateUserId()
    const sid = sessionId ?? sessionData.sessionId

    try {
      const res = await fetch(`${API}/sessions/${sid}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionData: { ...sessionData, sessionId: sid }, userId }),
      })
      const json = await res.json()
      if (json.success) {
        const reportId = json.data.reportId as string
        set({ reportId })
        return reportId
      }
    } catch (err) {
      console.error('[submitSession]', err)
    }
    return null
  },

  reset: () => set({
    config: null, sessionId: null, questions: [],
    sessionData: null, report: null, reportId: null,
  }),
}))
