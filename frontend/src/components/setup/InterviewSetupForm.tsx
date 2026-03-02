'use client'

import { useState } from 'react'
import type { InterviewConfig } from '@spotlightready/shared'

interface Props {
  onSubmit: (config: InterviewConfig) => void
}

export function InterviewSetupForm({ onSubmit }: Props) {
  const [form, setForm] = useState<Partial<InterviewConfig>>({
    mode: 'interview',
    role: '',
    experienceLevel: 'junior',
    companyType: 'mid-size',
    difficulty: 'intermediate',
    timeLimitMinutes: 3,
    totalQuestions: 5,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.role) return
    onSubmit(form as InterviewConfig)
  }

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-white/60 text-sm mb-2">{label}</label>
      {children}
    </div>
  )

  const selectClass = "w-full bg-surface-800 border border-surface-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors"
  const inputClass = "w-full bg-surface-800 border border-surface-700 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Interview Mode</h1>
        <p className="text-white/40">Configure your simulation session</p>
      </div>

      {field('Role / Position *', (
        <input
          className={inputClass}
          placeholder="e.g. SDE – Java, Frontend Engineer, Product Manager"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
      ))}

      <div className="grid grid-cols-2 gap-4">
        {field('Experience Level', (
          <select className={selectClass} value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as any })}>
            <option value="fresher">Fresher (0 years)</option>
            <option value="junior">Junior (1-2 years)</option>
            <option value="mid">Mid (3-5 years)</option>
            <option value="senior">Senior (6-10 years)</option>
            <option value="lead">Lead / Principal</option>
          </select>
        ))}

        {field('Company Type', (
          <select className={selectClass} value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })}>
            <option value="startup">Startup</option>
            <option value="mid-size">Mid-size</option>
            <option value="enterprise">Enterprise</option>
            <option value="faang">FAANG / Big Tech</option>
          </select>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Difficulty', (
          <select className={selectClass} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        ))}

        {field('Questions', (
          <select className={selectClass} value={form.totalQuestions} onChange={(e) => setForm({ ...form, totalQuestions: parseInt(e.target.value) })}>
            {[3, 5, 7, 10].map((n) => (
              <option key={n} value={n}>{n} questions</option>
            ))}
          </select>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all hover:scale-[1.02]"
      >
        Continue →
      </button>
    </form>
  )
}
