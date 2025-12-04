import { computed } from 'vue'
import type { Business } from '@/types/business'
import type { Support } from '@/types/monitoring-evaluation/Support'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'

export function usePortfolioMetrics(
  businesses: () => Business[],
  supports: () => Support[],
  quickWins: () => QuickWin[],
  metrics: () => MomentumMetric[]
) {
  // --- Pipeline Stages ---

  const totalBusinesses = computed(() => businesses().length)

  const businessesWithAssessment = computed(() => {
    return businesses().filter((b) => b.maturityLevels && Object.keys(b.maturityLevels).length > 0)
      .length
  })

  const businessesWithSupport = computed(() => {
    const supportedIds = new Set(supports().map((s) => s.businessId))
    return businesses().filter((b) => supportedIds.has(b.id!)).length
  })

  const businessesWithQuickWins = computed(() => {
    const quickWinIds = new Set(quickWins().map((q) => q.businessId))
    return businesses().filter((b) => quickWinIds.has(b.id!)).length
  })

  // "Graduated" heuristic: Avg maturity > 3.5 (assuming 1-5 scale)
  const graduatedBusinesses = computed(() => {
    return businesses().filter((b) => {
      if (!b.maturityLevels) return false
      const levels = Object.values(b.maturityLevels) as number[]
      if (levels.length === 0) return false
      const avg = levels.reduce((a, b) => a + b, 0) / levels.length
      return avg >= 3.5
    }).length
  })

  const pipelineStages = computed(() => [
    { label: 'Total Portfolio', count: totalBusinesses.value, color: '#3B82F6' },
    { label: 'Assessed', count: businessesWithAssessment.value, color: '#8B5CF6' },
    { label: 'Active Support', count: businessesWithSupport.value, color: '#F59E0B' },
    { label: 'Quick Wins', count: businessesWithQuickWins.value, color: '#10B981' },
    { label: 'Graduated', count: graduatedBusinesses.value, color: '#059669' }
  ])

  // --- Impact Trends (Mocked for now as we lack historical data structure) ---

  const impactTrends = computed(() => {
    // In a real app, we'd aggregate historical metrics.
    // Here we'll generate some plausible data based on current counts to show the visualization.
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return {
      labels: months,
      datasets: [
        {
          label: 'Jobs Created',
          data: [12, 19, 25, 32, 45, 58], // Mock cumulative
          borderColor: '#3B82F6',
          tension: 0.4
        },
        {
          label: 'Revenue Growth (%)',
          data: [5, 8, 12, 15, 22, 28], // Mock avg growth
          borderColor: '#10B981',
          tension: 0.4
        }
      ]
    }
  })

  return {
    pipelineStages,
    impactTrends
  }
}
