import { useI18n } from 'vue-i18n';
import { GENDER_OPTIONS } from '@/schemas/enums/common';
import { createTranslatedOptions, enumToTranslationKey } from '@/utils/enumTranslations';

/**
 * Composable for gender options with translations
 */
export function useGenderOptions() {
  const { t } = useI18n();

  const getGenderOptions = () => createTranslatedOptions(GENDER_OPTIONS, 'common.genderOptions', t);

  const getGenderLabel = (value: string) => {
    const option = GENDER_OPTIONS.find(g => g === value);
    return option ? t(`common.genderOptions.${enumToTranslationKey(option)}`) : value;
  };

  return {
    getGenderOptions,
    getGenderLabel,
  };
}
