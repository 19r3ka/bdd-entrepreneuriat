<template>
  <div
    class="dashboard-widget surface-0 shadow-2 p-3 border-1 border-50 border-round cursor-pointer hover:surface-100 transition-colors transition-duration-150"
    @click="$emit('click')"
  >
    <div class="flex justify-content-between mb-3">
      <div>
        <h3 class="block text-500 font-medium mb-3 m-0">{{ title }}</h3>
        <div class="text-900 font-bold text-xl">{{ count }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    count: number
  }>()

  defineEmits<{
    (e: 'click'): void
  }>()
</script>

<style scoped>
  .dashboard-widget {
    transition: all 0.3s ease;
  }

  .dashboard-widget:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1) !important;
  }
</style>
