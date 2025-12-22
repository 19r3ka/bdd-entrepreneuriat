/* eslint-disable */
import { EntrepreneurSchema } from './entrepreneur';
import { describe, it, expect } from 'vitest';

describe('EntrepreneurSchema', () => {
  it('accepts valid entrepreneur data', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com',
      },
      gender: 'Man',
      dateOfBirth: '1990-01-01', // Date string should be preprocessed to Date object
      socialMedia: {
        website: 'https://johndoe.com',
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.dateOfBirth).toBeInstanceOf(Date);
    expect(result.data?.socialMedia?.website).toBe('https://johndoe.com');
  });

  it('rejects invalid data', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: '', // required field
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com',
      },
    });
    expect(result.success).toBe(false);
    // Flexible check for required field message (could be key or translated)
    expect(result.error!.issues[0]!.message).toMatch(/required|requis|validation\.required/i);
  });

  it('validates avatar can be string, File, or null', () => {
    const common = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
    };
    const mockFile = new File([], 'avatar.jpg');

    // Test with string avatar
    let result = EntrepreneurSchema.safeParse({
      ...common,
      avatar: 'https://example.com/avatar.jpg',
    });
    expect(result.success).toBe(true);

    // Test with File avatar
    result = EntrepreneurSchema.safeParse({
      ...common,
      avatar: mockFile,
    });
    expect(result.success).toBe(true);

    // Test with null avatar
    result = EntrepreneurSchema.safeParse({
      ...common,
      avatar: null,
    });
    expect(result.success).toBe(true);
  });

  it('validates slug format', () => {
    const common = {
      firstName: 'John',
      lastName: 'Doe',
      contact: { email: 'john@example.com' },
    };

    // Valid slug
    let result = EntrepreneurSchema.safeParse({
      ...common,
      slug: 'john-doe-123',
    });
    expect(result.success).toBe(true);

    // Invalid slug with uppercase
    result = EntrepreneurSchema.safeParse({
      ...common,
      slug: 'John-Doe', // contains uppercase
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0]!.message).toMatch(/slug|validation\.invalidSlug/i);
  });

  it('validates gender field with allowed values', () => {
    const common = {
      firstName: 'Jane',
      lastName: 'Doe',
      slug: 'jane-doe',
      contact: { email: 'jane@example.com' },
    };
    const validGenders = ['Woman', 'Man', 'Non-binary', 'Prefer not to say', ''];
    validGenders.forEach(gender => {
      const result = EntrepreneurSchema.safeParse({ ...common, gender: gender });
      expect(result.success).toBe(true);
    });
  });

  it('rejects invalid gender value', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      slug: 'jane-doe',
      contact: { email: 'jane@example.com' },
      gender: 'Alien', // Invalid gender
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0]!.message).toMatch(/Invalid option|Invalid enum value/i);
  });

  it('validates dateOfBirth field with a valid date string and preprocesses to Date object', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: '1985-11-20', // Valid date string
    });
    expect(result.success).toBe(true);
    expect(result.data?.dateOfBirth).toBeInstanceOf(Date);
    const dateStr = result.data!.dateOfBirth?.toISOString();
    expect(dateStr?.startsWith('1985-11-20')).toBe(true);
  });

  it('allows dateOfBirth to be undefined', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: undefined,
    });
    expect(result.success).toBe(true);
    expect(result.data?.dateOfBirth).toBeUndefined();
  });

  it('rejects invalid dateOfBirth value', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: 'not-a-date', // Invalid date string
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0]!.message).toMatch(/Invalid date|expected date/i);
  });

  it('validates socialMedia.website with standard behavior', () => {
    const common = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
    };

    // Valid URL
    let result = EntrepreneurSchema.safeParse({
      ...common,
      socialMedia: { website: 'https://example.com' },
    });
    expect(result.success).toBe(true);
    expect(result.data?.socialMedia?.website).toBe('https://example.com');

    // Empty string becomes empty string due to .catch('') in SocialMediaSchema
    result = EntrepreneurSchema.safeParse({
      ...common,
      socialMedia: { website: '' },
    });
    expect(result.success).toBe(true);
    expect(result.data?.socialMedia?.website).toBe('');

    // Invalid URL is caught by catch('') and becomes empty string
    // Wait, let's check the schema's catch behavior. If it catches at the field level, it returns the catch value.
    result = EntrepreneurSchema.safeParse({
      ...common,
      socialMedia: { website: 'not-a-url' },
    });
    expect(result.success).toBe(true);
    expect(result.data?.socialMedia?.website).toBe('');
  });
});
