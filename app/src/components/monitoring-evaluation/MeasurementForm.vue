<template>
  <div class="card">
    <Toast />
    <h1 class="m-0">{{ isEdit ? $t('measurementForm.edit') : $t('measurementForm.new') }}</h1>
    <BaseForm
      v-slot="{ defineField, canSubmit, isSubmitting }"
      :schema="MeasurementSchema"
      :initial-values="fullInitialValues"
      :on-submit="handleSubmit"
    >
      <Section :title="$t('measurementForm.details')">
        <div class="formgrid grid">
          <div v-if="!indicatorId" class="col-12 field">
            <label class="block text-900 font-medium mb-2">Business</label>
            <BusinessAutocomplete
              v-model="selectedBusinessId"
              label=""
              placeholder="Select a business..."
            />
          </div>

          <FormField
            v-if="!indicatorId"
            name="indicatorId"
            label="Goal/Indicator"
            v-bind="defineField('indicatorId')"
            required
            field-class="col-12"
          >
            <template #input="{ modelValue, updateModelValue, hasError }">
              <Select
                :model-value="modelValue"
                :options="availableIndicators"
                option-label="label"
                option-value="value"
                placeholder="Select a goal"
                :disabled="!selectedBusinessId"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="updateModelValue"
              />
            </template>
          </FormField>

          <FormField
            name="currentValue"
            :label="$t('measurementForm.currentValue')"
            v-bind="defineField('currentValue')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <InputNumber
                :model-value="modelValue as number | null"
                mode="decimal"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="(val: number | null) => updateModelValue(val)"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="dateRecorded"
            :label="$t('measurementForm.dateRecorded')"
            v-bind="defineField('dateRecorded')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Calendar
                :model-value="modelValue as Date | null"
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="(val: Date | null) => updateModelValue(val)"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="evidenceSource"
            :label="$t('measurementForm.evidenceSource')"
            v-bind="defineField('evidenceSource')"
            required
            field-class="col-12"
          >
            <template #input="{ modelValue, updateModelValue, hasError }">
              <div class="flex flex-column gap-2">
                <FileUpload
                  mode="basic"
                  name="evidence"
                  :choose-label="$t('measurementForm.uploadEvidence')"
                  :custom-upload="true"
                  :auto="true"
                  @uploader="event => onUpload(event, updateModelValue)"
                />
                <small v-if="modelValue" class="text-green-500"
                  >File uploaded (ID: {{ modelValue }})</small
                >
                <small v-if="hasError" class="p-error">{{
                  $t('measurementForm.validation.evidenceSourceRequired')
                }}</small>
              </div>
            </template>
          </FormField>

          <FormField
            name="contributionNarrative"
            :label="$t('measurementForm.contributionNarrative')"
            v-bind="defineField('contributionNarrative')"
            required
            type="textarea"
            field-class="col-12"
          />
        </div>
      </Section>

      <div class="flex justify-content-end mt-4">
        <Button
          type="button"
          :label="$t('common.cancel')"
          icon="pi pi-times"
          class="p-button-secondary mr-2"
          @click="emit('cancel')"
        />
        <Button
          type="submit"
          :label="isEdit ? $t('common.update') : $t('common.submit')"
          :disabled="!canSubmit"
          :loading="isSubmitting"
        />
      </div>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
/**
 * MeasurementForm Component
 *
 * Form for logging measurements against a Goal (Indicator).
 * Handles file upload for evidence.
 *
 * @component
 * @example
 * <MeasurementForm
 *   :indicator-id="indicatorId"
 *   :is-edit="false"
 *   :initial-values="{}"
 *   @success="handleSuccess"
 *   @cancel="handleCancel"
 * />
 */
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import BaseForm from '@/components/common/BaseForm.vue';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import { useIndicatorStore } from '@/stores/useIndicatorStore';
import {
  MeasurementSchema,
  type Measurement as MeasurementSchemaType,
} from '@/schemas/monitoring-evaluation/Indicator'; // Use MeasurementSchema for type inference
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import { db } from '@/services/local-db';

const props = defineProps<{
  isEdit: boolean;
  initialValues: Partial<MeasurementSchemaType>;
  indicatorId?: string;
  businessId?: string;
}>();

const emit = defineEmits(['success', 'cancel']);

const { t } = useI18n();
const toast = useToast();
const indicatorStore = useIndicatorStore();
const { handleApiError } = useErrorHandler();

const selectedBusinessId = ref(props.businessId || '');
const availableIndicators = computed(() =>
  indicatorStore.indicators
    .filter(i => i.businessId === selectedBusinessId.value)
    .map(i => ({ label: i.name, value: i.id }))
);

const fullInitialValues = computed(() => ({
  id: props.initialValues.id || crypto.randomUUID(),
  indicatorId: props.initialValues.indicatorId || props.indicatorId || '',
  currentValue: props.initialValues.currentValue ?? 0,
  dateRecorded: props.initialValues.dateRecorded
    ? new Date(props.initialValues.dateRecorded)
    : new Date(),
  evidenceSource: props.initialValues.evidenceSource || '',
  contributionNarrative: props.initialValues.contributionNarrative || '',
  createdAt: props.initialValues.createdAt ? new Date(props.initialValues.createdAt) : new Date(),
  updatedAt: props.initialValues.updatedAt ? new Date(props.initialValues.updatedAt) : new Date(),
}));

watch(selectedBusinessId, async newId => {
  if (newId) {
    // Ensure indicators are loaded for this business
  }
});

import type { FileUploadUploaderEvent } from 'primevue/fileupload';

/**
 *
 */
const onUpload = async (
  event: FileUploadUploaderEvent,
  updateModelValue: (val: string) => void
) => {
  const file = Array.isArray(event.files) ? event.files[0] : event.files;

  if (!file) {
    // Add check for undefined file
    toast.add({ severity: 'error', summary: 'Error', detail: 'No file selected', life: 3000 });
    return;
  }

  const reader = new FileReader();
  reader.onload = async e => {
    const base64 = e.target?.result as string;
    const id = crypto.randomUUID();
    await db.evidenceFiles.add({
      id,
      data: base64,
      type: file.type,
      name: file.name,
    });
    updateModelValue(id);
    toast.add({ severity: 'info', summary: 'Success', detail: 'File uploaded', life: 3000 });
  };
  reader.readAsDataURL(file);
};

/**
 *
 */
async function handleSubmit(data: MeasurementSchemaType) {
  try {
    const measurementData = (({ ...rest }) => ({
      ...rest,
      dateRecorded: new Date(rest.dateRecorded),
    }))(data);

    if (props.isEdit) {
      await indicatorStore.updateMeasurement(props.initialValues.id!, measurementData);
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('measurementForm.updateSuccess'),
        life: 3000,
      });
    } else {
      await indicatorStore.addMeasurement({
        ...measurementData,
        indicatorId: data.indicatorId || props.indicatorId!,
      });
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('measurementForm.createSuccess'),
        life: 3000,
      });
    }
    emit('success');
  } catch (error) {
    handleApiError(
      error as AppError,
      `Failed to ${props.isEdit ? 'update' : 'create'} measurement`
    );
  }
}
</script>
