<template>
  <div>
    <h5 class="mb-3">{{ $t('common.overview') }}</h5>
    <div class="grid formgrid">
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.name') }}</label>
        <p>{{ business.name || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.primaryBusinessArea')
        }}</label>
        <p>{{ business.primaryBusinessArea || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.secondaryBusinessArea')
        }}</label>
        <p>{{ business.secondaryBusinessArea || $t('common.notAvailable') }}</p>
      </div>
      <!-- onlinePresence field removed - property doesn't exist in Business type -->
      <!-- <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.onlinePresence') }}</label>
        <p>{{ business.onlinePresence || $t('common.notAvailable') }}</p>
      </div> -->
      <div class="col-12 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.registrationNumber') }}</label>
        <p>{{ business.registrationNumber || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.registrationDate') }}</label>
        <p>
          {{
            business.registrationDate
              ? new Date(business.registrationDate).toLocaleDateString()
              : $t('common.notAvailable')
          }}
        </p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.activityStartDate') }}</label>
        <p>
          {{
            business.activityStartDate
              ? new Date(business.activityStartDate).toLocaleDateString()
              : $t('common.notAvailable')
          }}
        </p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.supportStartDate') }}</label>
        <p>
          {{
            business.supportStartDate
              ? new Date(business.supportStartDate).toLocaleDateString()
              : $t('common.notAvailable')
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Business } from '@/types/business'

  defineProps<{
    business: Business
  }>()
</script>

<style scoped>
  .field p {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
</style>
