<template>
  <div>
    <h5 class="mb-3">{{ $t('common.personalInformation') }}</h5>
    <div class="grid formgrid">
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.firstName') }}</label>
        <p>{{ entrepreneur.firstName || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.lastName') }}</label>
        <p>{{ entrepreneur.lastName || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.bio') }}</label>
        <p>{{ entrepreneur.bio || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.personalWebsite') }}</label>
        <p>{{ entrepreneur.personalWebsite || $t('common.notAvailable') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Entrepreneur } from '@/types/entrepreneur';

defineProps<{
  entrepreneur: Entrepreneur;
}>();
</script>

<style scoped>
.field p {
  margin-top: 0.5rem;
  margin-bottom: 0;
}
</style>
