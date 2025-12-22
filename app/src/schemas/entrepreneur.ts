import { z } from 'zod';
import i18n from '@/i18n';
import { ContactInfoSchema, AppDateSchema } from '@/schemas/common';
import { AddressSchema } from '@/schemas/common';
import { SocialMediaSchema } from '@/schemas/socialMedia';
import { GenderEnum } from '@/schemas/enums';

const t = i18n.global.t;

export const EntrepreneurSchema = z.object({
  id: z.string().uuid().optional(),

  firstName: z.string().min(1, { message: t('validation.required') }),

  lastName: z.string().min(1, { message: t('validation.required') }),

  gender: z.preprocess(val => (val === '' ? undefined : val), GenderEnum.optional()),

  dateOfBirth: AppDateSchema.optional(), // Using Date objects in app layer

  contact: ContactInfoSchema,

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, t('validation.invalidSlug'))
    .min(1, { message: t('validation.required') }),

  address: AddressSchema.optional(),

  socialMedia: SocialMediaSchema.optional(),

  bio: z.string().optional(),

  // Location is now part of address (coordinates)
  // Keeping this commented out for reference or if explicit back-compat is needed during migration
  // location: z.object({...}).optional(),

  avatar: z
    .union([
      z.string(), // base64 or URL
      z.instanceof(File),
      z.null(),
    ])
    .optional(),
});

export type Entrepreneur = z.infer<typeof EntrepreneurSchema>;
