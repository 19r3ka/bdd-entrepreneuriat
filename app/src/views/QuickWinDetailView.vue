<template>
  <div class="quick-win-detail-view">
    <div v-if="loading" class="flex justify-content-center p-6">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else-if="quickWin">
      <!-- Hero Card -->
      <QuickWinHeroCard
        :quick-win="quickWin"
        class="mb-4"
        @edit="editQuickWin"
        @delete="handleDelete"
      />

      <!-- Business and Support Links Row -->
      <div class="flex align-items-center justify-content-between flex-wrap mb-4">
        <div class="flex align-items-center gap-3">
          <div
            v-if="business"
            class="surface-card px-3 py-2 border-round-lg flex align-items-center gap-2 shadow-1 cursor-pointer hover:surface-100"
            @click="goToBusiness"
          >
            <i class="pi pi-building text-primary"></i>
            <span class="text-sm font-medium">{{ business.name }}</span>
          </div>

          <div
            v-if="quickWin.supportBoostId && support"
            class="surface-card px-3 py-2 border-round-lg flex align-items-center gap-2 shadow-1 cursor-pointer hover:surface-100"
            @click="goToSupport"
          >
            <i class="pi pi-heart text-purple-600"></i>
            <span class="text-sm font-medium">{{
              support.title || $t('quickWin.supportBoost')
            }}</span>
          </div>
        </div>

        <Button
          :label="$t('momentumMetric.trackOutcome', 'Track Outcome')"
          icon="pi pi-chart-line"
          severity="help"
          outlined
          @click="openMomentumForm"
        />
      </div>

      <!-- Tabs -->
      <Tabs value="0">
        <TabList>
          <Tab value="0">{{ $t('quickWin.tabs.details', 'Details') }}</Tab>
          <Tab value="1">{{ $t('quickWin.tabs.rbmAlignment', 'RBM Alignment') }}</Tab>
          <Tab value="2">{{ $t('quickWin.tabs.evidence', 'Evidence') }}</Tab>
        </TabList>

        <TabPanels>
          <!-- Details Tab -->
          <TabPanel value="0">
            <div class="card p-0 overflow-hidden mt-4 shadow-2">
              <div class="p-4 border-bottom-1 surface-border">
                <h3 class="text-xl font-bold text-900 m-0">{{ $t('quickWin.indicators') }}</h3>
              </div>

              <div v-if="quickWin.indicatorValues && quickWin.indicatorValues.length > 0">
                <DataTable
                  :value="quickWin.indicatorValues"
                  responsive-layout="scroll"
                  class="p-datatable-sm"
                >
                  <Column
                    :header="$t('outputIndicator.name', 'Indicator')"
                    style="min-width: 200px"
                  >
                    <template #body="{ data }">
                      <div class="font-semibold text-900">
                        {{ getIndicatorName(data.indicatorId) }}
                      </div>
                    </template>
                  </Column>

                  <Column :header="$t('quickWin.baseline')" style="min-width: 100px">
                    <template #body="{ data }">
                      <span class="text-700">{{ formatValue(data.baseline) }}</span>
                    </template>
                  </Column>

                  <Column :header="$t('quickWin.target')" style="min-width: 100px">
                    <template #body="{ data }">
                      <span class="text-700">{{ formatValue(data.target) }}</span>
                    </template>
                  </Column>

                  <Column :header="$t('quickWin.currentValue')" style="min-width: 120px">
                    <template #body="{ data }">
                      <span class="font-bold text-green-600">{{
                        formatValue(data.currentValue)
                      }}</span>
                    </template>
                  </Column>

                  <Column :header="$t('common.notes', 'Notes')" style="min-width: 200px">
                    <template #body="{ data }">
                      <span class="text-600 text-sm">{{ data.notes || '-' }}</span>
                    </template>
                  </Column>
                </DataTable>
              </div>

              <div v-else class="p-5 text-center text-600">
                <i class="pi pi-chart-line text-4xl mb-3 block text-400"></i>
                <p class="m-0">{{ $t('quickWin.noIndicators') }}</p>
              </div>

              <!-- Footer -->
              <DetailViewFooter :created-at="quickWin.createdAt" :updated-at="quickWin.updatedAt" />
            </div>
          </TabPanel>

          <!-- RBM Alignment Tab -->
          <TabPanel value="1">
            <div class="flex flex-column gap-4 mt-4">
              <!-- RBM Codes Card -->
              <!-- RBM Codes Card -->
              <Card class="shadow-1 border-1 surface-border">
                <template #title>
                  <div class="text-lg font-bold text-900 mb-0">
                    {{ $t('quickWin.rbmCodes', 'RBM Codes') }}
                  </div>
                </template>
                <template #content>
                  <div class="grid">
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-1">
                        {{ $t('quickWin.rbmLevel', 'RBM Level') }}
                      </div>
                      <div class="text-900 font-semibold">{{ quickWin.rbmLevel || 'Output' }}</div>
                    </div>
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-1">
                        {{ $t('quickWin.cpdOutputCode', 'CPD Output Code') }}
                      </div>
                      <div class="text-900 font-semibold">{{ quickWin.cpdOutputCode || '-' }}</div>
                    </div>
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-1">
                        {{ $t('quickWin.spOutputCode', 'SP Output Code') }}
                      </div>
                      <div class="text-900 font-semibold">{{ quickWin.spOutcomeCode || '-' }}</div>
                    </div>
                  </div>
                </template>
              </Card>

              <!-- Classifications & Targets Card -->
              <!-- Classifications & Targets Card -->
              <Card class="shadow-1 border-1 surface-border">
                <template #title>
                  <div class="text-lg font-bold text-900 mb-0">
                    {{ $t('quickWin.classificationsTargets', 'Classifications & Targets') }}
                  </div>
                </template>
                <template #content>
                  <div class="grid">
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-2">{{ $t('quickWin.genderMarker') }}</div>
                      <div class="text-900 font-semibold">{{ quickWin.genderMarker || '-' }}</div>
                    </div>
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-2">
                        {{ $t('quickWin.irrfIndicators', 'IRRF Indicator IDs') }}
                      </div>
                      <div
                        v-if="quickWin.irrfIndicatorIds && quickWin.irrfIndicatorIds.length > 0"
                        class="flex flex-wrap gap-2"
                      >
                        <Tag
                          v-for="id in quickWin.irrfIndicatorIds"
                          :key="id"
                          :value="id"
                          severity="info"
                        />
                      </div>
                      <div v-else class="text-900 font-semibold">-</div>
                    </div>
                    <div class="col-12 md:col-4">
                      <div class="text-600 text-sm mb-2">
                        {{ $t('quickWin.sdgTargets', 'SDG Targets') }}
                      </div>
                      <div
                        v-if="quickWin.sdgTargets && quickWin.sdgTargets.length > 0"
                        class="flex flex-wrap gap-2"
                      >
                        <Tag
                          v-for="target in quickWin.sdgTargets"
                          :key="target"
                          :value="target"
                          severity="success"
                        />
                      </div>
                      <div v-else class="text-900 font-semibold">-</div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </TabPanel>

          <!-- Evidence Tab -->
          <TabPanel value="2">
            <div class="mt-4">
              <!-- Header -->
              <div class="flex justify-content-between align-items-center mb-4">
                <h3 class="text-xl font-bold text-900 m-0">
                  {{ $t('quickWin.evidence', 'Evidence & Attachments') }}
                </h3>
                <Button
                  :label="$t('quickWin.addEvidence', 'Add Evidence')"
                  icon="pi pi-plus"
                  @click="handleAddEvidence"
                />
              </div>

              <!-- Evidence Cards -->
              <div v-if="evidenceList.length > 0" class="grid mb-4">
                <div
                  v-for="evidence in evidenceList"
                  :key="evidence.id"
                  class="col-12 md:col-6 lg:col-4"
                >
                  <EvidenceCard :evidence="evidence" @download="handleDownloadEvidence" />
                </div>
              </div>

              <!-- Drag & Drop Upload Area -->
              <div
                class="border-2 border-dashed border-300 border-round-lg p-6 text-center cursor-pointer hover:surface-100 transition-colors"
                @click="triggerFileUpload"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
              >
                <i class="pi pi-cloud-upload text-5xl text-400 mb-3 block"></i>
                <p class="text-900 font-medium mb-2">
                  {{ $t('quickWin.dragDropFiles', 'Drag & drop files here') }}
                </p>
                <p class="text-600 text-sm">
                  {{ $t('quickWin.orClickBrowse', 'or click to browse') }}
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileSelect"
                />
              </div>

              <!-- No Evidence State -->
              <div v-if="evidenceList.length === 0" class="text-center p-5 text-600 mt-4">
                <i class="pi pi-file text-4xl mb-3 block text-400"></i>
                <p class="m-0">{{ $t('quickWin.noEvidence', 'No evidence uploaded yet') }}</p>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <div v-else class="text-center p-6">
      <div class="text-xl text-900 mb-2">{{ t('pages.quickWin.notFoundTitle') }}</div>
      <Button :label="t('common.goBack')" @click="goBack" />
    </div>

    <Dialog
      v-model:visible="isMomentumFormVisible"
      modal
      :header="$t('momentumMetric.new', 'New Outcome Metric')"
      :style="{ width: '60vw' }"
      :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
    >
      <MomentumMetricForm
        v-if="quickWin"
        :business-id="quickWin.businessId"
        :quick-win-id="quickWin.id"
        @submit="handleMomentumSubmit"
        @cancel="isMomentumFormVisible = false"
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import Button from 'primevue/button'
  import Tag from 'primevue/tag'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Tabs from 'primevue/tabs'
  import TabList from 'primevue/tablist'
  import Tab from 'primevue/tab'
  import TabPanels from 'primevue/tabpanels'
  import TabPanel from 'primevue/tabpanel'
  import Card from 'primevue/card'
  import QuickWinHeroCard from '@/components/monitoring-evaluation/QuickWinHeroCard.vue'
  import EvidenceCard from '@/components/common/EvidenceCard.vue'
  import DetailViewFooter from '@/components/common/DetailViewFooter.vue'

  const { t } = useI18n()
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useOutputIndicatorStore } from '@/stores/useOutputIndicatorStore'
  import { db } from '@/services/local-db'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
  import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator'

  import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore'
  import MomentumMetricForm from '@/components/monitoring-evaluation/MomentumMetricForm.vue'
  import Dialog from 'primevue/dialog'
  import { useToast } from 'primevue/usetoast'

  const route = useRoute()
  const router = useRouter()
  const store = useQuickWinStore()
  const indicatorStore = useOutputIndicatorStore()
  const momentumMetricStore = useMomentumMetricStore()
  const toast = useToast()

  const quickWinId = route.params.id as string
  const quickWin = ref<QuickWin | undefined>(undefined)
  const business = ref<any>(undefined)
  const support = ref<any>(undefined)
  const loading = ref(true)
  const indicatorsMap = ref<Record<string, OutputIndicator>>({})
  const fileInput = ref<HTMLInputElement | null>(null)

  // Momentum Metrics State
  const isMomentumFormVisible = ref(false)

  // Mock evidence list (placeholder for future implementation)
  const evidenceList = ref<any[]>([])

  onMounted(async () => {
    try {
      quickWin.value = await store.getQuickWinById(quickWinId)

      if (quickWin.value) {
        // Load business
        business.value = await db.businesses.get(quickWin.value.businessId)

        // Load support if exists
        if (quickWin.value.supportBoostId) {
          support.value = await db.supports.get(quickWin.value.supportBoostId)
        }

        // Load indicators
        for (const val of quickWin.value.indicatorValues || []) {
          const ind = await indicatorStore.getIndicatorById(val.indicatorId)
          if (ind) {
            indicatorsMap.value[ind.id] = ind
          }
        }
      }
    } catch (error) {
      console.error('Failed to load quick win', error)
    } finally {
      loading.value = false
    }
  })

  const goBack = () => {
    router.back()
  }

  const editQuickWin = () => {
    router.push(`/quick-wins/${quickWinId}/edit`)
  }

  const goToBusiness = () => {
    if (business.value) {
      router.push(`/businesses/${business.value.id}`)
    }
  }

  const goToSupport = () => {
    if (quickWin.value?.supportBoostId) {
      router.push(`/supports/${quickWin.value.supportBoostId}`)
    }
  }

  const handleDelete = async () => {
    if (!quickWin.value) return

    if (confirm('Are you sure you want to delete this Quick Win? This action cannot be undone.')) {
      try {
        await store.deleteQuickWin(quickWin.value.id)
        router.push('/quick-wins')
      } catch (error) {
        console.error('Failed to delete quick win', error)
      }
    }
  }

  const formatValue = (val?: number | string | boolean) => {
    if (val === undefined || val === null) return '-'
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    return val
  }

  const getIndicatorName = (id: string) => indicatorsMap.value[id]?.name || 'Unknown Indicator'

  // Evidence handling (placeholder)
  const handleAddEvidence = () => {
    triggerFileUpload()
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
      handleFiles(Array.from(target.files))
    }
  }

  const handleFileDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) {
      handleFiles(Array.from(event.dataTransfer.files))
    }
  }

  const handleFiles = (files: File[]) => {
    // Placeholder for file upload logic
    console.log('Files to upload:', files)
    // TODO: Implement actual file upload and evidence creation
  }

  const handleDownloadEvidence = (evidence: any) => {
    // Placeholder for download logic
    console.log('Download evidence:', evidence)
    // TODO: Implement actual download logic
  }

  // Momentum Metrics Handlers
  const openMomentumForm = () => {
    isMomentumFormVisible.value = true
  }

  const handleMomentumSubmit = async (data: any) => {
    try {
      await momentumMetricStore.addMetric(data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Outcome metric created successfully',
        life: 3000
      })
      isMomentumFormVisible.value = false
      // Optionally refresh or navigate
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save outcome metric',
        life: 3000
      })
    }
  }
</script>

<style scoped>
  .quick-win-detail-view :deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: var(--surface-50);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
  }

  .quick-win-detail-view :deep(.p-datatable .p-datatable-tbody > tr) {
    background-color: var(--surface-0);
  }

  .quick-win-detail-view :deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: var(--surface-50);
  }

  .hidden {
    display: none;
  }
</style>
