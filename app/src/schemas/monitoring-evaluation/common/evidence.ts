import { z } from 'zod';

/**
 * Standard schema for evidence tracking, typically an array of UUIDs referencing evidence files.
 */
export const EvidenceSchema = z.object({
  evidenceIds: z.array(z.string().uuid()).default([]),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
