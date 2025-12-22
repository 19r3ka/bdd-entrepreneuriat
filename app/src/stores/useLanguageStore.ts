import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import i18n from '@/i18n'; // Import the i18n instance directly
import { watch } from 'vue';

export const useLanguageStore = defineStore('language', () => {
  // Persist locale in local storage, default to 'fr'
  const currentLocale = useStorage<'fr' | 'en'>('user-locale', 'fr');

  // Initialize
  /**
   *
   */
  function init() {
    setLocale(currentLocale.value);
  }

  // Set locale action
  /**
   *
   */
  async function setLocale(locale: 'fr' | 'en') {
    currentLocale.value = locale;

    // Update vue-i18n
    // In legacy mode, locale is directly settable; in composition API mode, it's a Ref with .value
    // We use type assertion to access the value property in both cases
    if (i18n.mode === 'legacy') {
      (i18n.global.locale as any) = locale;
    } else {
      (i18n.global.locale as { value: string }).value = locale;
    }

    // Update HTML lang attribute
    document.documentElement.lang = locale;

    // Update PrimeVue locale (if we had the locale objects)
    // For now, we might need to manually load them or just rely on defaults if English is default
    // Ideally we would do:
    // primevue.config.locale = locale === 'fr' ? fr : en
  }

  // Watch for changes (in case storage changes from another tab)
  watch(currentLocale, newLocale => {
    setLocale(newLocale);
  });

  return {
    currentLocale,
    setLocale,
    init,
  };
});
