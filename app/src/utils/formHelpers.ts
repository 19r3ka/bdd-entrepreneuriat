import { toRaw } from 'vue';

/**
 * Gets a nested value from an object using a dot-notation path
 */
export function getNestedValue(obj: Record<string, unknown> | null, path: string): unknown {
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

/**
 * Sets a nested value in an object using a dot-notation path
 */
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key] as Record<string, unknown>;
  }, obj);
  target[lastKey] = value;
}

/**
 * Deep clones an object with Date preservation
 */
export function deepCloneWithDates(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepCloneWithDates);
  const cloned: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    cloned[key] = deepCloneWithDates((obj as Record<string, unknown>)[key]);
  }
  return cloned;
}

/**
 * Safely clones reactive proxies or plain objects
 */
export function safeClone<T>(value: T): T {
  try {
    const raw = toRaw(value as unknown as Record<string, unknown>) as T;
    return structuredClone(raw);
  } catch {
    return deepCloneWithDates(toRaw(value)) as T;
  }
}
