import type z from 'zod';
import { IndicatorSchema } from '@/schemas/monitoring-evaluation/MomentumMetricsIndicator';

export type MomentumMetricsIndicator = z.infer<typeof IndicatorSchema>;
