import { type ZodObject, ZodOptional, type ZodRawShape, type z } from 'zod';

/**
 * Check if all fields (strict) are filled for a given ZodObject schema.
 */
export function isProfileCompletedStrict<T extends ZodObject<ZodRawShape>>(
  schema: T,
  data: z.infer<T>
): boolean {
  return Object.keys(schema.shape).every(key => {
    const value = data[key as keyof z.infer<T>];
    return value !== null && value !== undefined && value !== '';
  });
}

/**
 * Check if all required fields are filled for a given ZodObject schema.
 */
export function isProfileCompletedRequired<T extends ZodObject<ZodRawShape>>(
  schema: T,
  data: z.infer<T>
): boolean {
  return Object.entries(schema.shape)
    .filter(([_, field]) => !(field instanceof ZodOptional))
    .every(([key]) => {
      const value = data[key as keyof z.infer<T>];
      return value !== null && value !== undefined && value !== '';
    });
}

/**
 * Return the list of missing fields (strict or required only).
 */
export function getMissingFields<T extends ZodObject<ZodRawShape>>(
  schema: T,
  data: z.infer<T>,
  strict = false
): (keyof z.infer<T>)[] {
  const entries = Object.entries(schema.shape);
  const filtered = strict
    ? entries
    : entries.filter(([_, field]) => !(field instanceof ZodOptional));

  return filtered
    .map(([key]) => key as keyof z.infer<T>)
    .filter(key => {
      const value = data[key];
      return value === null || value === undefined || value === '';
    });
}
