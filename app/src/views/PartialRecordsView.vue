<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { usePartialRecordStore } from '@/stores/usePartialRecordStore';
import PartialRecordEditor from '@/components/import-export/PartialRecordEditor.vue';
import type { PartialRecord } from '@/types/partialRecord';

const router = useRouter();
const partialRecordStore = usePartialRecordStore();

const statusFilter = ref<'pending' | 'ignored' | 'all'>('pending');
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Ignored', value: 'ignored' },
  { label: 'All', value: 'all' },
];

const selectedRecord = ref<PartialRecord | null>(null);
const showEditor = ref(false);

const filteredRecords = computed(() => {
  if (statusFilter.value === 'all') {
    return partialRecordStore.partialRecords;
  }
  return partialRecordStore.partialRecords.filter(r => r.status === statusFilter.value);
});

onMounted(async () => {
  await partialRecordStore.loadAll();
});

/**
 *
 */
function openEditor(record: PartialRecord) {
  selectedRecord.value = record;
  showEditor.value = true;
}

/**
 *
 */
function handleRecordUpdated() {
  partialRecordStore.loadAll();
}

/**
 *
 */
function goBack() {
  router.push('/');
}
</script>

<template>
  <div class="partial-records-view p-4">
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="text-3xl font-bold m-0">Partial Records</h1>
        <p class="text-color-secondary mt-2">
          Review and complete business records that need additional information
        </p>
      </div>
      <Button label="Back to Dashboard" icon="pi pi-arrow-left" outlined @click="goBack" />
    </div>

    <!-- Status Filter -->
    <div class="mb-4">
      <SelectButton
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
      />
    </div>

    <!-- Data Table -->
    <DataTable
      :value="filteredRecords"
      striped-rows
      paginator
      :rows="10"
      :loading="partialRecordStore.loading"
      data-key="id"
      class="p-datatable-sm"
    >
      <template #empty>
        <div class="text-center p-4">
          <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
          <p class="text-color-secondary">No partial records found</p>
        </div>
      </template>

      <Column field="importSource" header="Source" sortable>
        <template #body="{ data }">
          <div class="flex flex-column gap-1">
            <span class="font-semibold">{{ data.importSource }}</span>
            <span class="text-xs text-color-secondary">
              {{ new Date(data.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </template>
      </Column>

      <Column header="Business Name">
        <template #body="{ data }">
          {{ data.rawData.name || data.rawData['Business Name'] || 'N/A' }}
        </template>
      </Column>

      <Column header="Owner">
        <template #body="{ data }">
          {{ data.rawData.owner || data.rawData['Owner'] || 'N/A' }}
        </template>
      </Column>

      <Column field="missingFields" header="Missing Fields">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="field in data.missingFields.slice(0, 3)"
              :key="field"
              class="px-2 py-1 bg-orange-100 text-orange-900 border-round text-xs"
            >
              {{ field }}
            </span>
            <span
              v-if="data.missingFields.length > 3"
              class="px-2 py-1 bg-gray-100 text-gray-900 border-round text-xs"
            >
              +{{ data.missingFields.length - 3 }} more
            </span>
          </div>
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <span
            :class="{
              'px-2 py-1 border-round text-xs font-semibold': true,
              'bg-orange-100 text-orange-900': data.status === 'pending',
              'bg-gray-100 text-gray-900': data.status === 'ignored',
            }"
          >
            {{ data.status }}
          </span>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            outlined
            @click="openEditor(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Editor Dialog -->
    <PartialRecordEditor
      v-model:visible="showEditor"
      :partial-record="selectedRecord"
      @record-updated="handleRecordUpdated"
    />
  </div>
</template>
