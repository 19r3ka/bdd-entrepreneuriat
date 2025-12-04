<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="card p-4">
        <h2 class="mb-4">Log New Support</h2>
        <SupportBoostForm @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue'
  import { useSupportStore } from '@/stores/useSupportStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import { useToast } from 'primevue/usetoast'

  const router = useRouter()
  const supportStore = useSupportStore()
  const toast = useToast()

  const handleSubmit = async (data: Support) => {
    try {
      await supportStore.addSupport(data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Support boost logged successfully',
        life: 3000
      })
      router.push('/supports')
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to log support boost',
        life: 3000
      })
    }
  }
</script>
