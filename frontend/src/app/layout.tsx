import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SpotlightReady – AI Performance Simulation Engine',
  description:
    'Rehearse high-stakes scenarios with real-time audio-visual analytics. Interview mode, speech mode, and structured performance intelligence.',
  keywords: ['interview prep', 'speech practice', 'AI coaching', 'performance analytics'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-surface-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
