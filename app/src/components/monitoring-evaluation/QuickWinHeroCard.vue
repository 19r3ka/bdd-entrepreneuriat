<template>
  <div class="card p-5 shadow-2">
    <div class="flex flex-column gap-4">
      <!-- Row 1: Achieved On & Actions -->
      <div class="flex justify-content-between align-items-start">
        <div class="flex align-items-center gap-2 text-600 text-sm mt-1">
          <i class="pi pi-calendar"></i>
          <span>{{ $t('quickWin.achievedOn') }}: {{ formatDate(quickWin.achievedOn) }}</span>
        </div>

        <div class="flex gap-2">
          <Button 
            icon="pi pi-pencil" 
            :label="$t('common.edit')" 
            outlined
            size="small"
            @click="$emit('edit')"
          />
          <Button 
            icon="pi pi-trash" 
            :label="$t('common.delete')" 
            outlined
            severity="danger"
            size="small"
            @click="$emit('delete')"
          />
        </div>
      </div>

      <!-- Row 2: Title -->
      <h2 class="text-3xl font-bold text-900 m-0">{{ quickWin.title }}</h2>
      
      <!-- Row 3: Description/Result Summary -->
      <p class="text-700 text-base line-height-3 m-0">
        {{ quickWin.resultSummary }}
      </p>

      <!-- Row 4: Gender Marker and Tags -->
      <div class="flex justify-content-between align-items-center gap-3">
        <div v-if="quickWin.genderMarker" class="flex align-items-center gap-2 text-600 text-sm">
          <i class="pi pi-users"></i>
          <span class="font-semibold text-900">{{ quickWin.genderMarker }}</span>
        </div>
        <div v-else class="flex-1"></div>

        <div v-if="quickWin.tags && quickWin.tags.length > 0" class="flex flex-wrap gap-2">
          <Tag v-for="tag in quickWin.tags" :key="tag" :value="tag" severity="secondary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

interface Props {
  quickWin: QuickWin;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
};
</script>
