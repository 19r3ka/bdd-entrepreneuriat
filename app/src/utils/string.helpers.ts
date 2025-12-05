import { z } from 'zod'

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
  z.preprocess((val) => (val === '' ? undefined : val), constraintSchema.optional())

/**
 *
 */
export const capitalize = (word: string) => word.replace(/\b\w/g, (c) => c.toUpperCase())

/**
 *
 */
export const generateInitials = (name: string): string => {
  if (!name) {
    return ''
  }
  const nameParts = name.trim().split(/\s+/)
  if (nameParts.length === 1) {
    return (nameParts[0] || '').substring(0, 2).toUpperCase()
  }
  return nameParts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const COLOR_CLASSES = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-purple-500'
]

/**
 *
 */
export const getRandomColorClass = (str: string): string => {
  if (!str) {
    return 'bg-gray-500'
  }
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLOR_CLASSES.length
  return COLOR_CLASSES[index] || 'bg-gray-500'
}
