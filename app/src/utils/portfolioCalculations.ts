import type { Business } from '@/schemas/business';
import type { MomentumMetric } from '@/schemas/monitoring-evaluation/MomentumMetric';
import type { QuickWin } from '@/schemas/monitoring-evaluation/QuickWin';

/**
 * Calculates number of active businesses based on recent activity
 */
export function calculateActiveBusinesses(
  businesses: Business[],
  quickWins: QuickWin[],
  metrics: MomentumMetric[]
): number {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return businesses.filter(b => {
    const hasRecentQuickWin = quickWins.some(
      qw => qw.businessId === b.id && new Date(qw.createdAt || qw.updatedAt || '') >= oneYearAgo
    );

    const hasRecentMetric = metrics.some(m => {
      if (m.businessId !== b.id) return false;
      return m.indicators?.some(ind =>
        ind.readings?.some(reading => new Date(reading.asOf) >= oneYearAgo)
      );
    });

    return hasRecentQuickWin || hasRecentMetric;
  }).length;
}

/**
 * Calculates profile completeness points for a single business
 */
export function calculateProfilePoints(b: Business): number {
  let points = 0;
  if (b.name) points++;
  if (b.primaryBusinessArea) points++;
  if (b.location) points++;
  if (b.contact?.email) points++;
  if (b.contact?.telephone) points++;
  if (b.entrepreneurId) points++;
  if (b.activityStartDate) points++;
  return points;
}

/**
 * Calculates aggregate profile completeness for a list of businesses
 */
export function calculateProfileCompleteness(businesses: Business[], fieldsCount: number): number {
  if (businesses.length === 0) return 0;
  const completedPoints = businesses.reduce((acc, b) => acc + calculateProfilePoints(b), 0);
  const totalPoints = businesses.length * fieldsCount;
  return Math.round((completedPoints / totalPoints) * 100);
}

/**
 * Calculates finance unlocked across quick wins and metrics
 */
export function calculateFinanceUnlocked(quickWins: QuickWin[], metrics: MomentumMetric[]): number {
  let total = 0;

  quickWins.forEach(qw => {
    qw.indicatorValues.forEach(iv => {
      const id = iv.indicatorId.toLowerCase();
      const isFinance = ['finance', 'capital', 'funding', 'loan', 'grant'].some(k =>
        id.includes(k)
      );
      if (isFinance && typeof iv.currentValue === 'number') {
        total += iv.currentValue;
      }
    });
  });

  metrics.forEach(m => {
    if (m.category === 'finance_access') {
      m.indicators?.forEach(ind => {
        const latestReading = ind.readings?.[ind.readings.length - 1];
        if (latestReading && typeof latestReading.value === 'number') {
          total += latestReading.value;
        }
      });
    }
  });

  return Math.round(total);
}

/**
 * Calculates number of businesses with at least one maturity assessment
 */
export function countBusinessesWithAssessment(businesses: Business[]): number {
  return businesses.filter(b => b.maturityLevels && Object.keys(b.maturityLevels).length > 0)
    .length;
}

/**
 * Calculates number of businesses that have received support
 */
export function countBusinessesWithSupport(businesses: Business[], supports: Support[]): number {
  const supportedIds = new Set(supports.map(s => s.businessId));
  return businesses.filter(b => supportedIds.has(b.id!)).length;
}

/**
 * Calculates number of businesses with quick wins
 */
export function countBusinessesWithQuickWins(
  businesses: Business[],
  quickWins: QuickWin[]
): number {
  const quickWinIds = new Set(quickWins.map(q => q.businessId));
  return businesses.filter(b => quickWinIds.has(b.id!)).length;
}

/**
 * Calculates number of graduated businesses based on maturity threshold
 */
export function countGraduatedBusinesses(businesses: Business[], threshold: number): number {
  return businesses.filter(b => {
    if (!b.maturityLevels) return false;
    const levels = Object.values(b.maturityLevels) as number[];
    if (levels.length === 0) return false;
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    return avg >= threshold;
  }).length;
}

/**
 * Groups impact data by month for trends
 */
export function calculateImpactTrendsData(metrics: MomentumMetric[]) {
  const monthsSet = new Set<string>();
  const jobsDataMap = new Map<string, number>();
  const revenueDataMap = new Map<string, number>();

  const getMonthKey = (date: Date) => date.toLocaleString('default', { month: 'short' });

  metrics.forEach(metric => {
    const isJobs = metric.category === 'employment_inclusion';
    const isRevenue = metric.category === 'performance' || metric.category === 'finance_access';
    if (!isJobs && !isRevenue) return;

    metric.indicators.forEach(indicator => {
      const momIndicator = indicator as any;
      if (!momIndicator.readings) return;

      momIndicator.readings.forEach((reading: any) => {
        if (!reading.asOf) return;
        const key = getMonthKey(new Date(reading.asOf));
        monthsSet.add(key);
        const val = typeof reading.value === 'number' ? reading.value : reading.value ? 1 : 0;

        if (isJobs) jobsDataMap.set(key, (jobsDataMap.get(key) || 0) + val);
        else if (isRevenue) revenueDataMap.set(key, (revenueDataMap.get(key) || 0) + val);
      });
    });
  });

  const labels = Array.from(monthsSet);
  return {
    labels,
    jobsData: labels.map(l => jobsDataMap.get(l) || 0),
    revenueData: labels.map(l => revenueDataMap.get(l) || 0),
  };
}
