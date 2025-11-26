<template>
  <div class="output-indicator-selector">
    <div class="flex flex-column gap-2">
      <label v-if="label" class="font-medium text-900">{{ label }}</label>
      
      <div class="flex gap-2">
        <AutoComplete
          v-model="selectedIndicator"
          :suggestions="filteredIndicators"
          @complete="searchIndicators"
          optionLabel="name"
          :placeholder="placeholder || $t('outputIndicator.selector.placeholder')"
          class="w-full"
          dropdown
          forceSelection
          @item-select="onSelect"
        >
          <template #item="slotProps">
            <div class="flex flex-column">
              <span class="font-medium">{{ slotProps.item.name }}</span>
              <div class="flex align-items-center gap-2 text-sm text-500">
                <span v-if="slotProps.item.category" class="bg-primary-50 text-primary-700 px-2 py-1 border-round text-xs">
                  {{ $t(`outputIndicator.categories.${slotProps.item.category}`) }}
                </span>
                <span class="bg-gray-100 text-gray-700 px-2 py-1 border-round text-xs">
                  {{ $t(`outputIndicator.units.${slotProps.item.unit}`) }}
                </span>
                <span v-if="slotProps.item.usageCount > 0" class="flex align-items-center gap-1 text-xs">
                  <i class="pi pi-chart-bar text-xs"></i> {{ slotProps.item.usageCount }}
                </span>
              </div>
            </div>
          </template>
          <template #empty>
            <div class="p-2">
              <div class="text-center mb-2">{{ $t('outputIndicator.selector.noResults') }}</div>
              <Button 
                :label="$t('outputIndicator.selector.createNew')" 
                icon="pi pi-plus" 
                class="p-button-sm p-button-outlined w-full"
                @click="openCreateDialog"
              />
            </div>
          </template>
        </AutoComplete>
        
        <Button 
          icon="pi pi-plus" 
          :tooltip="$t('outputIndicator.selector.createNew')"
          class="p-button-outlined"
          @click="openCreateDialog"
        />
      </div>
      
      <small v-if="helpText" class="text-500">{{ helpText }}</small>
    </div>

    <!-- Create Indicator Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      :header="$t('outputIndicator.createTitle')"
      modal
      class="p-fluid"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <OutputIndicatorForm @submit="handleCreate" @cancel="showCreateDialog = false" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import OutputIndicatorForm from './OutputIndicatorForm.vue';
import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore';
import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator';

const props = defineProps<{
  modelValue?: OutputIndicator | null;
  label?: string;
  placeholder?: string;
  helpText?: string;
  categoryFilter?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: OutputIndicator | null): void;
  (e: 'select', value: OutputIndicator): void;
}>();

const { t } = useI18n();
const store = useOutputIndicatorStore();

const selectedIndicator = ref<OutputIndicator | null>(props.modelValue || null);
const filteredIndicators = ref<OutputIndicator[]>([]);
const showCreateDialog = ref(false);

// Sync internal state with prop
watch(() => props.modelValue, (newVal) => {
  selectedIndicator.value = newVal || null;
});

const searchIndicators = async (event: { query: string }) => {
  const query = event.query.toLowerCase();
  
  // Get all indicators (or filtered by category if prop set)
  let indicators = props.categoryFilter 
    ? await store.getIndicatorsByCategory(props.categoryFilter)
    : await store.getAllIndicators();
    
  // Filter by query
  if (query) {
    indicators = indicators.filter(i => 
      i.name.toLowerCase().includes(query) || 
      i.description?.toLowerCase().includes(query)
    );
  }
  
  // Sort: Standard first, then by usage count (descending)
  indicators.sort((a, b) => {
    if (a.isStandard !== b.isStandard) return a.isStandard ? -1 : 1;
    return b.usageCount - a.usageCount;
  });
  
  filteredIndicators.value = indicators;
};

const onSelect = (event: { value: OutputIndicator }) => {
  emit('update:modelValue', event.value);
  emit('select', event.value);
  selectedIndicator.value = null; // Reset for next selection if needed, or keep it?
  // For QuickWin form, we usually select one and add it to a list, so resetting might be better
  // But if this is a single selector, we should keep it.
  // Given the QuickWin form design (dynamic array), this selector is likely used to "Add" an indicator to the list.
  // So let's keep it bound but the parent will likely clear it after adding.
};

const openCreateDialog = () => {
  showCreateDialog.value = true;
};

const handleCreate = async (data: Omit<OutputIndicator, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const newIndicator = await store.createIndicator(data);
    showCreateDialog.value = false;
    
    // Select the newly created indicator
    emit('update:modelValue', newIndicator);
    emit('select', newIndicator);
    
    // Show success message (toast would be good here)
  } catch (error) {
    console.error('Failed to create indicator', error);
  }
};
</script>

<style scoped>
.output-indicator-selector :deep(.p-autocomplete-item) {
  white-space: normal;
}
</style>
