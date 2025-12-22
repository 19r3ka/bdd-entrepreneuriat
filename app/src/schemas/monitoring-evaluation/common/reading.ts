import { z } from 'zod';
import { AppDateSchema } from '@/schemas/common';
import { DisaggSchema } from '../Disagg';
import { CurrencyCodeStringSchema } from '@/schemas/enums/common';

/**
 * BaseReadingSchema
 * Common fields for any value reading at a point in time.
 * This serves as the single source of truth for value readings.
 */
export const BaseReadingSchema = z.object({
  value: z.union([z.number(), z.boolean(), z.string()]),
  asOf: AppDateSchema, // Using Date objects in app layer
  currency: CurrencyCodeStringSchema.optional(),
  disagg: DisaggSchema.optional(),
});

export type BaseReading = z.infer<typeof BaseReadingSchema>;

/**
 * MeasurementSchema
 * Detailed measurement of an indicator with evidence and narrative
 */
export const MeasurementSchema = z.object({
  id: z.string().uuid(),
  indicatorId: z.string().uuid(),
  currentValue: z.number(),
  dateRecorded: AppDateSchema,
  evidenceSource: z.string().min(1), // Assuming this will be a reference to an uploaded file's ID
  contributionNarrative: z.string().min(1),
  createdAt: AppDateSchema,
  updatedAt: AppDateSchema,
});

export type Measurement = z.infer<typeof MeasurementSchema>;

/**
 * IndicatorReadingSchema
 * Alias for BaseReadingSchema for use in indicators.
 */
export const IndicatorReadingSchema = BaseReadingSchema;

export type IndicatorReading = z.infer<typeof IndicatorReadingSchema>;

// Export z for use in files that import from this module
export { z };
