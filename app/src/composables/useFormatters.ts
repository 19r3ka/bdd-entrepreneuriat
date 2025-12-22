// src/composables/useFormatters.ts
import { useI18n } from 'vue-i18n';

/**
 *
 */
export function useFormatters() {
  const { locale } = useI18n();

  const formatDate = (value: string | Date | null | undefined): string => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date?.getTime?.())) return '';
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(date as Date);
  };

  return { formatDate };
}
