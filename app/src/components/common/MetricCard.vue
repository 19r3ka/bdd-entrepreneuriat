<script setup lang="ts">
  import { computed } from 'vue'
  import Card from 'primevue/card'

  // Unified Interface
  export interface MetricData {
    label: string
    value: string | number
    // Context A: Portfolio Style
    icon?: string // Material symbol name
    iconColorClass?: string // e.g. 'text-primary'
    // Context B: Report/Entity Style
    sdgTag?: string // e.g. 'SDG 8'
    // Bottom Section
    subtext?: string // Plain text description
    trend?: {
      value: string // e.g. '+12%'
      direction: 'UP' | 'DOWN'
    }
  }

  const props = defineProps<{
    data: MetricData
    // Optional: Allow overriding size for Hero vs Grid usage
    size?: 'normal' | 'large'
  }>()

  const isPositive = computed(() => props.data.trend?.direction === 'UP')
  const textSize = computed(() => (props.size === 'large' ? 'text-4xl' : 'text-2xl'))
</script>

<template>
  <Card class="h-full shadow-sm border-1 border-200 dark:border-700 shadow-none">
    <template #content>
      <div class="flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center relative min-h-[24px]">
          <span class="text-500 dark:text-400 font-medium text-sm uppercase tracking-wider">
            {{ data.label }}
          </span>

          <span
            v-if="data.icon"
            class="material-symbols-outlined text-2xl"
            :class="data.iconColorClass"
          >
            {{ data.icon }}
          </span>

          <span
            v-else-if="data.sdgTag"
            class="bg-primary-50 text-primary-700 px-2 py-1 border-round-2xl text-xs font-medium"
          >
            {{ data.sdgTag }}
          </span>
        </div>

        <div>
          <div class="text-900 dark:text-0 font-bold mb-2" :class="textSize">
            {{ data.value }}
          </div>

          <div
            v-if="data.trend"
            class="flex align-items-center gap-1 text-sm font-medium"
            :class="isPositive ? 'text-green-500' : 'text-red-500'"
          >
            <span class="material-symbols-outlined text-base">
              {{ isPositive ? 'trending_up' : 'trending_down' }}
            </span>
            <span>{{ data.trend.value }}</span>
          </div>

          <div
            v-else-if="data.subtext"
            class="text-500 dark:text-400 text-sm"
            :class="{
              'text-orange-500 font-semibold': data.subtext.toLowerCase().includes('attention')
            }"
          >
            {{ data.subtext }}
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
  :deep(.p-card-content) {
    padding: 0;
  }
</style>
