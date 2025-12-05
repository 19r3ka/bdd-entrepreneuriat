<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
  import Tag from 'primevue/tag'
  import SelectButton from 'primevue/selectbutton'
  import Chart from 'primevue/chart'
  import { useBusinessHealthStore } from '@/stores/useBusinessHealthStore'
  import { useRouter } from 'vue-router'
  import MetricCard from '@/components/shared/MetricCard.vue'

  const { d, n } = useI18n()

  const props = withDefaults(
    defineProps<{
      metrics?: MomentumMetric[]
      quickWins?: QuickWin[]
    }>(),
    {
      metrics: () => [],
      quickWins: () => []
    }
  )

  const router = useRouter()
  const healthStore = useBusinessHealthStore()

  // State for filters
  const periodOptions = ['Month', 'Quarter', 'Year']
  const selectedPeriod = ref('Quarter')

  const disaggOptions = [
    { label: 'Total', value: 'total' },
    { label: 'Women', value: 'women' },
    { label: 'Youth', value: 'youth' },
    { label: 'Disability', value: 'disability' }
  ]
  const selectedDisagg = ref('total')

  // Computed Metrics from Store
  // Computed Metrics from Store
  const jobsMetric = computed(() =>
    healthStore.getJobsCreated(props.metrics, props.quickWins, selectedPeriod.value)
  )
  const revenueMetric = computed(() =>
    healthStore.getRevenueGrowth(props.metrics, selectedPeriod.value)
  )
  const marketMetric = computed(() =>
    healthStore.getMarketGrowth(props.metrics, selectedPeriod.value)
  )
  const profitMetric = computed(() =>
    healthStore.getProfitability(props.metrics, selectedPeriod.value)
  )

  // Helper to get display value based on disaggregation
  const periodLabel = computed(() => {
    const now = new Date()
    if (selectedPeriod.value === 'Month') {
      return d(now, { month: 'long', year: 'numeric' })
    } else if (selectedPeriod.value === 'Quarter') {
      const quarter = Math.floor((now.getMonth() + 3) / 3)
      return `Q${quarter} ${now.getFullYear()}`
    } else {
      return now.getFullYear().toString()
    }
  })

  // Helper to get display value based on disaggregation
  const displayJobsValue = computed(() => {
    if (selectedDisagg.value === 'total') return jobsMetric.value.value
    const val =
      jobsMetric.value.disaggregation?.[
        selectedDisagg.value as keyof typeof jobsMetric.value.disaggregation
      ] || 0
    return val.toString()
  })

  // Sparkline Chart Options
  const sparklineOptions = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } },
    maintainAspectRatio: false,
    responsive: true
  }

  const getSparklineData = (data: number[], color: string) => ({
    labels: data.map((_, i) => i),
    datasets: [
      {
        data: data,
        borderColor: color,
        fill: false
      }
    ]
  })

  const openMomentumForm = () => {
    // Emit event or use router to open form
    // Since this component is inside a view, we might need to emit up
    // But for now, let's assume we can navigate or the parent handles it via the header button
    // We'll just show a "No Data" state that encourages using the main action button
  }
</script>

