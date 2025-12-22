<template>
  <BaseForm :schema="SupportBoostSchema" :initial-values="initialValues" :on-submit="onSubmit">
    <template #default="{ defineField, canSubmit, isSubmitting, values }">
      <div class="formgrid grid">
        <!-- Title -->
        <FormField
          name="title"
          :label="$t('pages.quickWins.title')"
          v-bind="defineField('title')"
          required
          field-class="col-12"
          :placeholder="$t('pages.quickWins.titlePlaceholder')"
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
              :model-value="modelValue as string"
              :placeholder="$t('placeholders.selectBusiness')"
              :class="{ 'p-invalid': hasError }"
              :disabled="!!props.businessId"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Boost Type -->
        <FormField
          name="boostType"
          :label="$t('pages.quickWins.boostType')"
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
              :placeholder="$t('pages.quickWins.selectType')"
              :class="['w-full', { 'p-invalid': hasError }]"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Modality -->
        <FormField
          name="modality"
          :label="$t('pages.quickWins.modality')"
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
              :placeholder="$t('pages.quickWins.selectModality')"
              :class="['w-full', { 'p-invalid': hasError }]"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Start Date -->
        <FormField
          name="startDate"
          :label="$t('pages.quickWins.startDate')"
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

        <!-- End Date -->
        <FormField
          name="endDate"
          :label="$t('pages.quickWins.endDate')"
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

        <!-- Channel -->
        <FormField
          name="channel"
          :label="$t('pages.quickWins.channel')"
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
              :placeholder="$t('pages.quickWins.selectChannel')"
              :class="['w-full', { 'p-invalid': hasError }]"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Beneficiary Group -->
        <FormField
          name="beneficiaryGroup"
          :label="$t('pages.quickWins.beneficiaryGroup', 'Beneficiary Group')"
          v-bind="defineField('beneficiaryGroup')"
          field-class="col-12 md:col-6"
        >
          <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
            <Select
              :model-value="modelValue"
              :options="beneficiaryGroupOptions"
              option-label="label"
              option-value="value"
              :placeholder="
                $t('pages.quickWins.selectBeneficiaryGroup', 'Select a beneficiary group')
              "
              :class="['w-full', { 'p-invalid': hasError }]"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Gender Marker -->
        <FormField
          name="genderMarker"
          :label="$t('pages.quickWins.genderMarker')"
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
              :placeholder="$t('pages.quickWins.selectMarker')"
              :class="['w-full', { 'p-invalid': hasError }]"
              @update:model-value="updateModelValue"
              @blur="onBlur && onBlur()"
            />
          </template>
        </FormField>

        <!-- Provider -->
        <FormField
          name="provider"
          :label="$t('pages.quickWins.provider')"
          v-bind="defineField('provider')"
          required
          field-class="col-12"
          :placeholder="$t('pages.quickWins.providerPlaceholder')"
        />

        <!-- Quantity Section -->
        <div class="col-12">
          <div class="surface-50 p-3 border-round">
            <h4 class="text-base font-semibold mb-3">{{ $t('pages.quickWins.quantityValue') }}</h4>
            <div class="grid">
              <!-- Value -->
              <FormField
                name="quantity.value"
                :label="$t('pages.quickWins.value')"
                v-bind="defineField('quantity.value')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <InputNumber
                    :model-value="typeof modelValue === 'number' ? modelValue : null"
                    :placeholder="$t('pages.quickWins.valuePlaceholder')"
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>

              <!-- Unit -->
              <FormField
                name="quantity.unit"
                :label="$t('pages.quickWins.unit')"
                v-bind="defineField('quantity.unit')"
                field-class="col-12 md:col-3"
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

              <!-- Currency (conditional) -->
              <FormField
                v-if="(values as any).quantity?.unit === 'currency'"
                name="quantity.currency"
                :label="$t('pages.quickWins.currency')"
                v-bind="defineField('quantity.currency')"
                field-class="col-12 md:col-3"
                :placeholder="$t('pages.quickWins.currencyPlaceholder')"
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <FormField
          name="notes"
          :label="$t('pages.quickWins.notes')"
          v-bind="defineField('notes')"
          type="textarea"
          field-class="col-12"
          :placeholder="$t('pages.quickWins.notesPlaceholder')"
        />

        <!-- Submit Button -->
        <div class="col-12 flex justify-content-end mt-3">
          <Button
            type="submit"
            :label="$t('pages.quickWins.saveSupport')"
            icon="pi pi-check"
            :loading="isSubmitting"
            :disabled="!canSubmit"
            severity="success"
          />
        </div>
      </div>
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseForm from '@/components/common/BaseForm.vue';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import FormField from '@/components/common/FormField.vue';
import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support';
import type { Support } from '@/schemas/monitoring-evaluation/Support';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import { v4 as uuidv4 } from 'uuid';
import {
  BoostTypeEnum,
  ModalityEnum,
  ChannelEnum,
  GenderMarkerEnum,
  SupportQuantityUnitEnum,
} from '@/schemas/enums';
import { useSupportOptions } from '@/composables/useSupportOptions';

useI18n();
const {
  getBoostTypeOptions,
  getModalityOptions,
  getChannelOptions,
  getGenderMarkerOptions,
  getSupportQuantityUnitOptions,
  getBeneficiaryGroupOptions,
} = useSupportOptions();

const props = defineProps<{
  initialData?: Partial<Support>;
  businessId?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Support): void;
}>();

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
  getInitialValues(props.initialData, props.businessId)
);

const onSubmit = async (values: Support) => {
  emit('submit', values);
};

const boostTypeOptions = computed(() => getBoostTypeOptions());
const modalityOptions = computed(() => getModalityOptions());
const channelOptions = computed(() => getChannelOptions());
const supportQuantityUnitOptions = computed(() => getSupportQuantityUnitOptions());
const genderMarkerOptions = computed(() => getGenderMarkerOptions());
const beneficiaryGroupOptions = computed(() => getBeneficiaryGroupOptions());
</script>
