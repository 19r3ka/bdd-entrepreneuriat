<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import { useConfirmation } from '@/composables/useConfirmation'
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';

  // Components
  import Tabs from 'primevue/tabs'
  import TabList from 'primevue/tablist'
  import Tab from 'primevue/tab'
  import TabPanels from 'primevue/tabpanels'
  import TabPanel from 'primevue/tabpanel'
  import BusinessIdentityHeader from '@/components/common/BusinessIdentityHeader.vue'
  import BusinessOverviewTab from '@/components/BusinessOverviewTab.vue'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue';
  import SupportBoostTimeline from '@/components/monitoring-evaluation/SupportBoostTimeline.vue';

  // Logic
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import { useSupportStore } from '@/stores/useSupportStore';
  import type { Support } from '@/types/monitoring-evaluation/Support';
  import GoalForm from '@/components/monitoring-evaluation/GoalForm.vue';
  import MeasurementForm from '@/components/monitoring-evaluation/MeasurementForm.vue';
  import { useIndicatorStore } from '@/stores/useIndicatorStore';
  import type { IndicatorDefinition, Measurement } from '@/types/monitoring-evaluation/Indicator';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()
  const { showConfirmation } = useConfirmation()

  const businessStore = useBusinessStore()
  const entrepreneurStore = useEntrepreneurStore()
  const supportStore = useSupportStore();
  const indicatorStore = useIndicatorStore();

  const businessId = route.params.id as string
  const activeTabIndex = ref('0')
  const isSupportFormVisible = ref(false);
  const supports = ref<Support[]>([]);
  const selectedSupport = ref<Support | undefined>(undefined);
  const isEditMode = ref(false);

  // Goals & Measurements State
  const goals = ref<IndicatorDefinition[]>([]);
  const goalMeasurements = ref<Record<string, Measurement[]>>({});
  const isGoalFormVisible = ref(false);
  const isMeasurementFormVisible = ref(false);
  const selectedGoal = ref<IndicatorDefinition | null>(null);
  const selectedMeasurement = ref<Measurement | null>(null);
  const isGoalEditMode = ref(false);
  const isMeasurementEditMode = ref(false);
  const activeGoalId = ref<string | null>(null);

  // Data Fetching
  onMounted(async () => {
    await businessStore.fetchAll() // Ideally fetchOne(id)
    if (businessStore.getById(businessId)?.entrepreneurId) {
      await entrepreneurStore.fetchAll()
    }
    supports.value = await supportStore.getSupportsByBusinessId(businessId);
    await fetchGoalsAndMeasurements();
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

  // Action Handlers
  const handleAction = (action: string) => {
    if (action === 'edit') {
      router.push(`/businesses/${businessId}/edit`)
    } else if (action === 'delete') {
      confirmDelete()
    } else if (action === 'log_intervention') {
      openSupportForm();
    }
  }

  const confirmDelete = () => {
    showConfirmation(
      t('pages.businesses.deleteConfirmation'),
      t('pages.businesses.deleteTitle'),
      async () => {
        try {
          await businessStore.remove(businessId)
          toast.add({
            severity: 'success',
            summary: t('common.success'),
            detail: t('pages.businesses.deleteSuccess'),
            life: 3000
          })
          router.push('/businesses')
        } catch {
          toast.add({
            severity: 'error',
            summary: t('common.error'),
            detail: t('pages.businesses.deleteError'),
            life: 3000
          })
        }
      }
    )
  }

  const openSupportForm = () => {
    isEditMode.value = false;
    selectedSupport.value = undefined;
    isSupportFormVisible.value = true;
  };

  const handleSupportSubmit = async (data: Support) => {
    try {
      if (isEditMode.value && selectedSupport.value?.id) {
        await supportStore.updateSupport(selectedSupport.value.id, data);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Support boost updated successfully', life: 3000 });
      } else {
        await supportStore.addSupport(data);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Support boost logged successfully', life: 3000 });
      }
      isSupportFormVisible.value = false;
      supports.value = await supportStore.getSupportsByBusinessId(businessId);
    } catch (error) {
      console.error(error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save support boost', life: 3000 });
    }
  };

  const editSupport = async (id: string) => {
    const support = await supportStore.getSupportById(id);
    if (support) {
      isEditMode.value = true;
      selectedSupport.value = support;
      isSupportFormVisible.value = true;
    }
  };

  const deleteSupport = (support: Support) => { // Kept for OverviewTab compatibility if needed
    showConfirmation(
      'Are you sure you want to delete this support boost?',
      'Confirm Deletion',
      async () => {
        try {
          await supportStore.deleteSupport(support.id);
          supports.value = await supportStore.getSupportsByBusinessId(businessId);
          toast.add({ severity: 'success', summary: 'Success', detail: 'Support boost deleted successfully', life: 3000 });
        } catch {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete support boost', life: 3000 });
        }
      }
    );
  };

  // Goal & Measurement Handlers
  const fetchGoalsAndMeasurements = async () => {
    goals.value = await indicatorStore.getIndicatorsByBusinessId(businessId);
    for (const goal of goals.value) {
      goalMeasurements.value[goal.id] = await indicatorStore.getMeasurementsByIndicatorId(goal.id);
    }
  };

  const openGoalForm = () => {
    isGoalEditMode.value = false;
    selectedGoal.value = null;
    isGoalFormVisible.value = true;
  };

  const editGoal = (goal: IndicatorDefinition) => {
    isGoalEditMode.value = true;
    selectedGoal.value = goal;
    isGoalFormVisible.value = true;
  };

  const deleteGoal = (goal: IndicatorDefinition) => {
    showConfirmation(
      'Are you sure you want to delete this goal?',
      'Confirm Deletion',
      async () => {
        try {
          await indicatorStore.deleteIndicator(goal.id);
          await fetchGoalsAndMeasurements();
          toast.add({ severity: 'success', summary: 'Success', detail: 'Goal deleted successfully', life: 3000 });
        } catch {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete goal', life: 3000 });
        }
      }
    );
  };

  const handleGoalSuccess = async () => {
    isGoalFormVisible.value = false;
    await fetchGoalsAndMeasurements();
  };

  const openMeasurementForm = (goal: IndicatorDefinition) => {
    activeGoalId.value = goal.id;
    isMeasurementEditMode.value = false;
    selectedMeasurement.value = null;
    isMeasurementFormVisible.value = true;
  };

  const editMeasurement = (measurement: Measurement, goal: IndicatorDefinition) => {
    activeGoalId.value = goal.id;
    isMeasurementEditMode.value = true;
    selectedMeasurement.value = measurement;
    isMeasurementFormVisible.value = true;
  };

  const deleteMeasurement = (measurement: Measurement, goal: IndicatorDefinition) => {
    showConfirmation(
      'Are you sure you want to delete this measurement?',
      'Confirm Deletion',
      async () => {
        try {
          await indicatorStore.deleteMeasurement(measurement.id);
          goalMeasurements.value[goal.id] = await indicatorStore.getMeasurementsByIndicatorId(goal.id);
          toast.add({ severity: 'success', summary: 'Success', detail: 'Measurement deleted successfully', life: 3000 });
        } catch {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete measurement', life: 3000 });
        }
      }
    );
  };

  const handleMeasurementSuccess = async () => {
    isMeasurementFormVisible.value = false;
    if (activeGoalId.value) {
      goalMeasurements.value[activeGoalId.value] = await indicatorStore.getMeasurementsByIndicatorId(activeGoalId.value);
    }
  };

</script>

<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-7xl mx-auto" v-if="business">
      <BusinessIdentityHeader
        :business="business"
        :entrepreneur="associatedEntrepreneur"
        @action="handleAction"
      />

      <div
        class="card bg-surface-0 dark:bg-surface-900 border-round-xl shadow-1 border-1 border-200 dark:border-700"
      >
        <Tabs v-model:value="activeTabIndex">
          <TabList>
            <Tab value="0">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-id-card"></i>
                <span class="font-semibold">Overview</span>
              </div>
            </Tab>
            <Tab value="1">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-chart-line"></i>
                <span class="font-semibold">Performance</span>
              </div>
            </Tab>
            <Tab value="2">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-bullseye"></i>
                <span class="font-semibold">Goals</span>
              </div>
            </Tab>
            <Tab value="3">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-history"></i>
                <span class="font-semibold">Support Timeline</span>
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="p-4">
                <BusinessOverviewTab 
                  :business="business" 
                  :socials="socials" 
                />
              </div>
            </TabPanel>

            <TabPanel value="1">
                <div class="p-4">
                  <p>Performance tab content pending migration to new M&E module.</p>
                </div>
            </TabPanel>
            <TabPanel value="2">
              <div class="p-4">
                 <div class="flex justify-content-between align-items-center mb-4">
                   <h2>Goals & Measurements</h2>
                   <Button label="New Goal" icon="pi pi-plus" @click="openGoalForm" />
                 </div>
                 
                 <div v-if="goals.length === 0" class="text-center p-4">
                   No goals defined yet.
                 </div>

                 <div v-else class="flex flex-column gap-4">
                   <div v-for="goal in goals" :key="goal.id" class="card p-3 border-1 surface-border">
                     <div class="flex justify-content-between align-items-start">
                       <div>
                         <h3 class="m-0">{{ goal.name }}</h3>
                         <span class="text-sm text-500">{{ goal.type }}</span>
                         <p>{{ goal.description }}</p>
                         <div class="flex gap-4 mt-2">
                           <div><strong>Baseline:</strong> {{ goal.baselineValue }} ({{ new Date(goal.baselineDate).toLocaleDateString() }})</div>
                           <div><strong>Target:</strong> {{ goal.targetValue }} ({{ new Date(goal.targetDate).toLocaleDateString() }})</div>
                         </div>
                       </div>
                       <div class="flex gap-2">
                         <Button icon="pi pi-pencil" class="p-button-text" @click="editGoal(goal)" />
                         <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteGoal(goal)" />
                       </div>
                     </div>

                     <div class="mt-4 pl-4 border-left-2 border-primary-500">
                       <div class="flex justify-content-between align-items-center mb-2">
                         <h4 class="m-0">Measurements</h4>
                         <Button label="Add Measurement" icon="pi pi-plus" size="small" outlined @click="openMeasurementForm(goal)" />
                       </div>
                       
                       <div v-if="!goalMeasurements[goal.id] || goalMeasurements[goal.id].length === 0" class="text-sm text-500">
                         No measurements recorded.
                       </div>
                       <DataTable v-else :value="goalMeasurements[goal.id] || []" size="small">
                         <Column field="dateRecorded" header="Date">
                           <template #body="slotProps">
                             {{ new Date(slotProps.data.dateRecorded).toLocaleDateString() }}
                           </template>
                         </Column>
                         <Column field="currentValue" header="Value"></Column>
                         <Column field="contributionNarrative" header="Narrative"></Column>
                         <Column header="Actions">
                           <template #body="slotProps">
                             <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editMeasurement(slotProps.data, goal)" />
                             <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteMeasurement(slotProps.data, goal)" />
                           </template>
                         </Column>
                       </DataTable>
                     </div>
                   </div>
                 </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div class="p-4">
                <SupportBoostTimeline
                  :supports="businessSupports"
                  @add="openSupportForm()"
                  @view="(id) => router.push(`/supports/${id}`)"
                  @edit="openSupportForm"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>

    <div v-else class="flex justify-content-center align-items-center min-h-screen">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>
    
    <Dialog v-model:visible="isSupportFormVisible" modal :header="isEditMode ? 'Edit Support' : 'Log Support'" :style="{ width: '65vw' }" :breakpoints="{ '960px': '80vw', '640px': '95vw' }">
      <SupportBoostForm
        :business-id="businessId"
        :initial-data="selectedSupport || {}"
        @submit="handleSupportSubmit"
      />
    </Dialog>

    <Dialog v-model:visible="isGoalFormVisible" modal :header="isGoalEditMode ? $t('goalForm.edit') : $t('goalForm.new')" :style="{ width: '50vw' }">
      <GoalForm
        :business-id="businessId"
        :is-edit="isGoalEditMode"
        :initial-values="selectedGoal || {}"
        @success="handleGoalSuccess"
        @cancel="isGoalFormVisible = false"
      />
    </Dialog>

    <Dialog v-model:visible="isMeasurementFormVisible" modal :header="isMeasurementEditMode ? $t('measurementForm.edit') : $t('measurementForm.new')" :style="{ width: '50vw' }">
      <MeasurementForm
        :indicator-id="activeGoalId!"
        :is-edit="isMeasurementEditMode"
        :initial-values="selectedMeasurement || {}"
        @success="handleMeasurementSuccess"
        @cancel="isMeasurementFormVisible = false"
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

