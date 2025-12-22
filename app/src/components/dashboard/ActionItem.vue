<script setup lang="ts">
import type { ActionItem } from '@/composables/usePortfolioActions';

defineProps<{
  action: ActionItem;
}>();

defineEmits<{
  (e: 'click', action: ActionItem): void;
}>();
</script>

<template>
  <div
    class="flex align-items-start gap-3 p-3 border-round-lg mb-2 transition-colors cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800"
    :class="{
      'border-left-3 border-red-500': action.type === 'urgent',
      'border-left-3 border-blue-500': action.type === 'opportunity',
    }"
    @click="$emit('click', action)"
  >
    <!-- Icon -->
    <div class="mt-1">
      <i
        class="pi text-xl"
        :class="{
          'pi-exclamation-circle text-red-600 dark:text-red-400': action.type === 'urgent',
          'pi-star text-blue-600 dark:text-blue-400': action.type === 'opportunity',
        }"
      ></i>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <div class="flex justify-content-between align-items-start">
        <h4 class="m-0 text-sm font-bold text-900 dark:text-white">{{ action.title }}</h4>
        <span
          class="text-xs px-2 py-1 border-round font-medium"
          :class="{
            'bg-red-100 text-red-800 dark:bg-red-500/30 dark:text-red-100':
              action.priority === 'high',
            'bg-orange-100 text-orange-800 dark:bg-orange-500/30 dark:text-orange-100':
              action.priority === 'medium',
            'bg-green-100 text-green-800 dark:bg-green-500/30 dark:text-green-100':
              action.priority === 'low',
          }"
        >
          {{ action.priority }}
        </span>
      </div>
      <p class="m-0 mt-1 text-sm text-700 dark:text-300 line-height-3">{{ action.description }}</p>
    </div>

    <!-- Action Button (Chevron) -->
    <div class="flex align-items-center self-center">
      <i class="pi pi-chevron-right text-400"></i>
    </div>
  </div>
</template>
