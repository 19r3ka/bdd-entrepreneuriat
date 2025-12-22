<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useImportExport } from '@/composables/useImportExport';
import type { Business } from '@/types/business';
import { getAvailableExportFields, transformBusinessForExport } from '@/utils/exportHelpers';

const props = defineProps<{
  visible: boolean;
  data: Business[];
  defaultFileName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const { exportData, exporting } = useImportExport();
const toast = useToast();
const { t } = useI18n();

const format = ref<'csv' | 'xlsx'>('xlsx');
const fileName = ref(props.defaultFileName || 'businesses_export');
const availableFields = getAvailableExportFields();
const selectedFields = ref<string[]>(availableFields.map(f => f.key));

const allSelected = computed(() => selectedFields.value.length === availableFields.length);
// const someSelected = computed(
//   () => selectedFields.value.length > 0 && selectedFields.value.length < availableFields.length
// )

/**
 *
 */
function toggleAll() {
  if (allSelected.value) {
    selectedFields.value = [];
  } else {
    selectedFields.value = availableFields.map(f => f.key);
  }
}

/**
 *
 */
function handleExport() {
  try {
    // Transform businesses for export
    const transformedData = props.data.map(transformBusinessForExport);

    // Export with selected fields
    exportData(transformedData, fileName.value, format.value, selectedFields.value);

    toast.add({
      severity: 'success',
      summary: t('importExport.exportSuccess'),
      detail: t('importExport.exportSuccessDetail', {
        count: props.data.length,
        file: `${fileName.value}.${format.value}`,
      }),
      life: 3000,
    });

    // Close dialog
    emit('update:visible', false);
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: t('importExport.exportFailed'),
      detail: t('importExport.exportFailedDetail'),
      life: 3000,
    });
  }
}

/**
 *
 */
function handleCancel() {
  emit('update:visible', false);
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('importExport.exportData')"
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-column gap-4">
      <!-- File Name -->
      <div class="flex flex-column gap-2">
        <label for="fileName">{{ $t('importExport.fileName') }}</label>
        <input
          id="fileName"
          v-model="fileName"
          type="text"
          class="p-inputtext p-component"
          :placeholder="$t('importExport.fileName')"
        />
      </div>

      <!-- Format Selection -->
      <div class="flex flex-column gap-2">
        <label>{{ $t('importExport.format') }}</label>
        <div class="flex gap-4">
          <div class="flex align-items-center">
            <RadioButton v-model="format" input-id="format-xlsx" value="xlsx" />
            <label for="format-xlsx" class="ml-2">Excel (.xlsx)</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton v-model="format" input-id="format-csv" value="csv" />
            <label for="format-csv" class="ml-2">CSV (.csv)</label>
          </div>
        </div>
      </div>

      <!-- Field Selection -->
      <div class="flex flex-column gap-2">
        <div class="flex align-items-center justify-content-between">
          <label>{{ $t('importExport.selectFields') }}</label>
          <Button
            :label="allSelected ? $t('importExport.deselectAll') : $t('importExport.selectAll')"
            text
            size="small"
            @click="toggleAll"
          />
        </div>
        <div class="grid">
          <div
            v-for="field in availableFields"
            :key="field.key"
            class="col-12 md:col-6 flex align-items-center"
          >
            <Checkbox
              v-model="selectedFields"
              :input-id="`field-${field.key}`"
              :value="field.key"
            />
            <label :for="`field-${field.key}`" class="ml-2">{{ $t(field.labelKey) }}</label>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="p-3 surface-100 border-round">
        <p class="m-0">
          {{
            $t('importExport.recordsSummary', {
              count: props.data.length,
              fields: selectedFields.length,
            })
          }}
        </p>
      </div>
    </div>

    <template #footer>
      <Button :label="$t('common.cancel')" text @click="handleCancel" />
      <Button
        :label="$t('importExport.export')"
        icon="pi pi-download"
        :loading="exporting"
        :disabled="selectedFields.length === 0"
        @click="handleExport"
      />
    </template>
  </Dialog>
</template>
