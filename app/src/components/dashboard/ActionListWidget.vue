<script setup lang="ts">
  import Card from 'primevue/card'
  import ActionItemComponent from './ActionItem.vue'
  import type { ActionItem } from '@/composables/usePortfolioActions'

  const props = defineProps<{
    title: string
    icon: string
    color: string // e.g., 'blue', 'red', 'orange'
    actions: ActionItem[]
    emptyTitle?: string
    emptyMessage?: string
    emptyIcon?: string
  }>()

  const emit = defineEmits<{
    (e: 'action-click', action: ActionItem): void
  }>()
</script>

<template>
  <Card class="h-full border-top-3" :class="`border-${color}-500`">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-2">
        <div class="flex align-items-center gap-2">
          <i class="pi text-xl" :class="[icon, `text-${color}-500`]"></i>
          <h3 class="text-lg font-bold m-0">{{ title }}</h3>
        </div>
        <span
          class="text-xs font-bold px-2 py-1 border-round-xl"
          :class="[`bg-${color}-100`, `text-${color}-700`]"
        >
          {{ actions.length }}
        </span>
      </div>
    </template>
    <template #content>
      <div
        v-if="actions.length > 0"
        class="flex flex-column overflow-y-auto"
        style="max-height: 300px"
      >
        <ActionItemComponent
          v-for="action in actions"
          :key="action.id"
          :action="action"
          @click="emit('action-click', action)"
        />
      </div>
      <div
        v-else
        class="flex flex-column align-items-center justify-content-center py-6 text-center"
      >
        <i
          class="pi text-4xl mb-3"
          :class="[emptyIcon || 'pi-info-circle', `text-${color}-300`]"
        ></i>
        <p class="text-700 font-medium m-0">{{ emptyTitle || 'No items' }}</p>
        <p class="text-500 text-sm mt-1">
          {{ emptyMessage || 'Nothing to display at this time.' }}
        </p>
      </div>
    </template>
  </Card>
</template>
