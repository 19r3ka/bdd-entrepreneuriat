<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Business } from '@/types/business';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import AvatarDisplay from '@/components/common/AvatarDisplay.vue';
import { FilterMatchMode } from '@primevue/core/api';
import type { DataTableFilterMeta } from 'primevue/datatable';

const props = defineProps<{
  visible: boolean;
  businesses: Business[];
  dimension: string;
  currentLevel: number;
  nextLevel: number;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
}>();

const router = useRouter();
const globalFilterValue = ref('');

const filters = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
});

const headerText = computed(() => {
  const count = props.businesses.length;
  return `${props.dimension} - Level ${props.currentLevel} → ${props.nextLevel} (${count} ${count === 1 ? 'business' : 'businesses'})`;
});

const onGlobalFilterChange = () => {
  const globalFilter = filters.value.global;
  if (globalFilter && typeof globalFilter === 'object' && 'value' in globalFilter) {
    globalFilter.value = globalFilterValue.value || null;
  }
};

const viewBusiness = (businessId: string) => {
  if (businessId) {
    router.push(`/businesses/${businessId}`);
  }
};
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="headerText"
    :modal="true"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="business-list-modal"
  >
    <template #header>
      <div class="flex flex-column gap-2 w-full">
        <h3 class="m-0 text-900 dark:text-0 font-bold">{{ headerText }}</h3>
        <p class="m-0 text-sm text-600 dark:text-400">
          These businesses are currently at Level {{ currentLevel }} and ready to advance to Level
          {{ nextLevel }}.
        </p>
      </div>
    </template>

    <div class="mb-3">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="globalFilterValue"
          placeholder="Search businesses..."
          class="w-full"
          @input="onGlobalFilterChange"
        />
      </IconField>
    </div>

    <DataTable
      :value="businesses"
      :filters="filters"
      :global-filter-fields="['name', 'ownerName']"
      paginator
      :rows="10"
      data-key="id"
      striped-rows
      class="business-modal-table"
      @row-click="event => viewBusiness(event.data.id)"
    >
      <template #empty>
        <div class="text-center p-3 text-500">No businesses found.</div>
      </template>

      <Column field="logo" header="" style="width: 4rem">
        <template #body="{ data }">
          <AvatarDisplay
            :src="data.avatar || data.logo"
            :label="data.name || ''"
            shape="circle"
            size="normal"
          />
        </template>
      </Column>

      <Column field="name" header="Business Name" sortable>
        <template #body="{ data }">
          <span class="font-semibold text-800 dark:text-100">{{ data.name }}</span>
        </template>
      </Column>

      <Column field="ownerName" header="Owner" sortable>
        <template #body="{ data }">
          <span v-if="data.ownerName" class="text-700 dark:text-200">{{ data.ownerName }}</span>
          <span v-else class="text-500">Not assigned</span>
        </template>
      </Column>

      <Column :header="`${dimension} Level`" style="width: 8rem" class="text-center">
        <template #body="{ data }">
          <span class="font-bold text-blue-600 dark:text-blue-400">
            Level {{ data.maturityLevels?.[dimension] || 1 }}
          </span>
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<style scoped>
.business-list-modal :deep(.p-dialog-header) {
  padding-bottom: 1rem;
}

.business-modal-table :deep(tbody tr) {
  cursor: pointer;
}

.business-modal-table :deep(tbody tr:hover) {
  background-color: var(--highlight-bg);
}
</style>
