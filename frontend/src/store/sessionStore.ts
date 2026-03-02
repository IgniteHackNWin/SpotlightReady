import { create } from 'zustand'
import type { SessionConfig, SessionData, PerformanceReport } from '@spotlightready/shared'
import axios from 'axios'

interface SessionState {
  config: SessionConfig | null
  sessionData: SessionData | null
  report: PerformanceReport | null
  sessionId: string | null

  setConfig: (config: SessionConfig) => void
  setSessionData: (data: SessionData) => void
  setReport: (report: PerformanceReport) => void
  endSession: () => void
  submitSession: () => Promise<void>
  reset: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  config: null,
  sessionData: null,
  report: null,
  sessionId: null,

  setConfig: (config) => set({ config }),
  setSessionData: (sessionData) => set({ sessionData }),
  setReport: (report) => set({ report }),
  endSession: () => set({ config: null }),

  submitSession: async () => {
    const { sessionData } = get()
    if (!sessionData) return

    try {
      const { data } = await axios.post(
        `/api/sessions/${sessionData.sessionId}/submit`,
        { sessionData, userId: 'demo-user' }  // TODO: replace with real auth
      )
      if (data.success) {
        set({ sessionId: data.data.reportId })
      }
    } catch (err) {
      console.error('[submitSession]', err)
    }
  },

  reset: () => set({ config: null, sessionData: null, report: null, sessionId: null }),
}))
