<template>
  <div class="card">
    <Toast />
    <h1 class="m-0">{{ isEdit ? $t('measurementForm.edit') : $t('measurementForm.new') }}</h1>
    <BaseForm
      :schema="MeasurementSchema"
      :initial-values="initialValues"
      :on-submit="handleSubmit"
      v-slot="{ defineField, canSubmit, isSubmitting }"
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
                 @update:model-value="updateModelValue"
                 :options="availableIndicators"
                 optionLabel="label"
                 optionValue="value"
                 placeholder="Select a goal"
                 :disabled="!selectedBusinessId"
                 :class="{ 'p-invalid': hasError }"
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
                :model-value="modelValue"
                @update:model-value="updateModelValue"
                mode="decimal"
                :class="{ 'p-invalid': hasError }"
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
                :model-value="modelValue"
                @update:model-value="updateModelValue"
                dateFormat="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
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
             <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
               <div class="flex flex-column gap-2">
                 <FileUpload
                    mode="basic"
                    name="evidence"
                    :chooseLabel="$t('measurementForm.uploadEvidence')"
                    :customUpload="true"
                    @uploader="onUpload($event, updateModelValue)"
                    :auto="true"
                 />
                 <small v-if="modelValue" class="text-green-500">File uploaded (ID: {{ modelValue }})</small>
                 <small v-if="hasError" class="p-error">{{ $t('measurementForm.validation.evidenceSourceRequired') }}</small>
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
          :disabled="!canSubmit.value"
          :loading="isSubmitting.value"
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
import { MeasurementSchema } from '@/schemas/monitoring-evaluation/Indicator';
import type { Measurement } from '@/types/monitoring-evaluation/Indicator';
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import { db } from '@/services/local-db';

const props = defineProps<{
  isEdit: boolean;
  initialValues: Partial<Measurement>;
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
  indicatorStore.indicators.filter(i => i.businessId === selectedBusinessId.value)
    .map(i => ({ label: i.name, value: i.id }))
);

watch(selectedBusinessId, async (newId) => {
  if (newId) {
    // Ensure indicators are loaded for this business
    // Assuming fetchAll loads all, or we might need a specific fetch
    // If fetchAll is already called globally, we might have them.
    // But to be safe/efficient, we might want fetchByBusiness if available.
    // For now, let's assume fetchAll or rely on store state.
    // If store doesn't have them, we might need to trigger a fetch.
    // indicatorStore.fetchByBusiness(newId); // If this action exists
  }
});

const onUpload = async (event: any, updateModelValue: (val: string) => void) => {
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target?.result as string;
    const id = crypto.randomUUID();
    await db.evidenceFiles.add({
      id,
      data: base64,
      type: file.type,
      name: file.name
    });
    updateModelValue(id);
    toast.add({ severity: 'info', summary: 'Success', detail: 'File uploaded', life: 3000 });
  };
  reader.readAsDataURL(file);
};

async function handleSubmit(data: any) {
  try {
    if (props.isEdit) {
      await indicatorStore.updateMeasurement(props.initialValues.id!, data);
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('measurementForm.updateSuccess'),
        life: 3000,
      });
    } else {
      await indicatorStore.addMeasurement({ ...data, indicatorId: data.indicatorId || props.indicatorId });
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('measurementForm.createSuccess'),
        life: 3000,
      });
    }
    emit('success');
  } catch (error) {
    handleApiError(error as AppError, `Failed to ${props.isEdit ? 'update' : 'create'} measurement`);
  }
}
</script>
