<template>
  <QuickWinList
    :quick-wins="quickWins"
    @create="createQuickWin"
    @view="viewQuickWin"
    @edit="editQuickWin"
  />
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
  quickWins.value = await store.fetchAll();
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
