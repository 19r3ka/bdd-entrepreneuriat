<template>
  <div class="flex items-center gap-2">
    <Checkbox
      :indeterminate="modelValue === null"
      binary
      :value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <label class="text-600">{{ $t(label) }}</label>
  </div>
</template>

<script setup lang="ts">
  import Checkbox from 'primevue/checkbox'

  defineProps<{
    modelValue: boolean | null
    label: string // i18n key
  }>()

  defineEmits<(e: 'update:modelValue', value: boolean | null) => void>()
</script>
