<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import { useConfirmation } from '@/composables/useConfirmation'
  import { BUSINESS_ACTIONS, type BusinessAction } from '@/constants/actions'
  import Dialog from 'primevue/dialog'
  import Button from 'primevue/button'

  // Components
  import Tabs from 'primevue/tabs'
  import TabList from 'primevue/tablist'
  import Tab from 'primevue/tab'
  import TabPanels from 'primevue/tabpanels'
  import TabPanel from 'primevue/tabpanel'
  import BusinessIdentityHeader from '@/components/common/BusinessIdentityHeader.vue'
  import BusinessOverviewTab from '@/components/BusinessOverviewTab.vue'
  import SupportBoostList from '@/components/monitoring-evaluation/SupportBoostList.vue'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue'
  import QuickWinList from '@/components/monitoring-evaluation/QuickWinList.vue'
  import Tooltip from 'primevue/tooltip'

  const vTooltip = Tooltip

  // Logic
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'

  import MomentumMetricList from '@/components/monitoring-evaluation/MomentumMetricList.vue'
  import MomentumMetricForm from '@/components/monitoring-evaluation/MomentumMetricForm.vue'
  import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore'
  import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
  import MaturityReportsTab from '@/components/monitoring-evaluation/MaturityReportsTab.vue'
  import BusinessAdvisoryPanel from '@/components/common/BusinessAdvisoryPanel.vue'
  import { usePortfolioActions } from '@/composables/usePortfolioActions'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()
  const { showConfirmation, confirmDelete } = useConfirmation()

  const businessStore = useBusinessStore()
  const entrepreneurStore = useEntrepreneurStore()
  const supportStore = useSupportStore()
  const quickWinStore = useQuickWinStore()
  const momentumMetricStore = useMomentumMetricStore()

  import { BUSINESS_TABS } from '@/constants/tabs'

  const businessId = route.params.id as string
  const activeTabIndex = ref(BUSINESS_TABS.OVERVIEW)
  const isSupportFormVisible = ref(false)
  const businessSupports = ref<Support[]>([])
  const businessQuickWins = ref<QuickWin[]>([])
  const selectedSupport = ref<Support | undefined>(undefined)
  const isEditMode = ref(false)



  // Momentum Metrics State
  const momentumMetrics = ref<MomentumMetric[]>([])
  const isMomentumFormVisible = ref(false)
  const selectedMetric = ref<MomentumMetric | undefined>(undefined)
  const selectedQuickWinId = ref<string | undefined>(undefined)

  // Data Fetching
  onMounted(async () => {
    await businessStore.fetchAll() // Ideally fetchOne(id)
    if (businessStore.getById(businessId)?.entrepreneurId) {
      await entrepreneurStore.fetchAll()
    }
    businessSupports.value = await supportStore.getSupportsByBusinessId(businessId)
    businessQuickWins.value = await quickWinStore.getQuickWinsByBusinessId(businessId)
    momentumMetrics.value = await momentumMetricStore.getMetricsByBusinessId(businessId)
  })

  // Computed State
  const business = computed(() => businessStore.getById(businessId))

  const associatedEntrepreneur = computed(() => {
    if (!business.value?.entrepreneurId) return null
    return entrepreneurStore.getById(business.value.entrepreneurId)
  })

  // Social Media Logic (Lifted from original view)
  const socials = computed(() => {
    const sm = business.value?.socialMedia
    if (!sm) return []
    const map: { name: string; url: string; icon: string }[] = []

    if (sm.linkedin) map.push({ name: 'LinkedIn', url: sm.linkedin, icon: 'pi-linkedin' })
    if (sm.twitter) map.push({ name: 'Twitter', url: sm.twitter, icon: 'pi-twitter' })
    if (sm.facebook) map.push({ name: 'Facebook', url: sm.facebook, icon: 'pi-facebook' })
    if (sm.instagram) map.push({ name: 'Instagram', url: sm.instagram, icon: 'pi-instagram' })
    if (sm.tiktok) map.push({ name: 'TikTok', url: sm.tiktok, icon: 'pi-globe' })

    // Handle dynamic property access safely
    const gh = (sm as any).github
    if (gh) map.push({ name: 'GitHub', url: gh, icon: 'pi-github' })

    if (sm.website) {
      map.push({ name: t('common.website'), url: sm.website, icon: 'pi-globe' })
    }
    return map
  })

  // Generate actions for this specific business from portfolio actions composable
  const { urgentActions, opportunities } = usePortfolioActions(
    () => (business.value ? [business.value] : []),
    () => businessSupports.value,
    () => businessQuickWins.value
  )

  const businessActions = computed(() => [...urgentActions.value, ...opportunities.value])

  // Action Handlers
  /**
   * Handles actions triggered from the UI (e.g., header buttons).
   * Uses a switch statement to delegate to specific handlers.
   * @param {string} action - The action identifier (from BUSINESS_ACTIONS).
   */
  const handleAction = (action: string) => {
    switch (action) {
      case BUSINESS_ACTIONS.EDIT:
        router.push(`/businesses/${businessId}/edit`)
        break
      case BUSINESS_ACTIONS.DELETE:
        if (!business.value) return
        // Capture ID to avoid TS errors in async callback
        const idToDelete = business.value.id
        if (!idToDelete) return
        confirmDelete(business.value.name || 'this business', async () => {
          try {
            await businessStore.remove(idToDelete)
            router.push('/businesses')
          } catch (error) {
            console.error(error)
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: t('pages.businesses.deleteError'),
              life: 3000
            })
          }
        })
        break
      case BUSINESS_ACTIONS.LOG_INTERVENTION:
        openSupportForm()
        break
      case BUSINESS_ACTIONS.LOG_QUICK_WIN:
        // Added
        openQuickWinForm() // Added
        break
      case BUSINESS_ACTIONS.TRACK_PERFORMANCE:
        openMomentumForm()
        break
      default:
        console.warn('Unknown action:', action)
    }
  }

  const openSupportForm = (id?: string) => {
    // Modified to accept id
    if (id) {
      isEditMode.value = true
      selectedSupport.value = businessSupports.value.find((s) => s.id === id)
    } else {
      isEditMode.value = false
      selectedSupport.value = undefined
    }
    isSupportFormVisible.value = true
  }

  const handleSupportSubmit = async (data: Support) => {
    try {
      if (isEditMode.value && selectedSupport.value?.id) {
        await supportStore.updateSupport(selectedSupport.value.id, data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Support boost updated successfully',
          life: 3000
        })
      } else {
        await supportStore.addSupport(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Support boost logged successfully',
          life: 3000
        })
      }
      isSupportFormVisible.value = false
      businessSupports.value = await supportStore.getSupportsByBusinessId(businessId)
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save support boost',
        life: 3000
      })
    }
  }

  const editSupport = async (id: string) => {
    // Modified to accept id
    const support = await supportStore.getSupportById(id)
    if (support) {
      isEditMode.value = true
      selectedSupport.value = support
      isSupportFormVisible.value = true
    }
  }

  const deleteSupport = (support: Support) => {
    // Kept for OverviewTab compatibility if needed
    confirmDelete(support.title || 'Support Boost', async () => {
      try {
        await supportStore.deleteSupport(support.id)
        businessSupports.value = await supportStore.getSupportsByBusinessId(businessId)
      } catch (error) {
        console.error(error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete support boost',
          life: 3000
        })
      }
    })
  }

  // Quick Win Handlers (Added)
  const openQuickWinForm = (supportId?: string) => {
    const query: any = { businessId }
    if (supportId) query.supportBoostId = supportId
    router.push({ path: '/quick-wins/new', query })
  }

  const deleteQuickWin = async (id: string) => {
    // Check for linked Momentum Metrics
    const quickWin = businessQuickWins.value.find((qw) => qw.id === id)
    if (quickWin?.indicatorValues?.length) {
      // Assuming indicatorValues is the property for linked performance reports
      toast.add({
        severity: 'warn',
        summary: 'Cannot Delete',
        detail: 'This Quick Win has linked Performance Reports. Please delete them first.',
        life: 5000
      })
      return
    }

    const name = quickWin?.title || 'Quick Win'
    confirmDelete(name, async () => {
      try {
        await quickWinStore.deleteQuickWin(id)
        businessQuickWins.value = await quickWinStore.getQuickWinsByBusinessId(businessId)
      } catch (error) {
        console.error(error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete Quick Win',
          life: 3000
        })
      }
    })
  }



  // Momentum Metrics Handlers
  const openMomentumForm = (quickWinId?: string) => {
    selectedMetric.value = undefined
    selectedQuickWinId.value = quickWinId
    isMomentumFormVisible.value = true
  }

  const editMetric = (metric: MomentumMetric) => {
    selectedMetric.value = metric
    isMomentumFormVisible.value = true
  }

  const handleMomentumSubmit = async (data: any) => {
    try {
      if (selectedMetric.value) {
        await momentumMetricStore.updateMetric(selectedMetric.value.momentumMetricId, data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Outcome metric updated successfully',
          life: 3000
        })
      } else {
        await momentumMetricStore.addMetric(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Outcome metric created successfully',
          life: 3000
        })
      }
      isMomentumFormVisible.value = false
      momentumMetrics.value = await momentumMetricStore.getMetricsByBusinessId(businessId)
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

