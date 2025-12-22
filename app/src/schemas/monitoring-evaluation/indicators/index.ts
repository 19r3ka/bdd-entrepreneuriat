import { z } from 'zod';
import { StandardIndicatorSchema } from './standard';
import { OutputIndicatorSchema } from './output';
import { MomentumIndicatorSchema } from './momentum';

export const IndicatorSchema = z.discriminatedUnion('type', [
  StandardIndicatorSchema,
  OutputIndicatorSchema,
  MomentumIndicatorSchema,
]);

export type Indicator = z.infer<typeof IndicatorSchema>;
