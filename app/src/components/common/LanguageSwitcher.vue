<template>
  <SelectButton
    v-model="languageStore.currentLocale"
    :options="locales"
    option-label="label"
    option-value="value"
    :allow-empty="false"
    aria-label="Language Switcher"
    @change="handleLocaleChange"
  >
    <template #option="slotProps">
      <span class="font-bold">{{ slotProps.option.label }}</span>
    </template>
  </SelectButton>
</template>

<script setup lang="ts">
  import { useLanguageStore } from '@/stores/useLanguageStore'
  import SelectButton from 'primevue/selectbutton'

  const languageStore = useLanguageStore()

  const locales = [
    { label: 'FR', value: 'fr' },
    { label: 'EN', value: 'en' }
  ]

  /**
   *
   */
  function handleLocaleChange(event: any) {
    if (event.value) {
      languageStore.setLocale(event.value)
    }
  }
</script>

