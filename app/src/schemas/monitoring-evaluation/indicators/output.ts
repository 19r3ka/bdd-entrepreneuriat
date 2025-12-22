import { z } from 'zod';
import { BaseIndicatorSchema } from './base';

// Specific category enum for OutputIndicator
export const OutputCategoryEnum = z.enum([
  'capacity_development',
  'access_to_finance',
  'market_access',
  'policy_regulatory',
  'innovation_sustainability',
  'digital_transformation',
]);
export type OutputCategory = z.infer<typeof OutputCategoryEnum>;

export const OutputIndicatorSchema = BaseIndicatorSchema.extend({
  type: z.literal('output'),
  category: OutputCategoryEnum.optional(),
  isStandard: z.boolean().default(false),
  sdgTargets: z.array(z.string()).optional(),
  irrfIndicatorCode: z.string().optional(),
  cpdOutputCode: z.string().optional(),
  // Additional audit fields (not in base)
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type OutputIndicator = z.infer<typeof OutputIndicatorSchema>;
