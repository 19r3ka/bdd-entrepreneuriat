<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';

interface Stage {
  label: string;
  count: number;
  color: string;
}

const MIN_BAR_WIDTH_PERCENT = 5;

const props = defineProps<{
  stages: Stage[];
}>();

const maxCount = computed(() => {
  return Math.max(...props.stages.map(s => s.count), 1); // Avoid div by zero
});

const getWidth = (count: number) => {
  return `${Math.max((count / maxCount.value) * 100, MIN_BAR_WIDTH_PERCENT)}%`;
};
</script>

<template>
  <Card class="h-full">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-2">
        <h3 class="text-lg font-bold m-0">{{ $t('pages.dashboard.pipeline.title') }}</h3>
        <i class="pi pi-filter text-500"></i>
      </div>
    </template>
    <template #content>
      <div class="flex flex-column gap-4 mt-2">
        <div v-for="(stage, index) in stages" :key="stage.label" class="pipeline-stage">
          <div class="flex justify-content-between mb-1">
            <span class="text-sm font-medium text-700 dark:text-300">{{ stage.label }}</span>
            <span class="text-sm font-bold text-900 dark:text-white">{{ stage.count }}</span>
          </div>

          <div
            class="w-full bg-surface-100 dark:bg-surface-800 border-round overflow-hidden"
            style="height: 8px"
          >
            <div
              class="h-full border-round transition-all duration-500 ease-out"
              :style="{ width: getWidth(stage.count), backgroundColor: stage.color }"
            ></div>
          </div>

          <!-- Conversion Rate (skip for first item) -->
          <div v-if="index > 0" class="text-xs text-500 mt-1 text-right">
            {{
              $t('pages.dashboard.pipeline.conversion', {
                rate: Math.round((stage.count / stages[index - 1]!.count) * 100) || 0,
              })
            }}
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.pipeline-stage {
  position: relative;
}
</style>
