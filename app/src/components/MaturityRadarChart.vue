<script setup lang="ts">
import { computed } from 'vue'
import MaturityRadar from './monitoring-evaluation/MaturityRadar.vue'
import type { MaturityScore } from '@/types/maturity'

const props = defineProps<{
  scores: MaturityScore[]
}>()

const labels = computed(() => props.scores.map(s => s.label))
const datasets = computed(() => [{
  label: 'Current Maturity',
  data: props.scores.map(s => s.score),
  backgroundColor: 'rgba(54, 162, 235, 0.2)',
  borderColor: 'rgba(54, 162, 235, 1)',
  pointBackgroundColor: 'rgba(54, 162, 235, 1)',
  pointBorderColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
}])
</script>

<template>
  <MaturityRadar :labels="labels" :datasets="datasets" />
</template>
