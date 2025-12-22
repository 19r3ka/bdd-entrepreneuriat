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
        <h2 class="mb-3">{{ $t('pages.dashboard.quickActions') }}</h2>
        <div class="flex gap-3 flex-wrap">
          <Button
            :label="$t('pages.dashboard.logSupport')"
            icon="pi pi-heart"
            @click="showSupportDialog = true"
          />
          <Button
            :label="$t('pages.dashboard.addGoal')"
            icon="pi pi-flag"
            @click="showGoalDialog = true"
          />
          <Button
            :label="$t('pages.dashboard.recordMeasurement')"
            icon="pi pi-chart-line"
            @click="showMeasurementDialog = true"
          />
        </div>
      </div>
    </div>

    <div class="col-12 xl:col-8">
      <div class="card">
        <h2>{{ $t('pages.dashboard.businessLocations') }}</h2>
        <InteractiveMap :locations="businessLocations" class="w-full h-full" :is-editable="false" />
      </div>
    </div>

    <div class="col-12 xl:col-4">
      <QuickAddEntrepreneurForm />
    </div>
  </div>

  <!-- Dialogs -->
  <Dialog
    v-model:visible="showSupportDialog"
    :header="$t('pages.dashboard.logSupport')"
    modal
    class="p-fluid"
    :style="{ width: '65vw' }"
    :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
  >
    <SupportBoostForm @submit="handleSupportSubmit" />
  </Dialog>

  <Dialog
    v-model:visible="showGoalDialog"
    :header="$t('goalForm.new')"
    modal
    class="p-fluid"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
  >
    <GoalForm
      :is-edit="false"
      :initial-values="{}"
      @success="showGoalDialog = false"
      @cancel="showGoalDialog = false"
    />
  </Dialog>

  <Dialog
    v-model:visible="showMeasurementDialog"
    :header="$t('measurementForm.new')"
    modal
    class="p-fluid"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
  >
    <MeasurementForm
      :is-edit="false"
      :initial-values="{}"
      @success="showMeasurementDialog = false"
      @cancel="showMeasurementDialog = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useSupportStore } from '@/stores/useSupportStore';
import DashboardWidget from '@/components/DashboardWidget.vue';
import QuickAddEntrepreneurForm from '@/components/QuickAddEntrepreneurForm.vue';
import InteractiveMap from '@/components/InteractiveMap.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue';
import GoalForm from '@/components/monitoring-evaluation/GoalForm.vue';
import MeasurementForm from '@/components/monitoring-evaluation/MeasurementForm.vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import type { Support } from '@/schemas/monitoring-evaluation/Support'; // Use schema for type inference

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
    .filter(b => b.location?.coordinates?.latitude && b.location?.coordinates?.longitude)
    .map(b => ({
      lat: b.location!.coordinates!.latitude as number,
      lng: b.location!.coordinates!.longitude as number,
      name: b.name,
      address: formatAddress(b.location), // Format address from AddressSchema
    }));
});

/**
 *
 */
function formatAddress(location: (typeof businesses.value)[number]['location']) {
  if (!location) return undefined;
  const parts = [];
  if (location.street) parts.push(location.street);
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);
  return parts.join(', ');
}

const handleSupportSubmit = async (data: Support) => {
  try {
    await supportStore.addSupport(data);
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('messages.supportCreated'),
      life: 3000,
    });
    showSupportDialog.value = false;
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('messages.supportFailed'),
      life: 3000,
    });
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
