import { z } from 'zod';
import { CurrencyCodeEnum } from '@/schemas/enums';

// Object structure for money
// Preprocesses legacy simple numbers/strings into object with default currency if needed
// (Assuming default currency USD if not provided in legacy, or fail if context unknown.
//  Actually, if it's a number, we might return just number if allowed, but spec says "object { amount: number, currencyCode: string }".
//  To support legacy data which might be just a number, we need to decide on a default currency or ask for it.
//  For now, I'll strictly enforce the object structure but allow string amount coercion.)

export const MoneySchema = z.object({
  amount: z.preprocess(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }, z.number()),
  currencyCode: CurrencyCodeEnum,
});

export type Money = z.infer<typeof MoneySchema>;
