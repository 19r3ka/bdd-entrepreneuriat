import { z } from 'zod';
import { BaseIndicatorSchema } from './base';
import { IndicatorReadingSchema } from '../common/reading';
import { CurrencyCodeStringSchema } from '@/schemas/enums/common';

export const MomentumIndicatorSchema = BaseIndicatorSchema.extend({
  type: z.literal('momentum'),
  baseline: z.number().optional(),
  target: z.number().optional(),
  currency: CurrencyCodeStringSchema.optional(), // Replaced inline validation
  evidenceId: z.string().uuid().optional(),
  readings: z.array(IndicatorReadingSchema).default([]),
});

export type MomentumIndicator = z.infer<typeof MomentumIndicatorSchema>;
