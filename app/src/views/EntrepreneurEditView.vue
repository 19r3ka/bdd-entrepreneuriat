<template>
  <div>
    <EntrepreneurForm
      v-if="!loading"
      :is-edit="true"
      :initial-values="entrepreneur"
      :schema="EntrepreneurSchema"
      :unique-checks="uniqueChecks"
    />
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import EntrepreneurForm from '@/components/EntrepreneurForm.vue';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';
import type { Entrepreneur } from '@/types/entrepreneur';
import { initialEntrepreneur } from '@/constants/entrepreneurInitialValues';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const store = useEntrepreneurStore();
const toast = useToast();

const entrepreneur = ref<Entrepreneur>({ ...initialEntrepreneur });
const loading = ref(true);

const uniqueChecks = {
  slug: store.getBySlug,
  'contact.email': store.getByEmail,
} as any;

onMounted(async () => {
  await store.fetchAll();
  const entrepreneurId = route.params.id as string;
  if (entrepreneurId) {
    const existingEntrepreneur = store.getById(entrepreneurId);
    if (existingEntrepreneur) {
      entrepreneur.value = existingEntrepreneur;
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Entrepreneur not found', life: 3000 });
      router.push('/entrepreneurs');
    }
  }
  loading.value = false;
});
</script>