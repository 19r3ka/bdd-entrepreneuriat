/* eslint-disable */
import { useI18n } from 'vue-i18n';
import { type ZodIssue, ZodIssueCode } from 'zod';

/**
 * Translates Zod error messages to localized versions.
 * @param errors - Array of Zod issues.
 * @param t - Translation function.
 * @returns Array of Zod issues with translated messages.
 */
export function translateZodErrors(
  errors: ZodIssue[],
  t: (key: string, args?: Record<string, unknown>) => string
): ZodIssue[] {
  return errors.map(error => {
    let translatedMessage = error.message || '';

    // 1. Check if the message is already an i18n key (heuristic: starts with 'validation.')
    if (translatedMessage.startsWith('validation.')) {
      translatedMessage = t(translatedMessage);
      return { ...error, message: translatedMessage };
    }

    // 2. Fallback to code-based mapping
    switch (error.code) {
      case ZodIssueCode.invalid_type:
        // Usually "Required" if received is undefined/null
        if ((error as any).received === 'undefined' || (error as any).received === 'null') {
          translatedMessage = t('validation.required');
        } else {
          translatedMessage = t('validation.invalidType');
        }
        break;

      // invalid_date is removed in Zod 4 or covered by invalid_type

      case ZodIssueCode.too_small:
        if ((error as any).type === 'string' && (error as any).minimum === 1) {
          translatedMessage = t('validation.required');
        } else {
          translatedMessage = t('validation.tooShort', { min: (error as any).minimum });
        }
        break;

      case ZodIssueCode.too_big:
        translatedMessage = t('validation.tooLong', { max: (error as any).maximum });
        break;

      // invalid_enum_value replaced by invalid_value or similar in some versions, but let's check strict ZodIssueCode
      // If ZodIssueCode.invalid_enum_value exists, use it. If not, use 'invalid_enum_value' string literal or cast.
      // Based on error log, invalid_enum_value does NOT exist. 'invalid_value' might be it.
      case 'invalid_enum_value' as any:
      case 'invalid_value' as any: // Handle both for safety
        translatedMessage = t('validation.invalidOption');
        break;

      // invalid_string replaced/merged into invalid_format in Zod 4?
      case 'invalid_string' as any:
      case ZodIssueCode.invalid_format: // Zod 4 seems to use this
        const validation = (error as any).validation;
        if (validation === 'email') translatedMessage = t('validation.email');
        else if (validation === 'url') translatedMessage = t('validation.url');
        else if (validation === 'uuid') translatedMessage = t('validation.invalidUuid');
        else if (validation === 'regex') translatedMessage = t('validation.invalidFormat');
        else translatedMessage = t('validation.invalidFormat');
        break;

      case ZodIssueCode.custom:
      // Fall through to default for loose matching based on message content
      default:
        // Fallback loose matching
        const lowerMsg = translatedMessage.toLowerCase();
        if (lowerMsg.includes('required')) {
          translatedMessage = t('validation.required');
        } else if (lowerMsg.includes('coordinates')) {
          translatedMessage = t('validation.invalidCoordinates');
        }
        break;
    }

    return {
      ...error,
      message: translatedMessage,
    };
  });
}
