<script setup lang="ts">
  const props = defineProps<{
    dimension: string
    level: string
    count: number
    message: string
  }>()

  const emit = defineEmits<{
    click: []
  }>()
</script>

<template>
  <div class="flex align-items-start gap-2 text-sm text-600 dark:text-300">
    <i class="pi pi-info-circle text-blue-500 mt-1 flex-shrink-0"></i>
    <span>
      <strong class="text-800 dark:text-100">{{ dimension }} ({{ level }}):</strong>
      <button
        @click="emit('click')"
        class="bg-transparent border-none p-0 mx-1 text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
      >
        {{ count }} businesses
      </button>
      {{ message }}
    </span>
  </div>
</template>
