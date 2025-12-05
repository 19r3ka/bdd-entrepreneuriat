<template>
  <ResourceDataTable
    resource-name="supports"
    :title="$t('pages.supports.title', 'Support Interventions')"
    data-key="id"
    :data="supports"
    :columns="columns"
    :loading="loading"
    filter-mode="advanced"
    v-model:filters="filters"
    :global-filter-fields="['title', 'provider', 'notes']"
    @add="handleAdd"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
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
  </ResourceDataTable>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { FilterMatchMode } from '@primevue/core/api'
  import ResourceDataTable from '@/components/common/ResourceDataTable.vue'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useConfirmation } from '@/composables/useConfirmation'

  const router = useRouter()
  const { t } = useI18n()
  const supportStore = useSupportStore()
  const businessStore = useBusinessStore()
  const { confirmDelete } = useConfirmation()

  const loading = ref(false)
  const supports = computed(() => supportStore.supports)

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
    genderMarker: { value: null, matchMode: FilterMatchMode.EQUALS }
  })

  const columns = computed(() => [
    { field: 'title', header: t('support.title'), sortable: true, dataType: 'text' as const },
    { field: 'businessId', header: t('business.label'), sortable: true, dataType: 'text' as const },
    { field: 'boostType', header: t('support.boostType'), sortable: true, dataType: 'text' as const },
    { field: 'modality', header: t('support.modality'), sortable: true, dataType: 'text' as const },
    { field: 'startDate', header: t('support.startDate'), sortable: true, dataType: 'date' as const },
    { field: 'endDate', header: t('support.endDate'), sortable: true, dataType: 'date' as const },
    { field: 'provider', header: t('support.provider'), sortable: true, dataType: 'text' as const },
    { field: 'quantity', header: t('support.quantityValue'), sortable: false }
  ])

  onMounted(async () => {
    loading.value = true
    await Promise.all([
      supportStore.fetchAll(),
      businessStore.fetchAll() // Ensure businesses are loaded for name lookup
    ])
    loading.value = false
  })

  function getBusinessName(businessId: string) {
    const business = businessStore.businesses.find((b) => b.id === businessId)
    return business ? business.name : t('common.unknownBusiness')
  }

  function getBusinessId(businessId: string) {
    return businessStore.businesses.find((b) => b.id === businessId)
  }

  function formatQuantity(quantity: any) {
    if (!quantity || !quantity.value) return '-'
    const unit = quantity.unit === 'currency' ? quantity.currency : quantity.unit
    return `${quantity.value} ${unit || ''}`
  }

  function handleAdd() {
    router.push('/supports/new')
  }

  function handleView(id: string) {
    router.push(`/supports/${id}`)
  }

  function handleEdit(id: string) {
    router.push(`/supports/${id}/edit`)
  }

  function handleDelete(id: string) {
    const support = supports.value.find((s) => s.id === id)
    const name = support?.title || 'Support'

    confirmDelete(name, async () => {
      await supportStore.deleteSupport(id)
    })
  }
</script>
