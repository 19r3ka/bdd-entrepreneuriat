import { IndicatorReadingSchema } from './common/reading';
import { z } from 'zod';

// Export the schema that's now defined in the common reading module
// This maintains backward compatibility while using the new unified structure
export { IndicatorReadingSchema };

export type IndicatorReading = z.infer<typeof IndicatorReadingSchema>;
