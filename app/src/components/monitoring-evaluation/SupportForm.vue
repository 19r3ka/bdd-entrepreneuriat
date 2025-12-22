<template>
  <div class="card">
    <Toast />
    <h1 v-if="!hideTitle" class="m-0 mb-3">
      {{ isEdit ? 'Edit Support Intervention' : 'New Support Intervention' }}
    </h1>
    <BaseForm :schema="SupportBoostSchema" :initial-values="initialValues" @submit="handleSubmit">
      <template #default="{ defineField, canSubmit, isSubmitting, values }">
        <Section title="Intervention Details">
          <div class="formgrid grid">
            <FormField
              v-if="!businessId"
              name="businessId"
              label="Business"
              v-bind="defineField('businessId')"
              required
              field-class="col-12"
            >
              <template #input="{ modelValue, updateModelValue, hasError }">
                <BusinessAutocomplete
                  :model-value="modelValue as string"
                  label="Select Business"
                  placeholder="Search for a business..."
                  :class="{ 'p-invalid': hasError }"
                  @update:model-value="updateModelValue"
                />
              </template>
            </FormField>

            <FormField
              name="title"
              label="Title"
              v-bind="defineField('title')"
              required
              field-class="col-12"
              placeholder="e.g. Digital Marketing Training"
            />

            <FormField
              name="boostType"
              label="Boost Type"
              v-bind="defineField('boostType')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="boostTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a boost type"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="modality"
              label="Modality"
              v-bind="defineField('modality')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="modalityOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a modality"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="startDate"
              label="Start Date"
              v-bind="defineField('startDate')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <DatePicker
                  :model-value="
                    (modelValue as any) instanceof Date
                      ? (modelValue as any)
                      : modelValue
                        ? new Date(modelValue as string)
                        : null
                  "
                  show-icon
                  date-format="yy-mm-dd"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="endDate"
              label="End Date"
              v-bind="defineField('endDate')"
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <DatePicker
                  :model-value="
                    (modelValue as any) instanceof Date
                      ? (modelValue as any)
                      : modelValue
                        ? new Date(modelValue as string)
                        : null
                  "
                  show-icon
                  date-format="yy-mm-dd"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="channel"
              label="Channel"
              v-bind="defineField('channel')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="channelOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a channel"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="provider"
              label="Provider"
              v-bind="defineField('provider')"
              field-class="col-12 md:col-6"
              placeholder="e.g. UNDP"
            />

            <FormField
              name="beneficiaryGroup"
              label="Beneficiary Group"
              v-bind="defineField('beneficiaryGroup')"
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="beneficiaryGroupOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a beneficiary group"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
            <FormField
              name="genderMarker"
              label="Gender Marker"
              v-bind="defineField('genderMarker')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="genderMarkerOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select a gender marker"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>
        </Section>

        <Section title="Quantity (if applicable)">
          <div class="formgrid grid">
            <FormField
              name="quantity.value"
              label="Value"
              v-bind="defineField('quantity.value')"
              field-class="col-12 md:col-4"
              :placeholder="$t('pages.quickWins.valuePlaceholder')"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <InputNumber
                  :model-value="typeof modelValue === 'number' ? modelValue : null"
                  mode="decimal"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="quantity.unit"
              label="Unit"
              v-bind="defineField('quantity.unit')"
              field-class="col-12 md:col-4"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="supportQuantityUnitOptions"
                  option-label="label"
                  option-value="value"
                  :placeholder="$t('pages.quickWins.selectUnit')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              v-if="(values as any).quantity?.unit === 'currency'"
              name="quantity.currency"
              label="Currency"
              v-bind="defineField('quantity.currency')"
              field-class="col-12 md:col-4"
              :placeholder="$t('pages.quickWins.currencyPlaceholder')"
            />
          </div>
        </Section>

        <FormField
          name="notes"
          label="Notes"
          v-bind="defineField('notes')"
          type="textarea"
          field-class="col-12"
          placeholder="Any additional notes"
        />

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
      </template>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import BaseForm from '@/components/common/BaseForm.vue';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import Toast from 'primevue/toast';
import { v4 as uuidv4 } from 'uuid';
import { useSupportStore } from '@/stores/useSupportStore';
import { SupportBoostSchema, type Support } from '@/schemas/monitoring-evaluation/Support';
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import {
  BoostTypeEnum,
  ModalityEnum,
  GenderMarkerEnum,
  SupportQuantityUnitEnum,
  ChannelEnum,
} from '@/schemas/enums';
import { useSupportOptions } from '@/composables/useSupportOptions';

useI18n();
const toast = useToast();
const supportStore = useSupportStore();
const { handleApiError } = useErrorHandler();
const {
  getBoostTypeOptions,
  getModalityOptions,
  getChannelOptions,
  getGenderMarkerOptions,
  getSupportQuantityUnitOptions,
  getBeneficiaryGroupOptions,
} = useSupportOptions();

const props = defineProps<{
  isEdit: boolean;
  initialValues: Partial<Support>;
  businessId?: string;
  hideTitle?: boolean;
}>();

const emit = defineEmits(['success', 'cancel']);

/**
 * Helper function to build initial values and reduce cyclomatic complexity.
 * @param initial - Optional partial support data.
 * @param businessId - Optional business ID.
 * @returns A complete Support object.
 */
function getInitialValues(
  initial: Partial<Support> | undefined,
  businessId: string | undefined
): Support {
  const defaultSupport = {
    id: uuidv4(),
    businessId: businessId || '',
    title: '',
    boostType: BoostTypeEnum.enum.Training,
    modality: ModalityEnum.enum['In-person'],
    startDate: new Date(),
    provider: 'UNDP',
    channel: ChannelEnum.enum['In-person'],
    quantity: {
      unit: SupportQuantityUnitEnum.enum.currency,
    },
    genderMarker: GenderMarkerEnum.enum.GEN0,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!initial) return defaultSupport as Support;

  return {
    ...defaultSupport,
    ...initial,
    id: initial.id || defaultSupport.id,
    businessId: initial.businessId || defaultSupport.businessId,
    startDate: initial.startDate ? new Date(initial.startDate) : defaultSupport.startDate,
    endDate: initial.endDate ? new Date(initial.endDate) : undefined,
    quantity: {
      ...defaultSupport.quantity,
      ...initial.quantity,
      value: initial.quantity?.value,
    },
    createdAt: initial.createdAt ? new Date(initial.createdAt) : defaultSupport.createdAt,
    updatedAt: new Date(),
  } as Support;
}

const initialValues = computed<Support>(() =>
  getInitialValues(props.initialValues, props.businessId)
);

const handleSubmit = async (data: Support) => {
  try {
    if (props.isEdit) {
      await supportStore.updateSupport(data.id, data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Support intervention updated successfully',
        life: 3000,
      });
    } else {
      await supportStore.addSupport(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Support intervention created successfully',
        life: 3000,
      });
    }
    emit('success');
  } catch (error) {
    handleApiError(
      error as AppError,
      `Failed to ${props.isEdit ? 'update' : 'create'} support intervention`
    );
  }
};

const boostTypeOptions = computed(() => getBoostTypeOptions());
const modalityOptions = computed(() => getModalityOptions());
const channelOptions = computed(() => getChannelOptions());
const supportQuantityUnitOptions = computed(() => getSupportQuantityUnitOptions());
const genderMarkerOptions = computed(() => getGenderMarkerOptions());
const beneficiaryGroupOptions = computed(() => getBeneficiaryGroupOptions());
</script>
