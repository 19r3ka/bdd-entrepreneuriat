<template>
  <div class="card">
    <Toast />
    <h1 class="m-0">{{ isEdit ? $t('goalForm.edit') : $t('goalForm.new') }}</h1>
    <BaseForm
      v-slot="{ defineField, canSubmit, isSubmitting }"
      :schema="IndicatorDefinitionSchema"
      :initial-values="initialValues"
      :on-submit="handleSubmit"
    >
      <Section :title="$t('goalForm.details')">
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
            name="type"
            :label="$t('goalForm.type')"
            v-bind="defineField('type')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Select
                :model-value="modelValue"
                :options="indicatorTypeOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('goalForm.selectType')"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="name"
            :label="$t('goalForm.name')"
            v-bind="defineField('name')"
            required
            field-class="col-12 md:col-6"
          />

          <FormField
            name="description"
            :label="$t('goalForm.description')"
            v-bind="defineField('description')"
            type="textarea"
            field-class="col-12"
          />
        </div>
      </Section>

      <Section :title="$t('goalForm.targets')">
        <div class="formgrid grid">
          <FormField
            name="baselineValue"
            :label="$t('goalForm.baselineValue')"
            v-bind="defineField('baselineValue')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <InputNumber
                :model-value="modelValue"
                mode="decimal"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="baselineDate"
            :label="$t('goalForm.baselineDate')"
            v-bind="defineField('baselineDate')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Calendar
                :model-value="modelValue"
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="targetValue"
            :label="$t('goalForm.targetValue')"
            v-bind="defineField('targetValue')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <InputNumber
                :model-value="modelValue"
                mode="decimal"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="targetDate"
            :label="$t('goalForm.targetDate')"
            v-bind="defineField('targetDate')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Calendar
                :model-value="modelValue"
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
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
  /**
   * GoalForm Component
   *
   * Form for creating and editing Indicator Definitions (Goals).
   *
   * @component
   * @example
   * <GoalForm
   *   :business-id="businessId"
   *   :is-edit="false"
   *   :initial-values="{}"
   *   @success="handleSuccess"
   *   @cancel="handleCancel"
   * />
   */
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import BaseForm from '@/components/common/BaseForm.vue'
  import FormField from '@/components/common/FormField.vue'
  import Section from '@/components/common/FormSection.vue'
  import Button from 'primevue/button'
  import Select from 'primevue/select'
  import InputNumber from 'primevue/inputnumber'
  import Calendar from 'primevue/calendar'
  import Toast from 'primevue/toast'
  import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue'
  import { useIndicatorStore } from '@/stores/useIndicatorStore'
  import {
    IndicatorDefinitionSchema,
    IndicatorTypeEnum
  } from '@/schemas/monitoring-evaluation/Indicator'
  import type { IndicatorDefinition } from '@/types/monitoring-evaluation/Indicator'
  import { useErrorHandler, type AppError } from '@/composables/useErrorHandler'

  const props = defineProps<{
    isEdit: boolean
    initialValues: Partial<IndicatorDefinition>
    businessId?: string
  }>()

  const emit = defineEmits(['success', 'cancel'])

  const { t } = useI18n()
  const toast = useToast()
  const indicatorStore = useIndicatorStore()
  const { handleApiError } = useErrorHandler()

  const indicatorTypeOptions = computed(() =>
    Object.values(IndicatorTypeEnum.enum).map((value) => ({
      label: t(`indicatorType.${value}`),
      value
    }))
  )

  /**
   *
   */
  async function handleSubmit(data: any) {
    try {
      if (props.isEdit) {
        await indicatorStore.updateIndicator(props.initialValues.id!, data)
        toast.add({
          severity: 'success',
          summary: t('common.success'),
          detail: t('goalForm.updateSuccess', 'Goal updated successfully'),
          life: 3000
        })
      } else {
        await indicatorStore.addIndicator({
          ...data,
          businessId: data.businessId || props.businessId
        })
        toast.add({
          severity: 'success',
          summary: t('common.success'),
          detail: t('goalForm.createSuccess', 'Goal created successfully'),
          life: 3000
        })
      }
      emit('success')
    } catch (error) {
      handleApiError(error as AppError, `Failed to ${props.isEdit ? 'update' : 'create'} goal`)
    }
  }
</script>
