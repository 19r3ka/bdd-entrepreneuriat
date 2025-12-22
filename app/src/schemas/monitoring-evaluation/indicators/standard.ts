import { z } from 'zod';
import { BaseIndicatorSchema } from './base';
import { AppDateSchema } from '@/schemas/common';

export const StandardIndicatorSchema = BaseIndicatorSchema.extend({
  type: z.literal('standard'),
  businessId: z.string().uuid(),
  baseline: z.number(),
  baselineDate: AppDateSchema,
  target: z.number(),
  targetDate: AppDateSchema,
});

export type StandardIndicator = z.infer<typeof StandardIndicatorSchema>;
