import { z } from 'zod';
import { IndicatorSchema } from './MomentumMetricsIndicator';
import { DimensionEnum } from '@/schemas/enums';
import { RbmFieldsSchema } from './common/rbmFields';
import { EvidenceSchema } from './common/evidence';

// Constants for validation
const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 140;
const MAX_NARRATIVE_LENGTH = 500;

export const MomentumMetricSchema = z
  .object({
    momentumMetricId: z.string().uuid(),
    businessId: z.string().uuid(),
    quickWinId: z.string().uuid().optional(),

    title: z
      .string()
      .min(MIN_TITLE_LENGTH)
      .max(MAX_TITLE_LENGTH)
      .describe('Short name for the outcome metric'),
    category: z.enum([
      'performance',
      'employment_inclusion',
      'finance_access',
      'innovation',
      'sustainability',
      'resilience',
      'digital_adoption',
      'market_integration',
    ]),
    dimension: DimensionEnum.optional(),

    // RBM hooks (merged via RbmFieldsSchema)
    ...RbmFieldsSchema.shape,
    rbmLevel: z.literal('outcome').default('outcome'),

    indicators: z.array(IndicatorSchema).default([]),

    // Evidence (merged via EvidenceSchema)
    ...EvidenceSchema.shape,
    contributionNarrative: z.string().max(MAX_NARRATIVE_LENGTH).optional(),

    createdAt: z.string().datetime().optional(),
    createdBy: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
    updatedBy: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    for (const ind of val.indicators) {
      if (ind.unit === 'currency' && !ind.currency) {
        ctx.addIssue({
          code: 'custom',
          path: ['indicators'],
          message: "Indicators with unit='currency' must include a 3-letter currency code.",
        });
      }
    }
  });

export type MomentumMetric = z.infer<typeof MomentumMetricSchema>;
