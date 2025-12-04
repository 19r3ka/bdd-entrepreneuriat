import { computed } from 'vue'
import type { Business } from '@/types/business'
import type { Support } from '@/types/monitoring-evaluation/Support'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'

export interface ActionItem {
  id: string
  type: 'urgent' | 'opportunity'
  title: string
  description: string
  entityId?: string
  entityType?: 'business' | 'support' | 'quickwin'
  date?: string
  priority: 'high' | 'medium' | 'low'
}

export function usePortfolioActions(
  businesses: () => Business[],
  supports: () => Support[],
  quickWins: () => QuickWin[]
) {
  const urgentActions = computed<ActionItem[]>(() => {
    const actions: ActionItem[] = []
    const now = new Date()

    // 1. Businesses with no recent activity (mock logic for now, using registration date as proxy)
    // In a real app, we'd check the last activity log or support date
    businesses().forEach((b) => {
      if (!b.registrationDate) return
      const regDate = new Date(b.registrationDate)
      const diffDays = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24))

      // If registered > 90 days ago and no support/quick wins (simplified check)
      const hasSupport = supports().some((s) => s.businessId === b.id)
      const hasQuickWin = quickWins().some((q) => q.businessId === b.id)

      if (diffDays > 90 && !hasSupport && !hasQuickWin) {
        actions.push({
          id: `inactive-${b.id}`,
          type: 'urgent',
          title: 'Inactive Business',
          description: `${b.name} has had no activity for over 90 days.`,
          entityId: b.id,
          entityType: 'business',
          priority: 'high'
        })
      }
    })

    // 2. Incomplete Maturity Assessments (Mock: businesses with no maturity levels)
    businesses().forEach((b) => {
      if (!b.maturityLevels || Object.keys(b.maturityLevels).length === 0) {
        actions.push({
          id: `no-maturity-${b.id}`,
          type: 'urgent',
          title: 'Missing Assessment',
          description: `${b.name} needs an initial maturity assessment.`,
          entityId: b.id,
          entityType: 'business',
          priority: 'medium'
        })
      }
    })

    return actions.slice(0, 5) // Limit to top 5
  })

  const opportunities = computed<ActionItem[]>(() => {
    const opps: ActionItem[] = []

    // 1. Ready for Scaling (High maturity but low support count?)
    businesses().forEach((b) => {
      if (!b.maturityLevels) return
      const levels = Object.values(b.maturityLevels) as number[]
      if (levels.length === 0) return
      const avg = levels.reduce((a, b) => a + b, 0) / levels.length

      if (avg > 2.5) {
        opps.push({
          id: `scaling-${b.id}`,
          type: 'opportunity',
          title: 'Ready for Scaling',
          description: `${b.name} shows good maturity (Avg: ${avg.toFixed(1)}). Consider scaling support.`,
          entityId: b.id,
          entityType: 'business',
          priority: 'high'
        })
      }
    })

    // 2. High Momentum (Many Quick Wins)
    businesses().forEach((b) => {
      const wins = quickWins().filter((q) => q.businessId === b.id)
      if (wins.length >= 2) {
        opps.push({
          id: `momentum-${b.id}`,
          type: 'opportunity',
          title: 'High Momentum',
          description: `${b.name} has achieved ${wins.length} quick wins recently. Capitalize on this momentum.`,
          entityId: b.id,
          entityType: 'business',
          priority: 'medium'
        })
      }
    })

    // 2. Quick Wins pending documentation (Mock: just a placeholder logic)
    // In reality, maybe check for "draft" quick wins if that status existed

    return opps.slice(0, 5)
  })

  return {
    urgentActions,
    opportunities
  }
}
