import type { z } from 'zod';
import { SupportBoostSchema } from '@/schemas/monitoring-evaluation/Support';

export type Support = z.infer<typeof SupportBoostSchema>;
