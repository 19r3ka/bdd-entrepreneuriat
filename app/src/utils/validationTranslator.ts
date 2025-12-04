import { useI18n } from 'vue-i18n'

/**
 * Translates Zod error messages to localized versions
 */
export function translateZodErrors(errors: any[], t: any) {
  // Define mappings from English messages to i18n keys
  const errorMap: { [key: string]: string } = {
    Required: 'validation.required',
    invalid_type: 'validation.required', // Zod's default for wrong types
    too_small: 'validation.required', // Zod's default for min length 1
    email: 'validation.email',
    url: 'validation.url',
    uuid: 'validation.invalidUuid',
    regex: 'validation.invalidSlug', // For slug regex errors
    invalid_string: 'validation.invalidE164' // For E164 format
  }

  return errors.map((error) => {
    let translatedMessage = error.message || 'validation.unknownError'

    // If there's a direct mapping, use it
    if (errorMap[error.code]) {
      translatedMessage = t(errorMap[error.code])
    } else {
      // If there's a message property, use that
      if (error.message) {
        // Try to match based on message content
        if (error.message.toLowerCase().includes('email')) {
          translatedMessage = t('validation.email')
        } else if (error.message.toLowerCase().includes('url')) {
          translatedMessage = t('validation.url')
        } else if (error.message.toLowerCase().includes('e.164')) {
          translatedMessage = t('validation.invalidE164')
        } else if (error.message.toLowerCase().includes('slug')) {
          translatedMessage = t('validation.invalidSlug')
        } else if (error.message.toLowerCase().includes('required')) {
          translatedMessage = t('validation.required')
        } else if (error.message.toLowerCase().includes('coordinates')) {
          translatedMessage = t('validation.invalidCoordinates')
        } else if (error.message.toLowerCase().includes('uuid')) {
          translatedMessage = t('validation.invalidUuid')
        } else {
          translatedMessage = t('validation.unknownError')
        }
      }
    }

    return {
      ...error,
      message: translatedMessage
    }
  })
}
