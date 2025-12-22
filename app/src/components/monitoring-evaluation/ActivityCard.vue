<template>
  <Card
    class="activity-card mb-3 cursor-pointer activity-card-hover"
    :class="[`border-left-4 border-${color}-500`]"
    @click="$emit('view')"
  >
    <template #title>
      <div class="flex justify-content-between align-items-start">
        <span class="text-xl font-bold text-900">{{ title }}</span>
        <span v-if="showBusiness && businessName" class="text-sm font-normal text-500">
          <i class="pi pi-building mr-1"></i> {{ businessName }}
        </span>
      </div>
    </template>
    <template #subtitle>
      <div class="flex align-items-center gap-3 text-sm">
        <span class="flex align-items-center gap-1">
          <i class="pi pi-calendar text-primary"></i>
          {{ formatDate(date) }}
        </span>
        <span v-if="linkedItem" class="flex align-items-center gap-1 text-purple-600">
          <i class="pi pi-heart"></i>
          {{ linkedItem }}
        </span>
      </div>
    </template>
    <template #content>
      <div class="mb-3 text-700 line-height-3">
        {{ truncate(description, 150) }}
      </div>

      <div class="flex align-items-center gap-2 flex-wrap">
        <!-- QuickWin Specific Tags -->
        <template v-if="type === 'quickWin'">
          <Tag
            v-if="indicatorCount !== undefined"
            :value="`${indicatorCount} ${$t('quickWin.indicators')}`"
            severity="info"
            icon="pi pi-chart-bar"
            class="bg-blue-50 text-blue-700 border-blue-200 border-1"
          />
        </template>

        <!-- Support Specific Tags -->
        <template v-if="type === 'support'">
          <Tag
            v-if="boostType"
            :value="formatType(boostType)"
            severity="info"
            class="bg-purple-50 text-purple-700 border-purple-200 border-1"
          />
          <Tag
            v-if="quantity"
            :value="quantity"
            severity="success"
            class="bg-green-50 text-green-700 border-green-200 border-1"
          />
        </template>

        <!-- Common Tags -->
        <Tag
          v-if="genderMarker"
          :value="genderMarker"
          severity="warning"
          class="bg-orange-50 text-orange-700 border-orange-200 border-1"
        />

        <template v-if="tags && tags.length > 0">
          <Tag
            v-for="tag in tags.slice(0, 3)"
            :key="tag"
            :value="tag"
            severity="secondary"
            class="bg-gray-50 text-gray-700 border-gray-200 border-1"
          />
          <span v-if="tags.length > 3" class="text-xs text-500">+{{ tags.length - 3 }}</span>
        </template>
      </div>

      <div class="flex justify-content-end mt-2">
        <Button
          icon="pi pi-pencil"
          text
          rounded
          severity="secondary"
          :aria-label="$t('common.edit')"
          @click.stop="$emit('edit')"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

const { d } = useI18n();

const props = defineProps<{
  activity: {
    type: 'support' | 'quickWin';
    data: Support | QuickWin;
    date: string;
  };
  showBusiness?: boolean;
}>();

defineEmits<{
  (e: 'view'): void;
  (e: 'edit'): void;
}>();

const type = computed(() => props.activity.type);
const data = computed(() => props.activity.data);

const title = computed(() => {
  if (type.value === 'support') return (data.value as Support).title;
  return (data.value as QuickWin).title;
});

const date = computed(() => props.activity.date);

const description = computed(() => {
  if (type.value === 'support') return (data.value as Support).notes || '';
  return (data.value as QuickWin).resultSummary;
});

const businessName = computed(() => {
  // Assuming business name might be available in data or handled by parent if needed
  // For now, returning empty as it wasn't passed down explicitly in previous components
  // If needed, we can fetch it or pass it down.
  // The previous QuickWinCard had logic for this but relied on `quickWin.businessId`.
  // We'll keep it simple for now.
  return '';
});

const linkedItem = computed(() => {
  if (type.value === 'quickWin' && (data.value as QuickWin).supportBoostId) {
    return 'Linked Support'; // Or translate
  }
  return null;
});

const color = computed(() => {
  if (type.value === 'quickWin') return 'cyan';
  return 'purple'; // Default for support
});

// QuickWin specific
const indicatorCount = computed(() => {
  if (type.value === 'quickWin') return (data.value as QuickWin).indicatorValues?.length || 0;
  return undefined;
});

const tags = computed(() => {
  if (type.value === 'quickWin') return (data.value as QuickWin).tags || [];
  return [];
});

// Support specific
const boostType = computed(() => {
  if (type.value === 'support') return (data.value as Support).boostType;
  return undefined;
});

const quantity = computed(() => {
  if (type.value === 'support') {
    const q = (data.value as Support).quantity;
    if (!q || !q.value) return undefined;
    const unit = q.unit === 'currency' ? q.currency : q.unit;
    return `${q.value} ${unit || ''}`;
  }
  return undefined;
});

// Common
const genderMarker = computed(() => data.value.genderMarker);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return d(new Date(dateStr), 'short');
};

const truncate = (text: string, length: number) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const formatType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>

<style scoped>
/* Border colors are handled by utility classes */
.activity-card-hover {
  transition: all 0.2s ease-in-out;
}

.activity-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
</style>
