import type { ImprovementPlan } from '@spotlightready/shared'

interface Props { plan: ImprovementPlan }

const AREA_COLORS = {
  speech: '#3b52ff',
  visual: '#00e5ff',
  content: '#00e676',
  confidence: '#ffab00',
}

export function ImprovementPlanSection({ plan }: Props) {
  if (!plan) return null
  const drills = plan.drills ?? []
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-green rounded-full" />
        Your Improvement Plan
        {plan.estimatedScoreImprovement > 0 && (
          <span className="ml-auto text-accent-green text-sm font-medium">
            +{plan.estimatedScoreImprovement} pts potential
          </span>
        )}
      </h2>

      {/* Drills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {drills.map((drill, i) => (
          <div key={i} className="p-4 bg-surface-800 rounded-xl border border-surface-700">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${AREA_COLORS[drill.targetArea]}20`,
                  color: AREA_COLORS[drill.targetArea],
                }}
              >
                {drill.targetArea}
              </span>
              <span className="text-white/30 text-xs">{drill.estimatedMinutes} min</span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">{drill.title}</h3>
            <p className="text-white/50 text-xs leading-relaxed">{drill.description}</p>
          </div>
        ))}
      </div>

      {/* Retry recommendation */}
      <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
        <p className="text-brand-300 text-xs font-medium uppercase tracking-wider mb-2">Retry Recommendation</p>
        <p className="text-white/70 text-sm leading-relaxed">{plan.retryRecommendation}</p>
      </div>
    </section>
  )
}
