<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <SupportBoostList
      @create="handleCreate"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SupportBoostList from '@/components/monitoring-evaluation/SupportBoostList.vue';

const router = useRouter();

const handleCreate = () => {
  router.push('/supports/new');
};

const handleEdit = (id: string) => {
  router.push(`/supports/${id}/edit`);
};
</script>

