import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Business } from '@/types/business';
import type { Entrepreneur } from '@/types/entrepreneur';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { ActivityLog } from '@/types/ActivityLog';

export interface ActivityItem {
  id: string;
  type: 'business' | 'support' | 'quick_win' | 'metric' | 'entrepreneur';
  entityName: string;
  entityInitials: string;
  entityType: 'Business' | 'Entrepreneur';
  description: string;
  date: Date;
  status?: string;
  link: string;
  meta?: string; // Extra info like "Digital Lvl 2"
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  entityName: string;
  entityInitials: string;
  time: string;
  link: string;
  actionLabel: string;
}

/**
 * Creates activities for activity logs
 * @param logs
 * @returns
 */
export function useActivityLogs(logs: Ref<ActivityLog[]>) {
  const { t } = useI18n();

  const getLogLink = (log: ActivityLog) => {
    if (log.entityType === 'business') {
      return log.action === 'delete' ? '/businesses' : `/businesses/${log.entityId}`;
    }
    return '/businesses';
  };

  const getLogDescription = (action: string, entityType: string) => {
    const descriptions = {
      create: t('pages.dashboard.activity.newAdded', { type: entityType }),
      update: t('pages.dashboard.activity.updated', { type: entityType }),
      delete: t('pages.dashboard.activity.deleted', { type: entityType }),
    };
    return descriptions[action as keyof typeof descriptions] || '';
  };

  const getLogStatus = (action: string) => {
    const statuses = {
      create: t('pages.dashboard.activity.status.created'),
      update: t('pages.dashboard.activity.status.updated'),
      delete: t('pages.dashboard.activity.status.deleted'),
    };
    return statuses[action as keyof typeof statuses] || '';
  };

  const processActivityLogs = (): ActivityItem[] => {
    return logs.value.map(log => ({
      id: `log-${log.id}`,
      type: log.entityType as ActivityItem['type'],
      entityName: log.entityName,
      entityInitials: log.entityName.substring(0, 2).toUpperCase(),
      entityType: log.entityType === 'business' ? 'Business' : 'Entrepreneur',
      description: getLogDescription(log.action, log.entityType),
      date: new Date(log.timestamp),
      status: getLogStatus(log.action),
      link: getLogLink(log),
      meta: log.details,
    }));
  };

  return { processActivityLogs };
}

/**
 * Creates activities for businesses
 * @param businesses
 * @param logs
 * @returns
 */
export function useBusinessActivities(businesses: Ref<Business[]>, logs: Ref<ActivityLog[]>) {
  const { t } = useI18n();

  const hasCreateLog = (businessId: string) => {
    return logs.value.some(
      l => l.entityType === 'business' && l.entityId === businessId && l.action === 'create'
    );
  };

  const getBusinessDate = (business: Business) => {
    return business.registrationDate
      ? new Date(business.registrationDate)
      : business.activityStartDate
        ? new Date(business.activityStartDate)
        : null;
  };

  const processNewBusinesses = (): ActivityItem[] => {
    return businesses.value
      .filter(b => b.id && !hasCreateLog(b.id))
      .map(b => {
        const date = getBusinessDate(b);
        if (!date) return null;

        return {
          id: `new-biz-${b.id}`,
          type: 'business' as const,
          entityName: b.name,
          entityInitials: b.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.newBusinessRegistered'),
          date: date,
          status: t('pages.dashboard.activity.status.registered'),
          link: `/businesses/${b.id}`,
          meta: b.primaryBusinessArea,
        };
      })
      .filter(item => item !== null) as ActivityItem[];
  };

  return { processNewBusinesses };
}

/**
 * Creates activities for supports
 * @param businesses
 * @param supports
 * @returns
 */
export function useSupportActivities(businesses: Ref<Business[]>, supports: Ref<Support[]>) {
  const { t } = useI18n();

  const findBusiness = (businessId: string) => {
    return businesses.value.find(b => b.id === businessId);
  };

  const processSupports = (): ActivityItem[] => {
    return supports.value
      .map(s => {
        const business = findBusiness(s.businessId);
        if (!business) return null;

        return {
          id: `support-${s.id}`,
          type: 'support' as const,
          entityName: business.name,
          entityInitials: business.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.support', { type: s.boostType }),
          date: new Date(s.startDate),
          status: t('pages.dashboard.activity.status.completed'),
          link: `/businesses/${business.id}?tab=supports`,
          meta: s.dimension,
        };
      })
      .filter(item => item !== null) as ActivityItem[];
  };

  return { processSupports };
}

/**
 * Creates activities for quick wins
 * @param businesses
 * @param quickWins
 * @returns
 */
export function useQuickWinActivities(businesses: Ref<Business[]>, quickWins: Ref<QuickWin[]>) {
  const { t } = useI18n();

  const findBusiness = (businessId: string) => {
    return businesses.value.find(b => b.id === businessId);
  };

  const processQuickWins = (): ActivityItem[] => {
    return quickWins.value
      .map(qw => {
        const business = findBusiness(qw.businessId);
        if (!business) return null;

        return {
          id: `qw-${qw.id}`,
          type: 'quick_win' as const,
          entityName: business.name,
          entityInitials: business.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.quickWin', { title: qw.title }),
          date: new Date(qw.achievedOn),
          status: t('pages.dashboard.activity.status.achieved'),
          link: `/businesses/${business.id}?tab=quick-wins`,
          meta: qw.dimension,
        };
      })
      .filter(item => item !== null) as ActivityItem[];
  };

  return { processQuickWins };
}

