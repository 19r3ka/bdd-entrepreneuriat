<template>
  <div class="quick-win-edit-view">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-900 m-0">{{ $t('pages.quickWins.edit') }}</h1>
    </div>

    <div v-if="loading" class="flex justify-content-center p-6">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else-if="quickWin" class="card">
      <QuickWinForm :initial-data="quickWin" @submit="handleUpdate" @cancel="goBack" />
    </div>

    <div v-else class="text-center p-6">
      <div class="text-xl text-900 mb-2">Quick Win Not Found</div>
      <Button label="Go Back" @click="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Button from 'primevue/button'
  import QuickWinForm from '@/components/monitoring-evaluation/QuickWinForm.vue'
  import { useQuickWinStore } from '@/stores/useQuickWinStore'
  import { useToast } from 'primevue/usetoast'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'

  const route = useRoute()
  const router = useRouter()
  const store = useQuickWinStore()
  const toast = useToast()

  const quickWinId = route.params.id as string
  const quickWin = ref<QuickWin | undefined>(undefined)
  const loading = ref(true)

  onMounted(async () => {
    try {
      quickWin.value = await store.getQuickWinById(quickWinId)
    } catch (error) {
      console.error('Failed to load quick win', error)
    } finally {
      loading.value = false
    }
  })

  const goBack = () => {
    router.back()
  }

  const handleUpdate = async (data: any) => {
    try {
      await store.updateQuickWin(quickWinId, data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Quick Win updated successfully',
        life: 3000
      })
      goBack()
    } catch (error) {
      console.error('Failed to update quick win', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update Quick Win',
        life: 3000
      })
    }
  }
</script>
