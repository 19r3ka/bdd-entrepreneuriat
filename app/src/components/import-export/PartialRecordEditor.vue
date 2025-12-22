<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { usePartialRecords } from '@/composables/usePartialRecords';
import type { PartialRecord } from '@/types/partialRecord';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  visible: boolean;
  partialRecord: PartialRecord | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'record-updated'): void;
}>();

const { promoteToFull, ignoreRecord } = usePartialRecords();
const toast = useToast();
const { t } = useI18n();

const formData = ref<Record<string, unknown>>({});
const validationErrors = ref<string[]>([]);
const processing = ref(false);

const missingFieldsList = computed(() => {
  if (!props.partialRecord) return [];
  return props.partialRecord.missingFields;
});

onMounted(() => {
  if (props.partialRecord) {
    formData.value = { ...props.partialRecord.rawData };
  }
});

/**
 *
 */
async function handlePromote() {
  if (!props.partialRecord) return;

  processing.value = true;
  validationErrors.value = [];

  try {
    const result = await promoteToFull(props.partialRecord, formData.value);

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: t('importExport.businessCreated'),
        detail: t('importExport.businessCreatedDetail'),
        life: 3000,
      });
      emit('record-updated');
      emit('update:visible', false);
    } else {
      validationErrors.value = result.errors || [];
      toast.add({
        severity: 'warn',
        summary: t('importExport.validationFailed'),
        detail: t('importExport.pleaseFixErrors'),
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Failed to promote record:', error);
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('importExport.failedToSaveBusiness'),
      life: 3000,
    });
  } finally {
    processing.value = false;
  }
}

/**
 *
 */
async function handleIgnore() {
  if (!props.partialRecord) return;

  processing.value = true;

  try {
    await ignoreRecord(props.partialRecord.id);
    toast.add({
      severity: 'info',
      summary: t('importExport.recordIgnored'),
      detail: t('importExport.recordMarkedAsIgnored'),
      life: 3000,
    });
    emit('record-updated');
    emit('update:visible', false);
  } catch (error) {
    console.error('Failed to ignore record:', error);
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('importExport.failedToIgnoreRecord'),
      life: 3000,
    });
  } finally {
    processing.value = false;
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
    header="Edit Partial Record"
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="partialRecord" class="flex flex-column gap-4">
      <!-- Import Source Info -->
      <div class="p-3 surface-100 border-round">
        <p class="m-0 text-sm"><strong>Source:</strong> {{ partialRecord.importSource }}</p>
        <p class="m-0 text-sm">
          <strong>Imported:</strong> {{ new Date(partialRecord.createdAt).toLocaleString() }}
        </p>
      </div>

      <!-- Missing Fields Alert -->
      <Message v-if="missingFieldsList.length > 0" severity="warn" :closable="false">
        <strong>Missing or Invalid Fields:</strong>
        {{ missingFieldsList.join(', ') }}
      </Message>

      <!-- Validation Errors -->
      <Message v-if="validationErrors.length > 0" severity="error" :closable="false">
        <ul class="m-0 pl-3">
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </Message>

      <!-- Form Fields -->
      <div class="grid">
        <div
          v-for="(value, key) in formData"
          :key="key as string"
          class="col-12 md:col-6 flex flex-column gap-2"
        >
          <label :for="`field-${key}`" class="font-semibold">
            {{ key }}
            <span v-if="missingFieldsList.includes(key as string)" class="text-red-500">*</span>
          </label>
          <InputText
            :id="`field-${key}`"
            :model-value="(formData[key as string] ?? '') as string"
            :class="{ 'p-invalid': missingFieldsList.includes(key as string) }"
            @update:model-value="formData[key as string] = $event"
          />
        </div>
      </div>

      <!-- Raw Data Preview -->
      <details class="surface-100 p-3 border-round">
        <summary class="cursor-pointer font-semibold">View Raw Data</summary>
        <pre class="text-xs overflow-auto mt-2">{{
          JSON.stringify(partialRecord.rawData, null, 2)
        }}</pre>
      </details>
    </div>

    <template #footer>
      <div class="flex justify-content-between w-full">
        <Button
          label="Ignore"
          severity="secondary"
          outlined
          :loading="processing"
          @click="handleIgnore"
        />
        <div class="flex gap-2">
          <Button label="Cancel" text @click="handleCancel" />
          <Button
            label="Save & Promote"
            icon="pi pi-check"
            :loading="processing"
            @click="handlePromote"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
