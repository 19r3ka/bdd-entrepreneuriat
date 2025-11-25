import { dateField } from './dateField';
import { describe, it, expect } from 'vitest';

describe('dateField', () => {
  // ✅ Accepts string → coerces to Date
  it('accepts string and coerces to Date', () => {
    const result = dateField.safeParse('2023-01-01');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(Date);
      expect(result.data.toISOString()).toContain('2023-01-01');
    }
  });

  // ✅ Accepts Date → keeps as Date
  it('accepts Date and keeps as Date', () => {
    const date = new Date('2023-01-01');
    const result = dateField.safeParse(date);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(Date);
      expect(result.data).toEqual(date);
    }
  });

  // ✅ Accepts null → returns null
  it('accepts null and returns null', () => {
    const result = dateField.safeParse(null);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeNull();
    }
  });

  // ❌ Rejects invalid date string
  it('rejects invalid date string', () => {
    const result = dateField.safeParse('not-a-date');
    expect(result.success).toBe(false);
  });
});