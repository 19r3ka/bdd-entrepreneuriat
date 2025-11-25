import { ref, watch, type Ref } from 'vue';
import { useStorage } from './useStorage';

export function useImageResolver(src: Ref<string | File | null | undefined>) {
  const resolvedSrc = ref<string | null>(null);
  const { getFileUrl } = useStorage('avatars');

  watch(
  src,
  async (newSrc) => {
    if (!newSrc) {
      resolvedSrc.value = null;
      return;
    }

    // Handle File objects
    if (newSrc instanceof File && typeof window !== 'undefined') {
      resolvedSrc.value = URL.createObjectURL(newSrc);
      return;
    }

    // Handle string sources
    if (typeof newSrc === 'string') {
      resolvedSrc.value = newSrc.startsWith('dexie://')
        ? await getFileUrl(newSrc)
        : newSrc;
      return;
    }

    // Fallback for unexpected types
    resolvedSrc.value = null;
  }, { immediate: true });

  // Clean up object URLs
  watch(resolvedSrc, (newSrc, oldSrc) => {
    if (oldSrc && oldSrc.startsWith('blob:')) {
      URL.revokeObjectURL(oldSrc);
    }
  });

  return {
    resolvedSrc,
  };
}
