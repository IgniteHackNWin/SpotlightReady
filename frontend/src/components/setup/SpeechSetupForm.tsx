'use client'

import { useState } from 'react'
import type { SpeechConfig } from '@spotlightready/shared'

interface Props {
  onSubmit: (config: SpeechConfig) => void
}

export function SpeechSetupForm({ onSubmit }: Props) {
  const [form, setForm] = useState<Partial<SpeechConfig>>({
    mode: 'speech',
    topic: '',
    audienceSize: 'medium',
    durationMinutes: 5,
    formality: 'formal',
    teleprompterEnabled: false,
    teleprompterScript: '',
    teleprompterSpeed: 150,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.topic) return
    onSubmit(form as SpeechConfig)
  }

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-white/60 text-sm mb-2">{label}</label>
      {children}
    </div>
  )

  const selectClass = "w-full bg-surface-800 border border-surface-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-cyan transition-colors"
  const inputClass = "w-full bg-surface-800 border border-surface-700 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-cyan transition-colors"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Speech Mode</h1>
        <p className="text-white/40">Configure your presentation session</p>
      </div>

      {field('Topic / Title *', (
        <input
          className={inputClass}
          placeholder="e.g. The Future of AI in Healthcare, My Startup Pitch"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          required
        />
      ))}

      <div className="grid grid-cols-2 gap-4">
        {field('Audience Size', (
          <select className={selectClass} value={form.audienceSize} onChange={(e) => setForm({ ...form, audienceSize: e.target.value as any })}>
            <option value="small">Small (5-15)</option>
            <option value="medium">Medium (15-50)</option>
            <option value="large">Large (50-200)</option>
            <option value="virtual">Virtual / Online</option>
          </select>
        ))}

        {field('Duration', (
          <select className={selectClass} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) })}>
            {[2, 3, 5, 7, 10, 15].map((n) => (
              <option key={n} value={n}>{n} minutes</option>
            ))}
          </select>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Formality', (
          <select className={selectClass} value={form.formality} onChange={(e) => setForm({ ...form, formality: e.target.value as any })}>
            <option value="formal">Formal</option>
            <option value="informal">Informal / Casual</option>
          </select>
        ))}

        {field('Teleprompter', (
          <button
            type="button"
            onClick={() => setForm({ ...form, teleprompterEnabled: !form.teleprompterEnabled })}
            className={`w-full py-3 rounded-xl border transition-all font-medium text-sm ${
              form.teleprompterEnabled
                ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                : 'bg-surface-800 border-surface-700 text-white/40'
            }`}
          >
            {form.teleprompterEnabled ? '✓ Teleprompter On' : 'Teleprompter Off'}
          </button>
        ))}
      </div>

      {form.teleprompterEnabled && (
        <div className="space-y-4 p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl">
          {field('Paste your speech / script', (
            <textarea
              className={`${inputClass} resize-none`}
              rows={6}
              placeholder="Paste your full speech here. It will auto-scroll during your session."
              value={form.teleprompterScript ?? ''}
              onChange={(e) => setForm({ ...form, teleprompterScript: e.target.value })}
            />
          ))}
          <div>
            <label className="block text-white/60 text-sm mb-2">
              Scroll Speed
              <span className="text-accent-cyan ml-2 font-semibold">{form.teleprompterSpeed ?? 150} WPM</span>
            </label>
            <input
              type="range" min={80} max={220} step={10}
              value={form.teleprompterSpeed ?? 150}
              onChange={(e) => setForm({ ...form, teleprompterSpeed: parseInt(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>80 — slow</span><span>150 — natural</span><span>220 — fast</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 bg-accent-cyan/20 hover:bg-accent-cyan/30 border border-accent-cyan/50 text-accent-cyan font-semibold rounded-xl transition-all hover:scale-[1.02]"
      >
        Continue →
      </button>
    </form>
  )
}
