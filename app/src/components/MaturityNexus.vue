<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import MaturityRadarChart from './MaturityRadarChart.vue';
import ProgressBar from 'primevue/progressbar';
import type { MaturityScore, Milestone } from '@/types/maturity';

const props = defineProps<{
  scores: MaturityScore[];
  milestones: Record<string, Milestone[]>;
}>();

/**
 * Helper to calculate progress per axis for the accordion header
 * @param axis The axis to calculate progress for
 * @returns An object containing the count, total, and percentage of completed milestones
 */
const getProgress = (axis: string) => {
  const list = props.milestones[axis] || [];
  const completed = list.filter(m => m.isCompleted).length;
  return { count: completed, total: list.length, percentage: (completed / list.length) * 100 };
};
</script>

<template>
  <div
    class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark h-full"
  >
    <h2 class="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">Maturity Nexus</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div class="flex flex-col items-center justify-center">
        <div class="w-full max-w-sm aspect-square">
          <MaturityRadarChart :scores="scores" />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <Accordion value="0" class="maturity-accordion">
          <AccordionPanel
            v-for="(score, index) in scores"
            :key="score.axis"
            :value="index.toString()"
          >
            <AccordionHeader>
              <div class="w-full pr-4">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm font-medium text-text-light dark:text-text-dark capitalize">
                    {{ score.label.toLowerCase() }}
                  </p>
                  <span class="text-xs text-text-medium-light dark:text-text-medium-dark">
                    {{ getProgress(score.axis).count }}/{{ getProgress(score.axis).total }}
                    Milestones
                  </span>
                </div>
                <ProgressBar
                  :value="getProgress(score.axis).percentage"
                  :show-value="false"
                  class="!h-1.5 !bg-primary/20"
                  :pt="{ value: { class: '!bg-primary' } }"
                />
              </div>
            </AccordionHeader>

            <AccordionContent>
              <ul class="list-none p-0 m-0 flex flex-col gap-2">
                <li v-for="m in milestones[score.axis]" :key="m.id" class="flex items-center gap-2">
                  <span
                    class="material-symbols-outlined !text-sm"
                    :class="m.isCompleted ? 'text-success' : 'text-gray-300'"
                  >
                    {{ m.isCompleted ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                  <span class="text-sm text-text-medium-light">{{ m.label }}</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-accordionheader-toggle) {
  background: transparent !important;
  border: none !important;
  padding: 1rem 0 !important;
  box-shadow: none !important;
}
:deep(.p-accordioncontent-content) {
  background: transparent !important;
  border: none !important;
  padding: 0 0 1rem 0 !important;
}

:deep(.p-accordionpanel) {
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--background-light);
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 0.75rem;
}

:deep(.dark .p-accordionpanel) {
  border-color: var(--border-dark);
  background: var(--background-dark);
}
</style>
