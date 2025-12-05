<template>
  <div class="quick-win-form">
    <BaseForm :schema="validationSchema" :initial-values="initialValues" @submit="onSubmit">
      <template #default="{ defineField, isSubmitting, values, setFieldValue, errors }">
        <!-- Required Fields Section -->
        <FormSection :title="$t('common.requiredFields', 'Required Information')">
          <div class="formgrid grid">
            <FormField
              name="title"
              :label="$t('quickWin.title')"
              v-bind="defineField('title')"
              required
              field-class="col-12"
              :placeholder="$t('quickWin.placeholders.title')"
            />

            <FormField
              name="resultSummary"
              :label="$t('quickWin.resultSummary')"
              v-bind="defineField('resultSummary')"
              required
              type="textarea"
              field-class="col-12"
              :placeholder="$t('quickWin.placeholders.resultSummary')"
            />

            <FormField
              name="achievedOn"
              :label="$t('quickWin.achievedOn')"
              v-bind="defineField('achievedOn')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <DatePicker
                  :model-value="modelValue ? new Date(modelValue) : null"
                  show-icon
                  date-format="yy-mm-dd"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  :max-date="new Date()"
                  @update:model-value="
                    (date) =>
                      updateModelValue(date instanceof Date ? date.toISOString().split('T')[0] : '')
                  "
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="businessId"
              :label="$t('quickWin.business')"
              v-bind="defineField('businessId')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <BusinessAutocomplete
                  :model-value="modelValue"
                  :placeholder="$t('quickWin.placeholders.business')"
                  :class="{ 'p-invalid': hasError }"
                  :disabled="!!props.businessId"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
            <FormField
              name="category"
              :label="$t('momentumMetric.category', 'Category')"
              v-bind="defineField('category')"
              required
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="QuickWinCategories"
                  option-label="label"
                  option-value="value"
                  :placeholder="$t('momentumMetric.placeholders.category', 'Select category')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="
                    (val) => {
                      updateModelValue(val)
                      updateSuggestions(val)
                    }
                  "
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>
        </FormSection>

        <!-- Indicator Values Section -->
        <FormSection :title="$t('quickWin.indicators')">
          <div class="flex justify-content-between align-items-center mb-4">
            <p class="text-600 m-0">Track measurable results with indicators</p>
            <OutputIndicatorSelector
              :placeholder="$t('quickWin.addIndicator')"
              @select="
                (indicator) => addIndicator(indicator, values.indicatorValues, setFieldValue)
              "
            />
          </div>

          <!-- Suggestions -->
          <div v-if="suggestedIndicators.length > 0" class="mb-4">
            <div class="text-sm font-semibold text-700 mb-2">Suggested Indicators:</div>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="suggestion in suggestedIndicators"
                :key="suggestion.name"
                :label="suggestion.name"
                icon="pi pi-plus"
                size="small"
                outlined
                severity="secondary"
                @click="addSuggestedIndicator(suggestion, values.indicatorValues, setFieldValue)"
              />
            </div>
          </div>

          <div
            v-if="values.indicatorValues && values.indicatorValues.length > 0"
            class="flex flex-column gap-3"
          >
            <div
              v-for="(item, index) in values.indicatorValues"
              :key="item.indicatorId"
              class="surface-card p-4 border-round-lg border-1 border-200 relative"
            >
              <Button
                icon="pi pi-times"
                class="p-button-rounded p-button-text p-button-danger absolute"
                style="top: 0.5rem; right: 0.5rem"
                @click="removeIndicator(index, values.indicatorValues, setFieldValue)"
              />

              <div class="font-semibold text-lg mb-3 text-primary pr-8">
                {{ getIndicatorName(item.indicatorId) }}
              </div>

              <!-- Boolean Indicator Layout -->
              <div v-if="isBooleanUnit(item.indicatorId)" class="formgrid grid">
                <div class="field col-12">
                  <label class="font-medium text-sm mb-2 block">{{
                    $t('quickWin.currentValue')
                  }}</label>
                  <SelectButton
                    v-model="item.currentValue"
                    :options="[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false }
                    ]"
                    option-label="label"
                    option-value="value"
                    @change="
                      () =>
                        updateIndicatorValue(
                          index,
                          'currentValue',
                          item.currentValue,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
                <div class="field col-12">
                  <label class="font-medium text-sm mb-2 block">{{
                    $t('common.notes', 'Notes')
                  }}</label>
                  <InputText
                    v-model="item.notes"
                    :placeholder="$t('quickWin.placeholders.indicatorNotes')"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'notes',
                          (e.target as HTMLInputElement)?.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
              </div>

              <!-- Numeric/Text Indicator Layout -->
              <div v-else class="formgrid grid">
                <div class="field col-12 md:col-4">
                  <label class="font-medium text-sm mb-2 block">{{
                    $t('quickWin.baseline')
                  }}</label>
                  <InputNumber
                    v-if="isNumericUnit(item.indicatorId)"
                    v-model="item.baseline"
                    :min-fraction-digits="0"
                    :max-fraction-digits="2"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'baseline',
                          e.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                  <InputText
                    v-else
                    v-model="item.baseline"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'baseline',
                          (e.target as HTMLInputElement)?.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
                <div class="field col-12 md:col-4">
                  <label class="font-medium text-sm mb-2 block">{{ $t('quickWin.target') }}</label>
                  <InputNumber
                    v-if="isNumericUnit(item.indicatorId)"
                    v-model="item.target"
                    :min-fraction-digits="0"
                    :max-fraction-digits="2"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'target',
                          e.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                  <InputText
                    v-else
                    v-model="item.target"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'target',
                          (e.target as HTMLInputElement)?.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
                <div class="field col-12 md:col-4">
                  <label class="font-medium text-sm mb-2 block">{{
                    $t('quickWin.currentValue')
                  }}</label>
                  <InputNumber
                    v-if="isNumericUnit(item.indicatorId)"
                    v-model="item.currentValue"
                    :min-fraction-digits="0"
                    :max-fraction-digits="2"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'currentValue',
                          e.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                  <InputText
                    v-else
                    v-model="item.currentValue"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'currentValue',
                          (e.target as HTMLInputElement)?.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
                <div class="field col-12">
                  <label class="font-medium text-sm mb-2 block">{{
                    $t('common.notes', 'Notes')
                  }}</label>
                  <InputText
                    v-model="item.notes"
                    :placeholder="$t('quickWin.placeholders.indicatorNotes')"
                    class="w-full"
                    @input="
                      (e) =>
                        updateIndicatorValue(
                          index,
                          'notes',
                          (e.target as HTMLInputElement)?.value,
                          values.indicatorValues,
                          setFieldValue
                        )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-5 surface-ground border-round-lg text-600">
            <i class="pi pi-chart-line text-4xl mb-3 block text-400"></i>
            <p class="m-0">{{ $t('quickWin.noIndicators') }}</p>
          </div>
        </FormSection>

        <!-- Optional Details Section -->
        <FormSection :title="$t('quickWin.sections.advanced')" :initially-collapsed="true">
          <div class="formgrid grid">
            <FormField
              name="supportBoostId"
              :label="$t('quickWin.supportBoost')"
              v-bind="defineField('supportBoostId')"
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="businessSupports"
                  option-label="title"
                  option-value="id"
                  :placeholder="$t('quickWin.placeholders.selectSupport')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  show-clear
                  :disabled="!!props.supportBoostId"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="genderMarker"
              :label="$t('quickWin.genderMarker')"
              v-bind="defineField('genderMarker')"
              field-class="col-12 md:col-6"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <Select
                  :model-value="modelValue"
                  :options="genderMarkerOptions"
                  option-label="label"
                  option-value="value"
                  :placeholder="$t('quickWin.placeholders.genderMarker')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>

            <FormField
              name="tags"
              :label="$t('quickWin.tags')"
              v-bind="defineField('tags')"
              field-class="col-12"
            >
              <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                <AutoComplete
                  :model-value="modelValue"
                  multiple
                  chips
                  :suggestions="filteredTags"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="updateModelValue"
                  @complete="searchTags"
                  @blur="onBlur && onBlur()"
                />
              </template>
            </FormField>
          </div>
        </FormSection>

        <!-- Action Buttons -->
        <div class="flex justify-content-end gap-3 mt-5">
          <Button
            type="button"
            :label="$t('common.cancel')"
            severity="secondary"
            outlined
            @click="$emit('cancel')"
          />
          <Button type="submit" :label="$t('common.save')" :loading="isSubmitting" />
        </div>
      </template>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BaseForm from '@/components/common/BaseForm.vue'
  import FormField from '@/components/common/FormField.vue'
  import FormSection from '@/components/common/FormSection.vue'
  import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue'
  import OutputIndicatorSelector from './OutputIndicatorSelector.vue'
  import Select from 'primevue/select'
  import Button from 'primevue/button'
  import DatePicker from 'primevue/datepicker'
  import InputText from 'primevue/inputtext'
  import InputNumber from 'primevue/inputnumber'
  import SelectButton from 'primevue/selectbutton'
  import AutoComplete from 'primevue/autocomplete'
  import { QuickWinSchema } from '@/schemas/monitoring-evaluation/QuickWin'
  import type { QuickWin, QuickWinIndicatorValue } from '@/types/monitoring-evaluation/QuickWin'
  import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator'
  import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import { db } from '@/services/local-db'
  import { IndicatorCatalog, QuickWinCategories } from '@/constants/indicatorCatalog'
  import { MaturityDimensions, MaturityCatalog } from '@/constants/maturityCatalog'

  const props = defineProps<{
    initialData?: Partial<QuickWin>
    businessId?: string
    supportBoostId?: string
  }>()

  const emit = defineEmits<{
    (e: 'submit', data: any): void
    (e: 'cancel'): void
  }>()

  const { t } = useI18n()
  const indicatorStore = useOutputIndicatorStore()

  const businessSupports = ref<Support[]>([])
  const indicatorsMap = ref<Record<string, OutputIndicator>>({})
  const suggestedIndicators = ref<any[]>([])

  const validationSchema = QuickWinSchema.omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true
  })

  const initialValues = computed(() => ({
    title: '',
    businessId: props.businessId || '',
    supportBoostId: props.supportBoostId || undefined,
    category: undefined,
    dimension: undefined,
    milestone: undefined,
    achievedOn: new Date().toISOString().split('T')[0],
    resultSummary: '',
    indicatorValues: [],
    tags: [],
    genderMarker: undefined,
    ...props.initialData
  }))

  const genderMarkerOptions = [
    { label: 'GEN0 - Gender Blind', value: 'GEN0' },
    { label: 'GEN1 - Gender Targeted', value: 'GEN1' },
    { label: 'GEN2 - Gender Responsive', value: 'GEN2' },
    { label: 'GEN3 - Gender Transformative', value: 'GEN3' }
  ]

  // Tags
  const tags = ref(['Innovation', 'Digital', 'Green', 'Finance', 'Policy', 'Training'])
  const filteredTags = ref<string[]>([])
  const searchTags = (event: { query: string }) => {
    filteredTags.value = tags.value.filter((tag) =>
      tag.toLowerCase().includes(event.query.toLowerCase())
    )
  }

  // Indicators Logic
  const addIndicator = (
    indicator: OutputIndicator,
    currentList: QuickWinIndicatorValue[],
    setFieldValue: any
  ) => {
    if (currentList.some((i) => i.indicatorId === indicator.id)) {
      return
    }

    const newValue: QuickWinIndicatorValue = {
      indicatorId: indicator.id,
      baseline: undefined,
      target: undefined,
      currentValue: undefined,
      notes: ''
    }

    indicatorsMap.value[indicator.id] = indicator
    setFieldValue('indicatorValues', [...currentList, newValue])
  }

  const removeIndicator = (
    index: number,
    currentList: QuickWinIndicatorValue[],
    setFieldValue: any
  ) => {
    const newList = [...currentList]
    newList.splice(index, 1)
    setFieldValue('indicatorValues', newList)
  }

  const updateIndicatorValue = (
    index: number,
    field: keyof QuickWinIndicatorValue,
    value: any,
    currentList: QuickWinIndicatorValue[],
    setFieldValue: any
  ) => {
    const newList = [...currentList]
    if (newList[index]) {
      newList[index] = { ...newList[index], [field]: value }
      setFieldValue('indicatorValues', newList)
    }
  }

  const getIndicatorName = (id: string) => indicatorsMap.value[id]?.name || 'Unknown Indicator'
  const getIndicatorUnit = (id: string) => indicatorsMap.value[id]?.unit || ''

  const isNumericUnit = (id: string) => {
    const unit = getIndicatorUnit(id)
    return ['count', 'percent', 'hours', 'currency', 'index'].includes(unit)
  }

  const isBooleanUnit = (id: string) => getIndicatorUnit(id) === 'boolean'

  // Suggestions Logic
  const updateSuggestions = (category: string) => {
    const categoryData = IndicatorCatalog.find((c) => c.category === category)
    suggestedIndicators.value = categoryData ? categoryData.indicators : []
  }

  const milestoneOptions = ref<{ label: string; value: number }[]>([])

  const updateMilestoneSuggestions = (dimension: string) => {
    if (dimension && MaturityCatalog[dimension as keyof typeof MaturityCatalog]) {
      milestoneOptions.value = MaturityCatalog[dimension as keyof typeof MaturityCatalog].map(
        (m) => ({
          label: `Level ${m.level}: ${m.name}`,
          value: m.level
        })
      )
    } else {
      milestoneOptions.value = []
    }
  }

  const updateIndicatorSuggestionsFromMilestone = (dimension: string, milestoneLevel: number) => {
    if (dimension && milestoneLevel && MaturityCatalog[dimension as keyof typeof MaturityCatalog]) {
      const milestone = MaturityCatalog[dimension as keyof typeof MaturityCatalog].find(
        (m) => m.level === milestoneLevel
      )
      if (milestone) {
        suggestedIndicators.value = milestone.requiredIndicators
      }
    }
  }

  const addSuggestedIndicator = async (
    suggestion: any,
    currentList: QuickWinIndicatorValue[],
    setFieldValue: any
  ) => {
    // Check if indicator already exists in store
    let indicator = await indicatorStore.findIndicatorByName(suggestion.name)

    if (!indicator) {
      // Create new indicator if not found
      indicator = await indicatorStore.addIndicator({
        name: suggestion.name,
        unit: suggestion.unit,
        category: suggestion.category || 'capacity_development', // Default or map category
        description: `Auto-created from ${suggestion.category} suggestion`,
        isStandard: false,
        usageCount: 0
      })
    }

    if (indicator) {
      addIndicator(indicator, currentList, setFieldValue)
    }
  }

  // Fetch data on mount
  onMounted(async () => {
    if (props.businessId || initialValues.value.businessId) {
      const bid = props.businessId || initialValues.value.businessId
      if (bid) {
        businessSupports.value = await db.supports.where('businessId').equals(bid).toArray()
      }
    }

    if (initialValues.value.indicatorValues) {
      for (const val of initialValues.value.indicatorValues) {
        const ind = await indicatorStore.getIndicatorById(val.indicatorId)
        if (ind) {
          indicatorsMap.value[ind.id] = ind
        }
      }
    }

    if (initialValues.value.category) {
      updateSuggestions(initialValues.value.category)
    }

    if (initialValues.value.dimension) {
      updateMilestoneSuggestions(initialValues.value.dimension)
      if (initialValues.value.milestone) {
        updateIndicatorSuggestionsFromMilestone(
          initialValues.value.dimension,
          initialValues.value.milestone
        )
      }
    }
  })

  // Watch for category changes to update suggestions
  // Note: We need access to 'values' from the form context, but here we only have initialValues.
  // BaseForm doesn't expose values to parent scope easily unless we use a ref or watch inside the slot.
  // Since we are inside the script setup, we can't easily watch the form values directly without binding.
  // However, we can use the 'change' event on the dropdown in the template to trigger updateSuggestions.

  const onSubmit = (values: any) => {
    emit('submit', values)
  }
</script>

<style scoped>
  .quick-win-form :deep(.p-panel-content) {
    padding-top: 1rem;
  }
</style>
