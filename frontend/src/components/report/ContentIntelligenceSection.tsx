import type { ContentIntelligence, QuestionBreakdown } from '@spotlightready/shared'

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
          {(data.questionBreakdowns ?? []).length > 0 && (
            <div className="mt-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Per-Question Breakdown</p>
              <div className="space-y-3">
                {(data.questionBreakdowns as QuestionBreakdown[]).map((qb) => {
                  const sc = qb.answerScore
                  const c = sc > 70 ? 'border-accent-green/30 bg-accent-green/5' : sc > 40 ? 'border-accent-amber/30 bg-accent-amber/5' : 'border-accent-red/30 bg-accent-red/5'
                  const sc2 = sc > 70 ? '#00e676' : sc > 40 ? '#ffab00' : '#ff1744'
                  const t = qb.durationSeconds < 60 ? `${qb.durationSeconds}s` : `${Math.floor(qb.durationSeconds/60)}m ${qb.durationSeconds%60}s`
                  return (
                    <div key={qb.questionIndex} className={`p-4 rounded-xl border ${c}`}>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span className="text-white/70 text-sm font-medium">Q{qb.questionIndex + 1}. {qb.questionText}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-white/30 text-xs">{t}</span>
                          <span className="font-bold text-base" style={{ color: sc2 }}>{sc}</span>
                        </div>
                      </div>
                      <p className="text-white/50 text-xs mb-1">{qb.feedback}</p>
                      {qb.issues.length > 0 && (
                        <div className="flex flex-wrap gap-1">{qb.issues.map((iss: string) => (
                          <span key={iss} className="text-xs px-2 py-0.5 bg-surface-800 text-white/40 rounded-full">{iss}</span>
                        ))}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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
