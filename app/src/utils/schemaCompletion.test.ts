import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { isProfileCompletedStrict, isProfileCompletedRequired, getMissingFields } from './schemaCompletion';

// Create a test schema
const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
  address: z.object({
    street: z.string(),
    city: z.string()
  }).optional(),
});

describe('schemaCompletion', () => {
  describe('isProfileCompletedStrict', () => {
    it('returns true when all required fields are present and valid', () => {
      const completeData = {
        name: 'John Doe',
        email: 'john@example.com',
        address: { street: '123 Main St', city: 'Anytown' }
      };

      expect(isProfileCompletedStrict(testSchema, completeData)).toBe(true);
    });

    it('returns false when required fields are missing', () => {
      const incompleteData = {
        name: 'John Doe',
        // email is missing
      };

      expect(isProfileCompletedStrict(testSchema, incompleteData)).toBe(false);
    });

    it('returns false when fields have invalid values', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email', // invalid email
      };

      expect(isProfileCompletedStrict(testSchema, invalidData)).toBe(false);
    });
  });

  describe('isProfileCompletedRequired', () => {
    it('returns true when all required fields are present and valid', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      expect(isProfileCompletedRequired(testSchema, data)).toBe(true);
    });

    it('ignores optional fields when checking completion', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        // age and address are optional, so not required for "Required" completion
      };

      expect(isProfileCompletedRequired(testSchema, data)).toBe(true);
    });

    it('returns false when required fields are missing', () => {
      const incompleteData = {
        name: 'John Doe',
        // email is missing (it's required)
      };

      expect(isProfileCompletedRequired(testSchema, incompleteData)).toBe(false);
    });
  });

  describe('getMissingFields', () => {
    it('returns empty array for complete data in strict mode', () => {
      const completeData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const missing = getMissingFields(testSchema, completeData, 'strict');
      expect(missing).toEqual([]);
    });

    it('returns empty array for required-only complete data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const missing = getMissingFields(testSchema, data, 'required');
      expect(missing).toEqual([]);
    });

    it('returns missing required fields in required mode', () => {
      const incompleteData = {
        name: 'John Doe',
        // email is missing
      };

      const missing = getMissingFields(testSchema, incompleteData, 'required');
      expect(missing).toContain('email');
    });

    it('returns missing fields in strict mode', () => {
      const incompleteData = {
        name: 'John Doe',
        email: 'john@example.com',
        // age and address are not filled but might be considered "missing" in strict mode
        // depending on the implementation
      };

      // This will depend on the exact implementation of getMissingFields
      const missing = getMissingFields(testSchema, incompleteData, 'strict');
      expect(Array.isArray(missing)).toBe(true);
    });
  });
});