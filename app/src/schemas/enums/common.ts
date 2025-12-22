import { z } from 'zod';

export const GENDER_OPTIONS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'] as const;
export const GenderEnum = z.enum(GENDER_OPTIONS);
export type Gender = z.infer<typeof GenderEnum>;

export const ISO_CURRENCY_CODE_LENGTH = 3;
export const CURRENCY_CODE_OPTIONS = ['USD', 'KES', 'EUR', 'GBP', 'XOF'] as const;
export const CurrencyCodeEnum = z.enum(CURRENCY_CODE_OPTIONS);
export type CurrencyCode = z.infer<typeof CurrencyCodeEnum>;

// A generic schema for any 3-letter uppercase currency code, adhering to ISO 4217 format.
// This is more flexible than CurrencyCodeEnum if the application needs to support unlisted currencies.
export const CurrencyCodeStringSchema = z
  .string()
  .length(ISO_CURRENCY_CODE_LENGTH)
  .regex(/^[A-Z]{3}$/, 'Invalid currency code format (must be 3 uppercase letters).');
export type CurrencyCodeString = z.infer<typeof CurrencyCodeStringSchema>;

export const COUNTRY_CODE_OPTIONS = ['KE', 'UG', 'TZ', 'RW', 'TG'] as const;
export const CountryCodeEnum = z.enum(COUNTRY_CODE_OPTIONS);
export type CountryCode = z.infer<typeof CountryCodeEnum>;

export const IMPORT_STATUS_OPTIONS = ['pending', 'ignored'] as const;
export const ImportStatusEnum = z.enum(IMPORT_STATUS_OPTIONS);
export type ImportStatus = z.infer<typeof ImportStatusEnum>;
