/* eslint-disable */
import { describe, it, expect, vi } from 'vitest';
import { translateZodErrors } from './validationTranslator';
import { z } from 'zod';

describe('translateZodErrors', () => {
  const t = vi.fn((key: string) => `translated:${key}`);

  it('should translate known error codes', () => {
    const issues: any[] = [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: [],
        message: 'Required',
      },
      {
        code: 'too_small',
        minimum: 1,
        type: 'string',
        inclusive: true,
        exact: false,
        path: [],
        message: 'String must contain at least 1 character(s)',
      },
    ];

    const result = translateZodErrors(issues as z.ZodIssue[], t);

    expect(result[0]!.message).toBe('translated:validation.required');
    expect(result[1]!.message).toBe('translated:validation.required');
  });

  it('should translate invalid_string sub-types', () => {
    const issues: any[] = [
      {
        code: 'invalid_format',
        validation: 'email',
        message: 'Invalid email',
        path: [],
      },
      {
        code: 'invalid_format',
        validation: 'url',
        message: 'Invalid url',
        path: [],
      },
      {
        code: 'invalid_format',
        validation: 'uuid',
        message: 'Invalid uuid',
        path: [],
      },
    ];

    const result = translateZodErrors(issues, t);

    expect(result[0]!.message).toBe('translated:validation.email');
    expect(result[1]!.message).toBe('translated:validation.url');
    expect(result[2]!.message).toBe('translated:validation.invalidUuid');
  });

  it('should respect existing translation keys in message', () => {
    const issues: z.ZodIssue[] = [
      {
        code: 'custom',
        message: 'validation.customKey',
        path: [],
      },
    ];

    const result = translateZodErrors(issues, t);

    expect(result[0]!.message).toBe('translated:validation.customKey');
  });

  it('should fallback to string matching if no code match', () => {
    const issues: any[] = [
      {
        code: 'custom',
        message: 'Something is required here',
        path: [],
      },
    ];

    const result = translateZodErrors(issues as z.ZodIssue[], t);

    expect(result[0]!.message).toBe('translated:validation.required');
  });

  it('should keep original message if unknown and not a key', () => {
    const issues: z.ZodIssue[] = [
      {
        code: 'custom',
        message: 'Unknown error occurred',
        path: [],
      },
    ];

    const result = translateZodErrors(issues, t);

    expect(result[0]!.message).toBe('Unknown error occurred');
  });
});
