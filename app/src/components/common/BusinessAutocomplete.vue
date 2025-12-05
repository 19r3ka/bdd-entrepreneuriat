<template>
  <BaseAutocomplete
    :model-value="selectedBusiness"
    :suggestions="filtered"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :field-class="fieldClass"
    input-class="w-full p-3"
    @update:model-value="onUpdate"
    @complete="search"
  />
</template>

<script setup lang="ts">
  import BaseAutocomplete from '@/components/common/BaseAutocomplete.vue'
  import { ref, watch } from 'vue'
  import { useBusinessStore } from '@/stores/useBusinessStore'

  interface Props {
    modelValue?: string // UUID string
    label?: string
    placeholder?: string
    error?: { _errors: string[] }
    fieldClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    fieldClass: 'col-12'
  })

  const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

  const store = useBusinessStore()
  const filtered = ref<{ id: string; name: string }[]>([])
  const selectedBusiness = ref<{ id: string; name: string } | null>(null)

  watch(
    () => props.modelValue,
    (id) => {
      const match = store.businesses.find((b) => b.id === id)
      selectedBusiness.value = match && match.id ? { id: match.id, name: match.name } : null
    },
    { immediate: true }
  )

  /**
   *
   */
  function search(event: { query: string }) {
    const query = event.query.trim().toLowerCase()
    const all = store.businesses
      .filter((b) => b.id)
      .map((b) => ({
        id: b.id!,
        name: b.name
      }))
    filtered.value = !query ? all : all.filter((b) => b.name.toLowerCase().includes(query))
  }

  /**
   *
   */
  function onUpdate(value: any) {
    if (value && typeof value === 'object' && 'id' in value) {
      emit('update:modelValue', value.id)
    } else {
      emit('update:modelValue', '')
    }
  }
</script>
