<template>
  <div class="momentum-metric-form">
    <div class="p-fluid">
      <!-- Header is handled by parent Dialog, but we follow the internal structure -->

      <div class="flex flex-column gap-4">
        <!-- Row 1: Title -->
        <div class="field">
          <label for="title" class="font-bold block mb-2"
            >{{ $t('momentumMetric.title', 'Title') }} <span class="text-red-500">*</span></label
          >
          <InputText
            id="title"
            v-model="form.title"
            :class="['w-full', { 'p-invalid': errors.title }]"
            placeholder="e.g. Increased Revenue"
          />
          <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
        </div>

        <!-- Row 2: Business & Quick Win -->
        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="businessId" class="font-bold block mb-2"
              >{{ $t('business.label', 'Business') }} <span class="text-red-500">*</span></label
            >
            <InputText
              id="businessId"
              :value="businessName || businessId"
              readonly
              class="surface-200 w-full"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="quickWinId" class="font-bold block mb-2">{{
              $t('momentumMetric.quickWinId', 'Quick Win ID')
            }}</label>
            <Select
              id="quickWinId"
              v-model="form.quickWinId"
              :options="quickWinOptions"
              option-label="title"
              option-value="id"
              placeholder="Search and select a quick win..."
              filter
              show-clear
              :disabled="isQuickWinContext"
              class="w-full"
              @change="handleQuickWinChange"
            />
            <!-- Disabled if form opened from Quick Win context to prevent changing parent -->
          </div>
        </div>

        <!-- Row 3: Category & Gender Marker -->
        <div v-if="!isInherited" class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="category" class="font-bold block mb-2"
              >{{ $t('momentumMetric.category', 'Category') }}
              <span class="text-red-500">*</span></label
            >
            <Select
              id="category"
              v-model="form.category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              :class="['w-full', { 'p-invalid': errors.category }]"
              :placeholder="$t('momentumMetric.placeholders.category', 'Select category')"
              @change="updateSuggestions(form.category)"
            />
            <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="genderMarker" class="font-bold block mb-2">{{
              $t('momentumMetric.genderMarker', 'Gender Marker')
            }}</label>
            <Select
              id="genderMarker"
              v-model="form.genderMarker"
              :options="genderMarkerOptions"
              option-label="label"
              option-value="value"
              :placeholder="$t('momentumMetric.placeholders.genderMarker', 'Select gender marker')"
              class="w-full"
            />
          </div>
        </div>

        <!-- Row 3.5: Dimension -->
        <div v-if="!isInherited" class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="dimension" class="font-bold block mb-2">{{
              $t('momentumMetric.dimension', 'Maturity Dimension')
            }}</label>
            <Select
              id="dimension"
              v-model="form.dimension"
              :options="[...MaturityDimensions]"
              :placeholder="$t('momentumMetric.placeholders.dimension', 'Select dimension')"
              class="w-full"
            />
          </div>
        </div>

        <!-- Row 4: RBM Level & Codes -->
        <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <label for="rbmLevel" class="font-bold block mb-2">{{
              $t('momentumMetric.rbmLevel', 'RBM Level')
            }}</label>
            <InputText
              id="rbmLevel"
              v-model="form.rbmLevel"
              readonly
              class="surface-200 text-color-secondary w-full"
            />
          </div>

          <div v-if="!isInherited" class="field col-12 md:col-4">
            <label for="cpdOutputCode" class="font-bold block mb-2">{{
              $t('momentumMetric.cpdOutputCode', 'CPD Output Code')
            }}</label>
            <InputText
              id="cpdOutputCode"
              v-model="form.cpdOutputCode"
              placeholder="e.g. 2.1"
              class="w-full"
            />
          </div>

          <div v-if="!isInherited" class="field col-12 md:col-4">
            <label for="spOutcomeCode" class="font-bold block mb-2">{{
              $t('momentumMetric.spOutcomeCode', 'SP Outcome Code')
            }}</label>
            <InputText
              id="spOutcomeCode"
              v-model="form.spOutcomeCode"
              placeholder="e.g. 3.2"
              class="w-full"
            />
          </div>
        </div>

        <!-- Row 5: IRRF & SDG -->
        <div v-if="!isInherited" class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="irrfIndicatorIds" class="font-bold block mb-2">{{
              $t('momentumMetric.irrfIndicatorIds', 'IRRF Indicator IDs')
            }}</label>
            <AutoComplete
              id="irrfIndicatorIds"
              v-model="form.irrfIndicatorIds"
              multiple
              chips
              :suggestions="filteredIrrfIds"
              placeholder="Select or type IDs..."
              class="w-full"
              @complete="searchIrrfIds"
            />
          </div>

          <div class="field col-12 md:col-6">
            <label for="sdgTargets" class="font-bold block mb-2">{{
              $t('momentumMetric.sdgTargets', 'SDG Targets')
            }}</label>
            <AutoComplete
              id="sdgTargets"
              v-model="form.sdgTargets"
              multiple
              chips
              :suggestions="filteredSdgs"
              placeholder="Select targets..."
              class="w-full"
              @complete="searchSdgs"
            />
          </div>
        </div>

        <!-- Row 6: Narrative -->
        <div class="field">
          <label for="contributionNarrative" class="font-bold block mb-2">{{
            $t('momentumMetric.contributionNarrative', 'Contribution Narrative')
          }}</label>
          <Textarea
            id="contributionNarrative"
            v-model="form.contributionNarrative"
            rows="4"
            auto-resize
            placeholder="Describe how the support contributed to this result..."
            class="w-full"
          />
        </div>

        <!-- Indicators Section -->
        <div class="mt-4">
          <div class="flex justify-content-between align-items-center mb-3">
            <h2 class="text-lg font-bold m-0">
              {{ $t('momentumMetric.indicators', 'Indicators') }}
            </h2>
            <Button
              :label="$t('momentumMetric.addIndicator', 'Add Indicator')"
              icon="pi pi-plus"
              size="small"
              outlined
              @click="addIndicator"
            />
          </div>

          <!-- Suggestions -->
          <div v-if="suggestedIndicators.length > 0" class="mb-4 p-3 surface-50 border-round">
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
                @click="addSuggestedIndicator(suggestion)"
              />
            </div>
          </div>

          <div
            v-if="form.indicators.length === 0"
            class="text-center p-5 surface-ground border-round-lg text-600 border-1 border-dashed border-300"
          >
            <i class="pi pi-chart-bar text-4xl mb-3 block text-400"></i>
            <p class="m-0">{{ $t('momentumMetric.noIndicators', 'No indicators added yet.') }}</p>
          </div>

          <div v-else class="flex flex-column gap-4">
            <MomentumIndicatorCard
              v-for="(indicator, index) in form.indicators"
              :key="index"
              :indicator="indicator"
              :unit-options="unitOptions"
              @update="(updated) => updateIndicator(index, updated)"
              @remove="removeIndicator(index)"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-content-end gap-2 mt-4 pt-4 border-top-1 surface-border">
          <Button
            :label="$t('common.cancel')"
            icon="pi pi-times"
            text
            class="p-button-secondary"
            @click="$emit('cancel')"
          />
          <Button
            :label="$t('common.save')"
            icon="pi pi-check"
            :loading="loading"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import InputText from 'primevue/inputtext'
  import Textarea from 'primevue/textarea'
  import Select from 'primevue/select'
  import Button from 'primevue/button'
  import AutoComplete from 'primevue/autocomplete'
  import MomentumIndicatorCard from './MomentumIndicatorCard.vue'
  import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
  import { IndicatorCatalog } from '@/constants/indicatorCatalog'
  import { MaturityDimensions } from '@/constants/maturityCatalog'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore'
  import { useBusinessStore } from '@/stores/useBusinessStore'

  const { t } = useI18n()
  const quickWinStore = useQuickWinStore()
  const indicatorStore = useOutputIndicatorStore()
  const businessStore = useBusinessStore()

  const props = defineProps<{
    initialData?: Partial<MomentumMetric>
    businessId: string
    quickWinId?: string
    loading?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'submit', data: any): void
    (e: 'cancel'): void
  }>()

  // Define explicit type for form state
  interface FormState {
    title: string
    quickWinId?: string
    category: any
    dimension: any
    genderMarker: any
    rbmLevel: string
    cpdOutputCode: string
    spOutcomeCode: string
    irrfIndicatorIds: string[]
    sdgTargets: string[]
    contributionNarrative: string
    indicators: {
      name: string
      unit: string
      baseline?: number
      target?: number
      currency?: string
      readings: {
        value: number | boolean | undefined | null
        asOf: Date
        currency?: string
      }[]
    }[]
  }

  const form = ref<FormState>({
    title: props.initialData?.title || '',
    quickWinId: props.quickWinId || props.initialData?.quickWinId || undefined,
    category: props.initialData?.category || null,
    dimension: props.initialData?.dimension || null,
    genderMarker: props.initialData?.genderMarker || null,
    rbmLevel: props.initialData?.rbmLevel || 'Outcome',
    cpdOutputCode: props.initialData?.cpdOutputCode || '',
    spOutcomeCode: props.initialData?.spOutcomeCode || '',
    irrfIndicatorIds: props.initialData?.irrfIndicatorIds || [],
    sdgTargets: props.initialData?.sdgTargets || [],
    contributionNarrative: props.initialData?.contributionNarrative || '',
    indicators:
      props.initialData?.indicators?.map((ind) => ({
        name: ind.name,
        unit: ind.unit || 'count',
        baseline: ind.baseline,
        target: ind.target,
        currency: ind.currency,
        readings:
          ind.readings?.map((r) => ({
            value: r.value,
            asOf: new Date(r.asOf),
            currency: r.currency
          })) || []
      })) || []
  })

  const errors = ref<Record<string, string>>({})
  const suggestedIndicators = ref<any[]>([])
  const quickWinOptions = ref<any[]>([])
  const businessName = ref<string>('')

  // Computed property to check if fields should be locked due to inheritance
  const isInherited = computed(() => !!form.value.quickWinId)
  const isQuickWinContext = computed(() => !!props.quickWinId)

  const categoryOptions = [
    { label: 'Performance', value: 'performance' },
    { label: 'Employment & Inclusion', value: 'employment_inclusion' },
    { label: 'Access to Finance', value: 'finance_access' },
    { label: 'Innovation', value: 'innovation' },
    { label: 'Sustainability', value: 'sustainability' },
    { label: 'Resilience', value: 'resilience' },
    { label: 'Digital Adoption', value: 'digital_adoption' },
    { label: 'Market Integration', value: 'market_integration' }
  ]

  const genderMarkerOptions = [
    { label: 'GEN0 - No contribution', value: 'GEN0' },
    { label: 'GEN1 - Limited contribution', value: 'GEN1' },
    { label: 'GEN2 - Significant contribution', value: 'GEN2' },
    { label: 'GEN3 - Principal contribution', value: 'GEN3' }
  ]

  const unitOptions = [
    { label: 'Count (#)', value: 'count' },
    { label: 'Percentage (%)', value: 'percent' },
    { label: 'Currency', value: 'currency' },
    { label: 'Yes/No', value: 'boolean' },
    { label: 'Index', value: 'index' },
    { label: 'Hours', value: 'hours' }
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

  // IRRF Autocomplete (Mock list for now)
  const irrfList = ['ID-001', 'ID-002', 'ID-003', 'ID-004', 'ID-005']
  const filteredIrrfIds = ref<string[]>([])
  const searchIrrfIds = (event: { query: string }) => {
    filteredIrrfIds.value = irrfList.filter((id) =>
      id.toLowerCase().includes(event.query.toLowerCase())
    )
  }

  const addIndicator = () => {
    form.value.indicators.push({
      name: '',
      unit: 'count',
      baseline: undefined,
      target: undefined,
      readings: []
    })
  }

  const removeIndicator = (index: number) => {
    form.value.indicators.splice(index, 1)
  }

  const updateIndicator = (index: number, updated: any) => {
    form.value.indicators[index] = updated
  }

  // Suggestions Logic
  const updateSuggestions = (category: string) => {
    const categoryData = IndicatorCatalog.find((c) => c.category === category)
    suggestedIndicators.value = categoryData ? categoryData.indicators : []
  }

  const addSuggestedIndicator = (suggestion: any) => {
    form.value.indicators.push({
      name: suggestion.name,
      unit: suggestion.unit,
      baseline: undefined,
      target: undefined,
      readings: []
    })
  }

  // Handle Quick Win Selection Change
  const handleQuickWinChange = async () => {
    const qwId = form.value.quickWinId
    if (qwId) {
      await importFromQuickWin(qwId)
    } else {
      // Optional: Reset fields if Quick Win is cleared?
      // For now, we keep them to avoid data loss, but they become editable again.
    }
  }

  // Auto-import from QuickWin
  const importFromQuickWin = async (qwId: string) => {
    const qw = await quickWinStore.getQuickWinById(qwId)
    if (qw) {
      // Inherit category
      if (qw.category) {
        form.value.category = qw.category
        updateSuggestions(qw.category)
      }
      // Inherit dimension
      if (qw.dimension) {
        form.value.dimension = qw.dimension
      }
      // Inherit gender marker
      if (qw.genderMarker) {
        form.value.genderMarker = qw.genderMarker
      }

      // Inherit RBM/Codes
      if (qw.cpdOutputCode) form.value.cpdOutputCode = qw.cpdOutputCode
      if (qw.spOutcomeCode) form.value.spOutcomeCode = qw.spOutcomeCode
      if (qw.irrfIndicatorIds) form.value.irrfIndicatorIds = [...qw.irrfIndicatorIds]
      if (qw.sdgTargets) form.value.sdgTargets = [...qw.sdgTargets]

      // Import indicators if none exist (or maybe append?)
      // Logic: If indicators are empty, import.
      if (
        form.value.indicators.length === 0 &&
        qw.indicatorValues &&
        qw.indicatorValues.length > 0
      ) {
        for (const val of qw.indicatorValues) {
          const indDef = await indicatorStore.getIndicatorById(val.indicatorId)
          if (indDef) {
            if (!form.value.indicators.some((i) => i.name === indDef.name)) {
              form.value.indicators.push({
                name: indDef.name,
                unit: indDef.unit || 'count',
                baseline: val.baseline,
                target: val.target,
                readings:
                  val.currentValue !== undefined
                    ? [
                        {
                          value: val.currentValue as any,
                          asOf: new Date(qw.achievedOn)
                        }
                      ]
                    : []
              })
            }
          }
        }
      }
    }
  }

  onMounted(async () => {
    // Fetch Business Name
    if (props.businessId) {
      const business = await businessStore.fetchOne(props.businessId)
      if (business) {
        businessName.value = business.name
      }

      // Fetch Quick Wins for this business
      quickWinOptions.value = await quickWinStore.getQuickWinsByBusinessId(props.businessId)
    }

    // If Quick Win ID is provided via props (context), load it
    if (props.quickWinId) {
      form.value.quickWinId = props.quickWinId
      await importFromQuickWin(props.quickWinId)
    } else if (form.value.quickWinId) {
      // If editing and has quick win
      await importFromQuickWin(form.value.quickWinId)
    }

    if (form.value.category) {
      updateSuggestions(form.value.category)
    }
  })

  const handleSubmit = () => {
    errors.value = {}

    try {
      // Prepare data for validation
      const dataToValidate = {
        momentumMetricId: props.initialData?.momentumMetricId || 'temp-id',
        businessId: props.businessId,
        quickWinId: form.value.quickWinId,
        title: form.value.title,
        category: form.value.category,
        dimension: form.value.dimension || undefined,
        genderMarker: form.value.genderMarker || undefined,
        rbmLevel: form.value.rbmLevel,
        cpdOutputCode: form.value.cpdOutputCode || undefined,
        spOutcomeCode: form.value.spOutcomeCode || undefined,
        irrfIndicatorIds: form.value.irrfIndicatorIds.length
          ? form.value.irrfIndicatorIds
          : undefined,
        sdgTargets: form.value.sdgTargets.length ? form.value.sdgTargets : undefined,
        contributionNarrative: form.value.contributionNarrative || undefined,
        indicators: form.value.indicators.map((ind) => ({
          ...ind,
          readings: ind.readings.map((r) => ({
            ...r,
            asOf: r.asOf instanceof Date ? r.asOf.toISOString().split('T')[0] : r.asOf
          }))
        }))
      }

      if (!form.value.title) errors.value.title = t('validation.required')
      if (!form.value.category) errors.value.category = t('validation.required')

      if (Object.keys(errors.value).length > 0) return

      emit('submit', dataToValidate)
    } catch (error) {
      console.error('Validation error', error)
    }
  }
</script>

<style scoped>
  .momentum-metric-form {
    /* max-width: 900px;  Removed max-width to let it fill the dialog */
    margin: 0 auto;
  }
</style>
