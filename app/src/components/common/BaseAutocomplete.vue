<template>
  <div :class="['field', fieldClass]">
    <label v-if="label" :for="id" class="block text-900 font-medium mb-2">
      {{ label }}
    </label>
    <AutoComplete
      :id="id"
      :model-value="modelValue"
      @update:model-value="onUpdate"
      :suggestions="suggestions"
      :optionLabel="optionLabel"
      :forceSelection="forceSelection"
      class="w-full"
      :inputClass="inputClass"
      :placeholder="placeholder"
      @complete="onComplete"
      :class="{ 'p-invalid': hasError }"
      :dropdown="dropdown"
    />
    <small v-if="hasError" class="p-error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
  import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
  import { computed } from 'vue'

  interface Props {
    modelValue: any
    suggestions: any[]
    label?: string
    placeholder?: string
    error?: { _errors: string[] }
    fieldClass?: string
    optionLabel?: string
    forceSelection?: boolean
    id?: string
    dropdown?: boolean
    inputClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    fieldClass: 'col-12',
    optionLabel: 'name',
    forceSelection: true,
    id: 'autocomplete',
    dropdown: false,
    inputClass: 'w-full p-3'
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'complete', event: AutoCompleteCompleteEvent): void
  }>()

  const hasError = computed(
    () => props.error && props.error._errors && props.error._errors.length > 0
  )
  const errorMessage = computed(() => props.error?._errors?.[0])

  function onUpdate(value: any) {
    emit('update:modelValue', value)
  }

  function onComplete(event: AutoCompleteCompleteEvent) {
    emit('complete', event)
  }
</script>
