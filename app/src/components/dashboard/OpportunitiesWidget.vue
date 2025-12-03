<script setup lang="ts">
import Card from 'primevue/card';
import ActionItemComponent from './ActionItem.vue';
import type { ActionItem } from '@/composables/usePortfolioActions';

defineProps<{
  actions: ActionItem[];
}>();

const emit = defineEmits<{
  (e: 'action-click', action: ActionItem): void;
}>();
</script>

<template>
  <Card class="h-full border-top-3 border-blue-500">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-2">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-sparkles text-blue-500 text-xl"></i>
          <h3 class="text-lg font-bold m-0">Opportunities</h3>
        </div>
        <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 border-round-xl">
          {{ actions.length }}
        </span>
      </div>
    </template>
    <template #content>
      <div v-if="actions.length > 0" class="flex flex-column">
        <ActionItemComponent 
          v-for="action in actions" 
          :key="action.id" 
          :action="action"
          @click="emit('action-click', action)"
        />
      </div>
      <div v-else class="flex flex-column align-items-center justify-content-center py-6 text-center">
        <i class="pi pi-info-circle text-4xl text-blue-300 mb-3"></i>
        <p class="text-700 font-medium m-0">No new opportunities</p>
        <p class="text-500 text-sm mt-1">Check back later for recommendations.</p>
      </div>
    </template>
  </Card>
</template>
