<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import { RouterView } from 'vue-router';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';

const entrepreneurStore = useEntrepreneurStore();
const businessStore = useBusinessStore();
const { handleApiError } = useErrorHandler();

onMounted(async () => {
  try {
    await Promise.all([entrepreneurStore.fetchAll(), businessStore.fetchAll()]);
  } catch (error) {
    handleApiError(error as AppError, 'Failed to load initial data');
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <AppHeader />
    <div class="px-3 md:px-6 py-5 flex-1">
      <div class="flex flex-column w-full md:mx-auto" style="max-width: 1200px">
        <RouterView />
      </div>
    </div>
    <ConfirmDialog />
    <Toast />
  </div>
</template>
