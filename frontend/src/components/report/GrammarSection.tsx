import type { GrammarLanguage } from '@spotlightready/shared'

interface Props { data: GrammarLanguage }

export function GrammarSection({ data }: Props) {
  if (!data) return null
  const correctedSentences = data.correctedSentences ?? []
  const vocabularyUpgrades = data.vocabularyUpgrades ?? []
  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent-amber rounded-full" />
        Grammar & Language
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Corrected sentences */}
        {correctedSentences.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Corrections</p>
            <div className="space-y-3">
              {correctedSentences.slice(0, 3).map((item, i) => (
                <div key={i} className="text-sm space-y-1">
                  <p className="text-accent-red/80 line-through">{item.original}</p>
                  <p className="text-accent-green/90">→ {item.corrected}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary upgrades */}
        {vocabularyUpgrades.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Vocabulary Upgrades</p>
            <div className="space-y-2">
              {vocabularyUpgrades.slice(0, 4).map((item) => (
                <div key={item.word} className="flex items-center gap-2 text-sm">
                  <span className="text-white/50">&quot;{item.word}&quot;</span>
                  <span className="text-white/30">→</span>
                  <div className="flex gap-1 flex-wrap">
                    {item.suggestions.slice(0, 2).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-brand-500/20 text-brand-300 rounded-md text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
