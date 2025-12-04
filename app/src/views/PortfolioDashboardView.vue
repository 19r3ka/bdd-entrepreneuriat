<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { useActivityLogStore } from '@/stores/useActivityLogStore'
  import { useRouter } from 'vue-router'

  import PortfolioHealthSummary from '@/components/dashboard/PortfolioHealthSummary.vue'
  import MaturityPortfolioView from '@/components/dashboard/MaturityPortfolioView.vue'
  import AggregatedKPICards from '@/components/dashboard/AggregatedKPICards.vue'
  import ActivityAlertsWidget from '@/components/dashboard/ActivityAlertsWidget.vue'
  import RegionalDistributionWithList from '@/components/dashboard/RegionalDistributionWithList.vue'
  import ExecutiveSummaryBar from '@/components/dashboard/ExecutiveSummaryBar.vue'
  import SupportPipelineFunnel from '@/components/dashboard/SupportPipelineFunnel.vue'
  import ImpactTrendsChart from '@/components/dashboard/ImpactTrendsChart.vue'
  import ActionListWidget from '@/components/dashboard/ActionListWidget.vue'
  import { usePortfolioMetrics } from '@/composables/usePortfolioMetrics'
  import { usePortfolioActions, type ActionItem } from '@/composables/usePortfolioActions'

  import Button from 'primevue/button'

  const router = useRouter()
  const businessStore = useBusinessStore()
  const entrepreneurStore = useEntrepreneurStore()
  const metricStore = useMomentumMetricStore()
  const quickWinStore = useQuickWinStore()
  const supportStore = useSupportStore()
  const activityLogStore = useActivityLogStore()

  const { businesses } = storeToRefs(businessStore)
  const { entrepreneurs } = storeToRefs(entrepreneurStore)
  const { metrics } = storeToRefs(metricStore)
  const { quickWins } = storeToRefs(quickWinStore)
  const { supports } = storeToRefs(supportStore)
  const { logs } = storeToRefs(activityLogStore)

  // Use the new composable for metrics
  const { pipelineStages, impactTrends } = usePortfolioMetrics(
    () => businesses.value,
    () => supports.value,
    () => quickWins.value,
    () => metrics.value
  )

  // Use the new composable for actions
  const { urgentActions, opportunities } = usePortfolioActions(
    () => businesses.value,
    () => supports.value,
    () => quickWins.value
  )

  const handleActionClick = (action: ActionItem) => {
    if (action.entityType === 'business' && action.entityId) {
      router.push({
        path: `/businesses/${action.entityId}`,
        query: {
          actionId: action.id,
          actionType: action.type,
          actionTitle: action.title // Optional: for displaying the specific advice title
        }
      })
    }
    // Add other handlers as needed
  }

  const exportCSV = () => {
    const headers = [
      'Name',
      'Registration Number',
      'Primary Sector',
      'Registration Date',
      'Support Start Date',
      'Status'
    ]
    const rows = businesses.value.map((b) => [
      b.name,
      b.registrationNumber || '',
      b.primaryBusinessArea || '',
      b.registrationDate ? new Date(b.registrationDate).toLocaleDateString() : '',
      b.supportStartDate ? new Date(b.supportStartDate).toLocaleDateString() : '',
      'Active' // Placeholder
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  onMounted(async () => {
    await Promise.all([
      businessStore.fetchAll(),
      // entrepreneurStore.fetchAll(), // Handled by businessStore.fetchAll()
      metricStore.fetchAll(),
      quickWinStore.fetchAll(),
      supportStore.fetchAll(),
      activityLogStore.fetchAll()
    ])
  })
</script>

<template>
  <div class="layout-dashboard p-4">
    <!-- Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 mb-6">
      <div class="flex flex-column gap-1">
        <h1 class="text-900 dark:text-white text-4xl font-black m-0">Portfolio Overview</h1>
        <p class="text-500 dark:text-400 text-base font-normal m-0">Maritime, Togo</p>
      </div>
      <div>
        <Button
          label="Export Data"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportCSV"
        />
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="mb-6">
      <ExecutiveSummaryBar
        :businesses="businesses"
        :supports="supports"
        :quick-wins="quickWins"
        :metrics="metrics"
      />
    </div>

    <!-- Regional Distribution (Map & List) -->
    <div class="mb-6">
      <RegionalDistributionWithList :businesses="businesses" />
    </div>

    <!-- Maturity Matrix Portfolio View -->
    <div class="mb-6">
      <MaturityPortfolioView :businesses="businesses" />
    </div>

    <!-- Phase 2: Support Pipeline & Impact Trends -->
    <div class="grid mb-6">
      <div class="col-12 lg:col-4 h-full">
        <SupportPipelineFunnel :stages="pipelineStages" />
      </div>
      <div class="col-12 lg:col-8 h-full">
        <ImpactTrendsChart :chart-data="impactTrends" />
      </div>
    </div>

    <!-- Phase 3: Action Center -->
    <div class="grid mb-6">
      <div class="col-12 lg:col-6 h-full">
        <ActionListWidget
          title="Urgent Actions"
          icon="pi-exclamation-triangle"
          color="red"
          :actions="urgentActions"
          empty-title="All caught up!"
          empty-message="No urgent actions required."
          empty-icon="pi-check-circle"
          @action-click="handleActionClick"
        />
      </div>
      <div class="col-12 lg:col-6 h-full">
        <ActionListWidget
          title="Opportunities"
          icon="pi-sparkles"
          color="blue"
          :actions="opportunities"
          empty-title="No new opportunities"
          empty-message="Check back later for recommendations."
          empty-icon="pi-info-circle"
          @action-click="handleActionClick"
        />
      </div>
    </div>

    <!-- 4. Activity Log -->
    <div class="grid">
      <div class="col-12 h-full">
        <ActivityAlertsWidget
          :businesses="businesses"
          :entrepreneurs="entrepreneurs"
          :supports="supports"
          :quick-wins="quickWins"
          :metrics="metrics"
          :logs="logs"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Add any specific layout styles if PrimeFlex isn't enough */
  .layout-dashboard {
    padding-bottom: 2rem;
  }
</style>
