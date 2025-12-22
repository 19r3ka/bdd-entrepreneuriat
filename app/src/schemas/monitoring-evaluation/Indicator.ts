import { z } from 'zod';
import { StandardIndicatorSchema } from './indicators/standard';
import { MeasurementSchema as CommonMeasurementSchema } from './common/reading';

/**
 * @deprecated Use StandardIndicatorSchema from './indicators/standard' instead.
 * This re-export is maintained for backward compatibility during the refactoring process.
 * The schema now aligns with the new StandardIndicator structure,
 * which implies a 'type: "standard"' literal.
 */
export const IndicatorDefinitionSchema = StandardIndicatorSchema;

export const MeasurementSchema = CommonMeasurementSchema;

export type Measurement = z.infer<typeof MeasurementSchema>;
