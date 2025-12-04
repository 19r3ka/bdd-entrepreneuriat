import Dexie, { type Table } from 'dexie'
import type { z } from 'zod'
import type { Entrepreneur } from '@/types/entrepreneur'
import type { Business } from '@/types/business'
import type { MaturityAssessment } from '@/types/monitoring-evaluation/Maturity'
import type { Support } from '@/types/monitoring-evaluation/Support'
import type { IndicatorDefinition, Measurement } from '@/types/monitoring-evaluation/Indicator'
import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
import type { ActivityLog } from '@/types/ActivityLog'

// Dexie DB class
export class LocalDB extends Dexie {
  entrepreneurs!: Table<Entrepreneur, string>
  businesses!: Table<Business, string>
  avatars!: Table<{ id: string; data: string }, string> // for storing avatar files as base64
  maturityAssessments!: Table<MaturityAssessment, string>
  supports!: Table<Support, string>
  indicatorDefinitions!: Table<IndicatorDefinition, string>
  measurements!: Table<Measurement, string>
  evidenceFiles!: Table<{ id: string; data: string; type: string; name: string }, string>
  outputIndicators!: Table<OutputIndicator, string>
  quickWins!: Table<QuickWin, string>
  momentumMetrics!: Table<MomentumMetric, string>
  activityLogs!: Table<ActivityLog, string>

  constructor() {
    super('BusinessTrackerDB')

    this.version(4).stores({
      entrepreneurs: '&id, slug, contact.email',
      businesses: '&id, entrepreneurId',
      avatars: '&id',
      maturityAssessments: '&id, businessId',
      supports: '&id, businessId',
      indicatorDefinitions: '&id, businessId',
      measurements: '&id, indicatorId',
      evidenceFiles: '&id',
      outputIndicators: '&id, name, category, isStandard, usageCount',
      quickWins: '&id, businessId, supportBoostId, achievedOn, createdAt'
    })

    this.version(5).stores({
      momentumMetrics: '&momentumMetricId, businessId, quickWinId, category, createdAt'
    })

    this.version(6).stores({
      activityLogs: '&id, action, entityType, timestamp'
    })
  }
}

export const db = new LocalDB()
