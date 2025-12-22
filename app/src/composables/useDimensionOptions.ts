import { useI18n } from 'vue-i18n';
import { MaturityDimensions } from '@/constants/maturityCatalog';
import { createTranslatedOptions } from '@/utils/enumTranslations';

/**
 *
 */
export function useDimensionOptions() {
  const { t } = useI18n();

  const getDimensionOptions = () =>
    createTranslatedOptions(MaturityDimensions, 'momentumMetric.dimensions', t);

  const getDimensionLabel = (value: string) => {
    return t(`momentumMetric.dimensions.${value.toLowerCase()}`);
  };

  return {
    getDimensionOptions,
    getDimensionLabel,
  };
}
