import { z } from 'zod';
import i18n from '@/i18n';
import { ContactInfoSchema, AppDateSchema } from '@/schemas/common';
import { AddressSchema } from '@/schemas/common';
import { SocialMediaSchema } from '@/schemas/socialMedia';
import { optionalString } from '@/utils/string.helpers';
import { BusinessAreaEnum } from '@/schemas/enums';

const t = i18n.global.t;

export const BusinessSchema = z.object({
  id: optionalString(z.string().uuid()),

  entrepreneurId: z
    .string()
    .uuid({ message: t('validation.invalidUuid') })
    .min(1, { message: t('validation.required') }),

  name: z.string().min(1, { message: t('validation.required') }),

  location: AddressSchema,

  contact: ContactInfoSchema,

  primaryBusinessArea: BusinessAreaEnum,

  secondaryBusinessArea: BusinessAreaEnum.optional(),

  socialMedia: SocialMediaSchema.optional(),

  registrationNumber: z.string().optional(),

  registrationDate: AppDateSchema.nullable().optional(), // Using Date objects in app layer

  activityStartDate: AppDateSchema.nullable(), // Using Date objects in app layer

  supportStartDate: AppDateSchema.nullable(), // Using Date objects in app layer

  avatar: z
    .union([
      z.string(), // base64 or URL
      z.instanceof(File),
      z.null(),
    ])
    .optional(),

  maturityLevels: z.record(z.string(), z.number()).optional(),
});

export type Business = z.infer<typeof BusinessSchema>;
