<template>
  <div class="surface-0 p-3 flex align-items-center justify-content-between border-b surface-border">
    <!-- Logo and Title on the left -->
    <div class="flex align-items-center">
      <img src="/logo.svg" :alt="$t('common.logoAlt')" height="20" class="mr-3" />
      <h2 class="text-900 font-bold text-lg line-height-1 m-0">{{ $t('common.appName') }}</h2>
    </div>

    <!-- Mobile menu button -->
    <a v-ripple class="cursor-pointer block lg:hidden text-700 p-ripple" v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
      <i class="pi pi-bars text-4xl"></i>
    </a>

    <!-- Navigation links centered (only on large screens) -->
    <div class="hidden lg:flex flex-grow-1 justify-content-center">
      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none">
        <li class="mx-3">
          <router-link to="/" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('common.dashboard') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link to="/entrepreneurs" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('pages.entrepreneurs.title') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link to="/businesses" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('pages.businesses.title') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link to="/reports" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('common.reports') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link to="/supports" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('common.supports') }}</span>
          </router-link>
        </li>
        <li class="mx-3">
          <router-link to="/quick-wins" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>{{ $t('pages.quickWins.title') }}</span>
          </router-link>
        </li>
        <li class="mx-3" v-if="isDev">
          <router-link to="/dev-tools" v-ripple class="text-900 text-sm font-medium leading-normal p-ripple no-underline hover:text-900">
            <span>Dev Tools</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- User profile on the right -->
    <div class="flex align-items-center">
      <Button icon="pi pi-bell" class="p-button-text p-button-rounded p-2 mr-2" />
      <Avatar icon="pi pi-user" shape="circle" size="normal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";

// Register PrimeVue directives
const vRipple = Ripple;
const vStyleclass = StyleClass;

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