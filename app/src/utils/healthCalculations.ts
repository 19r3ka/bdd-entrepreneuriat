import { type IndicatorReading } from '@/schemas/monitoring-evaluation/IndicatorReading';

/**
 * Calculates start and end dates for different periods
 */
export const getPeriodDates = (period: string) => {
  const now = new Date();
  let start = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();

  const QUARTER_MONTHS = 3;
  const DECEMBER_MONTH_INDEX = 11;
  const DECEMBER_DAY = 31;
  const PREVIOUS_YEAR = 1;

  if (period === 'Month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (period === 'Quarter') {
    const quarter = Math.floor(now.getMonth() / QUARTER_MONTHS);
    start = new Date(now.getFullYear(), quarter * QUARTER_MONTHS, 1);
    prevStart = new Date(now.getFullYear(), (quarter - 1) * QUARTER_MONTHS, 1);
    prevEnd = new Date(now.getFullYear(), quarter * QUARTER_MONTHS, 0);
  } else {
    // Year
    start = new Date(now.getFullYear(), 0, 1);
    prevStart = new Date(now.getFullYear() - PREVIOUS_YEAR, 0, 1);
    prevEnd = new Date(now.getFullYear() - PREVIOUS_YEAR, DECEMBER_MONTH_INDEX, DECEMBER_DAY);
  }
  return { start, prevStart, prevEnd };
};

/**
 * Sums numeric values in readings
 */
export const sumReadings = (readings: IndicatorReading[]): number => {
  return readings.reduce((acc, r) => acc + (typeof r.value === 'number' ? r.value : 0), 0);
};

/**
 * Calculates trend percentage
 */
export const calculateTrendValue = (current: number, previous: number): number | null => {
  return previous > 0 ? ((current - previous) / previous) * 100 : null;
};

/**
 * Gets latest reading value from an indicator
 */
export const getLatestReadingValue = (indicator: {
  readings?: IndicatorReading[];
}): number | null => {
  if (!indicator?.readings?.length) return null;
  const sorted = [...indicator.readings].sort(
    (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
  );
  const latest = sorted[0];
  return latest && typeof latest.value === 'number' ? latest.value : null;
};
