// src/utils/resolveField.ts
export function resolveField<T>(
  obj: T,
  path: string,
  fallback: string | number | boolean = ''
): string | number | boolean {
  if (!obj) return fallback
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return fallback
  }, obj) as string | number | boolean
}
