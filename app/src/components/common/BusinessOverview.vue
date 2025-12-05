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
        <p>{{ getBusinessAreaLabel(business.primaryBusinessArea || '') || $t('common.notAvailable') }}</p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.secondaryBusinessArea')
        }}</label>
        <p>{{ getBusinessAreaLabel(business.secondaryBusinessArea || '') || $t('common.notAvailable') }}</p>
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
              ? d(new Date(business.registrationDate), 'long')
              : $t('common.notAvailable')
          }}
        </p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.activityStartDate') }}</label>
        <p>
          {{
            business.activityStartDate
              ? d(new Date(business.activityStartDate), 'long')
              : $t('common.notAvailable')
          }}
        </p>
      </div>
      <div class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.supportStartDate') }}</label>
        <p>
          {{
            business.supportStartDate
              ? d(new Date(business.supportStartDate), 'long')
              : $t('common.notAvailable')
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { Business } from '@/types/business'
  import { useBusinessAreas } from '@/composables/useBusinessAreas'

  const { d } = useI18n()

  defineProps<{
    business: Business
  }>()

  const { getBusinessAreaLabel } = useBusinessAreas()
</script>

<style scoped>
  .field p {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
</style>
