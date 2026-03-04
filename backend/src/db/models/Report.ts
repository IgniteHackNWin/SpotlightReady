import { Schema, model, Document } from 'mongoose'
import type { PerformanceReport } from '@spotlightready/shared'

export interface ReportDocument extends Omit<PerformanceReport, 'reportId'>, Document {}

const ReportSchema = new Schema<ReportDocument>(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    generatedAt: { type: String, required: true },
    totalScore: { type: Number, required: true },
    overallSummary: { type: Schema.Types.Mixed, required: true },
    speechAnalytics: { type: Schema.Types.Mixed, required: true },
    visualPresence: { type: Schema.Types.Mixed, required: true },
    contentIntelligence: { type: Schema.Types.Mixed, required: true },
    grammarLanguage: { type: Schema.Types.Mixed, required: true },
    replayMarkers: { type: Schema.Types.Mixed, default: [] },
    improvementPlan: { type: Schema.Types.Mixed, required: true },
    scoreBreakdown: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.reportId = (ret._id as { toString(): string }).toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Report = model<ReportDocument>('Report', ReportSchema)
