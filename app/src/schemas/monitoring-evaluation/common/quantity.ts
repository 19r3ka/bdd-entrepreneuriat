import { z } from 'zod';
import { SupportQuantityUnitEnum } from '../../enums';
import { CurrencyCodeStringSchema } from '@/schemas/enums/common';

/**
 * Standard schema for representing quantities with values, units, and optional currency.
 */
export const QuantitySchema = z
  .object({
    value: z.number().positive().optional().describe('Numeric value of the quantity'),
    unit: SupportQuantityUnitEnum.optional().describe('Unit of measurement'),
    currency: CurrencyCodeStringSchema.optional().describe(
      'ISO 4217 currency code (required if unit is currency)'
    ),
  })
  .superRefine((val, ctx) => {
    if (val.unit === 'currency' && !val.currency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currency'],
        message: "Provide a 3-letter currency code when unit='currency' (e.g., 'XOF', 'USD')",
      });
    }
  });

export type Quantity = z.infer<typeof QuantitySchema>;
