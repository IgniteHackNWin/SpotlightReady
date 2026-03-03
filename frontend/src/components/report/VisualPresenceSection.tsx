import type { VisualPresence } from '@spotlightready/shared'

interface Props { data: VisualPresence }

export function VisualPresenceSection({ data }: Props) {
  if (!data) return null
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-cyan rounded-full" />
        Visual Presence
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCircle label="Eye Contact" value={data.averageEyeContactPercent} />
        <ScoreCircle label="Head Stability" value={data.headStabilityScore} />
        <ScoreCircle label="Expressiveness" value={data.expressivenessScore} />
        {data.postureStabilityScore >= 0 && (
          <ScoreCircle label="Posture" value={data.postureStabilityScore} />
        )}
      </div>
      {(data.eyeContactDips ?? []).length > 0 && (
        <div className="mt-6">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Eye Contact Dips</p>
          <p className="text-white/60 text-sm">{data.eyeContactDips.length} dip(s) detected during session</p>
        </div>
      )}
    </section>
  )
}

function ScoreCircle({ label, value }: { label: string; value: number }) {
  const color = value > 70 ? '#00e676' : value > 40 ? '#ffab00' : '#ff1744'
  return (
    <div className="flex flex-col items-center p-4 bg-surface-800 rounded-xl">
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-white/40 text-xs text-center">{label}</div>
    </div>
  )
}
