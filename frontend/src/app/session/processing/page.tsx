'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'

const PROCESSING_STEPS = [
  { label: 'Analyzing speech patterns', duration: 1500 },
  { label: 'Evaluating visual presence', duration: 1200 },
  { label: 'Running AI content analysis', duration: 2000 },
  { label: 'Computing performance scores', duration: 1000 },
  { label: 'Generating improvement plan', duration: 1500 },
]

/**
 * POST-SESSION: Processing screen
 * Shows animated steps while backend + Mastra pipeline generates the report
 */
export default function ProcessingPage() {
  const router = useRouter()
  const { sessionData, submitSession } = useSessionStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!sessionData) {
      router.replace('/')
      return
    }
    // Submit session to backend, then step through animation
    submitSession().catch(console.error)
    runSteps()
  }, [])

  const runSteps = async () => {
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].duration))
      setCurrentStep(i + 1)
    }
    setDone(true)
    setTimeout(() => router.push(`/session/report/${sessionData?.sessionId}`), 800)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="text-center max-w-md w-full">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-surface-700" />
          <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {done ? 'Analysis Complete!' : 'Analyzing Your Performance'}
        </h2>
        <p className="text-white/40 text-sm mb-10">This takes just a moment</p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {PROCESSING_STEPS.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                idx < currentStep
                  ? 'bg-accent-green text-surface-950'
                  : idx === currentStep
                  ? 'bg-brand-500 animate-pulse'
                  : 'bg-surface-700'
              }`}>
                {idx < currentStep ? '✓' : ''}
              </div>
              <span className={`text-sm ${idx < currentStep ? 'text-white/80' : idx === currentStep ? 'text-white' : 'text-white/30'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
