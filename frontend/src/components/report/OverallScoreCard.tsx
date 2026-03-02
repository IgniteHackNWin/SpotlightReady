import type { OverallSummary, ScoreBreakdown } from '@spotlightready/shared'

interface Props {
  summary: OverallSummary
  breakdown: ScoreBreakdown
}

const SCORE_COLORS = {
  speechDelivery: '#3b52ff',
  visualPresence: '#00e5ff',
  contentQuality: '#00e676',
  confidenceFlow: '#ffab00',
}

/**
 * Section 1 – Overall Score Card
 * Animated score ring reveal + tier badge + strengths/improvements
 */
export function OverallScoreCard({ summary, breakdown }: Props) {
  const circumference = 2 * Math.PI * 45  // radius=45
  const dashOffset = circumference - (summary.totalScore / 100) * circumference

  return (
    <div className="glass-card p-8 animate-slide-up">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Score Ring */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r="45" fill="none" stroke="#1a1a24" strokeWidth="10" />
            <circle
              cx="65" cy="65" r="45"
              fill="none"
              stroke="#3b52ff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{summary.totalScore}</span>
            <span className="text-white/40 text-xs">/ 100</span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-sm font-medium mb-3">
            {summary.tier}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-accent-green text-xs font-semibold uppercase tracking-wider mb-2">
                ✦ Top Strengths
              </p>
              <ul className="space-y-1">
                {summary.topStrengths.map((s) => (
                  <li key={s} className="text-white/70 text-sm">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-accent-amber text-xs font-semibold uppercase tracking-wider mb-2">
                ◈ Improvements
              </p>
              <ul className="space-y-1">
                {summary.topImprovements.map((s) => (
                  <li key={s} className="text-white/70 text-sm">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-4 gap-3 mt-8 pt-6 border-t border-surface-700">
        {Object.entries({
          'Speech Delivery': { score: breakdown.speechDelivery, max: 30, color: SCORE_COLORS.speechDelivery },
          'Visual Presence': { score: breakdown.visualPresence, max: 20, color: SCORE_COLORS.visualPresence },
          'Content Quality': { score: breakdown.contentQuality, max: 30, color: SCORE_COLORS.contentQuality },
          'Confidence & Flow': { score: breakdown.confidenceFlow, max: 20, color: SCORE_COLORS.confidenceFlow },
        }).map(([label, { score, max, color }]) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-white/30 text-xs">/{max}</div>
            <div className="text-white/50 text-xs mt-1">{label}</div>
            <div className="mt-2 h-1 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(score / max) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
