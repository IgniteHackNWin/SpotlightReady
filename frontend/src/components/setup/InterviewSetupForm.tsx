'use client'

import { useState } from 'react'
import type { InterviewConfig } from '@spotlightready/shared'

interface Props {
  onSubmit: (config: InterviewConfig) => void
}

// ── Real role taxonomy ────────────────────────────────────────────────
const ROLE_GROUPS: { group: string; roles: string[] }[] = [
  {
    group: 'Software Engineering',
    roles: [
      'Software Development Engineer (SDE)',
      'Frontend Engineer',
      'Backend Engineer',
      'Full Stack Engineer',
      'Mobile Engineer (iOS / Android)',
      'DevOps / Platform Engineer',
      'Site Reliability Engineer (SRE)',
      'Machine Learning Engineer',
      'Embedded Systems Engineer',
    ],
  },
  {
    group: 'Data & AI',
    roles: [
      'Data Scientist',
      'Data Analyst',
      'Data Engineer',
      'AI / ML Researcher',
      'Business Intelligence Analyst',
    ],
  },
  {
    group: 'Product & Design',
    roles: [
      'Product Manager',
      'Technical Product Manager',
      'UX Designer',
      'UI Designer',
      'Product Designer',
    ],
  },
  {
    group: 'Business & Finance',
    roles: [
      'Investment Banking Analyst',
      'Financial Analyst (FP&A)',
      'Equity Research Analyst',
      'Management Consultant',
      'Business Analyst',
      'Strategy & Operations Analyst',
      'Risk Analyst',
      'Audit Associate',
    ],
  },
  {
    group: 'Marketing & Sales',
    roles: [
      'Marketing Manager',
      'Digital Marketing Specialist',
      'Growth / Performance Marketer',
      'Account Executive (Sales)',
      'Sales Development Representative (SDR)',
      'Brand Manager',
    ],
  },
  {
    group: 'Operations & HR',
    roles: [
      'Operations Manager',
      'Supply Chain Analyst',
      'Project Manager',
      'Scrum Master',
      'HR Business Partner',
      'Talent Acquisition Specialist',
    ],
  },
  {
    group: 'Cybersecurity',
    roles: [
      'Cybersecurity Analyst',
      'Penetration Tester',
      'Security Engineer',
      'SOC Analyst',
    ],
  },
]

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Interview Mode</h1>
        <p className="text-white/40">Configure your simulation session</p>
      </div>

      {field('Role / Position *', (
        <select
          className={selectClass}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="" disabled>Select your role…</option>
          {ROLE_GROUPS.map((group) => (
            <optgroup key={group.group} label={`—— ${group.group} ——`}>
              {group.roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </optgroup>
          ))}
        </select>
      ))}

      <div className="grid grid-cols-2 gap-4">
        {field('Experience Level', (
          <select className={selectClass} value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as any })}>
            <option value="fresher">Fresher (0–1 year)</option>
            <option value="junior">Junior (1–3 years)</option>
            <option value="mid">Mid-Level (3–5 years)</option>
            <option value="senior">Senior (5–8 years)</option>
            <option value="lead">Lead / Principal (8+ years)</option>
          </select>
        ))}

        {field('Company Type', (
          <select className={selectClass} value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })}>
            <option value="startup">Startup</option>
            <option value="mid-size">Mid-size Company</option>
            <option value="enterprise">Enterprise / MNC</option>
            <option value="faang">FAANG / Big Tech</option>
            <option value="consulting">Consulting Firm</option>
            <option value="finance">Investment Bank / Finance</option>
          </select>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Difficulty', (
          <select className={selectClass} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}>
            <option value="beginner">Beginner — Fundamentals only</option>
            <option value="intermediate">Intermediate — Mix of theory + practice</option>
            <option value="advanced">Advanced — Deep technical + design</option>
            <option value="expert">Expert — Ambiguous real-world problems</option>
          </select>
        ))}

        {field('No. of Questions', (
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
