/**
 * Utility functions for serializing and deserializing data for IndexedDB storage.
 *
 * IndexedDB cannot store Date objects directly - they must be converted to strings.
 * These utilities ensure consistent handling across the application.
 */

/**
 * Recursively converts Date objects to ISO strings for IndexedDB storage
 */
export function serializeForDb<T>(data: T): T {
  if (data === null || data === undefined) {
    return data
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString() as any
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeForDb(item)) as any
  }

  // Handle plain objects
  if (typeof data === 'object' && data.constructor === Object) {
    const serialized: any = {}
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeForDb(value)
    }
    return serialized
  }

  // Return primitives as-is
  return data
}

/**
 * Recursively converts ISO date strings back to Date objects when reading from IndexedDB
 * Only converts strings that match ISO 8601 date format
 */
export function deserializeFromDb<T>(data: T): T {
  if (data === null || data === undefined) {
    return data
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => deserializeFromDb(item)) as any
  }

  // Handle plain objects
  if (typeof data === 'object' && data.constructor === Object) {
    const deserialized: any = {}
    for (const [key, value] of Object.entries(data)) {
      deserialized[key] = deserializeFromDb(value)
    }
    return deserialized
  }

  // Convert ISO date strings to Date objects
  if (typeof data === 'string' && isISODateString(data)) {
    return new Date(data) as any
  }

  // Return primitives as-is
  return data
}

/**
 * Checks if a string is in ISO 8601 date format
 */
function isISODateString(value: string): boolean {
  // Match ISO 8601 formats: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/
  return isoDateRegex.test(value)
}
