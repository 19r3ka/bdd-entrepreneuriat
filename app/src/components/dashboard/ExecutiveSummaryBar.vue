<script setup lang="ts">
import { computed } from 'vue';
import KPIMetricCard from './KPIMetricCard.vue';
import type { Business } from '@/types/business';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';

// Constants for trend calculations
const BUSINESS_TREND_MAX_VARIANCE = 15;
const BUSINESS_TREND_MIN_VALUE = 5;
const SUPPORT_TREND_MAX_VARIANCE = 25;
const SUPPORT_TREND_MIN_VALUE = 10;
const QUICK_WIN_TREND_MAX_VARIANCE = 12;
const QUICK_WIN_TREND_MIN_VALUE = 3;
const MATURITY_TO_PERCENTAGE_FACTOR = 20; // Convert 0-5 scale to 0-100%
const HEALTH_SEVERITY_SUCCESS_THRESHOLD = 70;
const HEALTH_SEVERITY_INFO_THRESHOLD = 50;
const HEALTH_SEVERITY_WARNING_THRESHOLD = 30;

interface Props {
  businesses: Business[];
  supports: Support[];
  quickWins: QuickWin[];
  metrics: MomentumMetric[];
}

const props = defineProps<Props>();

// Calculate KPIs
const totalBusinesses = computed(() => props.businesses.length);
const totalSupports = computed(() => props.supports.length);
const totalQuickWins = computed(() => props.quickWins.length);

// Mock trend data (will be replaced with real calculations)
const businessTrend = computed(() => {
  // TODO: Calculate actual trend from activity logs
  return Math.floor(Math.random() * BUSINESS_TREND_MAX_VARIANCE) + BUSINESS_TREND_MIN_VALUE; // Placeholder
});

const supportTrend = computed(() => {
  return Math.floor(Math.random() * SUPPORT_TREND_MAX_VARIANCE) + SUPPORT_TREND_MIN_VALUE;
});

const quickWinTrend = computed(() => {
  return Math.floor(Math.random() * QUICK_WIN_TREND_MAX_VARIANCE) + QUICK_WIN_TREND_MIN_VALUE;
});

// Calculate maturity score (average across all businesses)
const portfolioHealth = computed(() => {
  if (props.businesses.length === 0) return 0;

  const totalMaturity = props.businesses.reduce((sum, business) => {
    if (!business.maturityLevels) return sum;
    const levels = Object.values(business.maturityLevels) as number[];
    const avg = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
    return sum + avg;
  }, 0);

  return Math.round((totalMaturity / props.businesses.length) * 100) / 100;
});

const healthPercentage = computed(() => {
  return Math.round(portfolioHealth.value * MATURITY_TO_PERCENTAGE_FACTOR); // Convert 0-5 scale to 0-100%
});

const healthSeverity = computed(() => {
  const pct = healthPercentage.value;
  if (pct >= HEALTH_SEVERITY_SUCCESS_THRESHOLD) return 'success';
  if (pct >= HEALTH_SEVERITY_INFO_THRESHOLD) return 'info';
  if (pct >= HEALTH_SEVERITY_WARNING_THRESHOLD) return 'warning';
  return 'danger';
});
</script>

<template>
  <div class="grid">
    <!-- Portfolio Health Score -->
    <div class="col-12">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.portfolioHealthScore')"
        :value="`${healthPercentage}%`"
        :change="5"
        :change-label="$t('pages.dashboard.executiveSummary.vsLastQuarter')"
        trend="up"
        icon="pi pi-heart-fill"
        :severity="healthSeverity"
        :tooltip="$t('pages.dashboard.executiveSummary.tooltips.health')"
      />
    </div>

    <!-- Key Metrics Row -->
    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.totalBusinesses')"
        :value="totalBusinesses"
        :change="businessTrend"
        :change-label="$t('pages.dashboard.executiveSummary.thisMonth')"
        trend="up"
        icon="pi pi-building"
        severity="success"
        :tooltip="$t('pages.dashboard.executiveSummary.tooltips.businesses')"
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.supportInterventions')"
        :value="totalSupports"
        :change="supportTrend"
        :change-label="$t('pages.dashboard.executiveSummary.thisMonth')"
        trend="up"
        icon="pi pi-heart"
        severity="info"
        :tooltip="$t('pages.dashboard.executiveSummary.tooltips.supports')"
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.quickWins')"
        :value="totalQuickWins"
        :change="quickWinTrend"
        :change-label="$t('pages.dashboard.executiveSummary.thisMonth')"
        trend="up"
        icon="pi pi-check-circle"
        severity="warning"
        :tooltip="$t('pages.dashboard.executiveSummary.tooltips.quickWins')"
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.activeOutcomes')"
        :value="metrics.length"
        :change="8"
        :change-label="$t('pages.dashboard.executiveSummary.thisMonth')"
        trend="up"
        icon="pi pi-chart-line"
        severity="success"
        :tooltip="$t('pages.dashboard.executiveSummary.tooltips.outcomes')"
      />
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
