/**
 * Utility functions to translate enum values to user-friendly labels
 */

/**
 * Converts an enum value to a translation key format
 * Example: 'In-person' -> 'in_person', 'Digital Tools' -> 'digital_tools'
 */
export function enumToTranslationKey(enumValue: string): string {
  return enumValue
    .toLowerCase()
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
    .replace(/[^a-z0-9_]/g, ''); // Remove any non-alphanumeric characters except underscore
}

/**
 * Creates translated options for a given enum
 * @param enumValues The array of enum values
 * @param translationPrefix The translation key prefix (e.g. 'pages.support.boostTypes')
 * @param t The translation function
 */
export function createTranslatedOptions(
  enumValues: readonly string[],
  translationPrefix: string,
  t: (key: string) => string
): { label: string; value: string }[] {
  return enumValues.map(value => ({
    label: t(`${translationPrefix}.${enumToTranslationKey(value)}`),
    value,
  }));
}
