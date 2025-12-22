<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore';
import { useQuickWinStore } from '@/stores/useQuickWinStore';
import { useSupportStore } from '@/stores/useSupportStore';
import { useActivityLogStore } from '@/stores/useActivityLogStore';
import { useRouter } from 'vue-router';
import MaturityPortfolioView from '@/components/dashboard/MaturityPortfolioView.vue';
import ActivityAlertsWidget from '@/components/dashboard/ActivityAlertsWidget.vue';
import RegionalDistributionWithList from '@/components/dashboard/RegionalDistributionWithList.vue';
import ExecutiveSummaryBar from '@/components/dashboard/ExecutiveSummaryBar.vue';
import SupportPipelineFunnel from '@/components/dashboard/SupportPipelineFunnel.vue';
import ImpactTrendsChart from '@/components/dashboard/ImpactTrendsChart.vue';
import ActionListWidget from '@/components/dashboard/ActionListWidget.vue';
import PartialRecordsWidget from '@/components/dashboard/PartialRecordsWidget.vue';
import { usePortfolioMetrics } from '@/composables/usePortfolioMetrics';
import { usePortfolioActions, type ActionItem } from '@/composables/usePortfolioActions';
import DataExportControl from '@/components/import-export/DataExportControl.vue';

const router = useRouter();
const businessStore = useBusinessStore();
const entrepreneurStore = useEntrepreneurStore();
const metricStore = useMomentumMetricStore();
const quickWinStore = useQuickWinStore();
const supportStore = useSupportStore();
const activityLogStore = useActivityLogStore();

const { businesses } = storeToRefs(businessStore);
const { entrepreneurs } = storeToRefs(entrepreneurStore);
const { metrics } = storeToRefs(metricStore);
const { quickWins } = storeToRefs(quickWinStore);
const { supports } = storeToRefs(supportStore);
const { logs } = storeToRefs(activityLogStore);

// Import/export functionality
const showExportDialog = ref(false);

// Use the new composable for metrics
const { pipelineStages, impactTrends } = usePortfolioMetrics(
  () => businesses.value,
  () => supports.value,
  () => quickWins.value,
  () => metrics.value
);

// Use the new composable for actions
const { urgentActions, opportunities } = usePortfolioActions(
  () => businesses.value,
  () => supports.value,
  () => quickWins.value
);

const handleActionClick = (action: ActionItem) => {
  if (action.entityType === 'business' && action.entityId) {
    router.push({
      path: `/businesses/${action.entityId}`,
      query: {
        actionId: action.id,
        actionType: action.type,
        actionTitle: action.title, // Optional: for displaying the specific advice title
      },
    });
  }
  // Add other handlers as needed
};

onMounted(async () => {
  await Promise.all([
    businessStore.fetchAll(),
    // entrepreneurStore.fetchAll(), // Handled by businessStore.fetchAll()
    metricStore.fetchAll(),
    quickWinStore.fetchAll(),
    supportStore.fetchAll(),
    activityLogStore.fetchAll(),
  ]);
});
</script>

<template>
  <div class="layout-dashboard p-4">
    <!-- Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-4 mb-6">
      <div class="flex flex-column gap-1">
        <h1 class="text-900 dark:text-white text-4xl font-black m-0">
          {{ $t('pages.dashboard.portfolioOverview') }}
        </h1>
        <p class="text-500 dark:text-400 text-base font-normal m-0">Maritime, Togo</p>
      </div>
    </div>

    <!-- Export Dialog -->
    <DataExportControl
      v-model:visible="showExportDialog"
      :data="businesses"
      default-file-name="portfolio_export"
    />

    <!-- Executive Summary -->
    <div class="mb-6">
      <ExecutiveSummaryBar
        :businesses="businesses"
        :supports="supports"
        :quick-wins="quickWins"
        :metrics="metrics"
      />
    </div>

    <!-- Partial Records Alert -->
    <div class="mb-6">
      <PartialRecordsWidget />
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
          :title="$t('pages.dashboard.urgentActions')"
          icon="pi-exclamation-triangle"
          color="red"
          :actions="urgentActions"
          :empty-title="$t('pages.dashboard.allCaughtUp')"
          :empty-message="$t('pages.dashboard.noUrgentActions')"
          empty-icon="pi-check-circle"
          @action-click="handleActionClick"
        />
      </div>
      <div class="col-12 lg:col-6 h-full">
        <ActionListWidget
          :title="$t('pages.dashboard.opportunities')"
          icon="pi-sparkles"
          color="blue"
          :actions="opportunities"
          :empty-title="$t('pages.dashboard.noNewOpportunities')"
          :empty-message="$t('pages.dashboard.checkBackLater')"
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
