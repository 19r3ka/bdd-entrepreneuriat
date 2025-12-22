<template>
  <div class="momentum-metric-card surface-card p-3 border-round shadow-1 h-full flex flex-column">
    <!-- Header -->
    <div class="flex justify-content-between align-items-start mb-2">
      <div>
        <div class="text-sm text-500 mb-1 uppercase font-semibold">
          {{ $t(`momentumMetric.categories.${metric.category}`, metric.category) }}
        </div>
        <div class="font-bold text-xl text-900">{{ metric.title }}</div>
      </div>
      <Tag
        v-if="metric.genderMarker"
        :value="metric.genderMarker"
        :severity="getGenderSeverity(metric.genderMarker)"
      />
    </div>

    <!-- Indicators & Sparklines -->
    <div class="flex-1">
      <div v-for="(indicator, index) in metric.indicators" :key="index" class="mb-3 last:mb-0">
        <div class="flex justify-content-between align-items-baseline mb-1">
          <span class="text-600 font-medium text-sm">{{ indicator.name }}</span>
          <span class="text-900 font-bold">{{
            formatValue(getLatestReading(indicator), indicator.unit)
          }}</span>
        </div>

        <!-- Sparkline -->
        <div
          v-if="indicator.readings && indicator.readings.length > 1"
          class="h-2rem w-full bg-surface-50 border-round overflow-hidden relative"
        >
          <svg class="w-full h-full" preserveAspectRatio="none">
            <polyline
              :points="getSparklinePoints(indicator.readings)"
              fill="none"
              stroke="var(--primary-color)"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div
          v-else-if="indicator.readings && indicator.readings.length === 1"
          class="text-xs text-500 mt-1"
        >
          {{ $t('momentumMetric.baseline', 'Baseline') }}:
          {{ formatValue(indicator.baseline, indicator.unit) }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-3 pt-3 border-top-1 border-200 flex justify-content-between align-items-center">
      <span class="text-xs text-500">{{ formatDate(metric.updatedAt || metric.createdAt) }}</span>
      <Button icon="pi pi-pencil" text rounded size="small" @click="$emit('edit', metric)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';

const { d } = useI18n();

defineProps<{
  metric: MomentumMetric;
}>();

defineEmits<{
  (e: 'edit', metric: MomentumMetric): void;
}>();

const getGenderSeverity = (marker?: string) => {
  switch (marker) {
    case 'GEN3':
      return 'success';
    case 'GEN2':
      return 'info';
    case 'GEN1':
      return 'warning';
    case 'GEN0':
      return 'danger';
    default:
      return 'secondary';
  }
};

const getLatestReading = (indicator: MomentumMetric['indicators'][number]) => {
  if (!indicator.readings || indicator.readings.length === 0) return null;
  // Sort by date descending
  const sorted = [...indicator.readings].sort(
    (a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime()
  );
  return sorted[0] ? sorted[0].value : null;
};

const formatValue = (value: number | boolean | string | null | undefined, unit?: string) => {
  if (value === null || value === undefined) return '-';

  if (unit === 'percent') return `${value}%`;
  if (unit === 'currency') return `${value}`; // Currency symbol handling could be added
  if (unit === 'boolean') return value ? 'Yes' : 'No';
  return value;
};

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '';
  return d(new Date(dateStr), 'long');
};

const getSparklinePoints = (
  readings: NonNullable<MomentumMetric['indicators'][number]['readings']>
) => {
  if (!readings || readings.length < 2) return '';

  // Sort by date ascending
  const sorted = [...readings].sort(
    (a, b) => new Date(a.asOf).getTime() - new Date(b.asOf).getTime()
  );

  const values = sorted.map(r => Number(r.value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid division by zero

  return values
    .map((val, index) => {
      const x = (index / (values.length - 1)) * 100;
      // Invert Y because SVG coords start from top
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');
};
</script>

<style scoped>
.momentum-metric-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.momentum-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-4);
}
</style>
