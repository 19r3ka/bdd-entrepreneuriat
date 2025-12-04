<script setup lang="ts">
  import { computed, ref, onMounted, watch } from 'vue'
  import { z } from 'zod'
  import { useStorage } from '@/composables/useStorage'

  type Props = {
    heroImage?: string | null
    minHeight?: string | number
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    heroImage: null,
    minHeight: '300px',
    ariaLabel: 'page hero'
  })

  const { getFileUrl } = useStorage('avatars')
  const displayImage = ref<string>('/images/default-hero.jpg')
  const isLoading = ref(false)

  const FALLBACK_IMAGE = '/images/default-hero.jpg'
  const RANDOM_IMAGE_URL = '/api/1600/900'

  const heroStyle = computed(() => {
    const bg = `url(${displayImage.value})`
    const minH = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
    return {
      backgroundImage: bg,
      minHeight: minH,
      height: minH,
      transition: 'background-image 0.5s ease-in-out'
    }
  })

  async function fetchRandomImage() {
    isLoading.value = true
    try {
      const response = await fetch(RANDOM_IMAGE_URL)
      if (response.ok && response.url) {
        displayImage.value = response.url
      } else {
        displayImage.value = FALLBACK_IMAGE
      }
    } catch (error) {
      console.error('Failed to fetch random image:', error)
      displayImage.value = FALLBACK_IMAGE
    } finally {
      isLoading.value = false
    }
  }

  async function validateAndSetImage(url: string | null | undefined) {
    if (!url) {
      await fetchRandomImage()
      return
    }

    // Handle local Dexie URLs first
    if (url.startsWith('dexie://')) {
      displayImage.value = (await getFileUrl(url)) || FALLBACK_IMAGE
      return
    }

    const urlSchema = z.string().url()
    const result = urlSchema.safeParse(url)

    if (result.success) {
      // Check if the image is actually reachable
      try {
        const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
        // no-cors will result in an opaque response, but it's enough to know the request didn't fail immediately
        // Note: This is not a perfect check due to service worker / cache interactions
        if (response.type !== 'opaque' && !response.ok) {
          throw new Error('Image not reachable')
        }
        displayImage.value = url
      } catch (e) {
        console.warn(`Provided heroImage URL "${url}" failed to load, fetching a random one.`, e)
        await fetchRandomImage()
      }
    } else {
      console.warn(`Provided heroImage URL \"${url}\" is invalid, fetching a random one.`, result.error)
      await fetchRandomImage()
    }
  }

  onMounted(() => {
    validateAndSetImage(props.heroImage)
  })

  watch(
    () => props.heroImage,
    (newUrl) => {
      validateAndSetImage(newUrl)
    }
  )
</script>
<template>
  <div class="w-full surface-ground min-h-screen">
    <!-- Hero -->
    <header
      role="banner"
      :aria-label="ariaLabel"
      class="relative w-full bg-cover bg-center border-round shadow-2"
      :style="heroStyle"
    >
      <div class="absolute inset-0 bg-black-alpha-40"></div>
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-black-alpha-30"
      >
        <i class="pi pi-spin pi-spinner text-white" style="font-size: 2rem"></i>
      </div>
      <div class="relative w-full h-full flex flex-column justify-content-end">
        <slot name="hero" />
      </div>
    </header>

    <!-- Content -->
    <main role="main" class="layout-content w-full p-4">
      <div class="grid">
        <section class="col-12 lg:col-8">
          <slot name="main" />
        </section>

        <aside class="col-12 lg:col-4">
          <slot name="sidebar" />
        </aside>
      </div>
    </main>
  </div>
</template>
<style scoped>
  /* minimal scoped adjustments; presentation handled by PrimeVue + PrimeFlex */
  .layout-content {
    z-index: 10;
  }

  /* ensure hero border radius respects themes and looks good on small screens */
  @media (max-width: 640px) {
    header {
      border-radius: 0.5rem;
    }
  }
</style>
