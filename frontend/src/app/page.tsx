import Link from 'next/link'

/**
 * Landing page – mode selection entry point
 * UX: Professional, immersive, dark-theme
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
          AI Performance Simulation Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-white">Get </span>
          <span className="bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">
            Spotlight
          </span>
          <span className="text-white">Ready.</span>
        </h1>

        <p className="text-xl text-white/60 leading-relaxed">
          Rehearse high-stakes scenarios with real-time audio-visual feedback.
          <br />
          Structured analytics. Actionable improvement plans.
        </p>
      </div>

      {/* Mode selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl animate-slide-up">
        <Link href="/session/setup?mode=interview" className="group">
          <div className="glass-card p-8 hover:border-brand-500/50 hover:bg-surface-800/60 transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-white mb-2">Interview Mode</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Simulate technical or behavioral interviews with AI-generated questions and
              structured performance scoring.
            </p>
            <div className="mt-6 flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:gap-3 transition-all">
              Start Session
              <span>→</span>
            </div>
          </div>
        </Link>

        <Link href="/session/setup?mode=speech" className="group">
          <div className="glass-card p-8 hover:border-accent-cyan/50 hover:bg-surface-800/60 transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">🎤</div>
            <h2 className="text-2xl font-bold text-white mb-2">Speech Mode</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Practice public speeches, pitches, or presentations with live delivery
              metrics and narrative structure analysis.
            </p>
            <div className="mt-6 flex items-center gap-2 text-accent-cyan text-sm font-medium group-hover:gap-3 transition-all">
              Start Session
              <span>→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer hint */}
      <p className="mt-12 text-white/20 text-sm">
        Not a chatbot. Not a grammar checker. A performance simulation engine.
      </p>
    </main>
  )
}
