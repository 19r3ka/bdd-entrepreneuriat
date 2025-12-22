<template>
  <div
    class="surface-0 p-3 flex align-items-center justify-content-between border-b surface-border"
  >
    <!-- Logo and Title on the left -->
    <router-link to="/" class="flex align-items-center no-underline">
      <img src="/logo.svg" :alt="$t('common.logoAlt')" height="20" class="mr-3" />
      <h2 class="text-900 font-bold text-lg line-height-1 m-0">{{ appName }}</h2>
    </router-link>

    <!-- Mobile menu button -->
    <a
      v-ripple
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        leaveToClass: 'hidden',
        hideOnOutsideClick: true,
      }"
      class="cursor-pointer block lg:hidden text-700 p-ripple"
    >
      <i class="pi pi-bars text-4xl"></i>
    </a>

    <!-- Navigation links centered (only on large screens) -->
    <div class="hidden lg:flex flex-grow-1 justify-content-center">
      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none">
        <li class="mx-3">
          <router-link
            v-ripple
            to="/"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>{{ $t('common.dashboard') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link
            v-ripple
            to="/entrepreneurs"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>{{ $t('pages.entrepreneurs.title') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link
            v-ripple
            to="/businesses"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>{{ $t('pages.businesses.title') }}</span>
          </router-link>
        </li>

        <li class="mx-3">
          <router-link
            v-ripple
            to="/supports"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>{{ $t('common.supports') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link
            v-ripple
            to="/quick-wins"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>{{ $t('pages.quickWins.title') }}</span>
          </router-link>
        </li>
        <li v-if="isDev" class="mx-3">
          <router-link
            v-ripple
            to="/dev-tools"
            class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900"
          >
            <span>Dev Tools</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- User profile on the right -->
    <div class="flex align-items-center gap-3">
      <LanguageSwitcher />
      <Button
        icon="pi pi-upload"
        class="p-button-text p-button-rounded p-2"
        @click="router.push('/settings')"
      />
      <Avatar icon="pi pi-user" shape="circle" size="normal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import packageJson from '../../package.json';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

// Register PrimeVue directives
const vRipple = Ripple;
const vStyleclass = StyleClass;
const router = useRouter();

// App name from package.json
interface PackageJson {
  name?: string;
  displayName?: string;
}

const appName = computed(
  () =>
    ((packageJson as PackageJson).displayName || packageJson.name || 'Entrepreneur App') as string
);

// Check if running in development mode
const isDev = computed(() => import.meta.env.DEV);
</script>

<style scoped>
/* Remove underlines from links */
a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* Ensure proper heading styles */
h2 {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.25rem;
  letter-spacing: -0.015em;
}
</style>
