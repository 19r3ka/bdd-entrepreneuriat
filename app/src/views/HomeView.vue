<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h1 class="mb-4">{{ $t('common.dashboard') }}</h1>
        <div class="grid">
          <div class="col-12 md:col-6 xl:col-4">
            <DashboardWidget
              :title="$t('pages.dashboard.totalEntrepreneurs')"
              :count="totalEntrepreneurs"
              @click="$router.push('/entrepreneurs')"
            />
          </div>
          <div class="col-12 md:col-6 xl:col-4">
            <DashboardWidget
              :title="$t('pages.dashboard.totalBusinesses')"
              :count="totalBusinesses"
              @click="$router.push('/businesses')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <h2 class="mb-3">Quick Actions</h2>
        <div class="flex gap-3 flex-wrap">
          <Button label="Log Support" icon="pi pi-heart" @click="showSupportDialog = true" />
          <Button label="Add Goal" icon="pi pi-flag" @click="showGoalDialog = true" />
          <Button label="Record Measurement" icon="pi pi-chart-line" @click="showMeasurementDialog = true" />
        </div>
      </div>
    </div>

    <div class="col-12 xl:col-8">
      <div class="card">
        <h2>Business Locations</h2>
        <MapComponent :locations="businessLocations" :is-editable="false" />
      </div>
    </div>

    <div class="col-12 xl:col-4">
      <QuickAddEntrepreneurForm />
    </div>
  </div>

  <!-- Dialogs -->
  <Dialog v-model:visible="showSupportDialog" header="Log Support" modal class="p-fluid" :style="{ width: '65vw' }" :breakpoints="{ '960px': '80vw', '640px': '95vw' }">
    <SupportBoostForm @submit="handleSupportSubmit" />
  </Dialog>

  <Dialog v-model:visible="showGoalDialog" :header="$t('goalForm.new')" modal class="p-fluid" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
    <GoalForm :is-edit="false" :initial-values="{}" @success="showGoalDialog = false" @cancel="showGoalDialog = false" />
  </Dialog>

  <Dialog v-model:visible="showMeasurementDialog" :header="$t('measurementForm.new')" modal class="p-fluid" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
    <MeasurementForm :is-edit="false" :initial-values="{}" @success="showMeasurementDialog = false" @cancel="showMeasurementDialog = false" />
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEntrepreneurStore } from "@/stores/useEntrepreneurStore";
import { useBusinessStore } from "@/stores/useBusinessStore";
import { useSupportStore } from "@/stores/useSupportStore";
import DashboardWidget from "@/components/DashboardWidget.vue";
import QuickAddEntrepreneurForm from "@/components/QuickAddEntrepreneurForm.vue";
import MapComponent from "@/components/MapComponent.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import SupportBoostForm from "@/components/monitoring-evaluation/SupportBoostForm.vue";
import GoalForm from "@/components/monitoring-evaluation/GoalForm.vue";
import MeasurementForm from "@/components/monitoring-evaluation/MeasurementForm.vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import type { Support } from "@/types/monitoring-evaluation/Support";

const { t } = useI18n();
const toast = useToast();

const entrepreneurStore = useEntrepreneurStore();
const businessStore = useBusinessStore();
const supportStore = useSupportStore();

const showSupportDialog = ref(false);
const showGoalDialog = ref(false);
const showMeasurementDialog = ref(false);

const { entrepreneurs } = storeToRefs(entrepreneurStore);
const { businesses } = storeToRefs(businessStore);

const totalEntrepreneurs = computed(() => entrepreneurs.value.length);
const totalBusinesses = computed(() => businesses.value.length);

const businessLocations = computed(() => {
  return businesses.value
    .filter(business => business.location && business.location.latitude && business.location.longitude)
    .map(business => ({
      lat: business.location.latitude!,
      lng: business.location.longitude!,
      name: business.name,
    }));
});

const handleSupportSubmit = async (data: Support) => {
  try {
    await supportStore.addSupport(data);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Support boost logged successfully', life: 3000 });
    showSupportDialog.value = false;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to log support boost', life: 3000 });
  }
};

onMounted(async () => {
  await entrepreneurStore.fetchAll();
  await businessStore.fetchAll();
});
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>


<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>
