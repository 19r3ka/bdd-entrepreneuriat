import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Business } from '@/schemas/business';
import type { Support } from '@/schemas/monitoring-evaluation/Support';
import type { QuickWin } from '@/schemas/monitoring-evaluation/QuickWin';
import type { MomentumMetric } from '@/schemas/monitoring-evaluation/MomentumMetric';
import {
  countBusinessesWithAssessment,
  countBusinessesWithSupport,
  countBusinessesWithQuickWins,
  countGraduatedBusinesses,
  calculateImpactTrendsData,
} from '@/utils/portfolioCalculations';

/**
 * Hook for calculating portfolio-level metrics
 */
export function usePortfolioMetrics(
  businesses: () => Business[],
  supports: () => Support[],
  quickWins: () => QuickWin[],
  _metrics: () => MomentumMetric[]
) {
  const { t } = useI18n();
  const GRADUATION_THRESHOLD = 3.5;

  const pipelineStages = computed(() => [
    {
      label: t('pages.dashboard.pipeline.stages.totalPortfolio'),
      count: businesses().length,
      color: '#3B82F6',
    },
    {
      label: t('pages.dashboard.pipeline.stages.assessed'),
      count: countBusinessesWithAssessment(businesses()),
      color: '#8B5CF6',
    },
    {
      label: t('pages.dashboard.pipeline.stages.activeSupport'),
      count: countBusinessesWithSupport(businesses(), supports()),
      color: '#F59E0B',
    },
    {
      label: t('pages.dashboard.pipeline.stages.quickWins'),
      count: countBusinessesWithQuickWins(businesses(), quickWins()),
      color: '#10B981',
    },
    {
      label: t('pages.dashboard.pipeline.stages.graduated'),
      count: countGraduatedBusinesses(businesses(), GRADUATION_THRESHOLD),
      color: '#059669',
    },
  ]);

  const impactTrends = computed(() => {
    const { labels, jobsData, revenueData } = calculateImpactTrendsData(_metrics());

    return {
      labels,
      datasets: [
        {
          label: t('pages.dashboard.impactTrends.jobsCreated'),
          data: jobsData,
          borderColor: '#3B82F6',
          tension: 0.4,
        },
        {
          label: t('pages.dashboard.impactTrends.revenueGrowth'),
          data: revenueData,
          borderColor: '#10B981',
          tension: 0.4,
        },
      ],
    };
  });

  return {
    pipelineStages,
    impactTrends,
  };
}
