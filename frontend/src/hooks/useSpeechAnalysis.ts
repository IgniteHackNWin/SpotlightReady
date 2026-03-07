import { useEffect, useRef, useState, useCallback } from 'react'
import type { SessionConfig, LiveMetrics, TranscriptSegment } from '@spotlightready/shared'
import { FILLER_WORDS, WPM_THRESHOLDS } from '@spotlightready/shared'

const REPETITION_THRESHOLD = 3  // flag word if repeated ≥ this many times
const REPETITION_ALTERNATIVES: Record<string, string[]> = {
  basically: ['essentially', 'in essence', 'fundamentally'],
  actually: ['in fact', 'indeed', 'truly'],
  literally: ['precisely', 'exactly', 'in reality'],
  like: ['such as', 'for instance', 'approximately'],
  'you know': ['as you may know', 'to clarify'],
  right: ['correct', 'exactly', 'indeed'],
  okay: ['understood', 'certainly', 'very well'],
}

const DEFAULT_METRICS: LiveMetrics = {
  elapsedSeconds: 0,
  currentWPM: 0,
  paceStatus: 'ideal',
  fillerWordCount: 0,
  fillerWordBreakdown: {},
  repetitions: [],
  eyeContactScore: 100,
  eyeContactStatus: 'maintaining',
  confidenceScore: 50,
}

/**
 * Hook: useSpeechAnalysis
 * Drives Layer 2 – Real-Time Performance Engine (speech side)
 * Uses Web Speech API for real-time transcription + client-side analysis
 */
export function useSpeechAnalysis(config: SessionConfig | null) {
  const [metrics, setMetrics] = useState<LiveMetrics>(DEFAULT_METRICS)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef<any>(null)
  const wordCountRef = useRef<Record<string, number>>({})
  const fillerCountRef = useRef<Record<string, number>>({})
  const startTimeRef = useRef<number>(0)
  const wordTimestampsRef = useRef<number[]>([])

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition
    startTimeRef.current = Date.now()
    setIsListening(true)

    recognition.onresult = (event: any) => {
      const nowMs = Date.now() - startTimeRef.current
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText = result[0].transcript.trim()
        }
      }

      if (!finalText) return

      // Add to transcript
      const words = finalText.toLowerCase().split(/\s+/)
      wordTimestampsRef.current.push(...words.map(() => nowMs))

      setTranscript((prev) => [
        ...prev,
        { text: finalText, startMs: nowMs, endMs: nowMs + 500, confidence: 1 },
      ])

      // Count words
      words.forEach((word) => {
        const clean = word.replace(/[^a-z]/g, '')
        if (!clean) return
        wordCountRef.current[clean] = (wordCountRef.current[clean] || 0) + 1
      })

      // Count filler words
      FILLER_WORDS.forEach((filler) => {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi')
        const matches = finalText.match(regex)
        if (matches) {
          fillerCountRef.current[filler] = (fillerCountRef.current[filler] || 0) + matches.length
        }
      })

      // Compute updated metrics
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const totalWords = wordTimestampsRef.current.length
      const currentWPM = elapsedSeconds > 0 ? Math.round((totalWords / elapsedSeconds) * 60) : 0

      const paceStatus =
        currentWPM > WPM_THRESHOLDS.tooFast
          ? 'fast'
          : currentWPM < WPM_THRESHOLDS.tooSlow
          ? 'slow'
          : 'ideal'

      const totalFiller = Object.values(fillerCountRef.current).reduce((a, b) => a + b, 0)

      const repetitions = Object.entries(wordCountRef.current)
        .filter(([word, count]) => count >= REPETITION_THRESHOLD && word.length > 3)
        .map(([word, count]) => ({
          word,
          count,
          suggestions: REPETITION_ALTERNATIVES[word] || [],
        }))
        .slice(0, 3)  // show max 3 at once

      // ── Confidence: WPM-gated so silent/barely-speaking sessions get near-0 ──
      // wpmEngagement: 0 WPM → 0.0, 80+ WPM → 1.0 (smooth ramp, not a cliff)
      // Base confidence is then penalised by filler rate and pace issues.
      // Effect: saying one word can't spike confidence to 87 anymore.
      const fillerPenalty = Math.min(50, totalFiller * 3)
      const pacePenalty = paceStatus !== 'ideal' ? 15 : 0
      const baseConfidence = Math.max(0, 100 - fillerPenalty - pacePenalty)
      const wpmEngagement = Math.min(1, currentWPM / 80)
      const confidenceScore = Math.round(baseConfidence * wpmEngagement)

      setMetrics((prev) => ({
        ...prev,
        elapsedSeconds,
        currentWPM,
        paceStatus,
        fillerWordCount: totalFiller,
        fillerWordBreakdown: { ...fillerCountRef.current },
        repetitions,
        confidenceScore,
      }))
    }

    recognition.onerror = (event: any) => {
      console.error('[SpeechRecognition]', event.error)
    }

    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  // Tick elapsed time every second
  useEffect(() => {
    if (!isListening) return
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        elapsedSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [isListening])

  return { metrics, transcript, isListening, startListening, stopListening }
}
