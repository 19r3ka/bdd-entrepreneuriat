<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Message from 'primevue/message';
import type { ActionItem } from '@/composables/usePortfolioActions';

const props = defineProps<{
  actions: ActionItem[];
}>();

const route = useRoute();

// Check if we navigated here from a specific action
const activeActionId = computed(() => route.query.actionId as string);

// Filter actions to show: either the active one (if present) or the top priority one
const displayedAction = computed(() => {
  if (activeActionId.value) {
    return props.actions.find(a => a.id === activeActionId.value);
  }
  // Default: Show the highest priority urgent action, or opportunity
  return props.actions[0];
});

const severity = computed(() => {
  if (!displayedAction.value) return 'info';
  return displayedAction.value.type === 'urgent' ? 'warn' : 'info';
});

const icon = computed(() => {
    if (!displayedAction.value) return 'pi-info-circle';
    return displayedAction.value.type === 'urgent' ? 'pi-exclamation-triangle' : 'pi-sparkles';
});
</script>

<template>
  <div v-if="displayedAction" class="mb-4">
    <Message :severity="severity" :closable="false" class="w-full shadow-1">
        <div class="flex align-items-center gap-3">
            <i class="pi text-xl" :class="icon"></i>
            <div class="flex flex-column">
                <span class="font-bold text-lg">{{ displayedAction.title }}</span>
                <span class="text-sm">{{ displayedAction.description }}</span>
            </div>
             <div v-if="activeActionId" class="ml-auto">
                <span class="text-xs bg-white-alpha-30 px-2 py-1 border-round">Context: Dashboard Action</span>
            </div>
        </div>
    </Message>
  </div>
</template>

<style scoped>
:deep(.p-message-wrapper) {
    padding: 1rem;
}
</style>
