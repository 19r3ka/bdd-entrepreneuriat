<template>
  <BaseForm
    :schema="SupportBoostSchema"
    :initial-values="initialValues"
    :on-submit="onSubmit"
    v-slot="{ defineField, canSubmit, isSubmitting, errors, setFieldValue, values }"
  >
    <div class="formgrid grid">
      <!-- Title -->
      <FormField
        name="title"
        :label="$t('support.title')"
        v-bind="defineField('title')"
        required
        field-class="col-12"
        :placeholder="$t('support.titlePlaceholder')"
      />

      <!-- Business -->
      <FormField
        name="businessId"
        :label="$t('forms.business.name')"
        v-bind="defineField('businessId')"
        required
        field-class="col-12"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <BusinessAutocomplete
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            :placeholder="$t('placeholders.selectBusiness')"
            :class="{ 'p-invalid': hasError }"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Boost Type -->
      <FormField
        name="boostType"
        :label="$t('support.boostType')"
        v-bind="defineField('boostType')"
        required
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <Select
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            :options="boostTypeOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('support.selectType')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Modality -->
      <FormField
        name="modality"
        :label="$t('support.modality')"
        v-bind="defineField('modality')"
        required
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <Select
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            :options="modalityOptions"
            :placeholder="$t('support.selectModality')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Start Date -->
      <FormField
        name="startDate"
        :label="$t('support.startDate')"
        v-bind="defineField('startDate')"
        required
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <DatePicker
            :model-value="modelValue ? new Date(modelValue) : null"
            @update:model-value="(date) => updateModelValue(date ? date.toISOString().split('T')[0] : '')"
            showIcon
            dateFormat="mm/dd/yy"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- End Date -->
      <FormField
        name="endDate"
        :label="$t('support.endDate')"
        v-bind="defineField('endDate')"
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <DatePicker
            :model-value="modelValue ? new Date(modelValue) : null"
            @update:model-value="(date) => updateModelValue(date ? date.toISOString().split('T')[0] : '')"
            showIcon
            dateFormat="mm/dd/yy"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Channel -->
      <FormField
        name="channel"
        :label="$t('support.channel')"
        v-bind="defineField('channel')"
        required
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <Select
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            :options="channelOptions"
            :placeholder="$t('support.selectChannel')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Gender Marker -->
      <FormField
        name="genderMarker"
        :label="$t('support.genderMarker')"
        v-bind="defineField('genderMarker')"
        required
        field-class="col-12 md:col-6"
      >
        <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
          <Select
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            :options="genderMarkerOptions"
            :placeholder="$t('support.selectMarker')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @blur="onBlur && onBlur()"
          />
        </template>
      </FormField>

      <!-- Provider -->
      <FormField
        name="provider"
        :label="$t('support.provider')"
        v-bind="defineField('provider')"
        required
        field-class="col-12"
        :placeholder="$t('support.providerPlaceholder')"
      />

      <!-- Quantity Section -->
      <div class="col-12">
        <div class="surface-50 p-3 border-round">
          <h4 class="text-base font-semibold mb-3">{{ $t('support.quantityValue') }}</h4>
          <div class="grid">
            <!-- Value -->
            <FormField
              name="quantity.value"
              :label="$t('support.value')"
              v-bind="defineField('quantity.value')"
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <InputNumber
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  :placeholder="$t('support.valuePlaceholder')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <!-- Unit -->
            <FormField
              name="quantity.unit"
              :label="$t('support.unit')"
              v-bind="defineField('quantity.unit')"
              field-class="col-12 md:col-3"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  :options="unitOptions"
                  :placeholder="$t('support.selectUnit')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <!-- Currency (conditional) -->
            <FormField
              v-if="values.quantity?.unit === 'currency'"
              name="quantity.currency"
              :label="$t('support.currency')"
              v-bind="defineField('quantity.currency')"
              field-class="col-12 md:col-3"
              :placeholder="$t('support.currencyPlaceholder')"
            />
          </div>
        </div>
      </div>

      <!-- Notes -->
      <FormField
        name="notes"
        :label="$t('support.notes')"
        v-bind="defineField('notes')"
        type="textarea"
        field-class="col-12"
        :placeholder="$t('support.notesPlaceholder')"
      />

      <!-- Submit Button -->
      <div class="col-12 flex justify-content-end mt-3">
        <Button
          type="submit"
          :label="$t('support.saveSupport')"
          icon="pi pi-check"
          :loading="isSubmitting"
          :disabled="!canSubmit"
          severity="success"
        />
      </div>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseForm from '@/components/common/BaseForm.vue';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import FormField from '@/components/common/FormField.vue';
import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support';
import type { Support } from '@/types/monitoring-evaluation/Support';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{
  initialData?: Partial<Support>;
  businessId?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Support): void;
}>();

const initialValues = computed(() => ({
  id: props.initialData?.id || uuidv4(),
  businessId: props.initialData?.businessId || props.businessId || '',
  title: props.initialData?.title || '',
  boostType: props.initialData?.boostType || undefined,
  modality: props.initialData?.modality || undefined,
  startDate: props.initialData?.startDate || new Date().toISOString().split('T')[0],
  endDate: props.initialData?.endDate || undefined,
  provider: props.initialData?.provider || 'UNDP',
  channel: props.initialData?.channel || undefined,
  quantity: {
    value: props.initialData?.quantity?.value,
    unit: props.initialData?.quantity?.unit,
    currency: props.initialData?.quantity?.currency,
  },
  genderMarker: props.initialData?.genderMarker || 'GEN1',
  notes: props.initialData?.notes || '',
  createdAt: props.initialData?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const onSubmit = async (values: Support) => {
  // Sanitize the data to ensure it's serializable for IndexedDB
  const sanitizedData: Support = {
    ...values,
    // Ensure dates are ISO strings, not Date objects
    // Treat empty strings as undefined for optional fields
    startDate: typeof values.startDate === 'string' ? values.startDate : values.startDate?.toISOString?.().split('T')[0] || '',
    endDate: values.endDate && values.endDate !== '' 
      ? (typeof values.endDate === 'string' ? values.endDate : values.endDate?.toISOString?.().split('T')[0]) 
      : undefined,
    // Clean up quantity object - remove undefined values
    quantity: values.quantity ? {
      ...(values.quantity.value !== undefined && values.quantity.value !== null ? { value: values.quantity.value } : {}),
      ...(values.quantity.unit ? { unit: values.quantity.unit } : {}),
      ...(values.quantity.currency ? { currency: values.quantity.currency } : {}),
    } : {},
  };
  
  emit('submit', sanitizedData);
};

const boostTypeOptions = [
  { label: 'Financial Grant', value: 'financial_grant' },
  { label: 'Financial Match', value: 'financial_match' },
  { label: 'Training', value: 'training' },
  { label: 'Advisory / Mentoring', value: 'advisory_mentoring' },
  { label: 'Equipment / Infrastructure', value: 'equipment_infrastructure' },
  { label: 'Workspace Access', value: 'workspace_access' },
  { label: 'Policy Advocacy', value: 'policy_advocacy' },
  { label: 'Partnership Linkage', value: 'partnership_linkage' },
  { label: 'Market Access', value: 'market_access' },
  { label: 'Digitalization Support', value: 'digitalization_support' },
];

const modalityOptions = ['DIM', 'NIM', 'hybrid'];
const channelOptions = ['in-person', 'online', 'hybrid'];
const unitOptions = ['currency', 'sessions', 'hours', 'participants', 'items', 'linkages', 'docs'];
const genderMarkerOptions = ['GEN0', 'GEN1', 'GEN2', 'GEN3'];
</script>
