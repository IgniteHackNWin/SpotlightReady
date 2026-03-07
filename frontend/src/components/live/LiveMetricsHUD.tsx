import { cn } from '@/lib/utils'
import type { LiveMetrics } from '@spotlightready/shared'

interface Props {
  metrics: LiveMetrics
  isActive: boolean
}

/**
 * Live Metrics HUD – the minimal, non-distracting overlay
 * Only shows: Pace | Fillers | Repetitions | Eye Contact | Confidence
 * Displayed at the bottom of the live session screen
 */
export function LiveMetricsHUD({ metrics, isActive }: Props) {
  if (!isActive) return null

  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      {/* Pace */}
      <div className="live-metric-card flex flex-col items-center gap-1">
        <span className="text-white/40 text-xs uppercase tracking-wider">Pace</span>
        <span className={cn(
          'text-sm font-bold',
          metrics.paceStatus === 'fast' && 'pace-fast',
          metrics.paceStatus === 'ideal' && 'pace-ideal',
          metrics.paceStatus === 'slow' && 'pace-slow',
        )}>
          {metrics.currentWPM} WPM
        </span>
        <span className={cn(
          'text-xs',
          metrics.paceStatus === 'fast' && 'pace-fast',
          metrics.paceStatus === 'ideal' && 'pace-ideal',
          metrics.paceStatus === 'slow' && 'pace-slow',
        )}>
          {metrics.paceStatus === 'fast' ? '🔴 Fast' : metrics.paceStatus === 'ideal' ? '🟢 Ideal' : '🔵 Slow'}
        </span>
      </div>

      {/* Filler Words */}
      <div className="live-metric-card flex flex-col items-center gap-1">
        <span className="text-white/40 text-xs uppercase tracking-wider">Fillers</span>
        <span className={cn(
          'text-xl font-bold',
          metrics.fillerWordCount > 10 ? 'text-accent-red' : metrics.fillerWordCount > 5 ? 'text-accent-amber' : 'text-white'
        )}>
          {metrics.fillerWordCount}
        </span>
        <span className="text-white/40 text-xs">total</span>
      </div>

      {/* Repetitions */}
      <div className="live-metric-card flex flex-col items-center gap-1 min-h-[72px]">
        <span className="text-white/40 text-xs uppercase tracking-wider">Repeated</span>
        {metrics.repetitions.length > 0 ? (
          <div className="text-center">
            <span className="text-accent-amber text-xs font-medium">
              &quot;{metrics.repetitions[0]?.word}&quot; ({metrics.repetitions[0]?.count}x)
            </span>
            {metrics.repetitions[0]?.suggestions[0] && (
              <div className="text-white/40 text-xs mt-0.5">
                → {metrics.repetitions[0].suggestions[0]}
              </div>
            )}
          </div>
        ) : (
          <span className="text-accent-green text-xs">Clean ✓</span>
        )}
      </div>

      {/* Camera Presence */}
      <div className="live-metric-card flex flex-col items-center gap-1">
        <span className="text-white/40 text-xs uppercase tracking-wider">Camera</span>
        <span className={cn(
          'text-xl font-bold',
          metrics.eyeContactScore > 70 ? 'text-accent-green' : metrics.eyeContactScore > 40 ? 'text-accent-amber' : 'text-accent-red'
        )}>
          {metrics.eyeContactScore}%
        </span>
        <span className="text-white/40 text-xs">
          {metrics.eyeContactStatus === 'maintaining' ? 'On cam ✓' : 'Face cam'}
        </span>
      </div>

      {/* Delivery Score */}
      <div className="live-metric-card flex flex-col items-center gap-1">
        <span className="text-white/40 text-xs uppercase tracking-wider">Delivery</span>
        <span className="text-xl font-bold text-white">{metrics.confidenceScore}</span>
        <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full confidence-bar rounded-full transition-all duration-500"
            style={{ width: `${metrics.confidenceScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
