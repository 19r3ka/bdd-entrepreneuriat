<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="card p-4">
        <h2 class="mb-4">{{ $t('pages.support.new') }}</h2>
        <SupportBoostForm @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue'
  import { useSupportStore } from '@/stores/useSupportStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import { useToast } from 'primevue/usetoast'

  const router = useRouter()
  const supportStore = useSupportStore()
  const toast = useToast()
  const { t } = useI18n()

  const handleSubmit = async (data: Support) => {
    try {
      await supportStore.addSupport(data)
      toast.add({
        severity: 'success',
        summary: t('common.success'),
        detail: t('messages.supportCreated'),
        life: 3000
      })
      router.push('/supports')
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
</script>
