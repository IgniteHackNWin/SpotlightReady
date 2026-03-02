import type { SpeechAnalytics } from '@spotlightready/shared'

interface Props { data: SpeechAnalytics }

export function SpeechAnalyticsSection({ data }: Props) {
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-brand-500 rounded-full" />
        Speech Analytics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Avg WPM" value={data.averageWPM} unit="wpm" />
        <Stat label="Filler Words" value={data.totalFillerWords} highlight={data.totalFillerWords > 10} />
        <Stat label="Rhythm Score" value={data.rhythmConsistencyScore} unit="/100" />
        <Stat label="Stutters" value={data.stutterCount} highlight={data.stutterCount > 5} />
      </div>
      {/* Filler breakdown */}
      {Object.keys(data.fillerWordBreakdown).length > 0 && (
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Filler Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.fillerWordBreakdown).map(([word, count]) => (
              <span key={word} className="px-2 py-1 bg-surface-800 rounded-lg text-xs text-white/70">
                &quot;{word}&quot; × {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value, unit, highlight }: { label: string; value: number; unit?: string; highlight?: boolean }) {
  return (
    <div className="text-center p-3 bg-surface-800 rounded-xl">
      <div className={`text-2xl font-bold ${highlight ? 'text-accent-red' : 'text-white'}`}>
        {value}{unit && <span className="text-sm text-white/40 ml-1">{unit}</span>}
      </div>
      <div className="text-white/40 text-xs mt-1">{label}</div>
    </div>
  )
}
