<!-- src/components/common/ContactInfos.vue -->
<template>
  <Card class="shadow-2 mb-4" :aria-label="computedTitle">
    <template #title>
      <span class="text-xl font-bold text-900">{{ computedTitle }}</span>
    </template>

    <template #content>
      <address
        class="flex flex-column gap-3 not-italic"
        role="article"
        aria-label="contact information"
      >
        <!-- Email -->
        <div v-if="email" class="flex align-items-center gap-3">
          <i class="pi pi-envelope text-xl text-500" aria-hidden="true" />
          <div>
            <div class="text-sm font-medium text-500">{{ $t('common.email') }}</div>
            <a
              :href="mailtoHref"
              class="text-primary font-medium no-underline hover:underline"
              @click.prevent="onClickMail"
            >
              {{ email }}
            </a>
          </div>
        </div>

        <!-- Telephone -->
        <div v-if="telephone" class="flex align-items-center gap-3">
          <i class="pi pi-phone text-xl text-500" aria-hidden="true" />
          <div>
            <div class="text-sm font-medium text-500">{{ $t('common.telephone') }}</div>
            <a
              :href="telHref"
              class="text-primary font-medium no-underline hover:underline"
              @click.prevent="onClickTel"
            >
              {{ telephone }}
            </a>
          </div>
        </div>

        <!-- Address -->
        <div v-if="address" class="flex align-items-center gap-3">
          <i class="pi pi-map-marker text-xl text-500" aria-hidden="true" />
          <div>
            <div class="text-sm font-medium text-500">{{ $t('common.address') }}</div>
            <a
              :href="mapHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary font-medium no-underline hover:underline"
            >
              {{ address }}
            </a>
          </div>
        </div>

        <!-- Website -->
        <div v-if="website" class="flex align-items-center gap-3">
          <i class="pi pi-globe text-xl text-500" aria-hidden="true" />
          <div>
            <div class="text-sm font-medium text-500">{{ $t('common.website') }}</div>
            <a
              :href="safeWebsite"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary font-medium no-underline hover:underline"
            >
              {{ displayWebsite }}
            </a>
          </div>
        </div>

        <!-- Nothing to show -->
        <div v-if="!email && !telephone && !address && !website" class="text-500">
          {{ $t('common.notAvailable') }}
        </div>
      </address>
    </template>
  </Card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Card from 'primevue/card'
  import type { Contact } from '@/types/contact' // adjust path to your type

  // Props typed as a partial of Contact for flexibility
  const props = withDefaults(
    defineProps<{
      title?: string
      email?: Contact['email']
      telephone?: Contact['telephone']
      address?: string
      website?: string
    }>(),
    {
      title: undefined,
      email: undefined,
      telephone: undefined,
      address: undefined,
      website: undefined
    }
  )

  const { t } = useI18n()
  const computedTitle = computed(() => props.title ?? t('common.contactInformation'))

  // Safe hrefs (string | undefined)
  const mailtoHref = computed<string | undefined>(() =>
    props.email ? `mailto:${props.email}` : undefined
  )
  const telHref = computed<string | undefined>(() =>
    props.telephone ? `tel:${props.telephone}` : undefined
  )

  // Website safety and display
  const safeWebsite = computed<string | undefined>(() => {
    if (!props.website) return undefined
    return /^https?:\/\//i.test(props.website) ? props.website : `https://${props.website}`
  })

  const displayWebsite = computed<string>(() => {
    if (!props.website) return ''
    try {
      const u = new URL(safeWebsite.value!)
      return u.host + (u.pathname !== '/' ? u.pathname.replace(/\/$/, '') : '')
    } catch {
      return props.website!
    }
  })

  // Map link for address
  const mapHref = computed<string | undefined>(() => {
    if (!props.address) return undefined
    // Encode the address for safe use in URL
    const encodedAddress = encodeURIComponent(props.address)
    // Use Google Maps with the address as search parameter
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  })

  // Click handlers (placeholders for analytics or custom flows)
  /**
   *
   */
  function onClickMail() {
    if (!mailtoHref.value) return
    window.location.href = mailtoHref.value
  }

  /**
   *
   */
  function onClickTel() {
    if (!telHref.value) return
    window.location.href = telHref.value
  }
</script>

<style scoped>
  address a {
    word-break: break-all;
  }
</style>
