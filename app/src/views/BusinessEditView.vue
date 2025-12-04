<template>
  <div>
    <BusinessForm
      v-if="!isLoading && business"
      :is-edit="true"
      :initial-values="business"
      :schema="BusinessSchema"
      :unique-checks="uniqueChecks"
    />
    <div v-else-if="isLoading">{{ t('pages.businesses.edit_page.loading') }}</div>
    <div v-else>{{ t('business.notFound') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from 'primevue/usetoast'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import BusinessForm from '@/components/BusinessForm.vue'
  import { initialBusiness } from '@/constants/businessInitialValues'
  import { BusinessSchema } from '@/schemas/business'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import type { Business } from '@/types/business'

  const { t } = useI18n() // ✅ i18n composable

  const route = useRoute()
  const router = useRouter()
  const businessStore = useBusinessStore()
  const entrepreneurStore = useEntrepreneurStore()
  const toast = useToast()

  const business = ref<Business | null>(null)
  const isLoading = ref(true)

  const uniqueChecks = {
    registrationNumber: businessStore.getByRegistrationNumber,
    'contact.email': businessStore.getByEmail
  }

  onMounted(async () => {
    const businessId = route.params.id

    // ✅ Early validation with i18n
    if (typeof businessId !== 'string' || !businessId.trim()) {
      toast.add({
        severity: 'warn',
        summary: t('pages.businesses.edit_page.invalidRequestTitle'),
        detail: t('pages.businesses.edit_page.invalidRequestDetail'),
        life: 4000
      })
      router.push('/businesses')
      return
    }

    try {
      if (!businessStore.businesses.length) {
        await Promise.all([businessStore.fetchAll(), entrepreneurStore.fetchAll()])
      }

      const fetchedBusiness = await businessStore.fetchOne(businessId)

      if (!fetchedBusiness) {
        toast.add({
          severity: 'error',
          summary: t('business.notFoundTitle'),
          detail: t('business.notFoundDetail'),
          life: 4000
        })
        router.push('/businesses')
        return
      }

      business.value = fetchedBusiness
    } catch (err) {
      console.error('Failed to load business:', err)
      toast.add({
        severity: 'error',
        summary: t('pages.businesses.edit_page.errorTitle'),
        detail: t('pages.businesses.edit_page.errorDetail'),
        life: 5000
      })
      router.push('/businesses')
      return
    } finally {
      isLoading.value = false
    }
  })
</script>
f
