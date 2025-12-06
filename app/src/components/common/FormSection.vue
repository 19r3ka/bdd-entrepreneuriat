<template>
  <Panel toggleable :collapsed="initiallyCollapsed" class="mb-6 form-section">
    <template #header>
      <div class="flex justify-content-between align-items-center w-full">
        <h2 class="text-900 font-bold text-xl m-0">{{ title }}</h2>
      </div>
    </template>

    <div class="mt-2">
      <slot />
    </div>
  </Panel>
</template>

<script setup lang="ts">
  import Panel from 'primevue/panel'

  interface Props {
    title: string
    initiallyCollapsed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    initiallyCollapsed: false
  })
</script>
