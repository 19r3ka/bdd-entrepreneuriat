<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import Avatar from 'primevue/avatar'
  import { generateInitials, getRandomColorClass } from '@/utils/string.helpers'
  import { useImageResolver } from '@/composables/useImageResolver'

  const props = defineProps({
    src: {
      type: [String, File],
      default: null
    },
    label: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'normal' // 'normal', 'large', 'xlarge'
    },
    shape: {
      type: String,
      default: 'square'
    },
    customClass: {
      type: String,
      default: ''
    },
    style: {
      type: Object,
      default: () => ({})
    }
  })

  const srcRef = toRef(props, 'src')
  const { resolvedSrc } = useImageResolver(srcRef)

  const initials = computed(() => {
    if (resolvedSrc.value) {
      return undefined
    }
    return generateInitials(props.label)
  })
</script>

<template>
  <Avatar
    :image="resolvedSrc ?? undefined"
    :label="initials"
    :class="['avatar-initials', !resolvedSrc ? getRandomColorClass(label || '') : '', customClass]"
    :size="size"
    :shape="shape"
    :style="style"
  />
</template>
