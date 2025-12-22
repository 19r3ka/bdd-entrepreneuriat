<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { usePartialRecordStore } from '@/stores/usePartialRecordStore';

const router = useRouter();
const partialRecordStore = usePartialRecordStore();

const pendingCount = computed(() => partialRecordStore.pendingCount);
const hasPending = computed(() => pendingCount.value > 0);

onMounted(async () => {
  await partialRecordStore.loadAll();
});

/**
 *
 */
function navigateToPartialRecords() {
  router.push('/partial-records');
}
</script>

<template>
  <Card v-if="hasPending" class="partial-records-widget">
    <template #title>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-exclamation-triangle text-orange-500"></i>
        <span>Pending Data</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-column gap-3">
        <p class="m-0">
          You have <strong class="text-orange-600">{{ pendingCount }}</strong> partial business
          record{{ pendingCount !== 1 ? 's' : '' }} that need{{ pendingCount === 1 ? 's' : '' }}
          additional information.
        </p>
        <Button
          label="Review Pending Records"
          icon="pi pi-arrow-right"
          icon-pos="right"
          outlined
          @click="navigateToPartialRecords"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.partial-records-widget {
  border-left: 4px solid var(--orange-500);
}
</style>
