<template>
  <ResourceDataTable
    ref="resourceDataTableRef"
    v-model:filters="filters"
    :data="businesses"
    :columns="columns"
    data-key="id"
    :global-filter-fields="globalFilterFields"
    resource-name="businesses"
    :title="$t('pages.businesses.title')"
    filter-mode="advanced"
    @add="handleAddBusiness"
    @view="handleViewBusiness"
    @edit="handleEditBusiness"
    @delete="handleDelete"
    @delete-selected="confirmDeleteSelected"
    @export-csv="handleExportCSV"
  >
    <!-- Logo / Avatar -->
    <template #col-logo="{ data }">
      <AvatarDisplay
        :src="data.avatar || data.logo"
        :label="data.name || ''"
        shape="circle"
        size="normal"
        custom-class="mr-2"
      />
    </template>

    <!-- Name -->
    <template #col-name="{ data }">
      <span class="font-semibold">{{ data.name || $t('common.notAvailable') }}</span>
    </template>

    <!-- Owner -->
    <template #col-ownerName="{ data }">
      <div v-if="data.ownerName">
        <a class="text-capitalize owner-link" @click="goToEntrepreneurProfile(data.entrepreneurId)">
          {{ data.ownerName }}
        </a>
      </div>
      <span v-else class="text-500">{{ $t('common.notAssigned') }}</span>
    </template>

    <!-- Primary business area -->
    <template #col-primaryBusinessArea="{ data }">
      <Tag
        v-if="data.primaryBusinessArea"
        :value="truncateBusinessArea(getBusinessAreaLabel(data.primaryBusinessArea))"
        severity="info"
        :title="getBusinessAreaLabel(data.primaryBusinessArea)"
        class="business-area-tag"
      />
      <span v-else class="text-500">{{ $t('common.notSpecified') }}</span>
    </template>

    <!-- Registered -->
    <template #col-registered="{ data }">
      <i
        class="pi"
        :class="
          data.isRegistered ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'
        "
        :title="data.isRegistered ? $t('common.registered') : $t('common.notRegistered')"
      />
    </template>

    <!-- Support start date -->
    <template #col-supportStartDate="{ data }">
      {{ formatDate(data.supportStartDate) }}
    </template>

    <!-- Filters -->
    <template #filter-name="{ filterModel }">
      <TextFilter v-model="filterModel.value" :placeholder="$t('placeholders.searchByName')" />
    </template>

    <template #filter-ownerName="{ filterModel }">
      <SelectFilter
        v-model="filterModel.value"
        :options="ownerOptions"
        :placeholder="$t('placeholders.selectOwners')"
      />
    </template>

    <template #filter-primaryBusinessArea="{ filterModel }">
      <SelectFilter
        v-model="filterModel.value"
        :options="businessAreaOptions"
        :placeholder="$t('placeholders.selectArea')"
      />
    </template>

    <template #filter-isRegistered="{ filterModel }">
      <BooleanFilter v-model="filterModel.value" label="placeholders.registeredOnly" />
    </template>

    <template #filter-supportStartDate="{ filterModel }">
      <DatePicker
        v-model="filterModel.value"
        date-format="mm/dd/yy"
        :placeholder="$t('placeholders.selectDate')"
      />
    </template>
    <template #prepend-actions="{ data }">
      <Button
        v-tooltip.top="'Log Support'"
        icon="pi pi-heart"
        class="p-button-rounded p-button-text p-button-sm mr-1"
        @click="openSupportDialog(data.id)"
      />
    </template>

    <template #header-actions>
      <SplitButton
        :label="$t('pages.businesses.add')"
        icon="pi pi-plus"
        :model="actionItems"
        class="p-button-primary"
        @click="handleAddBusiness"
      />
    </template>
  </ResourceDataTable>

  <Dialog
    v-model:visible="showSupportDialog"
    header="Log Support"
    modal
    class="p-fluid"
    :style="{ width: '65vw' }"
    :breakpoints="{ '960px': '80vw', '640px': '95vw' }"
  >
    <SupportBoostForm :business-id="selectedBusinessId" @submit="handleSupportSubmit" />
  </Dialog>

  <!-- Import Dialog -->
  <DataImportUpload v-model:visible="showImportDialog" @import-complete="handleImportComplete" />

  <!-- Export Dialog -->
  <DataExportControl
    v-model:visible="showExportDialog"
    :data="exportDataSelected.length > 0 ? exportDataSelected : businesses"
    default-file-name="businesses_export"
  />
</template>