<template>
  <div class="flex flex-column gap-3">
    <!-- Controls -->
    <div class="flex justify-content-between align-items-center">
      <div class="flex align-items-center gap-3">
        <h3 class="m-0 text-lg font-semibold text-color">Business Health</h3>
        <span class="text-sm text-500 bg-surface-100 px-2 py-1 border-round">{{
          periodLabel
        }}</span>
      </div>
      <SelectButton v-model="selectedPeriod" :options="periodOptions" class="p-button-sm" />
    </div>

    <div class="grid">
      <!-- Jobs Created Card -->
      <div class="col-12 sm:col-6 xl:col-3">
        <MetricCard title="Jobs Created" icon="pi pi-users" icon-class="text-purple-500">
          <template #tag>
            <Tag
              v-if="jobsMetric.irrfCode"
              :value="jobsMetric.irrfCode"
              severity="info"
              class="text-xs"
            />
          </template>

          <template #value>
            <div v-if="jobsMetric.hasData" class="flex flex-column gap-3">
              <div class="text-4xl font-bold text-color">{{ displayJobsValue }}</div>

              <!-- Disaggregation Toggle -->
              <div class="flex gap-1">
                <button
                  v-for="opt in disaggOptions"
                  :key="opt.value"
                  @click="selectedDisagg = opt.value"
                  class="p-1 text-xs border-round cursor-pointer transition-colors border-none"
                  :class="
                    selectedDisagg === opt.value
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'bg-transparent text-500 hover:bg-surface-100'
                  "
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div
              v-else
              class="flex flex-column align-items-center justify-content-center py-4 text-center text-500 text-sm"
            >
              No data recorded
            </div>
          </template>
        </MetricCard>
      </div>

      <!-- Revenue Growth Card -->
      <div class="col-12 sm:col-6 xl:col-3">
        <MetricCard title="Revenue" icon="pi pi-dollar" icon-class="text-green-500">
          <template #tag>
            <Tag
              v-if="revenueMetric.irrfCode"
              :value="revenueMetric.irrfCode"
              severity="info"
              class="text-xs"
            />
          </template>

          <template #value>
            <div v-if="revenueMetric.hasData">
              <div class="text-3xl font-bold text-color">{{ revenueMetric.value }}</div>
            </div>
            <div
              v-else
              class="flex flex-column align-items-center justify-content-center py-4 text-center text-500 text-sm"
            >
              No revenue data
            </div>
          </template>

          <template #trend>
            <div
              v-if="revenueMetric.hasData && revenueMetric.trend !== null"
              class="flex align-items-center gap-1 text-sm font-bold"
              :class="revenueMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              <i
                :class="
                  revenueMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                "
              ></i>
              <span>{{ n(Math.abs(revenueMetric.trend), { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
            </div>
          </template>

          <template #chart>
            <div
              v-if="revenueMetric.hasData && revenueMetric.sparklineData.length > 1"
              class="h-3rem"
            >
              <Chart
                type="line"
                :data="getSparklineData(revenueMetric.sparklineData, '#10b981')"
                :options="sparklineOptions"
                class="h-full w-full"
              />
            </div>
          </template>
        </MetricCard>
      </div>

      <!-- Market Growth Card -->
      <div class="col-12 sm:col-6 xl:col-3">
        <MetricCard title="Market Growth" icon="pi pi-globe" icon-class="text-orange-500">
          <template #tag>
            <Tag
              v-if="marketMetric.irrfCode"
              :value="marketMetric.irrfCode"
              severity="info"
              class="text-xs"
            />
          </template>

          <template #value>
            <div v-if="marketMetric.hasData">
              <div class="text-3xl font-bold text-color">{{ marketMetric.value }}</div>
            </div>
            <div
              v-else
              class="flex flex-column align-items-center justify-content-center py-4 text-center text-500 text-sm"
            >
              No market data
            </div>
          </template>

          <template #trend>
            <div
              v-if="marketMetric.hasData && marketMetric.trend !== null"
              class="flex align-items-center gap-1 text-sm font-bold"
              :class="marketMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              <i
                :class="
                  marketMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                "
              ></i>
              <span>{{ n(Math.abs(marketMetric.trend), { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
            </div>
          </template>

          <template #chart>
            <div
              v-if="marketMetric.hasData && marketMetric.sparklineData.length > 1"
              class="h-3rem"
            >
              <Chart
                type="line"
                :data="getSparklineData(marketMetric.sparklineData, '#f97316')"
                :options="sparklineOptions"
                class="h-full w-full"
              />
            </div>
          </template>
        </MetricCard>
      </div>

      <!-- Profitability Card -->
      <div class="col-12 sm:col-6 xl:col-3">
        <MetricCard title="Profitability" icon="pi pi-percentage" icon-class="text-blue-500">
          <template #tag>
            <Tag
              v-if="profitMetric.irrfCode"
              :value="profitMetric.irrfCode"
              severity="info"
              class="text-xs"
            />
          </template>

          <template #value>
            <div v-if="profitMetric.hasData">
              <div class="text-3xl font-bold text-color">{{ profitMetric.value }}</div>
            </div>
            <div
              v-else
              class="flex flex-column align-items-center justify-content-center py-4 text-center text-500 text-sm"
            >
              No financial data
            </div>
          </template>

          <template #trend>
            <div
              v-if="profitMetric.hasData && profitMetric.trend !== null"
              class="flex align-items-center gap-1 text-sm font-bold"
              :class="profitMetric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              <i
                :class="
                  profitMetric.trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                "
              ></i>
              <span>{{ n(Math.abs(profitMetric.trend), { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}</span>
            </div>
          </template>

          <template #chart>
            <div
              v-if="profitMetric.hasData && profitMetric.sparklineData.length > 1"
              class="h-3rem"
            >
              <Chart
                type="line"
                :data="getSparklineData(profitMetric.sparklineData, '#3b82f6')"
                :options="sparklineOptions"
                class="h-full w-full"
              />
            </div>
          </template>
        </MetricCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(.p-selectbutton .p-button) {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
</style>
