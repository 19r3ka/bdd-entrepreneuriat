<template>
  <div class="evidence-card surface-card border-round-lg p-3 shadow-1 flex align-items-center gap-3">
    <!-- Icon Column -->
    <div class="flex-shrink-0">
      <i :class="['text-4xl', iconClass, iconColor]"></i>
    </div>

    <!-- Info Column -->
    <div class="flex-1 min-w-0">
      <div class="font-medium text-900 mb-1 text-overflow-ellipsis overflow-hidden white-space-nowrap">
        {{ evidence.name }}
      </div>
      <div class="text-sm text-600">
        {{ formatDate(evidence.uploadedAt) }}
      </div>
      <div v-if="evidence.uploadedBy" class="text-xs text-500">
        {{ $t('common.uploadedBy', 'Uploaded by') }}: {{ evidence.uploadedBy }}
      </div>
    </div>

    <!-- Download Button Column -->
    <div class="flex-shrink-0">
      <Button 
        icon="pi pi-download" 
        text 
        rounded
        severity="secondary"
        @click="$emit('download', evidence)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';

interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'other';
  uploadedAt: string;
  uploadedBy?: string;
  url?: string;
}

interface Props {
  evidence: Evidence;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'download', evidence: Evidence): void;
}>();

const iconClass = computed(() => {
  switch (props.evidence.type) {
    case 'document':
      return 'pi pi-file';
    case 'image':
      return 'pi pi-image';
    case 'video':
      return 'pi pi-video';
    default:
      return 'pi pi-file';
  }
});

const iconColor = computed(() => {
  switch (props.evidence.type) {
    case 'document':
      return 'text-blue-500';
    case 'image':
      return 'text-green-500';
    case 'video':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
};
</script>
