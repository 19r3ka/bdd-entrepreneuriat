// /composables/useBusinessAreas.ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { businessAreaOptions } from '@/constants/businessAreas'
import type { BusinessArea } from '@/types/businessArea'

/**
 *
 */
export function useBusinessAreas() {
  const { t } = useI18n()

  const businessAreaMap = computed(() =>
    businessAreaOptions.reduce(
      (acc, { code }) => {
        acc[code] = t(`businessAreas.${code}`)
        return acc
      },
      {} as Record<string, string>
    )
  )

  const getBusinessAreaLabel = (code: string): string => businessAreaMap.value[code] || code

  const getBusinessAreaOptions = () =>
    businessAreaOptions.map(({ code }) => ({ value: code, label: t(`businessAreas.${code}`) }))

  const isValidBusinessArea = (code: string): code is BusinessArea['code'] =>
    businessAreaOptions.some((option) => option.code === code)

  return {
    businessAreaMap,
    getBusinessAreaLabel,
    getBusinessAreaOptions,
   isValidBusinessArea
  }
}
