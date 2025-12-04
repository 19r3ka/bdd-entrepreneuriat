import { z } from 'zod'
import { togoleseRegex } from '@/constants/phoneNumberRegex'
import i18n from '@/i18n'
import { optionalString } from '@/utils/string.helpers'

const t = i18n.global.t

export const ContactSchema = z.object({
  email: z.email({ message: t('validation.email') }),
  telephone: optionalString(
    z
      .string()
      .regex(
        /^(\+[1-9]\d{1,14})$/, // general E.164
        { message: t('validation.invalidE164') }
      )
      .refine(
        (val) => {
          if (!val) return true // allow empty/undefined
          if (val.startsWith('+228')) {
            return togoleseRegex.test(val)
          }
          return true // other countries: just E.164
        },
        { message: t('validation.invalidTogoNumber') }
      )
  )
})
