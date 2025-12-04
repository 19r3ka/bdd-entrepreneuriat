<template>
  <EntrepreneurForm
    :is-edit="false"
    :initial-values="initialEntrepreneur"
    :schema="EntrepreneurSchema"
    :unique-checks="uniqueChecks"
  />
</template>

<script setup lang="ts">
  import EntrepreneurForm from '@/components/EntrepreneurForm.vue'
  import { EntrepreneurSchema } from '@/schemas/entrepreneur'
  import { initialEntrepreneur } from '@/constants/entrepreneurInitialValues'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'

  const store = useEntrepreneurStore()

  const uniqueChecks = {
    slug: store.getBySlug,
    'contact.email': store.getByEmail
  } as any
</script>
