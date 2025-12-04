<template>
  <div class="momentum-metric-list">
    <div v-if="metrics.length === 0" class="text-center p-5 text-600">
      <i class="pi pi-chart-line text-4xl mb-3 block text-400"></i>
      <p class="m-0">
        {{ emptyMessage || $t('momentumMetric.noMetrics', 'No outcome metrics recorded yet.') }}
      </p>
    </div>

    <div v-else class="grid">
      <div
        v-for="metric in metrics"
        :key="metric.momentumMetricId"
        class="col-12 md:col-6 lg:col-4"
      >
        <MomentumMetricCard :metric="metric" @edit="$emit('edit', metric)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MomentumMetricCard from './MomentumMetricCard.vue'
  import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'

  defineProps<{
    metrics: MomentumMetric[]
    emptyMessage?: string
  }>()

  defineEmits<{
    (e: 'edit', metric: MomentumMetric): void
  }>()
</script>
