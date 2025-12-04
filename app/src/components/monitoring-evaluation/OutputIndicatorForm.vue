<template>
  <div class="output-indicator-form">
    <BaseForm :schema="schema" :initial-values="initialValues" @submit="onSubmit">
      <template #default="{ defineField, isSubmitting }">
        <div class="grid formgrid p-fluid">
          <!-- Core Fields -->
          <div class="col-12">
            <FormField
              name="name"
              :label="$t('outputIndicator.name')"
              v-bind="defineField('name')"
              required
              :placeholder="$t('outputIndicator.placeholders.name')"
            />
          </div>

          <div class="col-12">
            <FormField
              name="description"
              :label="$t('outputIndicator.description')"
              v-bind="defineField('description')"
              type="textarea"
              :placeholder="$t('outputIndicator.placeholders.description')"
            />
          </div>

          <div class="col-12 md:col-6">
            <FormField
              name="category"
              :label="$t('outputIndicator.category')"
              v-bind="defineField('category')"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  :options="categoryOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="$t('outputIndicator.placeholders.category')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>

          <div class="col-12 md:col-6">
            <FormField
              name="unit"
              :label="$t('outputIndicator.unit')"
              v-bind="defineField('unit')"
              required
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  :options="unitOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="$t('outputIndicator.placeholders.unit')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>

          <!-- UNDP Alignment -->
          <div class="col-12">
            <div class="text-lg font-medium mb-2 mt-2">
              {{ $t('outputIndicator.sections.alignment') }}
            </div>
          </div>

          <div class="col-12 md:col-6">
            <FormField
              name="irrfIndicatorCode"
              :label="$t('outputIndicator.irrfIndicatorCode')"
              v-bind="defineField('irrfIndicatorCode')"
              placeholder="e.g. 1.1.1"
            />
          </div>

          <div class="col-12 md:col-6">
            <FormField
              name="cpdOutputCode"
              :label="$t('outputIndicator.cpdOutputCode')"
              v-bind="defineField('cpdOutputCode')"
              placeholder="e.g. 2.1"
            />
          </div>

          <div class="col-12">
            <FormField
              name="sdgTargets"
              :label="$t('outputIndicator.sdgTargets')"
              v-bind="defineField('sdgTargets')"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <AutoComplete
                  :model-value="modelValue"
                  @update:model-value="updateModelValue"
                  multiple
                  :suggestions="filteredSdgs"
                  @complete="searchSdgs"
                  dropdown
                  placeholder="e.g. 8.3"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>

          <div class="col-12 flex justify-content-end mt-4">
            <Button
              type="button"
              :label="$t('common.cancel')"
              class="p-button-text mr-2"
              @click="$emit('cancel')"
            />
            <Button type="submit" :label="$t('common.save')" :loading="isSubmitting" />
          </div>
        </div>
      </template>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BaseForm from '@/components/common/BaseForm.vue'
  import FormField from '@/components/common/FormField.vue'
  import Select from 'primevue/select'
  import Button from 'primevue/button'
  import AutoComplete from 'primevue/autocomplete'
  import { OutputIndicatorSchema } from '@/schemas/monitoring-evaluation/OutputIndicator'
  import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator'

  const props = defineProps<{
    initialData?: Partial<OutputIndicator>
  }>()

  const emit = defineEmits<{
    (e: 'submit', data: Omit<OutputIndicator, 'id' | 'createdAt' | 'updatedAt'>): void
    (e: 'cancel'): void
  }>()

  const { t } = useI18n()

  // Schema for form validation (omit system fields)
  const schema = OutputIndicatorSchema.omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    usageCount: true,
    isStandard: true
  })

  const initialValues = computed(() => ({
    name: '',
    description: '',
    category: undefined,
    unit: 'count',
    irrfIndicatorCode: '',
    cpdOutputCode: '',
    sdgTargets: [],
    ...props.initialData
  }))

  const categoryOptions = [
    { label: t('outputIndicator.categories.capacity_development'), value: 'capacity_development' },
    { label: t('outputIndicator.categories.access_to_finance'), value: 'access_to_finance' },
    { label: t('outputIndicator.categories.market_access'), value: 'market_access' },
    { label: t('outputIndicator.categories.policy_regulatory'), value: 'policy_regulatory' },
    {
      label: t('outputIndicator.categories.innovation_sustainability'),
      value: 'innovation_sustainability'
    },
    {
      label: t('outputIndicator.categories.digital_transformation'),
      value: 'digital_transformation'
    }
  ]

  const unitOptions = [
    { label: t('outputIndicator.units.count'), value: 'count' },
    { label: t('outputIndicator.units.percent'), value: 'percent' },
    { label: t('outputIndicator.units.boolean'), value: 'boolean' },
    { label: t('outputIndicator.units.hours'), value: 'hours' },
    { label: t('outputIndicator.units.currency'), value: 'currency' },
    { label: t('outputIndicator.units.index'), value: 'index' },
    { label: t('outputIndicator.units.text'), value: 'text' }
  ]

  // SDG Autocomplete
  const sdgList = [
    '1.1',
    '1.2',
    '1.3',
    '1.4',
    '1.5',
    '1.a',
    '1.b',
    '5.1',
    '5.5',
    '5.a',
    '5.b',
    '5.c',
    '8.1',
    '8.2',
    '8.3',
    '8.4',
    '8.5',
    '8.6',
    '8.7',
    '8.8',
    '8.9',
    '8.10',
    '8.a',
    '8.b',
    '9.1',
    '9.2',
    '9.3',
    '9.4',
    '9.5',
    '9.a',
    '9.b',
    '9.c',
    '10.1',
    '10.2',
    '10.3',
    '10.4',
    '10.5',
    '10.6',
    '10.7',
    '10.a',
    '10.b',
    '10.c',
    '12.1',
    '12.2',
    '12.3',
    '12.4',
    '12.5',
    '12.6',
    '12.7',
    '12.8',
    '12.a',
    '12.b',
    '12.c',
    '17.1',
    '17.17'
  ]
  const filteredSdgs = ref<string[]>([])

  const searchSdgs = (event: { query: string }) => {
    filteredSdgs.value = sdgList.filter((sdg) => sdg.includes(event.query))
  }

  const onSubmit = async (values: any) => {
    emit('submit', values)
  }
</script>
