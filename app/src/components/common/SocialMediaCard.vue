<template>
  <Card class="shadow-2 mb-4" :aria-label="computedTitle">
    <template #title>
      <span class="text-xl font-bold text-900">{{ computedTitle }}</span>
    </template>

    <template #content>
      <div class="flex flex-wrap gap-2 mt-2">
        <a
          v-for="platform in socials"
          :key="platform.name"
          :href="platform.url"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 border-round surface-100 hover:surface-200 transition-colors cursor-pointer text-700 hover:text-primary flex align-items-center justify-content-center no-underline"
          :aria-label="platform.name"
        >
          <i :class="`pi ${platform.icon} text-xl`" aria-hidden="true"></i>
          <!-- Optional username/label -->
          <span v-if="platform.username" class="ml-2 text-sm font-medium text-700">
            {{ platform.username }}
          </span>
        </a>
      </div>

      <!-- Fallback when no socials -->
      <div v-if="!socials || socials.length === 0" class="text-500 mt-2">
        {{ $t('common.notAvailable') }}
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Card from 'primevue/card'

  export interface SocialPlatform {
    name: string // e.g. "LinkedIn"
    url: string // full profile URL
    icon: string // PrimeIcon class, e.g. "pi-linkedin"
    username?: string // optional handle to display
  }

  const props = withDefaults(
    defineProps<{
      title?: string
      socials?: SocialPlatform[]
    }>(),
    {
      title: undefined,
      socials: () => []
    }
  )

  const { t } = useI18n()
  const computedTitle = computed(() => props.title ?? t('common.onlinePresence'))
</script>
