import { z } from 'zod'
import i18n from '@/i18n'
import { ContactSchema } from '@/schemas/contact'
import { LocationSchema } from '@/schemas/location'
import { SocialMediaSchema } from '@/schemas/socialMedia'
import { optionalString } from '@/utils/string.helpers'
import { VALID_BUSINESS_AREA_CODES } from '@/constants/businessAreaCodes'

const t = i18n.global.t

export const BusinessSchema = z.object({
  id: optionalString(z.uuid()),

  entrepreneurId: z
    .uuid({ message: t('validation.invalidUuid') })
    .min(1, { message: t('validation.required') }),

  name: z.string().min(1, { message: t('validation.required') }),

  location: LocationSchema,

  contact: ContactSchema,

  primaryBusinessArea: z.enum(VALID_BUSINESS_AREA_CODES, {
    message: 'Invalid business area code. Must be a valid ISIC Rev.4 code (A-U)'
  }),

  secondaryBusinessArea: z
    .enum(VALID_BUSINESS_AREA_CODES, {
      message: 'Invalid business area code. Must be a valid ISIC Rev.4 code (A-U)'
    })
    .optional(),

  socialMedia: SocialMediaSchema.optional(),

  registrationNumber: z.string().optional(),

  registrationDate: z.coerce.date().nullable().optional(),

  activityStartDate: z.coerce.date({ message: t('validation.required') }).nullable(),

  supportStartDate: z.coerce.date({ message: t('validation.required') }).nullable(),

  avatar: z
    .union([
      z.string(), // base64 or URL
      z.instanceof(File),
      z.null()
    ])
    .optional(),

  maturityLevels: z.record(z.string(), z.number()).optional()
})
