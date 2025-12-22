import { z } from 'zod';
import { RBMLevelEnum, GenderMarkerEnum } from '../../enums';

/**
 * Common RBM (Results-Based Management) fields used across various M&E entities.
 */
export const RbmFieldsSchema = z.object({
  rbmLevel: RBMLevelEnum.optional(),
  cpdOutputCode: z.string().optional(),
  spOutcomeCode: z.string().optional(),
  irrfIndicatorIds: z.array(z.string()).optional(),
  sdgTargets: z.array(z.string()).optional(),
  genderMarker: GenderMarkerEnum.optional(),
});

export type RbmFields = z.infer<typeof RbmFieldsSchema>;
