import Link from 'next/link'

const STATS = [
  { value: '6', label: 'Live Metrics' },
  { value: '7', label: 'Report Sections' },
  { value: '30+', label: 'Role Types' },
  { value: '2 AI', label: 'LLM Models' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pick Your Mode',
    desc: 'Interview or Speech — choose your battleground.',
    icon: '🎯',
  },
  {
    step: '02',
    title: 'Configure Your Session',
    desc: 'Set your role, experience level, difficulty, and target company type.',
    icon: '⚙️',
  },
  {
    step: '03',
    title: 'Perform Live',
    desc: 'AI-generated questions, real-time WPM, filler word counter, and eye-contact tracking.',
    icon: '🎤',
  },
  {
    step: '04',
    title: 'Get Your Report',
    desc: '7-section deep analysis — speech, content, grammar, visual presence + improvement plan.',
    icon: '📊',
  },
]

const FEATURES = [
  {
    icon: '🧠',
    title: 'Intelligent Questions',
    desc: 'Role-aware AI generates questions matched to your domain, seniority, and company target — not generic ones.',
    color: 'brand',
  },
  {
    icon: '📈',
    title: 'Real-Time Metrics',
    desc: 'WPM, filler words, repetition alerts, pace indicator, and eye contact — all live without breaking your flow.',
    color: 'cyan',
  },
  {
    icon: '🎯',
    title: 'Deep Performance Report',
    desc: 'Speech analytics, content intelligence, grammar corrections, visual presence scores and a personalized drill plan.',
    color: 'green',
  },
  {
    icon: '📬',
    title: 'Email Your Report',
    desc: 'Send your full session analysis to your inbox directly from the report page. Keep your progress.',
    color: 'amber',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-950 text-white">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-surface-800/60">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Spotlight<span className="text-brand-400">Ready</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/session/setup?mode=interview"
            className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Interview Mode
          </Link>
          <Link
            href="/session/setup?mode=speech"
            className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Speech Mode
          </Link>
          <Link
            href="/session/setup?mode=interview"
            className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors"
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-16 text-center">
        {/* Hero content container with subtle outline */}
        <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl p-8 md:p-12 bg-surface-900/20 backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
            Real-time AI Performance Engine — Built for Hackathon 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">Stop Practicing Blind.</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-brand-300 bg-clip-text text-transparent">
              Get SpotlightReady.
            </span>
          </h1>

          <p className="text-xl text-white/55 leading-relaxed max-w-2xl mx-auto mb-8">
            The only platform that simulates real interviews and speeches with live audio-visual analytics,
            AI-generated questions, and a structured 7-section performance report — all in your browser.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center my-12">
          <Link
            href="/session/setup?mode=interview"
            className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-brand-500/25"
          >
            💼 Start Interview Session
          </Link>
          <Link
            href="/session/setup?mode=speech"
            className="px-8 py-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-white font-semibold text-lg transition-all hover:scale-105"
          >
            🎤 Start Speech Session
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-brand-400">{s.value}</div>
              <div className="text-white/40 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="bg-surface-900/50 border-y border-surface-800/60 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-3">The Flow</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">From setup to insight in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-surface-700 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center text-2xl mb-5">
                    {step.icon}
                  </div>
                  <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">{step.step}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-14">
          <p className="text-accent-cyan text-sm font-medium uppercase tracking-wider mb-3">Why SpotlightReady</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Not a chatbot. Not a grammar checker.</h2>
          <p className="text-white/40 mt-3 text-lg">A full simulation engine with real scores.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card p-8 hover:border-surface-600/60 transition-colors">
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 text-center">
        <div className="glass-card p-12 md:p-16 border-brand-500/20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Your next interview is <br />
            <span className="bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">closer than you think.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Simulate. Analyze. Improve. Repeat. No signup needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/session/setup?mode=interview"
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-brand-500/25"
            >
              💼 Interview Mode
            </Link>
            <Link
              href="/session/setup?mode=speech"
              className="px-8 py-4 rounded-xl border border-surface-600 hover:border-accent-cyan/50 hover:bg-surface-800 text-white font-semibold text-lg transition-all hover:scale-105"
            >
              🎤 Speech Mode
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-800/60 py-8 text-center">
        <p className="text-white/20 text-sm">
          SpotlightReady · AI Performance Simulation Engine · Hackathon 2026
        </p>
      </footer>
    </main>
  )
}
