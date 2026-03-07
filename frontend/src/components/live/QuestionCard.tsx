'use client'

import { useState, useRef, useCallback } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import type { QuestionTiming } from '@spotlightready/shared'

interface Props {
  onTimingsUpdate?: (timings: QuestionTiming[]) => void
  transcriptGetter?: () => string
  fillerGetter?: () => number
  wpmGetter?: () => number
  sessionStartMs?: number
}

export function QuestionCard({ onTimingsUpdate, transcriptGetter, fillerGetter, wpmGetter, sessionStartMs = 0 }: Props) {
  const questions = useSessionStore((s) => s.questions)
  const [index, setIndex] = useState(0)

  const questionStartRef = useRef<number>(Date.now())
  const fillerAtStartRef = useRef<number>(0)
  const timingsRef = useRef<QuestionTiming[]>([])

  const recordAndNavigate = useCallback((prevIdx: number, nextIdx: number) => {
    const nowMs = Date.now()
    timingsRef.current[prevIdx] = {
      questionIndex: prevIdx,
      questionText: questions[prevIdx] ?? '',
      startMs: questionStartRef.current - sessionStartMs,
      endMs: nowMs - sessionStartMs,
      durationSeconds: Math.round((nowMs - questionStartRef.current) / 1000),
      transcriptText: transcriptGetter?.() ?? '',
      fillerCount: Math.max(0, (fillerGetter?.() ?? 0) - fillerAtStartRef.current),
      avgWPM: wpmGetter?.() ?? 0,
    }
    questionStartRef.current = nowMs
    fillerAtStartRef.current = fillerGetter?.() ?? 0
    onTimingsUpdate?.(timingsRef.current.filter(Boolean))
    setIndex(nextIdx)
  }, [questions, sessionStartMs, transcriptGetter, fillerGetter, wpmGetter, onTimingsUpdate])

  const current = questions[index]
  const total = questions.length

  if (!current) {
    return (
      <div className="glass-card max-w-2xl w-full p-8 text-center">
        <p className="text-white/30 text-sm">No questions loaded</p>
      </div>
    )
  }

  return (
    <div className="glass-card max-w-2xl w-full p-8">
      {/* Counter */}
      <p className="text-white/40 text-xs uppercase tracking-wider mb-4 text-center">
        Question {index + 1} of {total}
      </p>

      {/* Question text */}
      <p className="text-xl text-white font-medium leading-relaxed text-center mb-8">
        {current}
      </p>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => index > 0 && recordAndNavigate(index, index - 1)}
            disabled={index === 0}
            className="px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-white/60 hover:text-white text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => i !== index && recordAndNavigate(index, i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? 'bg-brand-400' : 'bg-surface-700 hover:bg-surface-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => index < total - 1 && recordAndNavigate(index, index + 1)}
            disabled={index === total - 1}
            className="px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-white/60 hover:text-white text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
