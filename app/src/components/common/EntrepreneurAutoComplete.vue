<template>
  <BaseAutocomplete
    :model-value="selectedEntrepreneur"
    :suggestions="filtered"
    :label="label"
    :placeholder="placeholder"
    :error="error"
    :field-class="fieldClass"
    input-class="w-full p-3 capitalize"
    @update:model-value="onUpdate"
    @complete="search"
  />
</template>

<script setup lang="ts">
import BaseAutocomplete from '@/components/common/BaseAutocomplete.vue';
import { ref, watch } from 'vue';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { capitalize } from '@/utils/string.helpers';

interface Props {
  modelValue: string; // always UUID string
  label?: string;
  placeholder?: string;
  error?: { _errors: string[] };
  fieldClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  error: undefined,
  fieldClass: 'col-12',
});

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

const store = useEntrepreneurStore();
const filtered = ref<{ id: string; name: string }[]>([]);
const selectedEntrepreneur = ref<{ id: string; name: string } | null>(null);

watch(
  () => props.modelValue,
  id => {
    const match = store.entrepreneurs.find(e => e.id === id);
    selectedEntrepreneur.value =
      match && match.id
        ? { id: match.id, name: capitalize(`${match.firstName} ${match.lastName}`) }
        : null;
  },
  { immediate: true }
);

/**
 *
 */
function search(event: { query: string }) {
  const query = event.query.trim().toLowerCase();
  const all = store.entrepreneurs
    .filter(e => e.id)
    .map(e => ({
      id: e.id!,
      name: capitalize(`${e.firstName} ${e.lastName}`),
    }));
  filtered.value = !query ? all : all.filter(e => e.name.toLowerCase().includes(query));
}

/**
 *
 */
function onUpdate(value: unknown) {
  if (value && typeof value === 'object' && 'id' in value) {
    emit('update:modelValue', (value as { id: string }).id); // ✅ only UUID string
  } else {
    emit('update:modelValue', ''); // empty if user types without selecting
  }
}
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
