import { useEffect, useRef, useState, useCallback, RefObject } from 'react'

interface EyeMetrics {
  score: number
  status: 'maintaining' | 'looking-away'
}

// ─────────────────────────────────────────────────────────────────────────────
// useEyeTracking  v2 — Canvas-based real face presence detection
//
// How it works:
//  1. Every ~200ms, draw the current video frame to a hidden canvas
//  2. Sample a face-zone in the upper-center 40% of the frame
//     (where a person's face is when looking at their screen)
//  3. Count pixels in skin-tone HSL range within that zone
//  4. Calculate what fraction of the zone is skin-tone
//  5. If face is present AND centered → eye contact is high
//     If face missing, off-center, or zone is dark → score drops
//
// This replaces the Math.random() stub and gives scores based on
// the actual camera feed — not fabricated numbers.
// ─────────────────────────────────────────────────────────────────────────────

// Offscreen canvas (persistent — created once)
let offscreenCanvas: HTMLCanvasElement | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null

function getOffscreen(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  if (typeof window === 'undefined') return null
  if (!offscreenCanvas) {
    offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = 160   // small sample size → fast
    offscreenCanvas.height = 120
    offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true })
  }
  if (!offscreenCtx) return null
  return { canvas: offscreenCanvas, ctx: offscreenCtx }
}

/**
 * Check if an RGB value falls in a broad skin-tone range.
 * Works for light, medium, and dark skin tones.
 * Based on: RGB skin detection heuristics (Kovac et al. + IQ-HSRGB ranges)
 */
function isSkinTone(r: number, g: number, b: number): boolean {
  // Must not be too dark or too bright
  if (r < 20 || g < 20 || b < 20) return false
  if (r > 250 && g > 250 && b > 250) return false
  // Red channel dominant
  if (r < g || r < b) return false
  // Skin-tone range gates
  if (Math.abs(r - g) < 15) return false   // too grey
  if (r - b < 10) return false             // too bluish
  // Range limits
  return r > 60 && g > 30 && b > 15 && r - b > 15 && r - g > 5
}

/**
 * Analyze a video frame and return a face-presence score 0–100.
 * Returns -1 if the video is not ready.
 */
function analyzeFrame(video: HTMLVideoElement): number {
  if (!video.videoWidth || !video.videoHeight || video.readyState < 2) return -1

  const offscreen = getOffscreen()
  if (!offscreen) return -1
  const { canvas, ctx } = offscreen

  // Draw the video frame scaled down to 160×120
  try {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  } catch {
    return -1
  }

  // Sample the upper-center face zone:
  // X: middle 50% of frame (25%–75%)
  // Y: top 60% of frame (0–60%)
  const zoneX = Math.floor(canvas.width * 0.20)
  const zoneY = Math.floor(canvas.height * 0.05)
  const zoneW = Math.floor(canvas.width * 0.60)
  const zoneH = Math.floor(canvas.height * 0.60)

  let imageData: ImageData
  try {
    imageData = ctx.getImageData(zoneX, zoneY, zoneW, zoneH)
  } catch {
    return -1
  }

  const data = imageData.data
  const totalPixels = zoneW * zoneH
  let skinPixels = 0

  // Sample every 4th pixel for performance (still accurate enough)
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (isSkinTone(r, g, b)) skinPixels++
  }

  const sampledTotal = Math.ceil(totalPixels / 4)
  const skinRatio = skinPixels / sampledTotal

  // skinRatio > 0.08 = face detected in zone
  // skinRatio > 0.20 = strong face presence / looking at camera
  // Map 0.05–0.35 → 0–100 score
  const score = Math.min(100, Math.max(0, Math.round(((skinRatio - 0.04) / 0.28) * 100)))
  return score
}

export function useEyeTracking(videoRef: RefObject<HTMLVideoElement>) {
  const [eyeMetrics, setEyeMetrics] = useState<EyeMetrics>({
    score: 100,
    status: 'maintaining',
  })

  const animFrameRef = useRef<number>()
  const isTrackingRef = useRef(false)
  const eyeContactHistory = useRef<number[]>([])
  const lastAnalysisRef = useRef<number>(0)

  const startTracking = useCallback(() => {
    isTrackingRef.current = true
    eyeContactHistory.current = []
    trackLoop()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const trackLoop = () => {
    if (!isTrackingRef.current) return

    const now = Date.now()
    // Analyze at ~5fps (every 200ms) — enough resolution, minimal CPU
    if (now - lastAnalysisRef.current >= 200) {
      lastAnalysisRef.current = now

      if (videoRef.current) {
        const rawScore = analyzeFrame(videoRef.current)

        if (rawScore >= 0) {
          // Rolling history window: last 20 samples (= last 4 seconds)
          eyeContactHistory.current.push(rawScore)
          if (eyeContactHistory.current.length > 20) {
            eyeContactHistory.current.shift()
          }

          // Smooth score = average of rolling window
          const avg = Math.round(
            eyeContactHistory.current.reduce((a, b) => a + b, 0) /
            eyeContactHistory.current.length
          )

          setEyeMetrics({
            score: avg,
            status: avg > 40 ? 'maintaining' : 'looking-away',
          })
        }
        // If rawScore === -1 (video not ready yet), keep previous value
      }
    }

    animFrameRef.current = requestAnimationFrame(trackLoop)
  }

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
  }, [])

  useEffect(() => {
    return () => stopTracking()
  }, [stopTracking])

  return { eyeMetrics, startTracking, stopTracking }
}
