import type { z } from 'zod';
import type { BusinessSchema } from '../schemas/business';

// Raw shape accepted/persisted (pre-coercion)
export type BusinessInput = z.input<typeof BusinessSchema>;

// Parsed shape after zod (post-coercion) — what the UI uses
export type BusinessBase = z.output<typeof BusinessSchema>;

// Extended type for UI, enriched with related entrepreneur object
export interface Business extends BusinessBase {
  ownerName?: string | null; // optional computed field from entrepreneur's name
  isRegistered?: boolean; // optional computed field from registrationNumber/registrationDate
  profileCompleted?: boolean; // optional computed field indicating if profile is complete
  maturityLevels?: Record<string, number>; // optional field for maturity levels by dimension
}
