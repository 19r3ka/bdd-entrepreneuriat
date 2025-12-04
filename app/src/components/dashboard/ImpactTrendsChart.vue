<script setup lang="ts">
  import { ref } from 'vue'
  import Chart from 'primevue/chart'
  import Card from 'primevue/card'

  const props = defineProps<{
    chartData: any
  }>()

  const chartOptions = ref({
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: '#64748b'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b'
        },
        grid: {
          color: '#e2e8f0'
        }
      },
      y: {
        ticks: {
          color: '#64748b'
        },
        grid: {
          color: '#e2e8f0'
        }
      }
    }
  })
</script>

<template>
  <Card class="h-full">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-2">
        <h3 class="text-lg font-bold m-0">Impact Trends (6 Months)</h3>
        <i class="pi pi-chart-line text-500"></i>
      </div>
    </template>
    <template #content>
      <div class="w-full relative" style="height: 300px">
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
      </div>
    </template>
  </Card>
</template>
