import { z } from 'zod'

export const MomentumMetricSchema = z
  .object({
    momentumMetricId: z.string().uuid(),
    businessId: z.string().uuid(),
    quickWinId: z.string().uuid().optional(),

    title: z
      .string()
      .min(2)
      .max(140)
      .describe("Short name for the outcome metric (e.g., 'Revenue Growth')"),
    category: z.enum([
      'performance',
      'employment_inclusion',
      'finance_access',
      'innovation',
      'sustainability',
      'resilience',
      'digital_adoption',
      'market_integration'
    ]),
    dimension: z
      .enum(['Digital', 'Finance', 'Market', 'Green', 'Formalization'])
      .optional()
      .describe('Maturity dimension tracked'),

    rbmLevel: z.literal('outcome').default('outcome'),
    cpdOutputCode: z.string().optional(),
    spOutcomeCode: z.string().optional(),
    irrfIndicatorIds: z.array(z.string()).optional(),
    sdgTargets: z.array(z.string()).optional(),
    genderMarker: z.enum(['GEN0', 'GEN1', 'GEN2', 'GEN3']).optional(),

    indicators: z
      .array(
        z.object({
          name: z.string().min(2),
          unit: z.enum(['percent', 'count', 'currency', 'boolean', 'index', 'hours']).optional(),
          baseline: z.number().optional(),
          readings: z
            .array(
              z.object({
                value: z.union([z.number(), z.boolean()]),
                asOf: z.string().date(),
                currency: z.string().length(3).optional(),
                disagg: z
                  .object({
                    gender: z.enum(['male', 'female', 'other']).optional(),
                    ageBand: z.enum(['15-24', '25-34', '35-50', '50+']).optional(),
                    disability: z.boolean().optional(),
                    location: z.string().optional()
                  })
                  .optional()
              })
            )
            .optional()
            .default([]),
          target: z.number().optional(),
          currency: z.string().length(3).optional(),
          evidenceId: z.string().uuid().optional()
        })
      )
      .optional()
      .default([]),

    evidenceIds: z.array(z.string().uuid()).optional().default([]),
    contributionNarrative: z.string().max(500).optional(),

    createdAt: z.string().datetime().optional(),
    createdBy: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
    updatedBy: z.string().optional()
  })
  .superRefine((val, ctx) => {
    for (const ind of val.indicators ?? []) {
      if (ind.unit === 'currency' && !ind.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['indicators'],
          message: "Indicators with unit='currency' must include a 3-letter currency code."
        })
      }
    }
  })

export type MomentumMetric = z.infer<typeof MomentumMetricSchema>
export type IndicatorReading = MomentumMetric['indicators'][number]['readings'][number]
