<script setup lang="ts">
  import { computed } from 'vue'
  import Card from 'primevue/card'

  interface KPIMetric {
    label: string
    value: number | string
    change?: number
    changeLabel?: string
    trend?: 'up' | 'down' | 'neutral'
    icon?: string
    severity?: 'success' | 'warning' | 'danger' | 'info'
    tooltip?: string
  }

  const props = defineProps<{
    label: string
    value: number | string
    change?: number
    changeLabel?: string
    trend?: 'up' | 'down' | 'neutral'
    icon?: string
    severity?: 'success' | 'warning' | 'danger' | 'info'
    tooltip?: string
  }>()

  const trendIcon = computed(() => {
    if (!props.trend) return ''
    return props.trend === 'up'
      ? 'pi pi-arrow-up'
      : props.trend === 'down'
        ? 'pi pi-arrow-down'
        : 'pi pi-minus'
  })

  const trendColor = computed(() => {
    if (!props.trend) return 'text-500'
    return props.trend === 'up'
      ? 'text-green-500'
      : props.trend === 'down'
        ? 'text-red-500'
        : 'text-500'
  })

  const severityColor = computed(() => {
    if (!props.severity) return 'primary'
    const colorMap: Record<string, string> = {
      success: 'green',
      warning: 'orange',
      danger: 'red',
      info: 'blue'
    }
    return colorMap[props.severity] || 'primary'
  })
</script>

<template>
  <Card class="kpi-card h-full">
    <template #content>
      <div class="flex flex-column gap-2">
        <!-- Icon & Label -->
        <div class="flex align-items-center gap-3">
          <div
            v-if="icon"
            :class="`flex align-items-center justify-content-center border-circle bg-${severityColor}-50 dark:bg-${severityColor}-900/20`"
            style="width: 48px; height: 48px; min-width: 48px"
          >
            <i :class="`${icon} text-xl text-${severityColor}-600`"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-600 dark:text-400 text-sm font-medium">{{ label }}</span>
            <span v-if="tooltip" class="text-500 cursor-help ml-1" v-tooltip.top="tooltip">
              <i class="pi pi-info-circle text-xs"></i>
            </span>
          </div>
        </div>

        <!-- Value -->
        <div class="flex align-items-end justify-content-between">
          <span class="text-900 dark:text-white text-4xl font-bold">{{ value }}</span>

          <!-- Trend Indicator -->
          <div v-if="change !== undefined" class="flex align-items-center gap-1">
            <i :class="`${trendIcon} text-sm ${trendColor}`"></i>
            <span :class="`text-sm font-semibold ${trendColor}`">
              {{ change > 0 ? '+' : '' }}{{ change }}
            </span>
          </div>
        </div>

        <!-- Change Label -->
        <span v-if="changeLabel" class="text-500 dark:text-400 text-xs">
          {{ changeLabel }}
        </span>
      </div>
    </template>
  </Card>
</template>

<style scoped>
  .kpi-card {
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
  }

  .kpi-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
</style>
