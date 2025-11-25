<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Timeline from 'primevue/timeline'
  import type { TimelineEvent } from '@/types/maturity'

  // CONTRACT
  const props = defineProps<{
    events: TimelineEvent[]
  }>()

  const activeTab = ref<'ALL' | 'SUPPORTS' | 'MEASUREMENTS'>('ALL')

  // Filter Logic
  const filteredEvents = computed(() => {
    if (activeTab.value === 'ALL') return props.events
    // Basic mapping logic assuming TYPES match the tabs
    return props.events.filter((e) => e.type.includes(activeTab.value.slice(0, -1)))
  })

  // Visual helpers based on type
  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'SUPPORT':
        return 'bg-success text-success border-success'
      case 'MEASUREMENT':
        return 'bg-primary text-primary border-primary'
      case 'MATURITY':
        return 'bg-[#6A1B9A] text-[#6A1B9A] border-[#6A1B9A]'
      default:
        return 'bg-gray-500'
    }
  }

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'SUPPORT':
        return 'card_giftcard'
      case 'MEASUREMENT':
        return 'monitoring'
      case 'MATURITY':
        return 'check_circle'
    }
  }
</script>

<template>
  <div
    class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm h-full flex flex-col border border-border-light dark:border-border-dark"
  >
    <div class="p-4 border-b border-border-light dark:border-border-dark">
      <div class="flex gap-6 text-sm">
        <button
          v-for="tab in ['ALL', 'SUPPORTS', 'MEASUREMENTS']"
          :key="tab"
          @click="activeTab = tab as any"
          class="pb-3 border-b-[3px] font-bold transition-colors"
          :class="
            activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-text-medium-light hover:text-text-light'
          "
        >
          {{ tab.charAt(0) + tab.slice(1).toLowerCase().replace('_', ' ') }}
        </button>
      </div>
    </div>

    <div class="p-4 flex-grow overflow-y-auto">
      <Timeline :value="filteredEvents" class="custom-timeline">
        <template #marker="slotProps">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-white z-10 relative"
            :class="getEventColor(slotProps.item.type).split(' ')[0]"
          >
            <span class="material-symbols-outlined !text-sm">{{
              getIcon(slotProps.item.type)
            }}</span>
          </div>
        </template>

        <template #content="slotProps">
          <div
            class="ml-4 mb-8 border-l-4 pl-4 rounded-r-lg py-3 bg-opacity-5"
            :class="[
              getEventColor(slotProps.item.type).split(' ')[2], // Border color
              getEventColor(slotProps.item.type).split(' ')[0].replace('bg-', 'bg-opacity-5 bg-') // BG tint
            ]"
          >
            <p class="text-sm font-semibold text-text-light dark:text-text-dark">
              {{ slotProps.item.title }}
            </p>
            <p class="text-xs text-text-medium-light mb-2">{{ slotProps.item.date }}</p>
            <p class="text-sm text-text-medium-light">{{ slotProps.item.description }}</p>

            <div v-if="slotProps.item.tags" class="flex gap-1 mt-2">
              <span
                v-for="tag in slotProps.item.tags"
                :key="tag"
                class="text-xs bg-surface-light border border-border-light px-2 py-0.5 rounded-full text-text-medium-light"
              >
                {{ tag }}
              </span>
            </div>

            <button class="text-primary font-medium text-sm mt-2 hover:underline">
              View Details
            </button>
          </div>
        </template>
      </Timeline>
    </div>
  </div>
</template>

<style scoped>
  /* PrimeVue Timeline overrides to match reference dashed line */
  :deep(.p-timeline-event-connector) {
    background-color: #dbe0e6 !important; /* border-light */
    width: 2px;
  }
  .dark :deep(.p-timeline-event-connector) {
    background-color: #324456 !important; /* border-dark */
  }
</style>
