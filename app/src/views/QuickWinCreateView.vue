<template>
  <div class="quick-win-create-view">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-900 m-0">{{ $t('pages.quickWins.new') }}</h1>
    </div>

    <div class="card">
      <QuickWinForm
        :business-id="businessId"
        :support-boost-id="supportBoostId"
        @submit="handleCreate"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import QuickWinForm from '@/components/monitoring-evaluation/QuickWinForm.vue';
import { useQuickWinStore } from '@/stores/useQuickWinStore';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const store = useQuickWinStore();
const toast = useToast();

const businessId = computed(() => route.query.businessId as string | undefined);
const supportBoostId = computed(() => route.query.supportBoostId as string | undefined);

const goBack = () => {
  router.back();
};

const handleCreate = async (data: any) => {
  try {
    await store.createQuickWin(data);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Quick Win created successfully',
      life: 3000
    });
    goBack();
  } catch (error) {
    console.error('Failed to create quick win', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create Quick Win',
      life: 3000
    });
  }
};
</script>
