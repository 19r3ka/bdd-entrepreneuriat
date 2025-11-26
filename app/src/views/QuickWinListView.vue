<template>
  <div class="quick-win-list-view">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-2xl font-bold m-0">{{ $t('pages.quickWins.title') }}</h1>
    </div>

    <div class="card">
      <QuickWinList 
        :quick-wins="quickWins" 
        @create="createQuickWin"
        @view="viewQuickWin"
        @edit="editQuickWin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import QuickWinList from '@/components/monitoring-evaluation/QuickWinList.vue';
import { useQuickWinStore } from '@/stores/useQuickWinStore';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

const router = useRouter();
const store = useQuickWinStore();
const quickWins = ref<QuickWin[]>([]);

onMounted(async () => {
  quickWins.value = await store.getAllQuickWins();
});

const createQuickWin = () => {
  router.push('/quick-wins/new');
};

const viewQuickWin = (id: string) => {
  router.push(`/quick-wins/${id}`);
};

const editQuickWin = (id: string) => {
  router.push(`/quick-wins/${id}/edit`);
};
</script>
