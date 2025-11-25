<template>
  <ResourceDataTable
    :data="filteredData"
    :columns="columns"
    dataKey="businessId"
    resourceName="reports"
    :title="$t('pages.reports.title')"
    :globalFilterFields="[]"
    v-model:filters="tableFilters"
    filterMode="advanced"
    @export-csv="handleExportCSV"
    @view="handleViewBusiness"
  >
    <!-- Custom Header with Description and Filters -->
    <template #header>
      <div class="flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center">
          <h1 class="m-0">{{ $t('pages.reports.title') }}</h1>
          <Button 
            :label="$t('reporting.export.csv')" 
            icon="pi pi-download" 
            @click="exportAllCSV"
            class="p-button-success"
          />
        </div>
        
        <p class="mb-0">{{ $t('pages.reports.description') }}</p>

        <!-- Filter Controls -->

      </div>
    </template>

    <!-- Custom Actions -->
    <template #actions="{ data }">
      <Button
        icon="pi pi-eye"
        class="p-button-rounded p-button-text"
        @click="handleViewBusiness(data.businessId)"
      />
    </template>
  </ResourceDataTable>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useEntrepreneurStore } from "@/stores/useEntrepreneurStore";
import { useBusinessStore } from "@/stores/useBusinessStore";
import { useSupportStore } from "@/stores/useSupportStore";
import { useIndicatorStore } from "@/stores/useIndicatorStore";
import { useMaturityStore } from "@/stores/useMaturityStore";
import Button from "primevue/button";

import ResourceDataTable from '@/components/common/ResourceDataTable.vue';
import { generateCsvColumns, useCsv } from '@/composables/useCsv';

const { t } = useI18n();
const router = useRouter();
const entrepreneurStore = useEntrepreneurStore();
const businessStore = useBusinessStore();
const supportStore = useSupportStore();
const indicatorStore = useIndicatorStore();
const maturityStore = useMaturityStore();
const { exportCsv } = useCsv();

const loading = ref(true);

interface ReportRow {
  businessId: string;
  businessName: string;
  entrepreneurName: string;
  gender: string;
  age: number | null;
  supportCount: number;
  goalCount: number;
  maturityLevel: number | null;
  genderMarkers: string[];
}

const reportData = ref<ReportRow[]>([]);

// Initialize filters with proper structure for advanced mode
const tableFilters = ref({});



// Column definitions
const columns = computed(() => [
  { 
    field: 'businessName', 
    header: t('reporting.columns.businessName'), 
    sortable: true,
    dataType: 'text' as const,
    filterField: 'businessName'
  },
  { 
    field: 'gender', 
    header: t('reporting.columns.gender'), 
    sortable: true,
    dataType: 'text' as const,
    filterField: 'gender'
  },
  { 
    field: 'age', 
    header: t('reporting.columns.age'), 
    sortable: true,
    dataType: 'numeric' as const,
    filterField: 'age'
  },
  { 
    field: 'supportCount', 
    header: t('reporting.columns.supportCount'), 
    sortable: true,
    dataType: 'numeric' as const,
    filterField: 'supportCount'
  },
  { 
    field: 'goalCount', 
    header: t('reporting.columns.goalCount'), 
    sortable: true,
    dataType: 'numeric' as const,
    filterField: 'goalCount'
  },
  { 
    field: 'maturityLevel', 
    header: t('reporting.columns.maturityLevel'), 
    sortable: true,
    dataType: 'numeric' as const,
    filterField: 'maturityLevel'
  }
]);

const youthOptions = computed(() => [
  { label: t('reporting.filters.all'), value: 'all' },
  { label: t('reporting.filters.youth'), value: 'youth' },
  { label: t('reporting.filters.nonYouth'), value: 'nonYouth' }
]);

const genderOptions = computed(() => [
  { label: t('reporting.filters.all'), value: 'all' },
  { label: t('reporting.filters.female'), value: 'Female' },
  { label: t('reporting.filters.male'), value: 'Male' },
  { label: t('reporting.filters.other'), value: 'Other' }
]);

const genderMarkerOptions = computed(() => [
  { label: t('reporting.filters.all'), value: 'all' },
  { label: 'GEN0', value: 'GEN0' },
  { label: 'GEN1', value: 'GEN1' },
  { label: 'GEN2', value: 'GEN2' },
  { label: 'GEN3', value: 'GEN3' }
]);

const calculateAge = (dob: Date | string | undefined) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      businessStore.fetchAll(),
      entrepreneurStore.fetchAll(),
      supportStore.getAllSupports(),
    ]);

    const rows: ReportRow[] = [];

    for (const business of businessStore.businesses) {
      if (!business.id) continue;
      const entrepreneurId = business.entrepreneurId;
      const entrepreneur = entrepreneurId ? entrepreneurStore.getById(entrepreneurId) : undefined;
      const supports = await supportStore.getSupportsByBusinessId(business.id);
      const indicators = await indicatorStore.getIndicatorsByBusinessId(business.id);
      const maturityAssessment = await maturityStore.getMaturityAssessmentByBusinessId(business.id);

      const age = entrepreneur ? calculateAge(entrepreneur.dateOfBirth) : null;
      const genderMarkers = supports.map(s => s.genderMarker).filter(Boolean) as string[];
      const maturityLevel = maturityAssessment
        ? Object.values(maturityAssessment.computedScores).reduce((sum, val) => sum + val, 0) /
          Object.values(maturityAssessment.computedScores).length
        : null;

      rows.push({
        businessId: business.id,
        businessName: business.name,
        entrepreneurName: entrepreneur ? `${entrepreneur.firstName} ${entrepreneur.lastName}` : 'N/A',
        gender: entrepreneur?.gender || 'N/A',
        age,
        supportCount: supports.length,
        goalCount: indicators.length,
        maturityLevel,
        genderMarkers
      });
    }
    reportData.value = rows;
  } finally {
    loading.value = false;
  }
});

const filteredData = computed(() => reportData.value);

const handleViewBusiness = (businessId: string) => {
  router.push(`/businesses/${businessId}`);
};

const handleExportCSV = (dataToExport: ReportRow[]) => {
  if (!dataToExport.length) return;
  const sample = dataToExport[0];
  const cols = generateCsvColumns(sample, ['businessId', 'genderMarkers', 'entrepreneurName']);
  exportCsv(dataToExport, cols as any, 'business-report');
};

const exportAllCSV = () => {
  handleExportCSV(filteredData.value);
};
</script>