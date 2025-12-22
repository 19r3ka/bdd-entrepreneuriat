import { useI18n } from 'vue-i18n';
import {
  BENEFICIARY_GROUP_OPTIONS,
  BOOST_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  CHANNEL_OPTIONS,
  GENDER_MARKER_OPTIONS,
  SUPPORT_QUANTITY_UNIT_OPTIONS,
} from '@/schemas/enums/support';
import { createTranslatedOptions } from '@/utils/enumTranslations';

/**
 *
 */
export function useSupportOptions() {
  const { t } = useI18n();

  const getBoostTypeOptions = () =>
    createTranslatedOptions(BOOST_TYPE_OPTIONS, 'pages.support.boostTypes', t);

  const getModalityOptions = () =>
    createTranslatedOptions(MODALITY_OPTIONS, 'pages.support.modalities', t);

  const getChannelOptions = () =>
    createTranslatedOptions(CHANNEL_OPTIONS, 'pages.support.channels', t);

  const getGenderMarkerOptions = () =>
    createTranslatedOptions(GENDER_MARKER_OPTIONS, 'pages.support.genderMarkers', t);

  const getSupportQuantityUnitOptions = () =>
    createTranslatedOptions(SUPPORT_QUANTITY_UNIT_OPTIONS, 'pages.support.units', t);

  const getBeneficiaryGroupOptions = () =>
    createTranslatedOptions(BENEFICIARY_GROUP_OPTIONS, 'pages.support.beneficiaryGroups', t);

  return {
    getBoostTypeOptions,
    getModalityOptions,
    getChannelOptions,
    getGenderMarkerOptions,
    getSupportQuantityUnitOptions,
    getBeneficiaryGroupOptions,
  };
}
