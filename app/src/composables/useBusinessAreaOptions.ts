import { useI18n } from 'vue-i18n';
import { businessAreaOptions as rawBusinessAreaOptions } from '@/constants/businessAreas';

/**
 *
 */
export function useBusinessAreaOptions() {
  const { t } = useI18n();

  const getBusinessAreaOptions = () =>
    rawBusinessAreaOptions.map(area => ({
      name: t(`businessAreas.${area.code}`),
      code: area.code,
    }));

  const getBusinessAreaName = (code: string) => {
    const area = rawBusinessAreaOptions.find(a => a.code === code);
    return area ? t(`businessAreas.${area.code}`) : code;
  };

  return {
    getBusinessAreaOptions,
    getBusinessAreaName,
  };
}
