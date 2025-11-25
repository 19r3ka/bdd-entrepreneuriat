<script setup lang="ts">
  import { ref, computed } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Tag from 'primevue/tag'
  import Button from 'primevue/button'
  import Avatar from 'primevue/avatar'
  import type { RecentActivity } from '@/types/portfolio'

  const props = defineProps<{
    activities: RecentActivity[]
    incompleteCount: number
  }>()

  // Simple Filter Logic simulating Tabs
  const activeFilter = ref<'ALL' | 'INCOMPLETE'>('ALL')

  const filteredData = computed(() => {
    if (activeFilter.value === 'INCOMPLETE') {
      return props.activities.filter((a) => a.status === 'MISSING_INFO')
    }
    return props.activities
  })

  const getSeverity = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'success'
      case 'MISSING_INFO':
        return 'warning' // Orange in PrimeVue
      default:
        return 'info'
    }
  }
</script>

<template>
  <div
    class="surface-card border-round-xl border-1 border-200 dark:border-700 shadow-1 h-full flex flex-column"
  >
    <div class="p-4 border-bottom-1 border-200 dark:border-700">
      <h2 class="text-xl font-bold m-0 mb-3 text-900 dark:text-0">Recent Activity & Alerts</h2>

      <div class="flex gap-4 text-sm font-medium">
        <button
          @click="activeFilter = 'ALL'"
          class="bg-transparent border-none cursor-pointer pb-2 border-bottom-2 transition-colors"
          :class="
            activeFilter === 'ALL'
              ? 'border-primary text-primary'
              : 'border-transparent text-500 hover:text-700'
          "
        >
          All Activity
        </button>
        <button
          @click="activeFilter = 'INCOMPLETE'"
          class="bg-transparent border-none cursor-pointer pb-2 border-bottom-2 transition-colors flex align-items-center gap-2"
          :class="
            activeFilter === 'INCOMPLETE'
              ? 'border-primary text-primary'
              : 'border-transparent text-500 hover:text-700'
          "
        >
          Incomplete Profiles
          <span class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 border-round-xl">
            {{ incompleteCount }}
          </span>
        </button>
      </div>
    </div>

    <DataTable :value="filteredData" :rows="5" responsiveLayout="scroll">
      <Column header="ENTITY" class="w-5">
        <template #body="slotProps">
          <div class="flex align-items-center gap-3">
            <Avatar :image="slotProps.data.avatarUrl" shape="circle" size="large" />
            <div class="flex flex-column">
              <span class="font-semibold text-900">{{ slotProps.data.name }}</span>
              <span class="text-500 text-sm">{{ slotProps.data.type }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column field="date" header="DATE" class="text-500 text-sm"></Column>

      <Column header="STATUS">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.statusLabel"
            :severity="getSeverity(slotProps.data.status)"
            class="text-xs font-bold"
            rounded
          />
        </template>
      </Column>

      <Column class="w-4rem text-right">
        <template #body="slotProps">
          <Button
            :label="slotProps.data.status === 'MISSING_INFO' ? 'Fix' : 'View'"
            text
            size="small"
            :class="slotProps.data.status === 'MISSING_INFO' ? 'font-bold' : ''"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
