<template>
  <div class="quick-win-form">
    <BaseForm :schema="validationSchema" :initial-values="initialValues" @submit="onSubmit">
      <template #default="{ defineField, isSubmitting, values, setFieldValue }">
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
                  :model-value="
                    modelValue instanceof Date
                      ? modelValue
                      : modelValue
                        ? new Date(modelValue as string)
                        : null
                  "
                  show-icon
                  date-format="yy-mm-dd"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  :max-date="new Date()"
                  @update:model-value="updateModelValue"
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
                  :model-value="modelValue as string"
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
                  :options="quickWinCategoryOptions"
                  option-label="label"
                  option-value="value"
                  :placeholder="$t('momentumMetric.placeholders.category', 'Select category')"
                  :class="['w-full', { 'p-invalid': hasError }]"
                  @update:model-value="
                    val => {
                      updateModelValue(val);
                      updateSuggestions(val as string);
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
            <p class="text-600 m-0">
              {{
                $t('quickWin.trackMeasurableResults', 'Track measurable results with indicators')
              }}
            </p>
            <OutputIndicatorSelector
              :placeholder="$t('quickWin.addIndicator')"
              @select="
                (indicator: OutputIndicator) =>
                  addIndicator(
                    indicator,
                    (values as Record<string, any>).indicatorValues,
                    setFieldValue
                  )
              "
            />
          </div>

          <!-- Suggestions -->
          <div v-if="suggestedIndicators.length > 0" class="mb-4">
            <div class="text-sm font-semibold text-700 mb-2">
              {{ $t('quickWin.suggestedIndicators', 'Suggested Indicators:') }}
            </div>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="suggestion in suggestedIndicators"
                :key="suggestion.name"
                :label="suggestion.name"
                icon="pi pi-plus"
                size="small"
                outlined
                severity="secondary"
                @click="
                  addSuggestedIndicator(
                    suggestion,
                    (values as Record<string, any>).indicatorValues,
                    setFieldValue,
                    'performance'
                  )
                "
              />
            </div>
          </div>

          <div
            v-if="
              (values as Record<string, any>).indicatorValues &&
              (values as Record<string, any>).indicatorValues.length > 0
            "
            class="flex flex-column gap-3"
          >
            <QuickWinIndicatorItem
              v-for="(item, index) in (values as Record<string, any>).indicatorValues"
              :key="item.indicatorId"
              :item="item"
              :indicator-name="getIndicatorName(item.indicatorId)"
              :is-boolean="isBooleanUnit(item.indicatorId)"
              :is-numeric="isNumericUnit(item.indicatorId)"
              @remove="
                removeIndicator(
                  index,
                  (values as Record<string, any>).indicatorValues,
                  setFieldValue
                )
              "
              @update="
                (field, val) =>
                  updateIndicatorValue(
                    index,
                    field,
                    val,
                    (values as Record<string, any>).indicatorValues,
                    setFieldValue
                  )
              "
            />
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
                  :model-value="modelValue as string[]"
                  multiple
                  chips
                  :suggestions="filteredTags"
                  dropdown
                  :placeholder="$t('quickWin.tagsPlaceholder', 'e.g. 8.3')"
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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';
import BaseForm from '@/components/common/BaseForm.vue';
import FormField from '@/components/common/FormField.vue';
import FormSection from '@/components/common/FormSection.vue';
import BusinessAutocomplete from '@/components/common/BusinessAutocomplete.vue';
import OutputIndicatorSelector from './OutputIndicatorSelector.vue';
import QuickWinIndicatorItem from './QuickWinIndicatorItem.vue';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import AutoComplete from 'primevue/autocomplete';
import { QuickWinSchema } from '@/schemas/monitoring-evaluation/QuickWin';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import { type OutputIndicator } from '@/schemas/monitoring-evaluation/indicators/output';
import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore';
import { useQuickWinIndicators } from '@/composables/useQuickWinIndicators';
import type { Support } from '@/types/monitoring-evaluation/Support';
import { db } from '@/services/local-db';
import { IndicatorCatalog } from '@/constants/indicatorCatalog';
import { GenderMarkerEnum } from '@/schemas/enums';

const props = defineProps<{
  initialData?: Partial<QuickWin>;
  businessId?: string;
  supportBoostId?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: QuickWin): void;
  (e: 'cancel'): void;
}>();

const { t } = useI18n();
const indicatorStore = useOutputIndicatorStore();
const {
  addIndicator,
  removeIndicator,
  updateIndicatorValue,
  getIndicatorName,
  isNumericUnit,
  isBooleanUnit,
  addSuggestedIndicator,
  indicatorsMap,
} = useQuickWinIndicators();

const businessSupports = ref<Support[]>([]);
const suggestedIndicators = ref<any[]>([]);

const validationSchema = QuickWinSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
});

const quickWinCategoryOptions = computed(() => [
  { label: t('momentumMetric.categories.performance'), value: 'performance' },
  { label: t('momentumMetric.categories.employment_inclusion'), value: 'employment_inclusion' },
  { label: t('momentumMetric.categories.finance_access'), value: 'finance_access' },
  { label: t('momentumMetric.categories.innovation'), value: 'innovation' },
  { label: t('momentumMetric.categories.sustainability'), value: 'sustainability' },
  { label: t('momentumMetric.categories.resilience'), value: 'resilience' },
  { label: t('momentumMetric.categories.digital_adoption'), value: 'digital_adoption' },
  { label: t('momentumMetric.categories.market_integration'), value: 'market_integration' },
]);

const genderMarkerOptions = computed(() =>
  Object.values(GenderMarkerEnum.enum).map(value => ({
    label: t(`quickWin.genderMarkerOptions.${value}`),
    value,
  }))
);

const initialValues = computed<z.infer<typeof validationSchema>>(() => ({
  title: '',
  businessId: props.businessId || '',
  supportBoostId: props.supportBoostId || undefined,
  category: (quickWinCategoryOptions.value[0]?.value as any) || 'performance',
  dimension: 'Digital',
  milestone: undefined,
  resultSummary: '',
  rbmLevel: 'output',
  indicatorValues: [],
  evidenceIds: [],
  tags: [],
  genderMarker: undefined,
  ...props.initialData,
  achievedOn: props.initialData?.achievedOn ? new Date(props.initialData.achievedOn) : new Date(),
}));

const tagsList = ref(['Innovation', 'Digital', 'Green', 'Finance', 'Policy', 'Training']);
const filteredTags = ref<string[]>([]);
const searchTags = (event: { query: string }) => {
  filteredTags.value = tagsList.value.filter(tag =>
    tag.toLowerCase().includes(event.query.toLowerCase())
  );
};

const updateSuggestions = (category: string) => {
  const categoryData = IndicatorCatalog.find(c => c.category === category);
  suggestedIndicators.value = categoryData ? categoryData.indicators : [];
};

onMounted(async () => {
  const bid = props.businessId || initialValues.value.businessId;
  if (bid) {
    businessSupports.value = await db.supports.where('businessId').equals(bid).toArray();
  }

  if (initialValues.value.indicatorValues) {
    for (const val of initialValues.value.indicatorValues) {
      const ind = await indicatorStore.getIndicatorById(val.indicatorId);
      if (ind) {
        indicatorsMap.value[ind.id] = ind;
      }
    }
  }

  if (initialValues.value.category) {
    updateSuggestions(initialValues.value.category as string);
  }
});

const onSubmit = (values: z.infer<typeof validationSchema>) => {
  emit('submit', { ...values, rbmLevel: 'output' } as QuickWin);
};
</script>
