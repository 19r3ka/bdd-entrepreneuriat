import { getNestedValue } from './formHelpers';
import { getDuplicateMessageKey } from './validationHelpers';
import type { UniqueChecks } from '@/composables/useValidationForm';

/**
 * Checks for uniqueness of a field value
 */
export function checkUniqueness(
  fieldPath: string,
  values: Record<string, unknown>,
  uniqueChecks?: UniqueChecks,
  t?: (key: string) => string
): string | null {
  if (!uniqueChecks) return null;

  const checker = uniqueChecks[fieldPath];
  if (!checker) return null;

  const currentValue = getNestedValue(values, fieldPath);
  if (!currentValue) return null;

  const duplicate = checker(String(currentValue));
  if (
    duplicate &&
    (duplicate as Record<string, unknown>).id !== (values as Record<string, unknown>).id
  ) {
    const messageKey = getDuplicateMessageKey(fieldPath);
    return t ? t(messageKey) : messageKey;
  }
  return null;
}