<script setup lang="ts">
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import Tooltip from 'primevue/tooltip'
  import { storeToRefs } from 'pinia'
  import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
  import Button from 'primevue/button'
  import DatePicker from 'primevue/datepicker'
  import Dialog from 'primevue/dialog'
  import SplitButton from 'primevue/splitbutton'
  import Tag from 'primevue/tag'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useToast } from 'primevue/usetoast'

  import BooleanFilter from '@/components/common/BooleanFilter.vue'
  import ResourceDataTable from '@/components/common/ResourceDataTable.vue'
  import SelectFilter from '@/components/common/SelectFilter.vue'
  import TextFilter from '@/components/common/TextFilter.vue'
  import DataImportUpload from '@/components/import-export/DataImportUpload.vue'
  import DataExportControl from '@/components/import-export/DataExportControl.vue'
  import { useBusinessAreas } from '@/composables/useBusinessAreas'
  import { useBusinessFilters } from '@/composables/useBusinessFilters'
  import { useConfirmation } from '@/composables/useConfirmation'
  import { generateCsvColumns, useCsv } from '@/composables/useCsv'
  import { useFormatters } from '@/composables/useFormatters'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useSupportStore } from '@/stores/useSupportStore'
  import type { Business } from '@/types/business'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import type { ImportResult } from '@/composables/useImportExport'

  const { t } = useI18n()
  const router = useRouter()
  const store = useBusinessStore()
  const supportStore = useSupportStore()
  const toast = useToast()
  const { businesses } = storeToRefs(store)
  const { confirmDelete, confirmDeleteSelected } = useConfirmation()
  const { getBusinessAreaLabel } = useBusinessAreas()
  const { ownerOptions, businessAreaOptions } = useBusinessFilters()
  const { formatDate } = useFormatters()
  const { exportCsv } = useCsv<Business>()
  const vTooltip = Tooltip

  const resourceDataTableRef = ref()
  const showSupportDialog = ref(false)
  const selectedBusinessId = ref<string | undefined>(undefined)
  const showImportDialog = ref(false)
  const showExportDialog = ref(false)

  // Computed properties to access the multi-select state from ResourceDataTable
  const isMultiSelect = computed(() => resourceDataTableRef.value?.isMultiSelect || false)
  const selectedIds = computed(() => resourceDataTableRef.value?.selectedIds || new Set())

  // Define the menu items for the split button
  const actionItems = computed(() => [
    {
      label: t('importExport.importData'),
      icon: 'pi pi-upload',
      command: () => {
        showImportDialog.value = true
      }
    },
    {
      label: t('importExport.exportData'),
      icon: 'pi pi-download',
      command: () => {
        triggerExportFromTopButton()
      },
      disabled: isMultiSelect.value && selectedIds.value.size === 0
    }
  ])

  /**
   *
   */
  function handleImportComplete(result: ImportResult) {
    console.log('Import complete:', result)
    // Refresh the business list
    store.fetchAll()
  }

  /**
   *
   */
  function openSupportDialog(businessId: string) {
    selectedBusinessId.value = businessId
    showSupportDialog.value = true
  }

  /**
   *
   */
  function truncateBusinessArea(label: string, maxLength: number = 40): string {
    if (!label || label.length <= maxLength) return label
    return label.substring(0, maxLength) + '...'
  }

  const handleSupportSubmit = async (data: Support) => {
    try {
      await supportStore.addSupport(data)
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('messages.supportCreated'),
        life: 3000
      })
      showSupportDialog.value = false
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: t('messages.supportFailed'),
        life: 3000
      })
    }
  }

  /** Columns */
  const columns = computed(() => [
    { field: 'logo', header: t('common.logo'), sortable: false },
    {
      field: 'name',
      header: t('common.name'),
      sortable: true,
      filterField: 'name',
      dataType: 'text' as const
    },
    {
      field: 'ownerName',
      header: t('common.owner'),
      sortable: true,
      filterField: 'ownerName',
      dataType: 'text' as const
    },
    {
      field: 'primaryBusinessArea',
      header: t('common.primaryBusinessArea'),
      sortable: true,
      filterField: 'primaryBusinessArea',
      dataType: 'text' as const
    },
    {
      field: 'registered',
      header: t('common.registered'),
      sortable: true,
      filterField: 'isRegistered',
      dataType: 'boolean' as const
    },
    {
      field: 'supportStartDate',
      header: t('common.supportStartDate'),
      sortable: true,
      filterField: 'supportStartDate',
      dataType: 'date' as const
    }
  ])

  /** Global filter fields */
  const globalFilterFields = ref(['name', 'ownerName', 'primaryBusinessArea'])

  /** Filters */
  const filters = ref<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    ownerName: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }]
    },
    primaryBusinessArea: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    isRegistered: { value: null, matchMode: FilterMatchMode.EQUALS },
    supportStartDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    }
  })

  /** Navigation */
  function handleAddBusiness() {
    router.push('/businesses/new')
  }
  /**
   *
   */
  function handleViewBusiness(id: string) {
    if (id) router.push(`/businesses/${id}`)
  }
  /**
   *
   */
  function goToEntrepreneurProfile(id: string) {
    if (id) router.push(`/entrepreneurs/${id}`)
  }
  /**
   *
   */
  function handleEditBusiness(id: string) {
    if (id) router.push(`/businesses/${id}/edit`)
  }

  /**
   *
   */
  function handleDelete(id: string) {
    const business = businesses.value.find((b) => b.id === id)
    const name = business?.name || t('common.business')

    confirmDelete(name, async () => {
      await store.remove(id)
    })
  }

  // Export functionality - to be used for both bulk and individual export
  const exportDataSelected = ref<Business[]>([])

  const handleExportCSV = (dataToExport: Business[]) => {
    exportDataSelected.value = dataToExport
    showExportDialog.value = true
  }

  // Handle export from the top "Export Data" button
  const triggerExportFromTopButton = () => {
    // Get the currently selected items from the ResourceDataTable
    const dataTableComponent = resourceDataTableRef.value
    if (dataTableComponent && dataTableComponent.selectedItems && dataTableComponent.selectedItems.length > 0) {
      // If there are selected items in the table, export those
      exportDataSelected.value = dataTableComponent.selectedItems
    } else {
      // Otherwise, export all businesses
      exportDataSelected.value = businesses.value
    }
    showExportDialog.value = true
  }

  /** Load data */
  onMounted(() => store.fetchAll())
</script>

<style scoped>
  .owner-link {
    cursor: pointer;
    color: var(--primary-color);
    text-decoration: none;
  }
  .owner-link:hover {
    text-decoration: underline;
  }

  .business-area-tag {
    max-width: 300px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
