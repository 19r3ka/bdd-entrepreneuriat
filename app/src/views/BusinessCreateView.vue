<template>
  <BusinessForm
    :key="route.fullPath"
    :is-edit="false"
    :initial-values="initialValues"
    :schema="BusinessSchema"
    :unique-checks="uniqueChecks"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BusinessForm from '@/components/BusinessForm.vue';
import { initialBusiness } from '@/constants/businessInitialValues';
import { BusinessSchema } from '@/schemas/business';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';

const businessStore = useBusinessStore();
const entrepreneurStore = useEntrepreneurStore();
const route = useRoute();

const initialValues = computed(() => {
  const entrepreneurId = route.query.entrepreneurId as string;
  if (entrepreneurId) {
    return {
      ...initialBusiness,
      entrepreneurId: entrepreneurId,
    };
  }
  return initialBusiness;
});

const uniqueChecks = {
  registrationNumber: businessStore.getByRegistrationNumber,
  'contact.email': businessStore.getByEmail,
};

onMounted(() => {
  entrepreneurStore.fetchAll();
});
</script>
