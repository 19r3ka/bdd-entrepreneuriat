<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div v-if="loading" class="flex justify-content-center">
        <i class="pi pi-spin pi-spinner text-4xl"></i>
      </div>
      <div v-else-if="support" class="card p-4">
        <h2 class="mb-4">Edit Support</h2>
        <SupportBoostForm :initial-data="support" @submit="handleSubmit" />
      </div>
      <div v-else class="text-center">
        <p>Support boost not found.</p>
        <Button label="Go Back" @click="router.back()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import SupportBoostForm from '@/components/monitoring-evaluation/SupportBoostForm.vue'
  import { useSupportStore } from '@/stores/useSupportStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import Button from 'primevue/button'
  import { useToast } from 'primevue/usetoast'

  const route = useRoute()
  const router = useRouter()
  const store = useSupportStore()
  const toast = useToast()

  const support = ref<Support | undefined>(undefined)
  const loading = ref(true)

  onMounted(async () => {
    const id = route.params.id as string
    support.value = await store.getSupportById(id)
    loading.value = false
  })

  const handleSubmit = async (data: Support) => {
    if (!support.value?.id) return
    try {
      await store.updateSupport(support.value.id, data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Support boost updated successfully',
        life: 3000
      })
      router.push('/supports')
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update support boost',
        life: 3000
      })
    }
  }
</script>
