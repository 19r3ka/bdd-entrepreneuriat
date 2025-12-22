import { z } from 'zod';

/**
 * Creates a truly optional Zod string schema that treats an empty string as `undefined`.
 *
 * This is useful for optional form fields that might have validation (e.g., `z.string().url()`).
 * Standard Zod schemas would fail validation on an empty string `''`. This helper
 * allows `''`, `null`, or `undefined` as input, and transforms `''` to `undefined` in the
 * parsed output, effectively making the field optional.
 *
 * @param constraintSchema - A Zod schema for a string, like `z.string().min(1)`, `z.email()`, or `z.url()`.
 * @returns A new Zod schema that is optional and treats `''` as `undefined`.
 *
 * @example
 * const schema = z.object({
 *   // homepage is optional, but if present, must be a valid URL.
 *   // An empty input field will pass validation.
 *   homepage: optionalString(z.string().url()),
 * });
 *
 * schema.parse({ homepage: '' }); // Result: { homepage: undefined }
 * schema.parse({}); // Result: { homepage: undefined }
 * schema.parse({ homepage: 'https://example.com' }); // Result: { homepage: 'https://example.com' }
 */
export const optionalString = <T extends z.ZodType<string>>(constraintSchema: T) =>
  z.preprocess(val => (val === '' ? undefined : val), constraintSchema.optional());

/**
 *
 */
export const capitalize = (word: string) => word.replace(/\b\w/g, c => c.toUpperCase());

/**
 *
 */
export const generateInitials = (name: string): string => {
  if (!name) {
    return '';
  }
  const nameParts = name.trim().split(/\s+/);
  const SUBSTRING_START_INDEX = 0;
  const SUBSTRING_END_INDEX = 2;

  if (nameParts.length === 1) {
    return (nameParts[0] || '').substring(SUBSTRING_START_INDEX, SUBSTRING_END_INDEX).toUpperCase();
  }
  return nameParts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const COLOR_TINT = 500;

const COLOR_CLASSES = [
  `bg-blue-${COLOR_TINT}`,
  `bg-green-${COLOR_TINT}`,
  `bg-red-${COLOR_TINT}`,
  `bg-cyan-${COLOR_TINT}`,
  `bg-pink-${COLOR_TINT}`,
  `bg-indigo-${COLOR_TINT}`,
  `bg-teal-${COLOR_TINT}`,
  `bg-orange-${COLOR_TINT}`,
  `bg-purple-${COLOR_TINT}`,
];

/**
 *
 */
export const getRandomColorClass = (str: string): string => {
  if (!str) {
    return 'bg-gray-500';
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_CLASSES.length;
  return COLOR_CLASSES[index] || 'bg-gray-500';
};
