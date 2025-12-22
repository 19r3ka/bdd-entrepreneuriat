<template>
  <InputText v-model="model" type="text" :placeholder="placeholder" class="w-full" />
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';

// defineModel creates a writable binding for v-model
const model = defineModel<string | null>('modelValue');

defineProps<{
  placeholder?: string;
}>();
</script>
