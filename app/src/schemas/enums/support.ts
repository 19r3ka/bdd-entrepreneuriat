import { z } from 'zod';

export const BOOST_TYPE_OPTIONS = [
  'Training',
  'Mentoring',
  'Coaching',
  'Grant',
  'Loan',
  'Technical Assistance',
  'Networking',
  'Market Linkage',
  'Digital Tools',
  'Policy Advocacy',
] as const;
export const BoostTypeEnum = z.enum(BOOST_TYPE_OPTIONS);
export type BoostType = z.infer<typeof BoostTypeEnum>;

export const MODALITY_OPTIONS = [
  'In-person',
  'Virtual',
  'Hybrid',
  'Self-paced',
  'Group',
  'One-on-one',
] as const;
export const ModalityEnum = z.enum(MODALITY_OPTIONS);
export type Modality = z.infer<typeof ModalityEnum>;

export const CHANNEL_OPTIONS = [
  'Email',
  'SMS',
  'WhatsApp',
  'Phone',
  'In-person',
  'Video Call',
  'Platform',
  'Field Visit',
] as const;
export const ChannelEnum = z.enum(CHANNEL_OPTIONS);
export type Channel = z.infer<typeof ChannelEnum>;

export const BENEFICIARY_GROUP_OPTIONS = [
  'Women-led',
  'Youth-led',
  'Persons with Disabilities',
  'Marginalized Groups',
  'Rural Communities',
  'Urban Communities',
] as const;
export const BeneficiaryGroupEnum = z.enum(BENEFICIARY_GROUP_OPTIONS);
export type BeneficiaryGroup = z.infer<typeof BeneficiaryGroupEnum>;

export const GENDER_MARKER_OPTIONS = ['GEN0', 'GEN1', 'GEN2', 'GEN3'] as const;
export const GenderMarkerEnum = z.enum(GENDER_MARKER_OPTIONS);
export type GenderMarker = z.infer<typeof GenderMarkerEnum>;

export const SUPPORT_QUANTITY_UNIT_OPTIONS = [
  'currency',
  'hours',
  'docs',
  'items',
  'linkages',
  'participants',
  'sessions',
] as const;
export const SupportQuantityUnitEnum = z.enum(SUPPORT_QUANTITY_UNIT_OPTIONS);
export type SupportQuantityUnit = z.infer<typeof SupportQuantityUnitEnum>;
