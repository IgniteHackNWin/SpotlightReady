import { Schema, model, Document } from 'mongoose'
import type { SessionData, SessionConfig } from '@spotlightready/shared'

export interface SessionDocument extends Omit<SessionData, 'sessionId'>, Document {}

const TranscriptSegmentSchema = new Schema(
  {
    text: { type: String, required: true },
    startMs: { type: Number, required: true },
    endMs: { type: Number, required: true },
    confidence: { type: Number, default: 1 },
  },
  { _id: false }
)

const SessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: String, required: true, index: true },
    config: { type: Schema.Types.Mixed, required: true },
    startedAt: { type: String, required: true },
    endedAt: { type: String, required: true },
    durationSeconds: { type: Number, required: true },
    transcript: { type: [TranscriptSegmentSchema], default: [] },
    metricsTimeline: { type: Schema.Types.Mixed, default: [] },
    recordingUrl: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.sessionId = (ret._id as { toString(): string }).toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Session = model<SessionDocument>('Session', SessionSchema)
