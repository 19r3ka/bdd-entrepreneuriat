<template>
  <div class="quick-win-timeline">
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-medium m-0">
        {{ title || $t('quickWin.timeline', 'Quick Wins Timeline') }}
      </h3>
      <Button
        :label="$t('quickWin.add', 'Add Quick Win')"
        icon="pi pi-plus"
        size="small"
        @click="$emit('add')"
      />
    </div>

    <Timeline :value="formattedQuickWins" align="alternate" class="customized-timeline">
      <template #marker>
        <span
          class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
          style="background-color: #00bcd4"
        >
          <i class="pi pi-check-circle"></i>
        </span>
      </template>
      <template #content="slotProps">
        <ActivityCard
          :activity="slotProps.item"
          @view="$emit('view', slotProps.item.data.id)"
          @edit="$emit('edit', slotProps.item.data.id)"
        />
      </template>
    </Timeline>

    <div v-if="quickWins.length === 0" class="text-center p-4 text-500">
      {{ $t('quickWin.noQuickWins', 'No quick wins recorded yet.') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Timeline from 'primevue/timeline';
import Button from 'primevue/button';
import ActivityCard from './ActivityCard.vue';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

const props = defineProps<{
  quickWins: QuickWin[];
  title?: string;
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
}>();

const formattedQuickWins = computed(() => {
  return [...props.quickWins]
    .sort((a, b) => new Date(b.achievedOn).getTime() - new Date(a.achievedOn).getTime())
    .map(q => ({ type: 'quickWin' as const, data: q, date: q.achievedOn }));
});
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-opposite) {
  flex: 0;
  padding: 0;
}
.customized-timeline :deep(.p-timeline-event-content) {
  width: 100%;
}
</style>
