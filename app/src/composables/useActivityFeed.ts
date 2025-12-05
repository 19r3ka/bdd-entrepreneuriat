import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Business } from '@/types/business'
import type { Entrepreneur } from '@/types/entrepreneur'
import type { Support } from '@/types/monitoring-evaluation/Support'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
import type { ActivityLog } from '@/types/ActivityLog'

export interface ActivityItem {
  id: string
  type: 'business' | 'support' | 'quick_win' | 'metric' | 'entrepreneur'
  entityName: string
  entityInitials: string
  entityType: 'Business' | 'Entrepreneur'
  description: string
  date: Date
  status?: string
  link: string
  meta?: string // Extra info like "Digital Lvl 2"
}

export interface AlertItem {
  id: string
  type: 'warning' | 'danger' | 'info'
  title: string
  message: string
  entityName: string
  entityInitials: string
  time: string
  link: string
  actionLabel: string
}

/**
 *
 */
export function useActivityFeed(
  businesses: Ref<Business[]>,
  entrepreneurs: Ref<Entrepreneur[]>,
  supports: Ref<Support[]>,
  quickWins: Ref<QuickWin[]>,
  metrics: Ref<MomentumMetric[]>,
  logs: Ref<ActivityLog[]>
) {
  const { t } = useI18n()
  // Helper to get entrepreneur details for a business
  const getEntDetails = (businessId: string) => {
    const business = businesses.value.find((b) => b.id === businessId)
    if (!business || !business.entrepreneurId) return null
    return entrepreneurs.value.find((e) => e.id === business.entrepreneurId)
  }

  // Helper to format date relative
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  const activities = computed<ActivityItem[]>(() => {
    const items: ActivityItem[] = []

    // 0. Persistent Logs
    logs.value.forEach((log) => {
      let link = '#'
      let description = ''
      let status = ''

      // Determine link and description based on action and type
      if (log.entityType === 'business') {
        link = log.action === 'delete' ? '/businesses' : `/businesses/${log.entityId}`
      } else if (log.entityType === 'entrepreneur') {
        // Try to find business for this entrepreneur to link to?
        // For now, link to entrepreneur list or business list
        link = '/businesses'
      }

      switch (log.action) {
        case 'create':
          description = t('pages.dashboard.activity.newAdded', { type: log.entityType })
          status = t('pages.dashboard.activity.status.created')
          break
        case 'update':
          description = t('pages.dashboard.activity.updated', { type: log.entityType })
          status = t('pages.dashboard.activity.status.updated')
          break
        case 'delete':
          description = t('pages.dashboard.activity.deleted', { type: log.entityType })
          status = t('pages.dashboard.activity.status.deleted')
          break
      }

      items.push({
        id: `log-${log.id}`,
        type: log.entityType as any, // Cast to match ActivityItem type
        entityName: log.entityName,
        entityInitials: log.entityName.substring(0, 2).toUpperCase(),
        entityType: log.entityType === 'business' ? 'Business' : 'Entrepreneur',
        description: description,
        date: new Date(log.timestamp),
        status: status,
        link: link,
        meta: log.details
      })
    })

    // 1. New Businesses (Derived)
    // Only add if no "create" log exists for this business to avoid duplicates
    businesses.value.forEach((b) => {
      const hasCreateLog = logs.value.some(
        (l) => l.entityType === 'business' && l.entityId === b.id && l.action === 'create'
      )
      if (hasCreateLog) return

      const date = b.registrationDate
        ? new Date(b.registrationDate)
        : b.activityStartDate
          ? new Date(b.activityStartDate)
          : null
      if (date) {
        items.push({
          id: `new-biz-${b.id}`,
          type: 'business',
          entityName: b.name,
          entityInitials: b.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.newBusinessRegistered'),
          date: date,
          status: t('pages.dashboard.activity.status.registered'),
          link: `/businesses/${b.id}`,
          meta: b.primaryBusinessArea
        })
      }
    })

    // 2. Supports Provided
    supports.value.forEach((s) => {
      const business = businesses.value.find((b) => b.id === s.businessId)
      if (business) {
        items.push({
          id: `support-${s.id}`,
          type: 'support',
          entityName: business.name,
          entityInitials: business.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.support', { type: s.boostType }),
          date: new Date(s.startDate),
          status: t('pages.dashboard.activity.status.completed'),
          link: `/businesses/${business.id}?tab=supports`,
          meta: s.dimension
        })
      }
    })

    // 3. Quick Wins Achieved
    quickWins.value.forEach((qw) => {
      const business = businesses.value.find((b) => b.id === qw.businessId)
      if (business) {
        items.push({
          id: `qw-${qw.id}`,
          type: 'quick_win',
          entityName: business.name,
          entityInitials: business.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.quickWin', { title: qw.title }),
          date: new Date(qw.achievedOn),
          status: t('pages.dashboard.activity.status.achieved'),
          link: `/businesses/${business.id}?tab=quick-wins`,
          meta: qw.dimension
        })
      }
    })

    // 4. Metrics Recorded
    metrics.value.forEach((m) => {
      const business = businesses.value.find((b) => b.id === m.businessId)
      if (business && m.indicators) {
        // Find most recent reading date
        let lastDate = new Date(0)
        m.indicators.forEach((i) => {
          i.readings?.forEach((r) => {
            const d = new Date(r.asOf)
            if (d > lastDate) lastDate = d
          })
        })

        if (lastDate.getTime() > 0) {
          items.push({
            id: `metric-${m.momentumMetricId}`,
            type: 'metric',
            entityName: business.name,
            entityInitials: business.name.substring(0, 2).toUpperCase(),
            entityType: 'Business',
            description: t('pages.dashboard.activity.performanceReported', { title: m.title }),
            date: lastDate,
            status: t('pages.dashboard.activity.status.reported'),
            link: `/businesses/${business.id}?tab=outcomes`,
            meta: m.dimension
          })
        }
      }
    })

    // Sort by date descending
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20)
  })

  const alerts = computed<AlertItem[]>(() => {
    const list: AlertItem[] = []

    businesses.value.forEach((b) => {
      // Alert 1: Incomplete Profile
      if (!b.profileCompleted) {
        list.push({
          id: `alert-profile-${b.id}`,
          type: 'warning',
          title: 'Incomplete Profile',
          message: 'Business profile needs completion',
          entityName: b.name,
          entityInitials: b.name.substring(0, 2).toUpperCase(),
          time: b.registrationDate ? formatRelativeTime(new Date(b.registrationDate)) : 'Unknown',
          link: `/businesses/${b.id}/edit`,
          actionLabel: 'Complete'
        })
      }

      // Alert 2: No Entrepreneur Linked
      if (!b.entrepreneurId) {
        list.push({
          id: `alert-no-ent-${b.id}`,
          type: 'danger',
          title: 'Missing Entrepreneur',
          message: 'No entrepreneur linked to business',
          entityName: b.name,
          entityInitials: b.name.substring(0, 2).toUpperCase(),
          time: 'Urgent',
          link: `/businesses/${b.id}/edit`,
          actionLabel: 'Link'
        })
      }

      // Alert 3: Stagnant (No activity in 90 days)
      // This would require checking supports/quickWins for this business
      // Skipping for KISS unless requested, as it requires more complex filtering
    })

    return list
  })

  return {
    activities,
    alerts
  }
}
