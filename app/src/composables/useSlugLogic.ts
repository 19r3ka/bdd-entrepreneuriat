// @/composables/useSlugLogic.ts
import { ref, watch } from 'vue'

export function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s._-]/g, '')
    .replace(/[\s._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useSlugLogic(formValues: { firstName: string; lastName: string; slug: string }) {
  const slugManuallyEdited = ref(false)

  // Watch firstName + lastName directly
  watch(
    () => [formValues.firstName, formValues.lastName],
    ([firstName, lastName]) => {
      if (slugManuallyEdited.value) return

      const nameParts = [firstName, lastName].filter(Boolean)
      if (nameParts.length > 0) {
        formValues.slug = sanitizeSlug(nameParts.join('-'))
      }
    },
    { immediate: true }
  )

  function markSlugAsManual() {
    slugManuallyEdited.value = true
  }

  function resetSlugManualEdit() {
    slugManuallyEdited.value = false
  }

  function generateSlug(firstName: string, lastName: string): string {
    const nameParts = [firstName, lastName].filter(Boolean)
    return nameParts.length > 0 ? sanitizeSlug(nameParts.join('-')) : ''
  }

  return {
    slugManuallyEdited,
    markSlugAsManual,
    resetSlugManualEdit,
    generateSlug
  }
}
