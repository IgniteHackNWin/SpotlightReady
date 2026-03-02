'use client'

import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

export function QuestionCard() {
  const questions = useSessionStore((s) => s.questions)
  const [index, setIndex] = useState(0)

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
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
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
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? 'bg-brand-400' : 'bg-surface-700 hover:bg-surface-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
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
