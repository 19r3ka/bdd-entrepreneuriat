<template>
  <ResourceDataTable
    v-model:filters="filters"
    resource-name="quickWins"
    :title="$t('pages.quickWins.title')"
    data-key="id"
    :data="quickWins"
    :columns="columns"
    :loading="loading"
    :filter-mode="'advanced'"
    :global-filter-fields="['title', 'resultSummary', 'tags']"
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
    <template #col-indicators="{ data }">
      <div class="flex justify-content-center">
        <Badge :value="data.indicatorValues.length" severity="info" />
      </div>
    </template>
    <template #col-tags="{ data }">
      <div class="flex gap-1 flex-wrap">
        <Tag v-for="tag in data.tags.slice(0, 2)" :key="tag" :value="tag" severity="secondary" />
        <span v-if="data.tags.length > 2" class="text-xs text-500"
          >+{{ data.tags.length - 2 }}</span
        >
      </div>
    </template>
    <template #append-actions="{ data }">
      <slot name="append-actions" :data="data"></slot>
    </template>
  </ResourceDataTable>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { FilterMatchMode } from '@primevue/core/api'
  import ResourceDataTable from '@/components/common/ResourceDataTable.vue'
  import Tag from 'primevue/tag'
  import Badge from 'primevue/badge'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useRouter } from 'vue-router'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
  import { useConfirmation } from '@/composables/useConfirmation'
  import { useI18n } from 'vue-i18n'

  const router = useRouter()
  const quickWinStore = useQuickWinStore()
  const businessStore = useBusinessStore()
  const { t } = useI18n()

  const loading = ref(false)
  const quickWins = computed(() => quickWinStore.quickWins)

  // Initialize filters for advanced mode
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    businessId: { value: null, matchMode: FilterMatchMode.EQUALS },
    achievedOn: { value: null, matchMode: FilterMatchMode.DATE_IS },
    genderMarker: { value: null, matchMode: FilterMatchMode.EQUALS }
  })

  const columns = computed(() => [
    { field: 'title', header: t('pages.quickWins.title'), sortable: true, dataType: 'text' as const },
    { field: 'businessId', header: t('business.label'), sortable: true, dataType: 'text' as const },
    { field: 'achievedOn', header: t('pages.quickWins.achievedOn'), sortable: true, dataType: 'date' as const },
    { field: 'indicators', header: t('pages.quickWins.indicators') },
    { field: 'tags', header: t('pages.quickWins.tags') }
  ])

  onMounted(async () => {
    loading.value = true
    await Promise.all([
      quickWinStore.fetchAll(),
      businessStore.fetchAll() // Ensure businesses are loaded for name lookup
    ])
    loading.value = false
  })

  /**
   *
   */
  function getBusinessName(businessId: string) {
    const business = businessStore.businesses.find((b) => b.id === businessId)
    return business ? business.name : t('common.unknownBusiness')
  }

  /**
   *
   */
  function getBusinessId(businessId: string) {
    return businessStore.businesses.find((b) => b.id === businessId)
  }

  /**
   *
   */
  function onAdd() {
    emit('create')
  }

  /**
   *
   */
  function onView(id: string) {
    router.push(`/quick-wins/${id}`)
  }

  /**
   *
   */
  function onEdit(id: string) {
    emit('edit', id)
  }

  const { confirmDelete } = useConfirmation()

  /**
   *
   */
  function onDelete(id: string) {
    const quickWin = quickWins.value.find((qw) => qw.id === id)
    const name = quickWin?.title || t('quickWins.label')

    confirmDelete(name, async () => {
      await quickWinStore.deleteQuickWin(id)
    })
  }

  const emit = defineEmits<{
    (e: 'create'): void
    (e: 'edit', id: string): void
  }>()
</script>
