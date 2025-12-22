/**
 * Date conversion utilities to handle the duality between
 * ISO strings (for database) and Date objects (for app)
 */

/**
 * Converts date fields in an object from ISO strings to Date objects for app usage
 */
export function isoStringsToDates<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  const result = { ...obj } as Record<string, any>;

  for (const [key, value] of Object.entries(result)) {
    // Check common date field names
    if (isDateField(key) && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        result[key] = date;
      }
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null ? isoStringsToDates(item) : item
      );
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      result[key] = isoStringsToDates(value);
    }
  }

  return result as T;
}

/**
 * Converts date fields in an object from Date objects to ISO strings for database storage
 */
export function datesToIsoStrings<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  const result = { ...obj } as Record<string, any>;

  for (const [key, value] of Object.entries(result)) {
    // Check common date field names
    if (isDateField(key) && value instanceof Date) {
      result[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null ? datesToIsoStrings(item) : item
      );
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      result[key] = datesToIsoStrings(value);
    }
  }

  return result as T;
}

/**
 * Checks if a field name typically contains a date value
 */
function isDateField(fieldName: string): boolean {
  const dateFieldNames = [
    'date',
    'Date',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'registrationDate',
    'activityStartDate',
    'supportStartDate',
    'achievedOn',
    'baselineDate',
    'targetDate',
    'startDate',
    'endDate',
    'asOf',
    'dateRecorded',
    'dob',
    'birthDate',
    'birthDate',
    'anniversary',
    'timestamp',
    'time',
  ];

  return dateFieldNames.some(
    dateField =>
      fieldName.includes(dateField) || fieldName.toLowerCase().includes(dateField.toLowerCase())
  );
}
