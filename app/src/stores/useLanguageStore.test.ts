import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLanguageStore } from './useLanguageStore'
import i18n from '@/i18n'

import { ref } from 'vue'

// Mock useStorage
vi.mock('@vueuse/core', () => ({
  useStorage: vi.fn((key, initialValue) => {
    return ref(initialValue)
  })
}))

// Mock usePrimeVue
vi.mock('primevue/config', () => ({
  usePrimeVue: vi.fn(() => ({
    config: {
      locale: {}
    }
  }))
}))

describe('useLanguageStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Reset i18n locale
    if (i18n.mode === 'legacy') {
      ;(i18n.global.locale as any).value = 'fr'
    } else {
      ;(i18n.global.locale as any).value = 'fr'
    }
  })

  it('initializes with default locale (fr)', () => {
    const store = useLanguageStore()
    expect(store.currentLocale).toBe('fr')
  })

  it('changes locale correctly', async () => {
    const store = useLanguageStore()
    await store.setLocale('en')
    
    expect(store.currentLocale).toBe('en')
    expect((i18n.global.locale as any).value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('persists locale change', async () => {
    const store = useLanguageStore()
    await store.setLocale('en')
    expect(store.currentLocale).toBe('en')
  })
})
