<script setup lang="ts">
  import Button from 'primevue/button'
  import SplitButton from 'primevue/splitbutton'

  defineProps<{
    regionName: string
  }>()

  const emit = defineEmits<{
    (e: 'export'): void
    (e: 'add-entrepreneur'): void
  }>()

  const addItems = [
    { label: 'Add Business', icon: 'pi pi-briefcase' },
    { label: 'Bulk Import', icon: 'pi pi-upload' }
  ]
</script>

<template>
  <header class="flex flex-wrap justify-content-between align-items-center gap-4 mb-6">
    <div class="flex flex-column gap-1">
      <h1 class="text-900 dark:text-0 text-4xl font-black m-0">Portfolio Overview</h1>
      <p class="text-500 dark:text-400 text-base m-0">Region: {{ regionName }}</p>
    </div>

    <div class="flex align-items-center gap-3">
      <Button
        label="Export CSV"
        icon="pi pi-download"
        severity="secondary"
        outlined
        class="font-bold border-300 dark:border-600"
        @click="emit('export')"
      />

      <SplitButton
        label="Add Entrepreneur"
        icon="pi pi-plus"
        :model="addItems"
        severity="primary"
        class="font-bold"
        @click="emit('add-entrepreneur')"
      />
    </div>
  </header>
</template>
