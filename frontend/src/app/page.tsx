'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

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

const TESTIMONIALS = [
  {
    quote: "Landed my FAANG offer after 5 practice sessions. The AI feedback was spot-on.",
    name: "Priya S.",
    role: "SDE-2 @ Google",
    avatar: "👩‍💻",
  },
  {
    quote: "Best interview prep tool I've used. Real-time metrics kept me aware without being distracting.",
    name: "Arjun M.",
    role: "Product Manager @ Microsoft",
    avatar: "👨‍💼",
  },
  {
    quote: "The speech mode helped me nail my TED talk. Confidence score was incredibly accurate.",
    name: "Neha K.",
    role: "Startup Founder",
    avatar: "👩‍🚀",
  },
]

// Animated counter component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])

  return <span ref={ref}>{count}</span>
}

export default function HomePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, 100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <main className="min-h-screen bg-surface-950 text-white overflow-hidden relative">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-accent-cyan/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-accent-green/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Link href="/session/setup?mode=interview">
          <motion.button
            className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white rounded-full p-4 shadow-2xl shadow-brand-500/50 backdrop-blur-sm border border-brand-400/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">🚀</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <motion.nav
        className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-surface-800/60 backdrop-blur-md bg-surface-950/80 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xl font-bold tracking-tight">
            Spotlight<span className="text-brand-400">Ready</span>
          </span>
        </motion.div>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/session/setup?mode=interview"
            className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            Interview Mode
          </Link>
          <Link
            href="/session/setup?mode=speech"
            className="hidden md:inline-flex px-5 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            Speech Mode
          </Link>
          <Link href="/session/setup?mode=interview">
            <motion.button
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free →
            </motion.button>
          </Link>
        </motion.div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-16 text-center relative"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-accent-green"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Real-time AI Performance Engine — Built for Hackathon 2026
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="text-white">Stop Practicing Blind.</span>
          <br />
          <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-brand-300 bg-clip-text text-transparent animate-gradient">
            Get SpotlightReady.
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-white/55 leading-relaxed max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          The only platform that simulates real interviews and speeches with live audio-visual analytics,
          AI-generated questions, and a structured 7-section performance report — all in your browser.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link href="/session/setup?mode=interview">
            <motion.button
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 border border-brand-400/20"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform">
                💼 Start Interview Session
              </span>
            </motion.button>
          </Link>
          <Link href="/session/setup?mode=speech">
            <motion.button
              className="group px-8 py-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-accent-cyan/50 text-white font-semibold text-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform">
                🎤 Start Speech Session
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats bar with animated counters */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="text-3xl font-bold text-brand-400">
              <AnimatedCounter end={6} />
            </div>
            <div className="text-white/40 text-sm mt-1">Live Metrics</div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-3xl font-bold text-brand-400">
              <AnimatedCounter end={7} />
            </div>
            <div className="text-white/40 text-sm mt-1">Report Sections</div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="text-3xl font-bold text-brand-400">
              <AnimatedCounter end={30} />+
            </div>
            <div className="text-white/40 text-sm mt-1">Role Types</div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="text-3xl font-bold text-brand-400">
              <AnimatedCounter end={2} /> AI
            </div>
            <div className="text-white/40 text-sm mt-1">LLM Models</div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="bg-surface-900/50 border-y border-surface-800/60 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-3">The Flow</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">From setup to insight in minutes</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-surface-700 to-transparent z-0" />
                )}
                <div className="relative z-10 group">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center text-2xl mb-5 group-hover:border-brand-500/50 group-hover:bg-surface-700 transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">{step.step}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-cyan text-sm font-medium uppercase tracking-wider mb-3">Why SpotlightReady</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Not a chatbot. Not a grammar checker.</h2>
          <p className="text-white/40 mt-3 text-lg">A full simulation engine with real scores.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card p-8 hover:border-surface-600/60 transition-all group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-5"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-brand-300 transition-colors">{f.title}</h3>
                <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="bg-surface-900/30 py-20 relative overflow-hidden">
        <motion.div
          className="max-w-6xl mx-auto px-6 md:px-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-14">
            <p className="text-accent-green text-sm font-medium uppercase tracking-wider mb-3">Success Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Trusted by performers worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-card p-6 hover:border-accent-green/30 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{t.avatar}</div>
                <p className="text-white/70 italic mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="border-t border-surface-700 pt-4">
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-white/40 text-sm">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 text-center">
        <motion.div
          className="glass-card p-12 md:p-16 border-brand-500/20 relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-cyan/10 to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: [-1000, 1000],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Your next interview is <br />
              <span className="bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">
                closer than you think.
              </span>
            </motion.h2>
            <motion.p
              className="text-white/50 text-lg mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Simulate. Analyze. Improve. Repeat. No signup needed.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/session/setup?mode=interview">
                <motion.button
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform">
                    Start Your First Session →
                  </span>
                </motion.button>
              </Link>
              <Link href="/session/setup?mode=speech">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-accent-cyan/50 text-white font-semibold text-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Speech Mode
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-800/60 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <p className="text-white/30 text-sm">
            © 2026 SpotlightReady · Built for Hackathon · Team: Yuvraj & Riya
          </p>
        </div>
      </footer>
    </main>
  )
}
