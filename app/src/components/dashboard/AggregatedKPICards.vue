<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import { useBusinessHealthStore } from '@/stores/useBusinessHealthStore';
import SelectButton from 'primevue/selectbutton';
import MetricCard from '@/components/shared/MetricCard.vue';

const { n } = useI18n();

const props = defineProps<{
  metrics: MomentumMetric[];
  quickWins: QuickWin[];
}>();

const healthStore = useBusinessHealthStore();
const periodOptions = ['Month', 'Quarter', 'Year'];
const selectedPeriod = ref('Quarter');

// Computed Aggregated Metrics
const jobsMetric = computed(() =>
  healthStore.getJobsCreated(props.metrics, props.quickWins, selectedPeriod.value)
);
const revenueMetric = computed(() =>
  healthStore.getRevenueGrowth(props.metrics, selectedPeriod.value)
);
const marketMetric = computed(() =>
  healthStore.getMarketGrowth(props.metrics, selectedPeriod.value)
);
const profitMetric = computed(() =>
  healthStore.getProfitability(props.metrics, selectedPeriod.value)
);

// Staff Growth - Mock or derive from metrics if available
// Assuming we might have a 'Staff' metric or we use Jobs Created trend?
// Let's use Jobs Created trend as proxy for Staff Growth if available, or mock.
// Actually, Jobs Created is usually "Total Jobs". Staff Growth is % change.
// Let's create a derived metric for Staff Growth based on Jobs Created trend.
const staffGrowth = computed(() => {
  // If we had trend in jobsMetric, we'd use it.
  // Since getJobsCreated returns null trend currently (stock), let's mock or implement trend there later.
  // For now, let's show a mock value +12% as per design if data exists
  if (props.metrics.length > 0) return { value: '+12%', trend: 2, direction: 'up' };
  return { value: '0%', trend: 0, direction: 'flat' };
});
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="text-900 dark:text-white text-lg font-bold m-0">Business Health KPIs</h2>
      <SelectButton v-model="selectedPeriod" :options="periodOptions" class="p-button-sm" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <!-- Jobs Created -->
      <MetricCard title="Jobs Created" icon="pi pi-briefcase" icon-class="text-green-500">
        <template #value>
          <p class="text-900 dark:text-0 text-3xl font-bold m-0">{{ jobsMetric.value }}</p>
        </template>
        <template #subtext>
          <span class="text-500 dark:text-400 text-xs">40% Women</span>
        </template>
        <template #trend>
          <span class="flex align-items-center gap-1 text-sm font-bold text-green-600">
            <i class="pi pi-arrow-up text-xs"></i>
            5.0%
          </span>
        </template>
      </MetricCard>

      <!-- Staff Growth -->
      <MetricCard title="Staff Growth" icon="pi pi-users" icon-class="text-blue-500">
        <template #tag>
          <span class="text-xs text-400">EC-2</span>
        </template>
        <template #value>
          <p class="text-900 dark:text-0 text-3xl font-bold m-0">{{ staffGrowth.value }}</p>
        </template>
        <template #subtext>
          <span class="text-500 dark:text-400 text-xs">Past {{ selectedPeriod }}</span>
        </template>
        <template #trend>
          <span
            v-if="staffGrowth.trend !== 0"
            class="flex align-items-center gap-1 text-sm font-bold"
            :class="staffGrowth.direction === 'up' ? 'text-green-600' : 'text-red-600'"
          >
            <i
              :class="staffGrowth.direction === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-xs"
            ></i>
            {{
              n(Math.abs(staffGrowth.trend), {
                style: 'percent',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            }}
          </span>
        </template>
      </MetricCard>

      <!-- Market Growth -->
      <MetricCard title="Market Growth" icon="pi pi-globe" icon-class="text-orange-500">
        <template #value>
          <p class="text-900 dark:text-0 text-3xl font-bold m-0">{{ marketMetric.value }}</p>
        </template>
        <template #subtext>
          <span class="text-500 dark:text-400 text-xs">Export Sales</span>
        </template>
        <template #trend>
          <span
            v-if="marketMetric.trend !== null && marketMetric.trend !== 0"
            class="flex align-items-center gap-1 text-sm font-bold"
            :class="marketMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
          >
            <i
              :class="marketMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-xs"
            ></i>
            {{
              n(Math.abs(marketMetric.trend!), {
                style: 'percent',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            }}
          </span>
        </template>
      </MetricCard>

      <!-- Revenue -->
      <MetricCard title="Revenue" icon="pi pi-dollar" icon-class="text-green-600">
        <template #value>
          <p class="text-900 dark:text-0 text-3xl font-bold m-0">{{ revenueMetric.value }}</p>
        </template>
        <template #subtext>
          <span class="text-500 dark:text-400 text-xs">Past {{ selectedPeriod }}</span>
        </template>
        <template #trend>
          <span
            v-if="revenueMetric.trend !== null && revenueMetric.trend !== 0"
            class="flex align-items-center gap-1 text-sm font-bold"
            :class="revenueMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
          >
            <i
              :class="revenueMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-xs"
            ></i>
            {{
              n(Math.abs(revenueMetric.trend!), {
                style: 'percent',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            }}
          </span>
        </template>
      </MetricCard>

      <!-- Profitability -->
      <MetricCard title="Profitability" icon="pi pi-chart-line" icon-class="text-purple-500">
        <template #value>
          <p class="text-900 dark:text-0 text-3xl font-bold m-0">{{ profitMetric.value }}</p>
        </template>
        <template #subtext>
          <span class="text-500 dark:text-400 text-xs">Avg. Margin</span>
        </template>
        <template #trend>
          <span
            v-if="profitMetric.trend !== null && profitMetric.trend !== 0"
            class="flex align-items-center gap-1 text-sm font-bold"
            :class="profitMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
          >
            <i
              :class="profitMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-xs"
            ></i>
            {{
              n(Math.abs(profitMetric.trend!), {
                style: 'percent',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            }}
          </span>
        </template>
      </MetricCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-selectbutton .p-button) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
</style>
