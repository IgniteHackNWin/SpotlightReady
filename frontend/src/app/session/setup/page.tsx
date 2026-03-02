'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SessionMode, InterviewConfig, SpeechConfig } from '@spotlightready/shared'
import { InterviewSetupForm } from '@/components/setup/InterviewSetupForm'
import { SpeechSetupForm } from '@/components/setup/SpeechSetupForm'
import { PreparationScreen } from '@/components/setup/PreparationScreen'

type SetupStep = 'configure' | 'prepare'

/**
 * PRE-SESSION FLOW
 * Step 2 (configure) → Step 3 (prepare + countdown)
 */
export default function SessionSetupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') as SessionMode

  const [step, setStep] = useState<SetupStep>('configure')
  const [config, setConfig] = useState<InterviewConfig | SpeechConfig | null>(null)

  if (!mode || (mode !== 'interview' && mode !== 'speech')) {
    router.replace('/')
    return null
  }

  const handleConfigSubmit = (cfg: InterviewConfig | SpeechConfig) => {
    setConfig(cfg)
    setStep('prepare')
  }

  const handleSessionStart = () => {
    if (!config) return
    // Store config and navigate to live session
    sessionStorage.setItem('spotlightready:config', JSON.stringify(config))
    router.push('/session/live')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <span>SpotlightReady</span>
          <span>/</span>
          <span className="text-white/60 capitalize">{mode} Mode</span>
          <span>/</span>
          <span className="text-brand-400 capitalize">{step === 'configure' ? 'Configure' : 'Prepare'}</span>
        </div>

        {step === 'configure' && mode === 'interview' && (
          <InterviewSetupForm onSubmit={handleConfigSubmit} />
        )}
        {step === 'configure' && mode === 'speech' && (
          <SpeechSetupForm onSubmit={handleConfigSubmit} />
        )}
        {step === 'prepare' && config && (
          <PreparationScreen config={config} onStart={handleSessionStart} />
        )}
      </div>
    </main>
  )
}
