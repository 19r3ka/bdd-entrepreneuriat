<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import {
    MaturityDimensions,
    type MaturityDimension,
    type MilestoneDefinition
  } from '@/constants/maturityCatalog'
  import { useMaturityCalculations } from '@/composables/useMaturityCalculations'
  import Card from 'primevue/card'
  import Accordion from 'primevue/accordion'
  import AccordionPanel from 'primevue/accordionpanel'
  import AccordionHeader from 'primevue/accordionheader'
  import AccordionContent from 'primevue/accordioncontent'
  import ProgressBar from 'primevue/progressbar'
  import MaturityRadarChart from '@/components/shared/MaturityRadarChart.vue'

  const props = defineProps<{
    levels: Record<MaturityDimension, number>
    nextMilestones: { dimension: MaturityDimension; milestone: MilestoneDefinition }[]
    dimensionStats: Record<string, { hasSupport: boolean; hasOutcome: boolean }>
  }>()

  // Use shared composable for maturity calculations
  const { avgMaturityLevels } = useMaturityCalculations(toRef(props, 'levels'))

  const filteredMilestones = computed(() => {
    // Show ALL dimensions, even if at max level
    return MaturityDimensions.map((dim) => {
      const existing = props.nextMilestones.find((m) => m.dimension === dim)
      if (existing) {
        return existing
      }
      // If no next milestone (at max level), show completion message
      return {
        dimension: dim,
        milestone: {
          level: 4,
          name: 'Max Level Achieved',
          description: 'This dimension has reached maximum maturity.',
          requiredIndicators: [],
          suggestedSupport: 'Maintain current practices'
        }
      }
    })
  })

  const getProgress = (currentLevel: number) => {
    return (currentLevel / 4) * 100
  }
</script>

<template>
  <Card class="maturity-nexus h-full p-0">
    <template #title>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-chart-line text-primary"></i>
        <span class="font-semibold">Maturity Nexus</span>
      </div>
    </template>
    <template #content class="p-0">
      <div class="grid grid-nogutter">
        <!-- Radar Chart - Using Shared Component -->
        <div class="col-12 lg:col-6 flex justify-content-center align-items-center p-4">
          <MaturityRadarChart :averages="avgMaturityLevels" />
        </div>

        <!-- Dimension Accordions -->
        <div class="col-12 lg:col-6 p-0">
          <div
            v-if="filteredMilestones.length === 0"
            class="flex flex-column align-items-center justify-content-center h-full text-center p-4 text-500"
          >
            <i class="pi pi-check-circle text-4xl mb-2 text-green-500"></i>
            <p>All milestones achieved!</p>
          </div>
          <Accordion v-else value="0">
            <AccordionPanel
              v-for="item in filteredMilestones"
              :key="item.dimension"
              :value="item.dimension"
              class=""
            >
              <AccordionHeader class="p-2">
                <div class="w-full">
                  <div class="flex justify-content-between align-items-center mb-1">
                    <span class="font-medium text-sm">{{ item.dimension }}</span>
                    <span class="text-xs text-color-secondary pr-2"
                      >{{ levels[item.dimension] }}/4</span
                    >
                  </div>
                  <ProgressBar
                    :value="getProgress(levels[item.dimension])"
                    :showValue="false"
                    style="height: 4px"
                    class="mr-2"
                  />
                </div>
              </AccordionHeader>
              <AccordionContent>
                <div>
                  <p class="text-sm font-semibold m-0 mb-1">Next: {{ item.milestone.name }}</p>
                  <p class="text-color-secondary text-xs m-0 mb-1 line-clamp-2">
                    {{ item.milestone.description }}
                  </p>
                  <div class="text-xs text-primary font-medium">
                    <i class="pi pi-lightbulb mr-1"></i>
                    Support: {{ item.milestone.suggestedSupport }}
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
  .maturity-nexus {
    height: 100%;
  }
</style>
