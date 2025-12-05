<script setup lang="ts">
  import { computed } from 'vue'
  import KPIMetricCard from './KPIMetricCard.vue'

  interface Props {
    businesses: any[]
    supports: any[]
    quickWins: any[]
    metrics: any[]
  }

  const props = defineProps<Props>()

  // Calculate KPIs
  const totalBusinesses = computed(() => props.businesses.length)
  const totalSupports = computed(() => props.supports.length)
  const totalQuickWins = computed(() => props.quickWins.length)

  // Mock trend data (will be replaced with real calculations)
  const businessTrend = computed(() => {
    // TODO: Calculate actual trend from activity logs
    return Math.floor(Math.random() * 15) + 5 // Placeholder
  })

  const supportTrend = computed(() => {
    return Math.floor(Math.random() * 25) + 10
  })

  const quickWinTrend = computed(() => {
    return Math.floor(Math.random() * 12) + 3
  })

  // Calculate maturity score (average across all businesses)
  const portfolioHealth = computed(() => {
    if (props.businesses.length === 0) return 0

    const totalMaturity = props.businesses.reduce((sum, business) => {
      if (!business.maturityLevels) return sum
      const levels = Object.values(business.maturityLevels) as number[]
      const avg = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0
      return sum + avg
    }, 0)

    return Math.round((totalMaturity / props.businesses.length) * 100) / 100
  })

  const healthPercentage = computed(() => {
    return Math.round(portfolioHealth.value * 20) // Convert 0-5 scale to 0-100%
  })

  const healthSeverity = computed(() => {
    const pct = healthPercentage.value
    if (pct >= 70) return 'success'
    if (pct >= 50) return 'info'
    if (pct >= 30) return 'warning'
    return 'danger'
  })
</script>

<template>
  <div class="grid">
    <!-- Portfolio Health Score -->
    <div class="col-12">
      <KPIMetricCard
        :label="$t('pages.dashboard.executiveSummary.portfolioHealthScore')"
        :value="`${healthPercentage}%`"
        :change="5"
        :changeLabel="$t('pages.dashboard.executiveSummary.vsLastQuarter')"
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
        :changeLabel="$t('pages.dashboard.executiveSummary.thisMonth')"
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
        :changeLabel="$t('pages.dashboard.executiveSummary.thisMonth')"
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
        :changeLabel="$t('pages.dashboard.executiveSummary.thisMonth')"
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
        :changeLabel="$t('pages.dashboard.executiveSummary.thisMonth')"
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
