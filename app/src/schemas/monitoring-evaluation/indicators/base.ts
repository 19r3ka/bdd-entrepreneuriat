import { z } from 'zod';
import { IndicatorUnitEnum } from '@/schemas/enums';
import { AppDateSchema } from '@/schemas/common';

export const BaseIndicatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  unit: IndicatorUnitEnum,
  type: z.string(), // This will be the discriminator field
  usageCount: z.number().default(0),
  createdAt: AppDateSchema.optional(),
  updatedAt: AppDateSchema.optional(),
});

export type BaseIndicator = z.infer<typeof BaseIndicatorSchema>;
