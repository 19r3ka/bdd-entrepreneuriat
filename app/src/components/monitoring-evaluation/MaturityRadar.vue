<template>
  <div class="maturity-radar">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
  import { defineProps, computed } from 'vue'
  import { Radar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler
  } from 'chart.js'

  /**
   * MaturityRadar Component
   *
   * A component that displays a radar chart for maturity assessments using vue-chartjs.
   */
  ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler)

  /**
   * Props for the MaturityRadar component.
   * @property {string[]} labels - The labels for the axes of the radar chart.
   * @property {Array<{label: string, data: number[], ...}>} datasets - The datasets to display on the radar chart.
   */
  const props = defineProps<{
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
      pointBackgroundColor?: string
      pointBorderColor?: string
      pointHoverBackgroundColor?: string
      pointHoverBorderColor?: string
    }>
  }>()

  const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 'rgba(54, 162, 235, 0.2)',
      borderColor: dataset.borderColor || 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: dataset.pointBackgroundColor || 'rgba(54, 162, 235, 1)',
      pointBorderColor: dataset.pointBorderColor || '#fff',
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || '#fff',
      pointHoverBorderColor: dataset.pointHoverBorderColor || 'rgba(54, 162, 235, 1)'
    }))
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Maturity Assessment'
      }
    }
  }
</script>

<style scoped>
  .maturity-radar {
    position: relative;
    height: 40vh;
  }
</style>
