import { z } from 'zod';

export const MaturityAssessmentSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  achievedMilestoneIds: z.array(z.string().uuid()),
  computedScores: z.record(z.string(), z.number()),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
