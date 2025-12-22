import { defineStore } from 'pinia';
import { type MomentumMetric } from '@/schemas/monitoring-evaluation/MomentumMetric';
import { type QuickWin } from '@/schemas/monitoring-evaluation/QuickWin';
import { type IndicatorReading } from '@/schemas/monitoring-evaluation/IndicatorReading';
import { IndicatorUnitEnum } from '@/schemas/enums';
import type { IndicatorUnit } from '@/schemas/enums';
import {
  getPeriodDates,
  sumReadings,
  calculateTrendValue,
  getLatestReadingValue,
} from '@/utils/healthCalculations';

interface HealthMetric {
  title: string;
  value: string;
  rawValue: number;
  unit: IndicatorUnit;
  trend: number | null;
  trendDirection: 'up' | 'down' | 'flat' | null;
  sparklineData: number[];
  irrfCode?: string;
  sdgTarget?: string;
  disaggregation?: {
    women: number;
    youth: number;
    disability: number;
  };
  hasData: boolean;
}

export const useBusinessHealthStore = defineStore('businessHealth', () => {
  const filterReadings = (
    readings: IndicatorReading[],
    start: Date,
    end: Date = new Date()
  ): IndicatorReading[] => {
    return readings.filter(r => {
      const d = new Date(r.asOf);
      return d >= start && d <= end;
    });
  };

  const getJobsCreated = (
    metrics: MomentumMetric[],
    quickWins: QuickWin[],
    _period: string = 'Year'
  ): HealthMetric => {
    let total = 0;
    let women = 0;
    let youth = 0;
    let disability = 0;
    let irrfCode: string | undefined;
    let sdgTarget: string | undefined;
    let hasData = false;

    const jobMetrics = metrics.filter(m =>
      m.indicators?.some(
        i => i.name.toLowerCase().includes('job') || i.name.toLowerCase().includes('employment')
      )
    );

    if (jobMetrics.length > 0) {
      hasData = true;
      jobMetrics.forEach(m => {
        const ind = m.indicators?.find(i => i.name.toLowerCase().includes('job'));
        if (!ind) return;

        const val = getLatestReadingValue(ind);
        if (val === null) return;

        total += val;

        // Find latest reading for disaggregation
        const sorted = [...ind.readings].sort(
          (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
        );
        const latest = sorted[0];

        if (latest?.disagg) {
          if (latest.disagg.gender === 'Woman') women += val;
          if (latest.disagg.ageBand === '15-24') youth += val;
          if (latest.disagg.disability) disability += val;
        }

        if (!irrfCode && m.irrfIndicatorIds?.length) irrfCode = m.irrfIndicatorIds[0];
        if (!sdgTarget && m.sdgTargets?.length) sdgTarget = m.sdgTargets[0];
      });
    } else {
      quickWins.forEach(qw => {
        const jobInd = qw.indicatorValues.find(iv => iv.indicatorId.toLowerCase().includes('job'));
        if (jobInd && typeof jobInd.currentValue === 'number') {
          total += jobInd.currentValue;
          hasData = true;
        }
      });
    }

    return {
      title: 'Jobs Created',
      value: total.toString(),
      rawValue: total,
      unit: IndicatorUnitEnum.enum.count,
      trend: null,
      trendDirection: null,
      sparklineData: [],
      irrfCode: irrfCode || 'IRRF-2.3.1',
      sdgTarget: sdgTarget || '8.5',
      disaggregation: { women, youth, disability },
      hasData,
    };
  };

  const getRevenueGrowth = (
    metrics: MomentumMetric[],
    period: string = 'Quarter'
  ): HealthMetric => {
    let totalValue = 0;
    let totalPrevValue = 0;
    let trend: number | null = null;
    let irrfCode: string | undefined;
    let sdgTarget: string | undefined;
    let hasData = false;

    const { start, prevStart, prevEnd } = getPeriodDates(period);
    const revenueMetrics = metrics.filter(m =>
      m.indicators?.some(
        i => i.name.toLowerCase().includes('revenue') || i.name.toLowerCase().includes('sales')
      )
    );

    if (revenueMetrics.length > 0) {
      hasData = true;
      irrfCode = revenueMetrics[0]!.irrfIndicatorIds?.[0] || 'IRRF-1.1.2';
      sdgTarget = revenueMetrics[0]!.sdgTargets?.[0] || '8.3';

      revenueMetrics.forEach(m => {
        const ind = m.indicators?.find(
          i => i.name.toLowerCase().includes('revenue') || i.name.toLowerCase().includes('sales')
        );
        if (!ind?.readings) return;

        const currentSum = sumReadings(filterReadings(ind.readings, start));
        const prevSum = sumReadings(filterReadings(ind.readings, prevStart, prevEnd));

        totalValue += currentSum === 0 ? getLatestReadingValue(ind) || 0 : currentSum;
        totalPrevValue += prevSum;
      });
      trend = calculateTrendValue(totalValue, totalPrevValue);
    }

    return {
      title: 'Revenue Growth',
      value: totalValue > 0 ? `$${totalValue.toLocaleString()}` : 'N/A',
      rawValue: totalValue,
      unit: IndicatorUnitEnum.enum.currency,
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData,
    };
  };

  const getMarketGrowth = (metrics: MomentumMetric[], period: string = 'Quarter'): HealthMetric => {
    let totalValue = 0;
    let totalPrevValue = 0;
    let unit: IndicatorUnit = IndicatorUnitEnum.enum.count;
    let trend: number | null = null;
    let irrfCode: string | undefined;
    let sdgTarget: string | undefined;
    let hasData = false;

    const { start, prevStart, prevEnd } = getPeriodDates(period);
    const keywords = ['export sales', 'regional sales', 'market'];
    const marketMetrics = metrics.filter(m =>
      m.indicators?.some(i => keywords.some(k => i.name.toLowerCase().includes(k)))
    );

    if (marketMetrics.length > 0) {
      hasData = true;
      irrfCode = marketMetrics[0]!.irrfIndicatorIds?.[0] || 'IRRF-MKT-2A';
      sdgTarget = marketMetrics[0]!.sdgTargets?.[0] || '8.2';

      marketMetrics.forEach(m => {
        const ind = m.indicators?.find(i => keywords.some(k => i.name.toLowerCase().includes(k)));
        if (!ind?.readings) return;
        if (ind.unit) unit = ind.unit;

        const currentSum = sumReadings(filterReadings(ind.readings, start));
        const prevSum = sumReadings(filterReadings(ind.readings, prevStart, prevEnd));

        totalValue += currentSum === 0 ? getLatestReadingValue(ind) || 0 : currentSum;
        totalPrevValue += prevSum;
      });
      trend = calculateTrendValue(totalValue, totalPrevValue);
    }

    return {
      title: 'Market Growth',
      value:
        (unit as IndicatorUnit) === IndicatorUnitEnum.enum.currency
          ? `$${totalValue.toLocaleString()}`
          : totalValue.toString(),
      rawValue: totalValue,
      unit,
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData,
    };
  };

  const getProfitability = (
    metrics: MomentumMetric[],
    period: string = 'Quarter'
  ): HealthMetric => {
    let avgValue = 0;
    let avgPrevValue = 0;
    let count = 0;
    let prevCount = 0;
    let unit: IndicatorUnit = IndicatorUnitEnum.enum.percent;
    let trend: number | null = null;
    let irrfCode: string | undefined;
    let sdgTarget: string | undefined;
    let hasData = false;

    const { start, prevStart, prevEnd } = getPeriodDates(period);
    const keywords = ['profit', 'margin', 'cost'];
    const profitMetrics = metrics.filter(m =>
      m.indicators?.some(i => keywords.some(k => i.name.toLowerCase().includes(k)))
    );

    if (profitMetrics.length > 0) {
      hasData = true;
      irrfCode = profitMetrics[0]!.irrfIndicatorIds?.[0];
      sdgTarget = profitMetrics[0]!.sdgTargets?.[0];

      profitMetrics.forEach(m => {
        const ind = m.indicators?.find(i => keywords.some(k => i.name.toLowerCase().includes(k)));
        if (!ind?.readings) return;
        if (ind.unit) unit = ind.unit;

        const currentReadings = filterReadings(ind.readings, start);
        const prevReadings = filterReadings(ind.readings, prevStart, prevEnd);

        if (currentReadings.length > 0) {
          avgValue += sumReadings(currentReadings) / currentReadings.length;
          count++;
        } else {
          const val = getLatestReadingValue(ind);
          if (val !== null) {
            avgValue += val;
            count++;
          }
        }

        if (prevReadings.length > 0) {
          avgPrevValue += sumReadings(prevReadings) / prevReadings.length;
          prevCount++;
        }
      });

      if (count > 0) avgValue /= count;
      if (prevCount > 0) avgPrevValue /= prevCount;
      trend = calculateTrendValue(avgValue, avgPrevValue);
    }

    return {
      title: 'Profitability',
      value:
        (unit as IndicatorUnit) === IndicatorUnitEnum.enum.percent
          ? `${avgValue.toFixed(1)}%`
          : `$${avgValue.toLocaleString()}`,
      rawValue: avgValue,
      unit,
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData,
    };
  };

  return {
    getJobsCreated,
    getRevenueGrowth,
    getMarketGrowth,
    getProfitability,
  };
});
