import { defineStore } from 'pinia'
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
import type { IndicatorReading } from '@/schemas/monitoring-evaluation/MomentumMetric'

interface HealthMetric {
  title: string
  value: string
  rawValue: number
  unit: string
  trend: number | null
  trendDirection: 'up' | 'down' | 'flat' | null
  sparklineData: number[]
  irrfCode?: string
  sdgTarget?: string
  disaggregation?: {
    women: number
    youth: number
    disability: number
  }
  hasData: boolean
}

export const useBusinessHealthStore = defineStore('businessHealth', () => {
  const getPeriodDates = (period: string) => {
    const now = new Date()
    let start = new Date()
    let prevStart = new Date()
    let prevEnd = new Date()

    if (period === 'Month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    } else if (period === 'Quarter') {
      const quarter = Math.floor(now.getMonth() / 3)
      start = new Date(now.getFullYear(), quarter * 3, 1)
      prevStart = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
      prevEnd = new Date(now.getFullYear(), quarter * 3, 0)
    } else {
      // Year
      start = new Date(now.getFullYear(), 0, 1)
      prevStart = new Date(now.getFullYear() - 1, 0, 1)
      prevEnd = new Date(now.getFullYear() - 1, 11, 31)
    }
    return { start, prevStart, prevEnd }
  }

  const filterReadings = (
    readings: IndicatorReading[],
    start: Date,
    end: Date = new Date()
  ): IndicatorReading[] => {
    return readings.filter((r) => {
      const d = new Date(r.asOf)
      return d >= start && d <= end
    })
  }

  const getJobsCreated = (
    metrics: MomentumMetric[],
    quickWins: QuickWin[],
    period: string = 'Year'
  ): HealthMetric => {
    let total = 0
    let women = 0
    let youth = 0
    let disability = 0
    let irrfCode: string | undefined
    let sdgTarget: string | undefined
    let hasData = false

    const jobMetrics = metrics.filter((m) =>
      m.indicators?.some(
        (i) => i.name.toLowerCase().includes('job') || i.name.toLowerCase().includes('employment')
      )
    )

    if (jobMetrics.length > 0) {
      hasData = true
      jobMetrics.forEach((m) => {
        const ind = m.indicators?.find((i) => i.name.toLowerCase().includes('job'))
        if (ind?.readings?.length) {
          const sorted = [...ind.readings].sort(
            (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
          )
          const latest = sorted[0]
          if (!latest) return

          if (typeof latest.value === 'number') {
            total += latest.value
            if (latest.disagg) {
              if (latest.disagg.gender === 'female') women += latest.value as number
              if (latest.disagg.ageBand === '15-24') youth += latest.value as number
              if (latest.disagg.disability) disability += latest.value as number
            }
          }

          if (!irrfCode && m.irrfIndicatorIds?.length) irrfCode = m.irrfIndicatorIds[0]
          if (!sdgTarget && m.sdgTargets?.length) sdgTarget = m.sdgTargets[0]
        }
      })
    } else {
      quickWins.forEach((qw) => {
        const jobInd = qw.indicatorValues.find((iv) => iv.indicatorId.toLowerCase().includes('job'))
        if (jobInd && typeof jobInd.currentValue === 'number') {
          total += jobInd.currentValue
          hasData = true
        }
      })
    }

    return {
      title: 'Jobs Created',
      value: total.toString(),
      rawValue: total,
      unit: 'count',
      trend: null,
      trendDirection: null,
      sparklineData: [],
      irrfCode: irrfCode || 'IRRF-2.3.1',
      sdgTarget: sdgTarget || '8.5',
      disaggregation: { women, youth, disability },
      hasData
    }
  }

  const getRevenueGrowth = (
    metrics: MomentumMetric[],
    period: string = 'Quarter'
  ): HealthMetric => {
    let totalValue = 0
    let totalPrevValue = 0
    let trend: number | null = null
    let irrfCode: string | undefined
    let sdgTarget: string | undefined
    let hasData = false

    const { start, prevStart, prevEnd } = getPeriodDates(period)

    const revenueMetrics = metrics.filter((m) =>
      m.indicators?.some(
        (i) => i.name.toLowerCase().includes('revenue') || i.name.toLowerCase().includes('sales')
      )
    )

    if (revenueMetrics.length > 0) {
      hasData = true
      irrfCode = revenueMetrics[0]!.irrfIndicatorIds?.[0] || 'IRRF-1.1.2'
      sdgTarget = revenueMetrics[0]!.sdgTargets?.[0] || '8.3'

      revenueMetrics.forEach((m) => {
        const ind = m.indicators?.find(
          (i) => i.name.toLowerCase().includes('revenue') || i.name.toLowerCase().includes('sales')
        )
        if (ind?.readings) {
          const currentReadings = filterReadings(ind.readings, start)
          const prevReadings = filterReadings(ind.readings, prevStart, prevEnd)

          const currentSum = currentReadings.reduce(
            (acc, r) => acc + (typeof r.value === 'number' ? r.value : 0),
            0
          )
          const prevSum = prevReadings.reduce(
            (acc, r) => acc + (typeof r.value === 'number' ? r.value : 0),
            0
          )

          if (currentSum === 0 && ind.readings.length > 0) {
            const sorted = [...ind.readings].sort(
              (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
            )
            const latest = sorted[0]
            if (latest && typeof latest.value === 'number') totalValue += latest.value
          } else {
            totalValue += currentSum
          }

          totalPrevValue += prevSum
        }
      })

      if (totalPrevValue > 0) {
        trend = ((totalValue - totalPrevValue) / totalPrevValue) * 100
      }
    }

    return {
      title: 'Revenue Growth',
      value: totalValue > 0 ? `$${totalValue.toLocaleString()}` : 'N/A',
      rawValue: totalValue,
      unit: 'currency',
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData
    }
  }

  const getMarketGrowth = (metrics: MomentumMetric[], period: string = 'Quarter'): HealthMetric => {
    let totalValue = 0
    let totalPrevValue = 0
    let unit = 'count'
    let trend: number | null = null
    let irrfCode: string | undefined
    let sdgTarget: string | undefined
    let hasData = false

    const { start, prevStart, prevEnd } = getPeriodDates(period)

    const marketMetrics = metrics.filter((m) =>
      m.indicators?.some(
        (i) =>
          i.name.toLowerCase().includes('export sales') ||
          i.name.toLowerCase().includes('regional sales') ||
          i.name.toLowerCase().includes('market')
      )
    )

    if (marketMetrics.length > 0) {
      hasData = true
      irrfCode = marketMetrics[0]!.irrfIndicatorIds?.[0] || 'IRRF-MKT-2A'
      sdgTarget = marketMetrics[0]!.sdgTargets?.[0] || '8.2'

      marketMetrics.forEach((m) => {
        const ind = m.indicators?.find(
          (i) =>
            i.name.toLowerCase().includes('export sales') ||
            i.name.toLowerCase().includes('regional sales') ||
            i.name.toLowerCase().includes('market')
        )

        if (ind?.readings) {
          if (ind.unit) unit = ind.unit

          const currentReadings = filterReadings(ind.readings, start)
          const prevReadings = filterReadings(ind.readings, prevStart, prevEnd)

          const currentSum = currentReadings.reduce(
            (acc, r) => acc + (typeof r.value === 'number' ? r.value : 0),
            0
          )
          const prevSum = prevReadings.reduce(
            (acc, r) => acc + (typeof r.value === 'number' ? r.value : 0),
            0
          )

          if (currentSum === 0 && ind.readings.length > 0) {
            const sorted = [...ind.readings].sort(
              (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
            )
            const latest = sorted[0]
            if (latest && typeof latest.value === 'number') totalValue += latest.value
          } else {
            totalValue += currentSum
          }
          totalPrevValue += prevSum
        }
      })

      if (totalPrevValue > 0) {
        trend = ((totalValue - totalPrevValue) / totalPrevValue) * 100
      }
    }

    return {
      title: 'Market Growth',
      value: unit === 'currency' ? `$${totalValue.toLocaleString()}` : totalValue.toString(),
      rawValue: totalValue,
      unit,
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData
    }
  }

  const getProfitability = (
    metrics: MomentumMetric[],
    period: string = 'Quarter'
  ): HealthMetric => {
    let avgValue = 0
    let avgPrevValue = 0
    let count = 0
    let prevCount = 0
    let unit = 'percent'
    let trend: number | null = null
    let irrfCode: string | undefined
    let sdgTarget: string | undefined
    let hasData = false

    const { start, prevStart, prevEnd } = getPeriodDates(period)

    const profitMetrics = metrics.filter((m) =>
      m.indicators?.some(
        (i) =>
          i.name.toLowerCase().includes('profit') ||
          i.name.toLowerCase().includes('margin') ||
          i.name.toLowerCase().includes('cost')
      )
    )

    if (profitMetrics.length > 0) {
      hasData = true
      irrfCode = profitMetrics[0]!.irrfIndicatorIds?.[0]
      sdgTarget = profitMetrics[0]!.sdgTargets?.[0]

      profitMetrics.forEach((m) => {
        const ind = m.indicators?.find(
          (i) =>
            i.name.toLowerCase().includes('profit') ||
            i.name.toLowerCase().includes('margin') ||
            i.name.toLowerCase().includes('cost')
        )

        if (ind?.readings) {
          if (ind.unit) unit = ind.unit

          const currentReadings = filterReadings(ind.readings, start)
          const prevReadings = filterReadings(ind.readings, prevStart, prevEnd)

          const getAvg = (arr: IndicatorReading[]) =>
            arr.length
              ? arr.reduce((acc, r) => acc + (typeof r.value === 'number' ? r.value : 0), 0) /
                arr.length
              : 0

          const currentAvg = getAvg(currentReadings)
          const prevAvg = getAvg(prevReadings)

          if (currentReadings.length > 0) {
            avgValue += currentAvg
            count++
          } else if (ind.readings.length > 0) {
            // Fallback to latest
            const sorted = [...ind.readings].sort(
              (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
            )
            const latest = sorted[0]
            if (latest && typeof latest.value === 'number') {
              avgValue += latest.value
              count++
            }
          }

          if (prevReadings.length > 0) {
            avgPrevValue += prevAvg
            prevCount++
          }
        }
      })

      if (count > 0) avgValue = avgValue / count
      if (prevCount > 0) avgPrevValue = avgPrevValue / prevCount

      if (prevCount > 0 && avgPrevValue > 0) {
        trend = ((avgValue - avgPrevValue) / avgPrevValue) * 100
      }
    }

    return {
      title: 'Profitability',
      value: unit === 'percent' ? `${avgValue.toFixed(1)}%` : `$${avgValue.toLocaleString()}`,
      rawValue: avgValue,
      unit,
      trend,
      trendDirection: trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : null,
      sparklineData: [],
      irrfCode,
      sdgTarget,
      hasData
    }
  }

  return {
    getJobsCreated,
    getRevenueGrowth,
    getMarketGrowth,
    getProfitability
  }
})