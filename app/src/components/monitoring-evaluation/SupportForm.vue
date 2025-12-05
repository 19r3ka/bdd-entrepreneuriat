<template>
  <div class="card">
    <Toast />
    <h1 v-if="!hideTitle" class="m-0 mb-3">
      {{ isEdit ? 'Edit Support Intervention' : 'New Support Intervention' }}
    </h1>
    <BaseForm
      v-slot="{ defineField, canSubmit, isSubmitting }"
      :schema="SupportBoostSchema"
      :initial-values="initialValues"
      :on-submit="handleSubmit"
    >
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
                :model-value="modelValue"
                label="Select Business"
                placeholder="Search for a business..."
                :error="{ _errors: hasError ? ['Business is required'] : [] }"
                @update:model-value="updateModelValue"
              />
            </template>
          </FormField>

          <FormField
            name="date"
            label="Date of Intervention"
            v-bind="defineField('date')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <DatePicker
                :model-value="modelValue"
                show-icon
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
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
                :options="SupportModalityOptions"
                option-label="label"
                option-value="value"
                placeholder="Select a modality"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            v-if="defineField('modality').modelValue.value === 'capacity_dev'"
            name="duration"
            :label="$t('supportForm.duration')"
            v-bind="defineField('duration')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <InputNumber
                :model-value="modelValue"
                mode="decimal"
                :min-fraction-digits="0"
                :max-fraction-digits="2"
                suffix=" hrs"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="description"
            label="Description"
            v-bind="defineField('description')"
            required
            type="textarea"
            field-class="col-12"
            class="w-full"
          />
        </div>
      </Section>

      <Section title="Classification">
        <div class="formgrid grid">
          <FormField
            name="theoryOfChange"
            label="Theory of Change"
            v-bind="defineField('theoryOfChange')"
            required
            type="textarea"
            field-class="col-12"
            class="w-full"
          />

          <FormField
            name="sesRiskCategory"
            label="SES Risk Category"
            v-bind="defineField('sesRiskCategory')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Select
                :model-value="modelValue"
                :options="sesRiskCategoryOptions"
                placeholder="Select a SES risk category"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
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
                placeholder="Select a gender marker"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>
        </div>
      </Section>

      <Section
        v-if="defineField('modality').modelValue.value === 'financial_grant'"
        title="Finance Details"
      >
        <div class="formgrid grid">
          <FormField
            name="financeDetails.instrument"
            label="Financial Instrument"
            v-bind="defineField('financeDetails.instrument')"
            required
            field-class="col-12 md:col-4"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Select
                :model-value="modelValue"
                :options="FinanceInstrumentOptions"
                option-label="label"
                option-value="value"
                placeholder="Select an instrument"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>
          <FormField
            name="financeDetails.source"
            label="Financial Source"
            v-bind="defineField('financeDetails.source')"
            required
            field-class="col-12 md:col-4"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Select
                :model-value="modelValue"
                :options="FinanceSourceOptions"
                option-label="label"
                option-value="value"
                placeholder="Select a source"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>
          <FormField
            name="financeDetails.amount"
            label="Amount"
            v-bind="defineField('financeDetails.amount')"
            required
            field-class="col-12 md:col-4"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <InputNumber
                :model-value="modelValue"
                mode="currency"
                currency="USD"
                locale="en-US"
                :class="{ 'p-invalid': hasError }"
                class="w-full"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>
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
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import BaseForm from '@/components/common/BaseForm.vue'
  import FormField from '@/components/common/FormField.vue'
  import Section from '@/components/common/FormSection.vue'
  import Button from 'primevue/button'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import DatePicker from 'primevue/datepicker'
  import Toast from 'primevue/toast'
  import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support'
  import type { Support as SupportType } from '@/types/monitoring-evaluation/Support'
  import { useErrorHandler, type AppError } from '@/composables/useErrorHandler'

  const props = defineProps<{
    isEdit: boolean
    initialValues: Partial<SupportType>
    businessId?: string
    hideTitle?: boolean
  }>()

  const emit = defineEmits(['success', 'cancel'])

  const { t } = useI18n()
  const toast = useToast()
  const supportStore = useSupportStore()
  const { handleApiError } = useErrorHandler()

  const SupportModalityOptions = computed(() =>
    ['DIM', 'NIM', 'hybrid'].map((value) => ({ label: t(`supportModality.${value}`), value }))
  )

  const sesRiskCategoryOptions = computed(() =>
    (['Low', 'High'] as const).map((value) => ({ label: t(`sesRiskCategory.${value}`), value }))
  )

  const genderMarkerOptions = computed(() =>
    (['GEN0', 'GEN1', 'GEN2', 'GEN3'] as const).map((value) => ({
      label: t(`genderMarker.${value}`),
      value
    }))
  )

  const FinanceInstrumentOptions = computed(() =>
    ['grant', 'loan', 'hybrid'].map((value) => ({ label: t(`financeInstrument.${value}`), value }))
  )

  const FinanceSourceOptions = computed(() =>
    ['UNDP_core', 'donor', 'government', 'mixed'].map((value) => ({
      label: t(`financeSource.${value}`),
      value
    }))
  )

  /**
   *
   */
  async function handleSubmit(data: any) {
    try {
      if (props.isEdit) {
        await supportStore.updateSupport(props.initialValues.id!, data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Support intervention updated successfully',
          life: 3000
        })
      } else {
        await supportStore.addSupport({ ...data, businessId: data.businessId || props.businessId })
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Support intervention created successfully',
          life: 3000
        })
      }
      emit('success')
    } catch (error) {
      handleApiError(
        error as AppError,
        `Failed to ${props.isEdit ? 'update' : 'create'} support intervention`
      )
    }
  }
</script>
