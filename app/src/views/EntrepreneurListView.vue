<template>
  <ResourceDataTable
    :data="entrepreneurs"
    :columns="columns"
    dataKey="id"
    v-model:filters="filters"
    :globalFilterFields="globalFilterFields"
    resourceName="entrepreneurs"
    :title="$t('pages.entrepreneurs.title')"
    @add="addEntrepreneur"
    @view="viewEntrepreneur"
    @edit="EditEntrepreneur"
    @delete="confirmDelete"
    @delete-selected="confirmDeleteSelected"
    @export-csv="exportCSV"
  >
    <!-- Avatar Column -->
    <template #col-avatar="{ data }">
      <AvatarDisplay
        :src="data.avatar"
        :label="`${data.firstName} ${data.lastName}`"
        shape="circle"
        size="normal"
        customClass="mr-2"
      />
    </template>

    <!-- Custom body slots -->
    <template #col-firstName="{ data }">
      <span class="text-capitalize">{{ data.firstName }}</span>
    </template>

    <template #col-lastName="{ data }">
      <span class="text-capitalize">{{ data.lastName }}</span>
    </template>

    <template #col-contact.email="{ data }">
      {{ data.contact?.email || '' }}
    </template>
  </ResourceDataTable>
</template>

<script setup lang="ts">
  import { FilterMatchMode } from '@primevue/core/api'
  import { storeToRefs } from 'pinia'
  import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
  import { useToast } from 'primevue/usetoast'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import ResourceDataTable from '@/components/common/ResourceDataTable.vue'
  import { useConfirmation } from '@/composables/useConfirmation'
  import { generateCsvColumns, useCsv } from '@/composables/useCsv'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import type { Entrepreneur } from '@/types/entrepreneur'

  const router = useRouter()
  const store = useEntrepreneurStore()
  const { entrepreneurs } = storeToRefs(store)
  const {
    confirmDelete: confirmDeleteEntrepreneur,
    confirmDeleteSelected: confirmDeleteSelectedEntrepreneurs
  } = useConfirmation()
  const toast = useToast()
  const { t } = useI18n()
  const { exportCsv } = useCsv<Entrepreneur>()

  /**
   * Column definitions: lean, declarative.
   */
  const columns = ref([
    {
      field: 'firstName',
      header: t('common.firstName'),
      sortable: true,
      filterField: 'firstName',
      dataType: 'text' as const
    },
    {
      field: 'lastName',
      header: t('common.lastName'),
      sortable: true,
      filterField: 'lastName',
      dataType: 'text' as const
    },
    {
      field: 'contact.email',
      header: t('common.email'),
      sortable: true,
      filterField: 'contact.email',
      dataType: 'text' as const
    }
  ])

  /** Global filter fields: used by the search box */
  const globalFilterFields = ref(['firstName', 'lastName', 'contact.email'])

  /** Filters object: parent owns it, passed via v-model */
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'contact.email': { value: null, matchMode: FilterMatchMode.CONTAINS }
  })

  /* ---------- Navigation and actions ---------- */
  const addEntrepreneur = () => router.push('/entrepreneurs/new')
  const viewEntrepreneur = (id: string) => router.push(`/entrepreneurs/${id}`)
  const EditEntrepreneur = (id: string) => router.push(`/entrepreneurs/${id}/edit`)

  /** Delete confirmations using extended useConfirmation */
  const confirmDelete = (id: string) => {
    const entrepreneur = entrepreneurs.value.find((e) => e.id === id)
    const name = entrepreneur
      ? `${entrepreneur.firstName} ${entrepreneur.lastName}`
      : t('common.entrepreneur')

    confirmDeleteEntrepreneur(name, async () => {
      try {
        await store.remove(id)
      } catch {
        toast.add({ severity: 'error', summary: t('pages.entrepreneurs.deleteError'), life: 3000 })
      }
    })
  }

  const confirmDeleteSelected = (ids: string[]) => {
    confirmDeleteSelectedEntrepreneurs('Entrepreneur', ids.length, async () => {
      try {
        await store.removeMany(ids)
      } catch {
        toast.add({ severity: 'error', summary: t('pages.entrepreneurs.deleteError'), life: 3000 })
      }
    })
  }

  /** CSV export using useCsv */
  const exportCSV = (dataToExport: Entrepreneur[]) => {
    if (!dataToExport.length) return

    const sample = dataToExport[0]
    const cols = generateCsvColumns(sample, ['id']) // exclude id

    exportCsv(dataToExport, cols, 'entrepreneurs')
  }

  onMounted(() => store.fetchAll())
</script>

<style scoped>
  .text-capitalize {
    text-transform: capitalize;
  }
</style>
