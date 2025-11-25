import { EntrepreneurSchema } from './entrepreneur';
import { describe, it, expect } from 'vitest';

describe('EntrepreneurSchema', () => {
  it('accepts valid entrepreneur data', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com'
      },
      gender: 'Man',
      dateOfBirth: new Date('1990-01-01')
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid data', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: '', // required field
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com'
      }
    });
    expect(result.success).toBe(false);
  });

  it('validates avatar can be string, File, or null', () => {
    const mockFile = new File([], 'avatar.jpg');
    
    // Test with string avatar
    let result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com'
      },
      avatar: 'https://example.com/avatar.jpg'
    });
    expect(result.success).toBe(true);

    // Test with File avatar
    result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com'
      },
      avatar: mockFile
    });
    expect(result.success).toBe(true);

    // Test with null avatar
    result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: {
        email: 'john@example.com'
      },
      avatar: null
    });
    expect(result.success).toBe(true);
  });

  it('validates slug format', () => {
    // Valid slug
    let result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe-123',
      contact: {
        email: 'john@example.com'
      }
    });
    expect(result.success).toBe(true);

    // Invalid slug with uppercase
    result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'John-Doe', // contains uppercase
      contact: {
        email: 'john@example.com'
      }
    });
    expect(result.success).toBe(false);
  });

  it('validates gender field with allowed values', () => {
    const validGenders = ['Woman', 'Man', 'Non-binary', 'Prefer not to say', ''];
    validGenders.forEach(gender => {
      const result = EntrepreneurSchema.safeParse({
        firstName: 'Jane',
        lastName: 'Doe',
        slug: 'jane-doe',
        contact: { email: 'jane@example.com' },
        gender: gender
      });
      expect(result.success).toBe(true, `Should accept gender: ${gender}`);
    });
  });

  it('rejects invalid gender value', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      slug: 'jane-doe',
      contact: { email: 'jane@example.com' },
      gender: 'Alien' // Invalid gender
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("Invalid enum value");
  });

  it('validates dateOfBirth field with a valid date string', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: '1985-11-20' // Valid date string
    });
    expect(result.success).toBe(true);
    expect(result.data?.dateOfBirth).toBeInstanceOf(Date);
  });

  it('validates dateOfBirth field with a valid Date object', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: new Date('1985-11-20') // Valid Date object
    });
    expect(result.success).toBe(true);
    expect(result.data?.dateOfBirth).toBeInstanceOf(Date);
  });

  it('allows dateOfBirth to be undefined', () => {
    const result = EntrepreneurSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      dateOfBirth: undefined
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
      dateOfBirth: 'not-a-date' // Invalid date string
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("Invalid date");
  });
});