<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-7xl mx-auto" v-if="business">
      <BusinessIdentityHeader
        :business="business"
        :entrepreneur="associatedEntrepreneur"
        @action="handleAction"
      >
        <template #actions>
          <div class="flex gap-2">
            <Button
              label="Log Support"
              icon="pi pi-heart"
              size="small"
              outlined
              @click="handleAction(BUSINESS_ACTIONS.LOG_INTERVENTION)"
            />
            <Button
              label="Add Quick Win"
              icon="pi pi-check-circle"
              size="small"
              outlined
              @click="handleAction(BUSINESS_ACTIONS.LOG_QUICK_WIN)"
            />
            <Button
              label="Track Performance"
              icon="pi pi-chart-line"
              size="small"
              @click="handleAction(BUSINESS_ACTIONS.TRACK_PERFORMANCE)"
            />
          </div>
        </template>
      </BusinessIdentityHeader>

      <!-- Advisory Panel -->
      <BusinessAdvisoryPanel :actions="businessActions" />

      <div
        class="card bg-surface-0 dark:bg-surface-900 border-round-xl shadow-1 border-1 border-200 dark:border-700"
      >
        <Tabs v-model:value="activeTabIndex">
          <TabList>
            <Tab :value="BUSINESS_TABS.OVERVIEW">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-id-card"></i>
                <span class="font-semibold">Overview</span>
              </div>
            </Tab>
            <Tab :value="BUSINESS_TABS.REPORTS">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-chart-bar"></i>
                <span class="font-semibold">Reports</span>
              </div>
            </Tab>
            <Tab :value="BUSINESS_TABS.SUPPORTS">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-heart"></i>
                <span class="font-semibold">Supports</span>
              </div>
            </Tab>
            <Tab :value="BUSINESS_TABS.QUICK_WINS">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-check-circle"></i>
                <span class="font-semibold">Quick Wins</span>
              </div>
            </Tab>
            <Tab :value="BUSINESS_TABS.OUTCOMES">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-chart-line"></i>
                <span class="font-semibold">Outcomes</span>
              </div>
            </Tab>

          </TabList>
          <TabPanels>
            <TabPanel :value="BUSINESS_TABS.OVERVIEW">
              <div class="p-4">
                <BusinessOverviewTab :business="business" :socials="socials" />
              </div>
            </TabPanel>

            <TabPanel :value="BUSINESS_TABS.REPORTS">
              <MaturityReportsTab :business-id="businessId" />
            </TabPanel>

            <TabPanel :value="BUSINESS_TABS.SUPPORTS">
              <SupportBoostList
                :data="businessSupports"
                @edit="editSupport"
                @delete="deleteSupport"
              >
                <template #append-actions="{ data }">
                  <Button
                    icon="pi pi-check-circle"
                    class="p-button-rounded p-button-text p-button-success"
                    v-tooltip.top="'Add Quick Win'"
                    @click="openQuickWinForm(data.id)"
                  />
                </template>
              </SupportBoostList>
            </TabPanel>

            <TabPanel :value="BUSINESS_TABS.QUICK_WINS">
              <QuickWinList
                :data="businessQuickWins"
                @edit="(id) => router.push(`/quick-wins/${id}/edit`)"
                @delete="deleteQuickWin"
              >
                <template #append-actions="{ data }">
                  <Button
                    icon="pi pi-chart-line"
                    class="p-button-rounded p-button-text p-button-help"
                    v-tooltip.top="'Add Performance Report'"
                    @click="openMomentumForm(data.id)"
                  />
                </template>
              </QuickWinList>
            </TabPanel>

            <TabPanel :value="BUSINESS_TABS.OUTCOMES">
              <MomentumMetricList :metrics="momentumMetrics" @edit="editMetric" />
            </TabPanel>


          </TabPanels>
        </Tabs>
      </div>
    </div>

    <div v-else class="flex justify-content-center align-items-center min-h-screen">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <Dialog
      v-model:visible="isSupportFormVisible"
      modal
      :header="isEditMode ? 'Edit Support' : 'Log Support'"
      :style="{ width: '65vw' }"
      :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
    >
      <SupportBoostForm
        :business-id="businessId"
        :initial-data="selectedSupport || {}"
        @submit="handleSupportSubmit"
      />
    </Dialog>



    <Dialog
      v-model:visible="isMomentumFormVisible"
      modal
      :header="
        selectedMetric
          ? $t('momentumMetric.edit', 'Edit Outcome Metric')
          : $t('momentumMetric.new', 'New Outcome Metric')
      "
      :style="{ width: '60vw' }"
      :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
    >
      <MomentumMetricForm
        :business-id="businessId"
        :quick-win-id="selectedQuickWinId"
        :initial-data="selectedMetric || {}"
        @submit="handleMomentumSubmit"
        @cancel="isMomentumFormVisible = false"
      />
    </Dialog>
  </div>
</template>

<style>
  /* Clean Tab Styling for new Tabs component */
  .p-tabs .p-tablist {
    background: transparent;
    border-bottom: 1px solid var(--surface-border);
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .p-tabs .p-tabpanels {
    background: transparent;
    padding: 0;
  }
  .p-tabs .p-tablist .p-tab {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-color-secondary);
    font-weight: 600;
    transition: all 0.2s;
  }
  .p-tabs .p-tablist .p-tab.p-tab-active {
    color: var(--primary-color);
    border-color: var(--primary-color);
    background: var(--primary-50);
  }
  .p-tabs .p-tablist .p-tab:hover {
    color: var(--primary-color);
    background: var(--surface-hover);
  }
</style>
