import { z } from 'zod'
import i18n from '@/i18n'

const t = i18n.global.t

export const LocationSchema = z.object({
  longitude: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), { message: t('validation.invalidLongitude') })
    .min(-180, { message: t('validation.longitudeRange') })
    .max(180, { message: t('validation.longitudeRange') })
    .nullable(),

  latitude: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), { message: t('validation.invalidLatitude') })
    .min(-90, { message: t('validation.latitudeRange') })
    .max(90, { message: t('validation.latitudeRange') })
    .nullable(),

  address: z.string().optional()
})
