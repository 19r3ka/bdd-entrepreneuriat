<script setup lang="ts">
import { computed, toRef } from 'vue';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import { useImageResolver } from '@/composables/useImageResolver';

const props = defineProps<{
  modelValue: string | File | null | undefined;
  label?: string;
  altText?: string;
  hasError?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
}>();

const chooseLabel = computed(() => props.label || 'Choose Avatar');

const modelValueRef = toRef(props, 'modelValue');
const { resolvedSrc: previewSrc } = useImageResolver(modelValueRef);

function onFileSelect(event: FileUploadSelectEvent) {
  const file = event.files[0];
  if (file) {
    emit('update:modelValue', file);
  }
}

function clearAvatar() {
  emit('update:modelValue', null);
}
</script>

<template>
  <div class="flex flex-column gap-2">
    <FileUpload
      mode="basic"
      accept="image/*"
      :auto="true"
      :customUpload="true"
      :chooseLabel="chooseLabel"
      @select="onFileSelect"
      :class="{ 'p-invalid': hasError }"
    />
    <div v-if="previewSrc" class="mt-2 flex align-items-center gap-2">
      <img :src="previewSrc" :alt="altText" class="w-8rem h-8rem border-round shadow-1 object-cover" />
      <Button
        icon="pi pi-times"
        severity="danger"
        text
        rounded
        @click="clearAvatar"
        aria-label="Remove avatar"
      />
    </div>
    <small v-if="hasError" class="p-error">{{ errorMessage }}</small>
  </div>
</template>
