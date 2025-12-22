import Dexie, { type Table } from 'dexie';
import type { Entrepreneur } from '@/types/entrepreneur';
import type { Business } from '@/types/business';
import type { MaturityAssessment } from '@/types/monitoring-evaluation/Maturity';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { IndicatorDefinition, Measurement } from '@/types/monitoring-evaluation/Indicator';
import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { ActivityLog } from '@/types/ActivityLog';
import type { PartialRecord } from '@/types/partialRecord';

// Dexie DB class
/**
 *
 */
export class LocalDB extends Dexie {
  entrepreneurs!: Table<Entrepreneur, string>;
  businesses!: Table<Business, string>;
  avatars!: Table<{ id: string; data: string }, string>; // for storing avatar files as base64
  maturityAssessments!: Table<MaturityAssessment, string>;
  supports!: Table<Support, string>;
  indicatorDefinitions!: Table<IndicatorDefinition, string>;
  measurements!: Table<Measurement, string>;
  evidenceFiles!: Table<{ id: string; data: string; type: string; name: string }, string>;
  outputIndicators!: Table<OutputIndicator, string>;
  quickWins!: Table<QuickWin, string>;
  momentumMetrics!: Table<MomentumMetric, string>;
  activityLogs!: Table<ActivityLog, string>;
  partialRecords!: Table<PartialRecord, string>;

  ORIGINAL_VERSION = 4;
  ADDS_MOMENTUM_METRICS_VERSION = 5;
  ADDS_ACTIVITY_LOGS_VERSION = 6;
  ADDS_PARTIAL_RECORDS_VERSION = 7;

  /**
   *
   */
  constructor() {
    super('BusinessTrackerDB');

    this.version(this.ORIGINAL_VERSION).stores({
      entrepreneurs: '&id, slug, contact.email',
      businesses: '&id, entrepreneurId',
      avatars: '&id',
      maturityAssessments: '&id, businessId',
      supports: '&id, businessId',
      indicatorDefinitions: '&id, businessId',
      measurements: '&id, indicatorId',
      evidenceFiles: '&id',
      outputIndicators: '&id, name, category, isStandard, usageCount',
      quickWins: '&id, businessId, supportBoostId, achievedOn, createdAt',
    });

    this.version(this.ADDS_MOMENTUM_METRICS_VERSION).stores({
      momentumMetrics: '&momentumMetricId, businessId, quickWinId, category, createdAt',
    });

    this.version(this.ADDS_ACTIVITY_LOGS_VERSION).stores({
      activityLogs: '&id, action, entityType, timestamp',
    });

    this.version(this.ADDS_PARTIAL_RECORDS_VERSION).stores({
      partialRecords: '&id, status, importSource, createdAt',
    });
  }
}

/**
 * Check if IndexedDB is supported in the current environment
 * @returns boolean
 */
function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

/**
 * Verify database connection
 * @returns Promise<boolean>
 */
export async function verifyDbConnection(): Promise<boolean> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB is not supported in this environment');
    return false;
  }

  try {
    /**
     * Try to open a transaction to test database availability
     */
    await db.transaction('readonly', db.businesses, () => {});
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export const db = new LocalDB();
