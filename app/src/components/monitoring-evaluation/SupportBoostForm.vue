<template>
  <BaseForm
    v-slot="{ defineField, canSubmit, isSubmitting, errors, setFieldValue, values }"
    :schema="SupportBoostSchema"
    :initial-values="initialValues"
    :on-submit="onSubmit"
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
            :placeholder="$t('placeholders.selectBusiness')"
            :class="{ 'p-invalid': hasError }"
            @update:model-value="updateModelValue"
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
            :options="boostTypeOptions"
            option-label="label"
            option-value="value"
            :placeholder="$t('support.selectType')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="updateModelValue"
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
            :options="modalityOptions"
            option-label="label"
            option-value="value"
            :placeholder="$t('support.selectModality')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="updateModelValue"
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
            show-icon
            date-format="mm/dd/yy"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="
              (value: Date | Date[] | (Date | null)[] | null | undefined) => {
                const date = Array.isArray(value) ? value[0] : value
                updateModelValue(
                  date && date instanceof Date ? date.toISOString().split('T')[0] : ''
                )
              }
            "
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
            show-icon
            date-format="mm/dd/yy"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="
              (value: Date | Date[] | (Date | null)[] | null | undefined) => {
                const date = Array.isArray(value) ? value[0] : value
                updateModelValue(
                  date && date instanceof Date ? date.toISOString().split('T')[0] : ''
                )
              }
            "
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
            :options="channelOptions"
            option-label="label"
            option-value="value"
            :placeholder="$t('support.selectChannel')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="updateModelValue"
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
            :options="genderMarkerOptions"
            option-label="label"
            option-value="value"
            :placeholder="$t('support.selectMarker')"
            :class="['w-full', { 'p-invalid': hasError }]"
            @update:model-value="updateModelValue"
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
                  :placeholder="$t('support.valuePlaceholder')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
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
                  :options="unitOptions"
                  option-label="label"
                  option-value="value"
                  :placeholder="$t('support.selectUnit')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
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
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BaseForm from '@/components/common/BaseForm.vue'
  import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue'
  import FormField from '@/components/common/FormField.vue'
  import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import Button from 'primevue/button'
  import DatePicker from 'primevue/datepicker'
  import InputNumber from 'primevue/inputnumber'
  import Select from 'primevue/select'
  import { v4 as uuidv4 } from 'uuid'

  const { t } = useI18n()

  const props = defineProps<{
    initialData?: Partial<Support>
    businessId?: string
  }>()

  const emit = defineEmits<{
    (e: 'submit', data: Support): void
  }>()

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
      currency: props.initialData?.quantity?.currency
    },
    genderMarker: props.initialData?.genderMarker || 'GEN1',
    notes: props.initialData?.notes || '',
    createdAt: props.initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  const onSubmit = async (values: Support) => {
    // Sanitize the data to ensure it's serializable for IndexedDB
    const sanitizedData: Support = {
      ...values,
      // Dates are already strings from the schema/form
      startDate: values.startDate || '',
      endDate: values.endDate || undefined,
      // Clean up quantity object - remove undefined values
      quantity: values.quantity
        ? {
            ...(values.quantity.value !== undefined && values.quantity.value !== null
              ? { value: values.quantity.value }
              : {}),
            ...(values.quantity.unit ? { unit: values.quantity.unit } : {}),
            ...(values.quantity.currency ? { currency: values.quantity.currency } : {})
          }
        : {}
    }

    emit('submit', sanitizedData)
  }

  const boostTypeOptions = computed(() => [
    { label: t('pages.support.boostTypes.financial_grant'), value: 'financial_grant' },
    { label: t('pages.support.boostTypes.financial_match'), value: 'financial_match' },
    { label: t('pages.support.boostTypes.training'), value: 'training' },
    { label: t('pages.support.boostTypes.advisory_mentoring'), value: 'advisory_mentoring' },
    { label: t('pages.support.boostTypes.equipment_infrastructure'), value: 'equipment_infrastructure' },
    { label: t('pages.support.boostTypes.workspace_access'), value: 'workspace_access' },
    { label: t('pages.support.boostTypes.policy_advocacy'), value: 'policy_advocacy' },
    { label: t('pages.support.boostTypes.partnership_linkage'), value: 'partnership_linkage' },
    { label: t('pages.support.boostTypes.market_access'), value: 'market_access' },
    { label: t('pages.support.boostTypes.digitalization_support'), value: 'digitalization_support' }
  ])

  const modalityOptions = computed(() => [
    { label: t('pages.support.modalities.DIM'), value: 'DIM' },
    { label: t('pages.support.modalities.NIM'), value: 'NIM' },
    { label: t('pages.support.modalities.hybrid'), value: 'hybrid' }
  ])

  const channelOptions = computed(() => [
    { label: t('pages.support.channels.in-person'), value: 'in-person' },
    { label: t('pages.support.channels.online'), value: 'online' },
    { label: t('pages.support.channels.hybrid'), value: 'hybrid' }
  ])

  const unitOptions = computed(() => [
    { label: t('pages.support.units.currency'), value: 'currency' },
    { label: t('pages.support.units.sessions'), value: 'sessions' },
    { label: t('pages.support.units.hours'), value: 'hours' },
    { label: t('pages.support.units.participants'), value: 'participants' },
    { label: t('pages.support.units.items'), value: 'items' },
    { label: t('pages.support.units.linkages'), value: 'linkages' },
    { label: t('pages.support.units.docs'), value: 'docs' }
  ])

  const genderMarkerOptions = computed(() => [
    { label: t('pages.support.genderMarkers.GEN0'), value: 'GEN0' },
    { label: t('pages.support.genderMarkers.GEN1'), value: 'GEN1' },
    { label: t('pages.support.genderMarkers.GEN2'), value: 'GEN2' },
    { label: t('pages.support.genderMarkers.GEN3'), value: 'GEN3' }
  ])
</script>
