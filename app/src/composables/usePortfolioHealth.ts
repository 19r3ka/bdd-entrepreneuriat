import { computed, ref, toValue, type MaybeRef } from 'vue';
import type { Business } from '@/schemas/business';
import type { MomentumMetric } from '@/schemas/monitoring-evaluation/MomentumMetric';
import type { QuickWin } from '@/schemas/monitoring-evaluation/QuickWin';
import { useBusinessHealthStore } from '@/stores/useBusinessHealthStore';
import {
  calculateActiveBusinesses,
  calculateProfilePoints,
  calculateProfileCompleteness,
  calculateFinanceUnlocked,
  calculateAvgMaturityScore,
} from '@/utils/portfolioCalculations';

/**
 *
 */
export function usePortfolioHealth(
  businessesRef: MaybeRef<Business[]>,
  metricsRef: MaybeRef<MomentumMetric[]>,
  quickWinsRef: MaybeRef<QuickWin[]>
) {
  const healthStore = useBusinessHealthStore();
  const PROFILE_COMPLETENESS_FIELDS_COUNT = 7;

  // State for jobs disaggregation filter
  const selectedJobsDisagg = ref<'total' | 'women' | 'youth' | 'disability'>('total');

  // 1. Totals
  const totalBusinesses = computed(() => toValue(businessesRef).length);
  const activeBusinesses = computed(() =>
    calculateActiveBusinesses(toValue(businessesRef), toValue(quickWinsRef), toValue(metricsRef))
  );
  const inactiveBusinesses = computed(() => totalBusinesses.value - activeBusinesses.value);

  // 2. Profile Completeness
  const profileCompleteness = computed(() =>
    calculateProfileCompleteness(toValue(businessesRef), PROFILE_COMPLETENESS_FIELDS_COUNT)
  );

  const needsAttentionCount = computed(() => {
    const businesses = toValue(businessesRef);
    return businesses.filter(b => calculateProfilePoints(b) < PROFILE_COMPLETENESS_FIELDS_COUNT)
      .length;
  });

  // 3. Jobs Metric
  const jobsMetric = computed(() =>
    healthStore.getJobsCreated(toValue(metricsRef), toValue(quickWinsRef), 'Year')
  );

  const displayedJobsValue = computed(() => {
    if (selectedJobsDisagg.value === 'total') return jobsMetric.value.value;
    const disagg = jobsMetric.value.disaggregation?.[selectedJobsDisagg.value];
    return disagg?.toString() || '0';
  });

  // 4. Finance & Maturity
  const financeUnlocked = computed(() =>
    calculateFinanceUnlocked(toValue(quickWinsRef), toValue(metricsRef))
  );
  const avgMaturityScore = computed(() => calculateAvgMaturityScore(toValue(quickWinsRef)));

  return {
    selectedJobsDisagg,
    totalBusinesses,
    activeBusinesses,
    inactiveBusinesses,
    profileCompleteness,
    needsAttentionCount,
    jobsMetric,
    displayedJobsValue,
    financeUnlocked,
    avgMaturityScore,
  };
}