/**
 * Creates activities for metrics
 * @param businesses
 * @param metrics
 * @returns
 */
export function useMetricActivities(businesses: Ref<Business[]>, metrics: Ref<MomentumMetric[]>) {
  const { t } = useI18n();

  const findBusiness = (businessId: string) => {
    return businesses.value.find(b => b.id === businessId);
  };

  const getMostRecentReadingDate = (metric: MomentumMetric): Date | null => {
    let lastDate = new Date(0);

    metric.indicators?.forEach(i => {
      i.readings?.forEach(r => {
        const d = new Date(r.asOf);
        if (d > lastDate) lastDate = d;
      });
    });

    return lastDate.getTime() > 0 ? lastDate : null;
  };

  const processMetrics = (): ActivityItem[] => {
    return metrics.value
      .map(m => {
        const business = findBusiness(m.businessId);
        if (!business || !m.indicators) return null;

        const lastDate = getMostRecentReadingDate(m);
        if (!lastDate) return null;

        return {
          id: `metric-${m.momentumMetricId}`,
          type: 'metric' as const,
          entityName: business.name,
          entityInitials: business.name.substring(0, 2).toUpperCase(),
          entityType: 'Business',
          description: t('pages.dashboard.activity.performanceReported', { title: m.title }),
          date: lastDate,
          status: t('pages.dashboard.activity.status.reported'),
          link: `/businesses/${business.id}?tab=outcomes`,
          meta: m.dimension,
        };
      })
      .filter(item => item !== null) as ActivityItem[];
  };

  return { processMetrics };
}

/**
 * Creates alerts for businesses that have incomplete profiles or missing entrepreneurs
 * @param businesses
 * @returns
 */
export function useBusinessAlerts(businesses: Ref<Business[]>) {
  const SECONDS_PER_MINUTE = 60;
  const MINUTES_PER_HOUR = 60;
  const HOURS_PER_DAY = 24;

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) /
        (1000 * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)
    );
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  /**
   * Creates an alert for a business that has an incomplete profile
   * @param business
   * @returns
   */
  const createIncompleteProfileAlert = (business: Business): AlertItem => ({
    id: `alert-profile-${business.id}`,
    type: 'warning',
    title: 'Incomplete Profile',
    message: 'Business profile needs completion',
    entityName: business.name,
    entityInitials: business.name.substring(0, 2).toUpperCase(),
    time: business.registrationDate
      ? formatRelativeTime(new Date(business.registrationDate))
      : 'Unknown',
    link: `/businesses/${business.id}/edit`,
    actionLabel: 'Complete',
  });

  /**
   * Creates an alert for a business that is missing an entrepreneur
   * @param business
   * @returns
   */
  const createMissingEntrepreneurAlert = (business: Business): AlertItem => ({
    id: `alert-no-ent-${business.id}`,
    type: 'danger',
    title: 'Missing Entrepreneur',
    message: 'No entrepreneur linked to business',
    entityName: business.name,
    entityInitials: business.name.substring(0, 2).toUpperCase(),
    time: 'Urgent',
    link: `/businesses/${business.id}/edit`,
    actionLabel: 'Link',
  });

  const alerts = computed<AlertItem[]>(() => {
    const list: AlertItem[] = [];

    businesses.value.forEach(b => {
      if (!b.profileCompleted) {
        list.push(createIncompleteProfileAlert(b));
      }
      if (!b.entrepreneurId) {
        list.push(createMissingEntrepreneurAlert(b));
      }
    });

    return list;
  });

  return { alerts };
}

/**
 *  function useActivityFeed
 * @param businesses
 * @param entrepreneurs
 * @param supports
 * @param quickWins
 * @param metrics
 * @param logs
 * @returns
 */
export function useActivityFeed(
  businesses: Ref<Business[]>,
  entrepreneurs: Ref<Entrepreneur[]>,
  supports: Ref<Support[]>,
  quickWins: Ref<QuickWin[]>,
  metrics: Ref<MomentumMetric[]>,
  logs: Ref<ActivityLog[]>
) {
  const MAX_ACTIVITY_ITEMS = 20;

  const { processActivityLogs } = useActivityLogs(logs);
  const { processNewBusinesses } = useBusinessActivities(businesses, logs);
  const { processSupports } = useSupportActivities(businesses, supports);
  const { processQuickWins } = useQuickWinActivities(businesses, quickWins);
  const { processMetrics } = useMetricActivities(businesses, metrics);
  const { alerts } = useBusinessAlerts(businesses);

  const activities = computed<ActivityItem[]>(() => {
    const items: ActivityItem[] = [
      ...processActivityLogs(),
      ...processNewBusinesses(),
      ...processSupports(),
      ...processQuickWins(),
      ...processMetrics(),
    ];

    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, MAX_ACTIVITY_ITEMS);
  });

  return {
    activities,
    alerts,
  };
}
