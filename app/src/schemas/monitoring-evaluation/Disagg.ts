import z from 'zod';
import { GenderEnum } from '../enums/common';

// Disaggregation (gender, age, etc.)
export const DisaggSchema = z.object({
  gender: GenderEnum.optional(),
  ageBand: z.enum(['15-24', '25-34', '35-50', '50+']).optional(),
  disability: z.boolean().optional(),
  location: z.string().optional(),
});
