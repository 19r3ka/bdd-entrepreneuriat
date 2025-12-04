<script setup lang="ts">
  import { computed } from 'vue'
  import { MaturityDimensions, type MaturityDimension } from '@/constants/maturityCatalog'

  const props = defineProps<{
    levels: Record<MaturityDimension, number>
  }>()

  // Chart configuration
  const size = 300
  const center = size / 2
  const radius = 100 // Radius for the max value (4)
  const maxLevel = 4

  // Helper to calculate points
  const getPoint = (index: number, value: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2 // Start from top
    const r = (value / maxLevel) * radius
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    return `${x},${y}`
  }

  // Generate polygon points for the current levels
  const currentPolygonPoints = computed(() => {
    return MaturityDimensions.map((dim, index) => {
      return getPoint(index, props.levels[dim], MaturityDimensions.length)
    }).join(' ')
  })

  // Generate polygon points for the baseline (optional, maybe level 1 or 0?)
  // For now, let's just show a background grid
  const getGridPolygon = (level: number) => {
    return MaturityDimensions.map((_, index) => {
      return getPoint(index, level, MaturityDimensions.length)
    }).join(' ')
  }

  // Labels positions
  const labels = computed(() => {
    return MaturityDimensions.map((dim, index) => {
      // Push labels out a bit further than the max radius
      const angle = (Math.PI * 2 * index) / MaturityDimensions.length - Math.PI / 2
      const r = radius + 25
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return { text: dim, x, y }
    })
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full max-w-sm">
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-auto"
      >
        <!-- Background Grid (Levels 1-4) -->
        <polygon
          v-for="i in 4"
          :key="i"
          :points="getGridPolygon(i)"
          fill="none"
          stroke="var(--surface-border)"
          stroke-width="1"
          stroke-dasharray="4"
        />

        <!-- Axes lines -->
        <line
          v-for="(dim, index) in MaturityDimensions"
          :key="dim"
          :x1="center"
          :y1="center"
          :x2="getPoint(index, maxLevel, MaturityDimensions.length).split(',')[0]"
          :y2="getPoint(index, maxLevel, MaturityDimensions.length).split(',')[1]"
          stroke="var(--surface-border)"
          stroke-width="1"
        />

        <!-- Current Value Polygon -->
        <polygon
          :points="currentPolygonPoints"
          fill="var(--primary-200)"
          fill-opacity="0.4"
          stroke="var(--primary-color)"
          stroke-width="2"
        />

        <!-- Data Points -->
        <circle
          v-for="(dim, index) in MaturityDimensions"
          :key="`point-${dim}`"
          :cx="getPoint(index, props.levels[dim], MaturityDimensions.length).split(',')[0]"
          :cy="getPoint(index, props.levels[dim], MaturityDimensions.length).split(',')[1]"
          r="4"
          fill="var(--primary-color)"
        />

        <!-- Labels -->
        <text
          v-for="label in labels"
          :key="label.text"
          :x="label.x"
          :y="label.y"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-xs font-medium fill-current text-color-secondary"
          style="font-size: 10px"
        >
          {{ label.text }}
        </text>
      </svg>
    </div>
  </div>
</template>
