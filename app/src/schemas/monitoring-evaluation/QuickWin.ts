import { z } from 'zod';
import { QuickWinCategoryEnum } from '@/schemas/enums';
import { AppDateSchema } from '@/schemas/common';
import { CurrencyCodeStringSchema } from '@/schemas/enums/common';
import { RbmFieldsSchema } from './common/rbmFields';
import { EvidenceSchema } from './common/evidence';

// Constants for validation
const MIN_TITLE_LENGTH = 2;
const MAX_TITLE_LENGTH = 140;
const MAX_NOTES_LENGTH = 200;
const MIN_MILESTONE = 1;
const MAX_MILESTONE = 4;
const MIN_RESULT_SUMMARY_LENGTH = 10;
const MAX_RESULT_SUMMARY_LENGTH = 500;

/**
 * QuickWinIndicatorValue Schema
 * Links a QuickWin to an OutputIndicator with specific values
 */
export const QuickWinIndicatorValueSchema = z.object({
  indicatorId: z.string().uuid().describe('FK: Reference to OutputIndicator'),
  baseline: z.number().optional().describe('Baseline value before intervention'),
  target: z.number().optional().describe('Target value to achieve'),
  currentValue: z
    .union([z.number(), z.boolean(), z.string()])
    .optional()
    .describe('Actual achieved value'),
  currency: CurrencyCodeStringSchema.optional().describe(
    'ISO 4217 currency code (when unit is currency)'
  ), // Replaced inline validation
  notes: z
    .string()
    .max(MAX_NOTES_LENGTH)
    .optional()
    .describe('Additional notes about this indicator value'),
});

/**
 * QuickWin Schema
 * Represents immediate outputs/results from UNDP support
 * Outputs are tangible deliverables that answer: "What changed immediately because of our support?"
 */
export const QuickWinSchema = z.object({
  id: z.string().uuid().describe('PK: UUID of this quick win'),
  businessId: z.string().uuid().describe('FK: Business that achieved this output'),
  supportBoostId: z
    .string()
    .uuid()
    .optional()
    .describe('FK: Optional link to support that enabled this output'),

  // Core fields (required)
  title: z
    .string()
    .min(MIN_TITLE_LENGTH)
    .max(MAX_TITLE_LENGTH)
    .describe("Short, descriptive title of the output (e.g., 'Digital storefront launched')"),
  category: QuickWinCategoryEnum.describe('Category of the quick win'),
  dimension: z
    .enum(['Digital', 'Finance', 'Market', 'Green', 'Formalization'])
    .optional()
    .describe('Maturity dimension achieved'),
  milestone: z
    .number()
    .min(MIN_MILESTONE)
    .max(MAX_MILESTONE)
    .optional()
    .describe('Maturity milestone level (1-4)'),
  resultSummary: z
    .string()
    .min(MIN_RESULT_SUMMARY_LENGTH)
    .max(MAX_RESULT_SUMMARY_LENGTH)
    .describe('What changed? What was achieved?'),
  achievedOn: AppDateSchema.describe('Date when this output was achieved'),

  // RBM alignment (merged via RbmFieldsSchema)
  ...RbmFieldsSchema.shape,
  rbmLevel: z.literal('output').default('output'),

  // Indicators (links to OutputIndicator table)
  indicatorValues: z
    .array(QuickWinIndicatorValueSchema)
    .optional()
    .default([])
    .describe('Measured indicators for this output'),

  // Evidence & categorization (merged via EvidenceSchema)
  ...EvidenceSchema.shape,
  tags: z.array(z.string()).optional().default([]).describe('Tags for categorization'),

  // Metadata
  createdAt: AppDateSchema.optional(),
  createdBy: z.string().optional(),
  updatedAt: AppDateSchema.optional(),
  updatedBy: z.string().optional(),
});

export type QuickWinIndicatorValue = z.infer<typeof QuickWinIndicatorValueSchema>;
export type QuickWin = z.infer<typeof QuickWinSchema>;
