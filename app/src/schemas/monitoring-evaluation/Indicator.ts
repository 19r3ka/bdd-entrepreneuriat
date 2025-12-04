import { z } from 'zod'

export const IndicatorTypeEnum = z.enum(['Economic', 'Behavioral', 'Institutional'])

export const IndicatorDefinitionSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  type: IndicatorTypeEnum,
  name: z.string().min(1),
  description: z.string().optional(),
  baselineValue: z.number(),
  baselineDate: z.date(),
  targetValue: z.number(),
  targetDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const MeasurementSchema = z.object({
  id: z.string().uuid(),
  indicatorId: z.string().uuid(),
  currentValue: z.number(),
  dateRecorded: z.date(),
  evidenceSource: z.string().min(1), // Assuming this will be a reference to an uploaded file's ID
  contributionNarrative: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
})
