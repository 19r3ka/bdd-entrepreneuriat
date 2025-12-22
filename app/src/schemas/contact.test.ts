import { ContactSchema } from './contact';
import { describe, it, expect } from 'vitest';

describe('ContactSchema', () => {
  // ✅ Accepts valid email + valid E.164 phone number
  it('accepts valid email and E.164 phone number', () => {
    const result = ContactSchema.safeParse({
      email: 'test@example.com',
      telephone: '+12345678901', // valid E.164 format
    });
    expect(result.success).toBe(true);
  });

  // ❌ Rejects invalid email format
  it('rejects invalid email format', () => {
    const result = ContactSchema.safeParse({
      email: 'not-an-email',
      telephone: '+1234567890',
    });
    expect(result.success).toBe(false);
  });

  // ✅ Accepts Togolese numbers starting with +228 that match togoleseRegex
  it('accepts Togolese numbers starting with +228 that match togoleseRegex', () => {
    const result = ContactSchema.safeParse({
      email: 'test@example.com',
      telephone: '+22890123456', // valid Togolese number
    });
    expect(result.success).toBe(true);
  });

  // ❌ Rejects Togolese numbers that don't match regex
  it("rejects Togolese numbers that don't match regex", () => {
    const result = ContactSchema.safeParse({
      email: 'test@example.com',
      telephone: '+22812345', // too short for Togolese number
    });
    expect(result.success).toBe(false);
  });

  // ✅ Allows empty/undefined telephone
  it('allows empty telephone', () => {
    const result = ContactSchema.safeParse({
      email: 'test@example.com',
      telephone: '', // empty should be valid (optional)
    });
    expect(result.success).toBe(true);
  });

  it('allows undefined telephone', () => {
    const result = ContactSchema.safeParse({
      email: 'test@example.com',
      telephone: undefined, // undefined should be valid (optional)
    });
    expect(result.success).toBe(true);
  });
});
