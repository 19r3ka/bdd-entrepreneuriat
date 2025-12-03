<script setup lang="ts">
import { computed } from 'vue';
import KPIMetricCard from './KPIMetricCard.vue';

interface Props {
  businesses: any[];
  supports: any[];
  quickWins: any[];
  metrics: any[];
}

const props = defineProps<Props>();

// Calculate KPIs
const totalBusinesses = computed(() => props.businesses.length);
const totalSupports = computed(() => props.supports.length);
const totalQuickWins = computed(() => props.quickWins.length);

// Mock trend data (will be replaced with real calculations)
const businessTrend = computed(() => {
  // TODO: Calculate actual trend from activity logs
  return Math.floor(Math.random() * 15) + 5; // Placeholder
});

const supportTrend = computed(() => {
  return Math.floor(Math.random() * 25) + 10;
});

const quickWinTrend = computed(() => {
  return Math.floor(Math.random() * 12) + 3;
});

// Calculate maturity score (average across all businesses)
const portfolioHealth = computed(() => {
  if (props.businesses.length === 0) return 0;
  
  const totalMaturity = props.businesses.reduce((sum, business) => {
    if (!business.maturityLevels) return sum;
    const levels = Object.values(business.maturityLevels) as number[];
    const avg = levels.length > 0 
      ? levels.reduce((a, b) => a + b, 0) / levels.length 
      : 0;
    return sum + avg;
  }, 0);
  
  return Math.round((totalMaturity / props.businesses.length) * 100) / 100;
});

const healthPercentage = computed(() => {
  return Math.round(portfolioHealth.value * 20); // Convert 0-5 scale to 0-100%
});

const healthSeverity = computed(() => {
  const pct = healthPercentage.value;
  if (pct >= 70) return 'success';
  if (pct >= 50) return 'info';
  if (pct >= 30) return 'warning';
  return 'danger';
});
</script>

<template>
  <div class="grid">
    <!-- Portfolio Health Score -->
    <div class="col-12">
      <KPIMetricCard
        label="Portfolio Health Score"
        :value="`${healthPercentage}%`"
        :change="5"
        changeLabel="vs last quarter"
        trend="up"
        icon="pi pi-heart-fill"
        :severity="healthSeverity"
        tooltip="Overall health based on average business maturity scores across the portfolio."
      />
    </div>

    <!-- Key Metrics Row -->
    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        label="Total Businesses"
        :value="totalBusinesses"
        :change="businessTrend"
        changeLabel="this month"
        trend="up"
        icon="pi pi-building"
        severity="success"
        tooltip="Total number of active businesses in the portfolio."
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        label="Support Interventions"
        :value="totalSupports"
        :change="supportTrend"
        changeLabel="this month"
        trend="up"
        icon="pi pi-heart"
        severity="info"
        tooltip="Total number of support boosts provided to businesses."
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        label="Quick Wins"
        :value="totalQuickWins"
        :change="quickWinTrend"
        changeLabel="this month"
        trend="up"
        icon="pi pi-check-circle"
        severity="warning"
        tooltip="Number of quick wins achieved and documented."
      />
    </div>

    <div class="col-12 md:col-6 lg:col-3">
      <KPIMetricCard
        label="Active Outcomes"
        :value="metrics.length"
        :change="8"
        changeLabel="this month"
        trend="up"
        icon="pi pi-chart-line"
        severity="success"
        tooltip="Number of active outcome indicators being tracked."
      />
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
