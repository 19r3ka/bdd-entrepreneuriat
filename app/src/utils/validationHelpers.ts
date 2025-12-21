import type { z } from 'zod';

export const VALIDATION_DUPLICATE = 'validation.duplicate';

export const DUPLICATE_VALIDATION_KEYS: Record<string, string> = {
  slug: 'validation.duplicateSlug',
  'contact.email': 'validation.duplicateEmail',
};

interface FieldError {
  _errors: string[];
}

export type FormErrors = Partial<Record<string, FieldError>>;

/**
 * Maps Zod issues to form errors object
 */
export function mapIssuesToErrors(issues: z.core.$ZodIssue[]): FormErrors {
  const newErrors: FormErrors = {};
  issues.forEach(issue => {
    const fieldPath = issue.path.join('.');
    if (!newErrors[fieldPath]) newErrors[fieldPath] = { _errors: [] };
    newErrors[fieldPath]!._errors.push(issue.message);
  });
  return newErrors;
}

/**
 * Gets translation key for duplicate validation errors
 */
export function getDuplicateMessageKey(fieldPath: string, fallbackKey?: string): string {
  if (fallbackKey) return fallbackKey;
  if (DUPLICATE_VALIDATION_KEYS[fieldPath]) return DUPLICATE_VALIDATION_KEYS[fieldPath];
  const match = Object.entries(DUPLICATE_VALIDATION_KEYS).find(([key]) =>
    new RegExp(`${key}$`).test(fieldPath)
  );
  if (match) return match[1];
  return VALIDATION_DUPLICATE;
}
