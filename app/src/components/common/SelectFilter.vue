<template>
  <Select
    :value="modelValue"
    :options="options"
    option-label="label"
    option-value="value"
    :placeholder="placeholder"
    class="w-full"
    show-clear
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
  import Select from 'primevue/select'

  interface Option {
    label: string
    value: string | number | boolean
  }

  defineProps<{
    modelValue: string | number | boolean | null
    options: Option[]
    placeholder?: string
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: string | number | boolean | null): void
  }>()
</script>
