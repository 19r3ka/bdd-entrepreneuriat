/**
 * Utility functions for transforming dates between app and database formats
 */

/**
 * Type representing an object that may contain dates to transform
 */
type MaybeWithDates =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | MaybeWithDates[]
  | { [key: string]: MaybeWithDates };

/**
 * Transform database dates (ISO strings) to app dates (Date objects)
 */
export function dbToAppDates(obj: MaybeWithDates): MaybeWithDates {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => dbToAppDates(item)) as MaybeWithDates;
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const result = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Try to parse as date
        const date = new Date(value);
        // Check if it's a valid date and it's actually a date string (not just any string)
        if (
          !isNaN(date.getTime()) &&
          (value.includes('T') || // ISO format with time
            /^\d{4}-\d{2}-\d{2}$/.test(value) || // YYYY-MM-DD format
            /\d{4}-\d{2}-\d{2}T/.test(value))
        ) {
          // ISO format
          result[key] = date;
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        result[key] = dbToAppDates(value);
      } else {
        result[key] = value;
      }
    }
    return result as MaybeWithDates;
  }

  return obj;
}

/**
 * Transform app dates (Date objects) to database dates (ISO strings)
 */
export function appToDbDates(obj: MaybeWithDates): MaybeWithDates {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => appToDbDates(item)) as MaybeWithDates;
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const result = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        result[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        result[key] = appToDbDates(value);
      } else {
        result[key] = value;
      }
    }
    return result as MaybeWithDates;
  }

  return obj;
}
