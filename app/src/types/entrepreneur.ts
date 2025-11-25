import type { z } from 'zod';
import type { EntrepreneurSchema } from '../schemas/entrepreneur';

export type EntrepreneurBase = z.infer<typeof EntrepreneurSchema>;

// Extended type for UI, enriched with related entrepreneur object
export interface Entrepreneur extends EntrepreneurBase {
	profileCompleted?: boolean; // optional computed field indicating if profile is complete
}
