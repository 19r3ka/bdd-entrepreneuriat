import { z } from 'zod';
import { OutputIndicatorSchema as NewOutputIndicatorSchema } from './indicators/output';

/**
 * @deprecated Use OutputIndicatorSchema from './indicators/output' instead.
 * This re-export is maintained for backward compatibility during the refactoring process.
 */
export const OutputIndicatorSchema = NewOutputIndicatorSchema;

export type OutputIndicator = z.infer<typeof OutputIndicatorSchema>;
