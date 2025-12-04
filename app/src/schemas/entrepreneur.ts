import { z } from 'zod'
import i18n from '@/i18n'
import { ContactSchema } from '@/schemas/contact'
import { SocialMediaSchema } from '@/schemas/socialMedia'
import { optionalString } from '@/utils/string.helpers'

const t = i18n.global.t

export const EntrepreneurSchema = z.object({
  id: z.uuid().optional(),

  firstName: z.string().min(1, { message: t('validation.required') }),

  lastName: z.string().min(1, { message: t('validation.required') }),

  gender: z.enum(['Woman', 'Man', 'Non-binary', 'Prefer not to say', '']).optional(),

  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
  }, z.date().optional()),

  contact: ContactSchema,

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, t('validation.invalidSlug'))
    .min(1, { message: t('validation.required') }),

  address: z.string().optional(),

  personalWebsite: optionalString(z.url({ message: t('validation.url') })),

  socialMedia: SocialMediaSchema.optional(),

  bio: z.string().optional(),

  location: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    })
    .optional(),

  avatar: z
    .union([
      z.string(), // base64 or URL
      z.instanceof(File),
      z.null()
    ])
    .optional()
})
