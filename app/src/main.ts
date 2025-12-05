import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'vue-toastification/dist/index.css'
import i18n from './i18n' // Import i18n configuration

import Material from '@primeuix/themes/material' // Import the Material theme preset

import 'primeicons/primeicons.css' // PrimeIcons
import 'primeflex/primeflex.css' // PrimeFlex CSS
import './assets/global.css' // Global styles

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Material, // Use the base Material theme
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})

import Tooltip from 'primevue/tooltip'

// Register toast notifications
app.use(ToastService)
app.use(ConfirmationService)

// Register Tooltip directive
app.directive('tooltip', Tooltip)

app.use(i18n)

app.mount('#app')

// Initialize language store after mount to ensure Pinia and i18n are ready
import { useLanguageStore } from '@/stores/useLanguageStore'
const languageStore = useLanguageStore()
languageStore.init()
