<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';
import type { SectorData } from '@/types/portfolio';

const props = defineProps<{
  sectors: SectorData[];
}>();

// Chart.js Data Structure
const chartData = computed(() => ({
  labels: props.sectors.map(s => s.label),
  datasets: [
    {
      data: props.sectors.map(s => s.value),
      backgroundColor: props.sectors.map(s => s.color),
      borderWidth: 0,
    },
  ],
}));

const chartOptions = {
  cutout: '60%',
  plugins: { legend: { display: false } }, // We build a custom legend
};

// Find top sector for the center text
const topSector = computed(() => {
  return [...props.sectors].sort((a, b) => b.value - a.value)[0];
});
</script>

<template>
  <div
    class="surface-card border-round-xl border-1 border-200 dark:border-700 shadow-1 h-full flex flex-column"
  >
    <div class="p-4 border-bottom-1 border-200 dark:border-700">
      <h2 class="text-xl font-bold m-0 text-900 dark:text-0">Sector Breakdown</h2>
    </div>

    <div
      class="flex-grow-1 flex align-items-center justify-content-center p-4 relative min-h-[250px]"
    >
      <div
        class="absolute top-0 left-0 w-full h-full flex flex-column align-items-center justify-content-center pointer-events-none"
      >
        <span class="text-500 text-sm">Top Sector</span>
        <span class="text-xl font-bold text-900">{{ topSector?.label || 'N/A' }}</span>
      </div>

      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-16rem" />
    </div>

    <div class="p-4 pt-0">
      <div class="grid text-sm">
        <div
          v-for="sector in sectors"
          :key="sector.label"
          class="col-6 flex align-items-center gap-2"
        >
          <span
            class="w-1rem h-1rem border-round-circle"
            :style="{ backgroundColor: sector.color }"
          ></span>
          <span class="text-700">{{ sector.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
