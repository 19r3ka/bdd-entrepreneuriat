<template>
  <div
    class="evidence-card surface-card border-round-lg p-3 shadow-1 flex align-items-center gap-3"
  >
    <!-- Icon Column -->
    <div class="flex-shrink-0">
      <i :class="['text-4xl', iconClass, iconColor]"></i>
    </div>

    <!-- Info Column -->
    <div class="flex-1 min-w-0">
      <div
        class="font-medium text-900 mb-1 text-overflow-ellipsis overflow-hidden white-space-nowrap"
      >
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
        @click="$emit(DOWNLOAD_EVENT, evidence)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';

const { d } = useI18n();

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

const DOWNLOAD_EVENT = 'download';

const props = defineProps<Props>();

defineEmits<{
  (e: typeof DOWNLOAD_EVENT, evidence: Evidence): void;
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
  return d(new Date(dateStr), 'long');
};
</script>
