<template>
  <div class="card">
    <Toast />
    <h1 class="m-0">{{ isEdit ? $t('goalForm.edit') : $t('goalForm.new') }}</h1>
    <BaseForm
      v-slot="{ defineField, canSubmit, isSubmitting }"
      :schema="StandardIndicatorSchema"
      :initial-values="fullInitialValues"
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
                :model-value="modelValue as string"
                label="Select Business"
                placeholder="Search for a business..."
                :error="{ _errors: hasError ? ['Business is required'] : [] }"
                @update:model-value="updateModelValue"
              />
            </template>
          </FormField>

          <!-- Type field is now a literal 'standard' in StandardIndicatorSchema, no longer a selectable enum -->
          <!-- The form now specifically creates Standard Indicators -->

          <FormField
            name="name"
            :label="$t('goalForm.name')"
            v-bind="defineField('name')"
            required
            field-class="col-12 md:col-6"
          />

          <FormField
            name="unit"
            :label="$t('goalForm.unit')"
            v-bind="defineField('unit')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Select
                :model-value="modelValue"
                :options="unitOptions"
                option-label="label"
                option-value="value"
                :class="['w-full', { 'p-invalid': hasError }]"
                @update:model-value="updateModelValue"
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

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
            name="baseline"
            :label="$t('goalForm.baselineValue')"
            v-bind="defineField('baseline')"
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
            name="baselineDate"
            :label="$t('goalForm.baselineDate')"
            v-bind="defineField('baselineDate')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Calendar
                :model-value="
                  modelValue && typeof modelValue === 'string' && modelValue !== '{}'
                    ? new Date(modelValue)
                    : null
                "
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="
                  (val: Date | null) =>
                    updateModelValue(val instanceof Date ? val.toISOString() : null)
                "
                @blur="onBlur && onBlur()"
              />
            </template>
          </FormField>

          <FormField
            name="target"
            :label="$t('goalForm.targetValue')"
            v-bind="defineField('target')"
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
            name="targetDate"
            :label="$t('goalForm.targetDate')"
            v-bind="defineField('targetDate')"
            required
            field-class="col-12 md:col-6"
          >
            <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
              <Calendar
                :model-value="
                  modelValue && typeof modelValue === 'string' && modelValue !== '{}'
                    ? new Date(modelValue)
                    : null
                "
                date-format="yy-mm-dd"
                :class="{ 'p-invalid': hasError }"
                @update:model-value="
                  (val: Date | null) =>
                    updateModelValue(val instanceof Date ? val.toISOString() : null)
                "
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import BaseForm from '@/components/common/BaseForm.vue';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import { useIndicatorStore } from '@/stores/useIndicatorStore';
import { StandardIndicatorSchema } from '@/schemas/monitoring-evaluation/indicators/standard'; // Import StandardIndicatorSchema
import type { StandardIndicator } from '@/schemas/monitoring-evaluation/indicators/standard'; // Import StandardIndicator type
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import { IndicatorType } from '@/types/monitoring-evaluation/Indicator';
import { IndicatorUnitEnum } from '@/schemas/enums/monitoring-evaluation';

const props = defineProps<{
  isEdit: boolean;
  initialValues: Partial<StandardIndicator>;
  businessId?: string;
}>();

const emit = defineEmits(['success', 'cancel']);

const { t } = useI18n();
const toast = useToast();
const indicatorStore = useIndicatorStore();
const { handleApiError } = useErrorHandler();

const unitOptions = computed(() =>
  IndicatorUnitEnum.options.map(option => ({
    label: t(`indicatorUnit.${option}`),
    value: option,
  }))
);

const fullInitialValues = computed(() => ({
  id: props.initialValues.id || crypto.randomUUID(),
  name: props.initialValues.name || '',
  description: props.initialValues.description || '',
  unit: props.initialValues.unit || 'count',
  businessId: props.initialValues.businessId || props.businessId || '',
  type: IndicatorType.Standard as const,
  usageCount: props.initialValues.usageCount || 0,
  baseline: props.initialValues.baseline ?? 0,
  baselineDate: props.initialValues.baselineDate
    ? new Date(props.initialValues.baselineDate)
    : new Date(),
  target: props.initialValues.target ?? 0,
  targetDate: props.initialValues.targetDate
    ? new Date(props.initialValues.targetDate)
    : new Date(),
}));

// Removed as StandardIndicator has a fixed type: 'standard'
// const indicatorTypeOptions = computed(() =>
//   Object.values(IndicatorTypeEnum.enum).map((value) => ({
//     label: t(`indicatorType.${value}`),
//     value
//   }))
// )

/**
 *
 */
async function handleSubmit(data: StandardIndicator) {
  try {
    const storeData = {
      name: data.name,
      description: data.description,
      unit: data.unit,
      businessId: data.businessId,
      type: IndicatorType.Standard,
      baselineValue: data.baseline,
      baselineDate: new Date(data.baselineDate),
      targetValue: data.target,
      targetDate: new Date(data.targetDate),
      usageCount: data.usageCount,
    };

    if (props.isEdit) {
      await indicatorStore.updateIndicator(props.initialValues.id!, storeData);
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('goalForm.updateSuccess', 'Goal updated successfully'),
        life: 3000,
      });
    } else {
      await indicatorStore.addIndicator(storeData);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Goal created successfully',
        life: 3000,
      });
    }
    emit('success');
  } catch (error) {
    handleApiError(error as AppError, `Failed to ${props.isEdit ? 'update' : 'create'} goal`);
  }
}
</script>
