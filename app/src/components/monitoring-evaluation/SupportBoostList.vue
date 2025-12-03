<template>
  <ResourceDataTable
    resource-name="supports"
    title="Supports"
    data-key="id"
    :data="supports"
    :columns="columns"
    :loading="loading"
    :filter-mode="'advanced'"
    v-model:filters="filters"
    :global-filter-fields="['title', 'provider', 'notes']"
    @add="onAdd"
    @view="onView"
    @edit="onEdit"
    @delete="onDelete"
  >
    <template #col-businessId="{ data }">
      <router-link
        v-if="getBusinessId(data.businessId)"
        :to="`/businesses/${data.businessId}`"
        class="text-primary no-underline hover:underline"
      >
        {{ getBusinessName(data.businessId) }}
      </router-link>
      <span v-else class="text-500">{{ getBusinessName(data.businessId) }}</span>
    </template>
    <template #col-quantity="{ data }">
      {{ formatQuantity(data.quantity) }}
    </template>
    <template #append-actions="{ data }">
      <slot name="append-actions" :data="data"></slot>
    </template>
  </ResourceDataTable>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import ResourceDataTable from '@/components/common/ResourceDataTable.vue';
import { useSupportStore } from '@/stores/useSupportStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRouter } from 'vue-router';
import type { Support } from '@/types/monitoring-evaluation/Support';
import { useConfirmation } from '@/composables/useConfirmation';

const router = useRouter();
const supportStore = useSupportStore();
const businessStore = useBusinessStore();

const loading = ref(false);
const supports = computed(() => supportStore.supports);

// Initialize filters for advanced mode
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  businessId: { value: null, matchMode: FilterMatchMode.EQUALS },
  boostType: { value: null, matchMode: FilterMatchMode.EQUALS },
  modality: { value: null, matchMode: FilterMatchMode.EQUALS },
  startDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  endDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
  provider: { value: null, matchMode: FilterMatchMode.CONTAINS },
  genderMarker: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const columns = [
  { field: 'title', header: 'Title', sortable: true, dataType: 'text' as const },
  { field: 'businessId', header: 'Business', sortable: true, dataType: 'text' as const },
  { field: 'boostType', header: 'Type', sortable: true, dataType: 'text' as const },
  { field: 'modality', header: 'Modality', sortable: true, dataType: 'text' as const },
  { field: 'startDate', header: 'Start Date', sortable: true, dataType: 'date' as const },
  { field: 'endDate', header: 'End Date', sortable: true, dataType: 'date' as const },
  { field: 'provider', header: 'Provider', sortable: true, dataType: 'text' as const },
  { field: 'quantity', header: 'Quantity' },
];

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    supportStore.fetchAll(),
    businessStore.fetchAll(), // Ensure businesses are loaded for name lookup
  ]);
  loading.value = false;
});

function getBusinessName(businessId: string) {
  const business = businessStore.businesses.find(b => b.id === businessId);
  return business ? business.name : 'Unknown Business';
}

function getBusinessId(businessId: string) {
  return businessStore.businesses.find(b => b.id === businessId);
}

function formatQuantity(quantity: any) {
  if (!quantity || !quantity.value) return '-';
  const unit = quantity.unit === 'currency' ? quantity.currency : quantity.unit;
  return `${quantity.value} ${unit || ''}`;
}

function onAdd() {
  emit('create');
}

function onView(id: string) {
  router.push(`/supports/${id}`);
}

function onEdit(id: string) {
  emit('edit', id);
}

const { confirmDelete } = useConfirmation();

function onDelete(id: string) {
  const support = supports.value.find(s => s.id === id);
  const name = support?.title || 'Support';

  confirmDelete(name, async () => {
    await supportStore.deleteSupport(id);
  });
}

const emit = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', id: string): void;
}>();
</script>
