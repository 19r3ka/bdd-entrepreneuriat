<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div
      v-if="loading"
      class="flex justify-content-center align-items-center"
      style="min-height: 400px"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else-if="support" class="max-w-5xl mx-auto">
      <!-- Main Card -->
      <div class="card mb-4">
        <!-- Title Section with Actions -->
        <div class="border-bottom-1 surface-border pb-4 mb-4">
          <div class="flex align-items-center justify-content-between">
            <div class="flex-1">
              <h1 class="text-4xl font-bold m-0 mb-2">{{ support.title }}</h1>
              <div class="flex gap-2 flex-wrap">
                <Tag :value="support.boostType" severity="info" />
                <Tag :value="support.modality" severity="success" />
                <Tag :value="support.genderMarker" />
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                :label="$t('common.edit')"
                class="p-button-secondary"
                @click="router.push(`/supports/${supportId}/edit`)"
              />
              <Button
                icon="pi pi-trash"
                :label="$t('common.delete')"
                class="p-button-danger"
                @click="handleDelete"
              />
            </div>
          </div>
        </div>

        <!-- Business Info -->
        <div class="mb-4 p-3 surface-50 border-round">
          <h3 class="text-lg font-semibold mb-2 flex align-items-center gap-2">
            <i class="pi pi-building"></i>
            {{ $t('forms.business.name') }}
          </h3>
          <router-link
            v-if="business"
            :to="`/businesses/${support.businessId}`"
            class="text-xl font-medium text-primary no-underline hover:underline"
          >
            {{ business.name }}
          </router-link>
          <span v-else class="text-500">{{ $t('common.notAvailable') }}</span>
        </div>

        <!-- Details Grid -->
        <div class="grid mb-4">
          <!-- Dates -->
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round h-full">
              <h4 class="text-sm font-semibold text-500 mb-2">{{ $t('support.startDate') }}</h4>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-calendar text-primary"></i>
                <span class="text-xl font-medium">{{ formatDate(support.startDate) }}</span>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round h-full">
              <h4 class="text-sm font-semibold text-500 mb-2">{{ $t('support.endDate') }}</h4>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-calendar text-primary"></i>
                <span class="text-xl font-medium">{{
                  support.endDate ? formatDate(support.endDate) : $t('common.notSpecified')
                }}</span>
              </div>
            </div>
          </div>

          <!-- Provider -->
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round h-full">
              <h4 class="text-sm font-semibold text-500 mb-2">{{ $t('support.provider') }}</h4>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-users text-primary"></i>
                <span class="text-xl font-medium">{{
                  support.provider || $t('common.notSpecified')
                }}</span>
              </div>
            </div>
          </div>

          <!-- Channel -->
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round h-full">
              <h4 class="text-sm font-semibold text-500 mb-2">{{ $t('support.channel') }}</h4>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-wifi text-primary"></i>
                <span class="text-xl font-medium">{{
                  support.channel || $t('common.notSpecified')
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity/Value -->
        <div
          v-if="support.quantity && (support.quantity.value || support.quantity.unit)"
          class="mb-4"
        >
          <div class="p-4 border-2 border-primary border-round">
            <h3 class="text-lg font-semibold mb-3 flex align-items-center gap-2">
              <i class="pi pi-chart-bar text-primary"></i>
              {{ $t('support.quantityValue') }}
            </h3>
            <div class="grid">
              <div v-if="support.quantity.value" class="col-12 md:col-4">
                <div class="text-center">
                  <div class="text-500 text-sm mb-1">{{ $t('support.value') }}</div>
                  <div class="text-3xl font-bold text-primary">{{ support.quantity.value }}</div>
                </div>
              </div>
              <div v-if="support.quantity.unit" class="col-12 md:col-4">
                <div class="text-center">
                  <div class="text-500 text-sm mb-1">{{ $t('support.unit') }}</div>
                  <div class="text-2xl font-semibold">{{ support.quantity.unit }}</div>
                </div>
              </div>
              <div v-if="support.quantity.currency" class="col-12 md:col-4">
                <div class="text-center">
                  <div class="text-500 text-sm mb-1">{{ $t('support.currency') }}</div>
                  <div class="text-2xl font-semibold">{{ support.quantity.currency }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="support.notes" class="mb-4">
          <h3 class="text-lg font-semibold mb-2 flex align-items-center gap-2">
            <i class="pi pi-file-edit"></i>
            {{ $t('support.notes') }}
          </h3>
          <div class="p-3 surface-50 border-round">
            <p class="m-0 white-space-pre-wrap">{{ support.notes }}</p>
          </div>
        </div>

        <!-- Quick Wins Section -->
        <div class="mb-4">
          <QuickWinTimeline
            :quick-wins="linkedQuickWins"
            :title="$t('quickWin.linkedQuickWins', 'Linked Quick Wins')"
            @add="addQuickWin"
            @view="(id) => router.push(`/quick-wins/${id}`)"
            @edit="(id) => router.push(`/quick-wins/${id}/edit`)"
          />
        </div>

        <!-- Metadata -->
        <div class="border-top-1 surface-border pt-3 mt-4">
          <div class="flex justify-content-between text-sm text-500">
            <div>
              <strong>{{ $t('common.createdAt') }}:</strong> {{ formatDateTime(support.createdAt) }}
            </div>
            <div>
              <strong>{{ $t('common.updatedAt') }}:</strong> {{ formatDateTime(support.updatedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <Message severity="error" :closable="false">
        {{ $t('errors.fetchFailed', { entity: 'support' }) }}
      </Message>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useConfirmation } from '@/composables/useConfirmation'
  import { useToast } from 'primevue/usetoast'
  import Button from 'primevue/button'
  import Tag from 'primevue/tag'
  import Message from 'primevue/message'
  import QuickWinTimeline from '@/components/monitoring-evaluation/QuickWinTimeline.vue'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'

  const { d } = useI18n()

  const route = useRoute()
  const router = useRouter()
  const supportStore = useSupportStore()
  const businessStore = useBusinessStore()
  const quickWinStore = useQuickWinStore()
  const { showConfirmation } = useConfirmation()
  const toast = useToast()

  const supportId = route.params.id as string
  const loading = ref(true)
  const support = ref<Support | undefined>()
  const linkedQuickWins = ref<QuickWin[]>([])

  const business = computed(() => {
    if (!support.value) return null
    return businessStore.businesses.find((b) => b.id === support.value!.businessId)
  })

  onMounted(async () => {
    loading.value = true
    try {
      await Promise.all([loadSupport(), businessStore.fetchAll(), loadQuickWins()])
    } finally {
      loading.value = false
    }
  })

  async function loadSupport() {
    support.value = await supportStore.getSupportById(supportId)
  }

  async function loadQuickWins() {
    linkedQuickWins.value = await quickWinStore.getQuickWinsBySupportId(supportId)
  }

  function addQuickWin() {
    if (support.value) {
      router.push(
        `/quick-wins/new?businessId=${support.value.businessId}&supportBoostId=${supportId}`
      )
    }
  }

  function formatDate(dateString: string | undefined) {
    if (!dateString) return ''
    return d(new Date(dateString), 'long')
  }

  function formatDateTime(dateString: string | undefined) {
    if (!dateString) return ''
    return d(new Date(dateString))
  }

  function handleDelete() {
    showConfirmation(
      'Are you sure you want to delete this support? This action cannot be undone.',
      'Confirm Deletion',
      async () => {
        await supportStore.deleteSupport(supportId)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Support deleted successfully',
          life: 3000
        })
        router.push('/supports')
      }
    )
  }
</script>

<style scoped>
  .white-space-pre-wrap {
    white-space: pre-wrap;
  }
</style>
