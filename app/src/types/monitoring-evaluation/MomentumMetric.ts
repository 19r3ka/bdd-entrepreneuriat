import type z from 'zod';
import { MomentumMetricSchema } from '../../schemas/monitoring-evaluation/MomentumMetric';

export type MomentumMetric = z.infer<typeof MomentumMetricSchema>;
