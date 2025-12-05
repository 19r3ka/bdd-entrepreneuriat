<template>
  <div class="border-top-1 surface-border pt-3 mt-4">
    <div class="flex justify-content-between text-sm text-600">
      <div>
        <span class="font-semibold text-900">{{ $t('common.createdAt') }}:</span>
        {{ formatDateTime(createdAt) }}
      </div>
      <div>
        <span class="font-semibold text-900">{{ $t('common.updatedAt') }}:</span>
        {{ formatDateTime(updatedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { d } = useI18n()
  interface Props {
    createdAt?: string | Date
    updatedAt?: string | Date
  }

  defineProps<Props>()

  const formatDateTime = (date?: string | Date) => {
    if (!date) return '-'
    return d(new Date(date))
  }
</script>
