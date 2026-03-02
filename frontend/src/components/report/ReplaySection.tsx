import type { ReplayMarker } from '@spotlightready/shared'

interface Props {
  sessionId: string
  markers: ReplayMarker[]
}

const MARKER_COLORS: Record<string, string> = {
  'filler-spike': '#ff1744',
  'confidence-dip': '#ffab00',
  'eye-contact-drop': '#00e5ff',
  'weak-answer': '#ff6d00',
  'long-pause': '#9c27b0',
  'strength-moment': '#00e676',
}

export function ReplaySection({ sessionId, markers }: Props) {
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const mm = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  return (
    <section className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-brand-400 rounded-full" />
        Session Replay
      </h2>

      {/* Timeline */}
      <div className="mb-6">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Performance Timeline</p>
        <div className="relative h-8 bg-surface-800 rounded-full overflow-hidden">
          {markers.map((marker, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform"
              style={{
                left: `${(marker.timestampMs / 60000) * 100}%`,
                backgroundColor: MARKER_COLORS[marker.type] || '#666',
              }}
              title={marker.label}
            />
          ))}
        </div>
      </div>

      {/* Marker list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {markers.map((marker, i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-surface-800 rounded-lg hover:bg-surface-700 cursor-pointer transition-colors">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: MARKER_COLORS[marker.type] }} />
            <span className="font-mono text-white/50 text-xs w-12">{formatTime(marker.timestampMs)}</span>
            <span className="text-white/70 text-sm flex-1">{marker.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              marker.severity === 'high' ? 'bg-accent-red/20 text-accent-red' :
              marker.severity === 'medium' ? 'bg-accent-amber/20 text-accent-amber' :
              'bg-surface-700 text-white/40'
            }`}>{marker.severity}</span>
          </div>
        ))}
        {markers.length === 0 && (
          <p className="text-white/30 text-sm text-center py-4">No markers recorded</p>
        )}
      </div>
    </section>
  )
}
