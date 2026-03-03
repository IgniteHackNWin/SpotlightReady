import type { ContentIntelligence } from '@spotlightready/shared'

interface Props { data: ContentIntelligence }

export function ContentIntelligenceSection({ data }: Props) {
  if (!data) return null
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-green rounded-full" />
        Content Intelligence
        <span className="ml-auto text-xs text-white/30 bg-surface-800 px-2 py-1 rounded-full">AI Powered</span>
      </h2>

      {data.type === 'interview' ? (
        <div className="space-y-4">
          <ScoreRow label="Relevance" value={data.relevanceScore} />
          <ScoreRow label="Key Concept Coverage" value={data.keyConceptCoverage} />
          <ScoreRow label="Structure" value={data.structureScore} />
          <ScoreRow label="Depth" value={data.depthScore} />
          {(data.missedPoints ?? []).length > 0 && (
            <div className="mt-4 p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl">
              <p className="text-accent-red text-xs font-medium uppercase tracking-wider mb-2">Missed Points</p>
              <ul className="space-y-1">
                {(data.missedPoints ?? []).map((p) => (
                  <li key={p} className="text-white/60 text-sm">• {p}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-white/50 text-sm mt-4 italic">{data.feedback}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <ScoreRow label="Message Clarity" value={data.messageClarityScore} />
          <ScoreRow label="Narrative Structure" value={data.narrativeStructureScore} />
          <ScoreRow label="Opening Strength" value={data.openingStrengthScore} />
          <ScoreRow label="Conclusion Impact" value={data.conclusionImpactScore} />
          <p className="text-white/50 text-sm mt-4 italic">{data.feedback}</p>
        </div>
      )}
    </section>
  )
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const color = value > 70 ? '#00e676' : value > 40 ? '#ffab00' : '#ff1744'
  return (
    <div className="flex items-center gap-4">
      <span className="text-white/60 text-sm w-48 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-surface-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-white font-medium text-sm w-10 text-right">{value}</span>
    </div>
  )
}
