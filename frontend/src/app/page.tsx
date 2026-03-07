'use client'

import Link from 'next/link'

const STATS = [
  { value: '6', label: 'Live Metrics' },
  { value: '7', label: 'Report Sections' },
  { value: '30+', label: 'Role Types' },
  { value: '100%', label: 'Browser-Based' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Practice Mode',
    desc: 'Select between Interview Prep for job roles or Public Speaking for presentations and pitches. Each mode adapts AI questions to your context.',
    icon: '🎯',
    highlight: 'Interview or Speech',
  },
  {
    step: '02',
    title: 'Customize Your Session',
    desc: 'Define your target role, experience level, and session duration. AI generates domain-specific questions matched to real scenarios.',
    icon: '⚙️',
    highlight: 'AI-Tailored Content',
  },
  {
    step: '03',
    title: 'Practice with Live Feedback',
    desc: 'Answer AI-generated questions while tracking speech pace, filler words, and delivery metrics in real-time without interruptions.',
    icon: '🎤',
    highlight: 'Real-Time Analytics',
  },
  {
    step: '04',
    title: 'Review Your Performance',
    desc: 'Receive a comprehensive report with scores, transcripts, improvement suggestions, and personalized drills to target weak areas.',
    icon: '📊',
    highlight: '7-Section Analysis',
  },
]

const FEATURES = [
  {
    icon: '🧠',
    title: 'Intelligent Questions',
    desc: 'Get curveball questions like "Explain blockchain to a 5-year-old" or "How would you scale this to 10M users?" — tailored to your role, not recycled from Google.',
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
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-surface-800/60 backdrop-blur-md bg-surface-950/80 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight">
            Spotlight<span className="text-brand-400">Ready</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            Home
          </Link>
          <Link
            href="/session/setup?mode=interview"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            Interview
          </Link>
          <Link
            href="/session/setup?mode=speech"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            Speech
          </Link>
          <button
            onClick={() => {
              const section = document.querySelector('#how-it-works');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            How It Works
          </button>
        </div>
      </nav>

      {/* ── Marquee Banner ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-brand-500/10 via-accent-cyan/10 to-brand-500/10 border-b border-brand-500/20 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium text-white/70 mx-8">✨ Get ready for your big day</span>
          <span className="text-sm font-medium text-white/70 mx-8">🎯 Practice makes permanent</span>
          <span className="text-sm font-medium text-white/70 mx-8">💼 Land your dream role</span>
          <span className="text-sm font-medium text-white/70 mx-8">🚀 Ace that presentation</span>
          <span className="text-sm font-medium text-white/70 mx-8">⚡ Real-time feedback, real results</span>
          <span className="text-sm font-medium text-white/70 mx-8">🎤 Your stage awaits</span>
          <span className="text-sm font-medium text-white/70 mx-8">✨ Get ready for your big day</span>
          <span className="text-sm font-medium text-white/70 mx-8">🎯 Practice makes permanent</span>
          <span className="text-sm font-medium text-white/70 mx-8">💼 Land your dream role</span>
          <span className="text-sm font-medium text-white/70 mx-8">🚀 Ace that presentation</span>
          <span className="text-sm font-medium text-white/70 mx-8">⚡ Real-time feedback, real results</span>
          <span className="text-sm font-medium text-white/70 mx-8">🎤 Your stage awaits</span>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-16 text-center">
        {/* Hero content container with subtle outline */}
        <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl p-8 md:p-12 bg-surface-900/20 backdrop-blur-sm mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-white">Stop Practicing Blind.</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-brand-300 bg-clip-text text-transparent">
              Get SpotlightReady.
            </span>
          </h1>

          <p className="text-xl text-white/55 leading-relaxed max-w-2xl mx-auto">
            The only platform that simulates real interviews and speeches with live audio-visual analytics,
            AI-generated questions, and a structured 7-section performance report — all in your browser.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

        {/* Stats bar in separate container */}
        <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-6 md:p-8 bg-surface-900/20 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-brand-400">{s.value}</div>
                <div className="text-white/40 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-surface-900/50 border-y border-surface-800/60 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-3">Simple 4-Step Process</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How SpotlightReady Works</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From setup to actionable insights in under 10 minutes. No installation, no signup required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="group relative glass-card p-8 hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-brand-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
                      Step {step.step}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-brand-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/5 border border-brand-500/20 text-brand-300 text-xs font-medium">
                      ✓ {step.highlight}
                    </div>
                  </div>
                </div>

                {/* Step connector line */}
                {i % 2 === 0 && i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-brand-500/50 to-transparent" />
                )}
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
