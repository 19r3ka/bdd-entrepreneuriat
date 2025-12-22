import { z } from 'zod';
import { BoostTypeEnum, ModalityEnum, ChannelEnum } from '@/schemas/enums';
import { AppDateSchema } from '@/schemas/common';
import { RbmFieldsSchema } from './common/rbmFields';
import { QuantitySchema } from './common/quantity';

const MAX_SUPPORT_NOTES_LENGTH = 2000;

/**
 * Minimal, relational-friendly SupportBoost schema (Inputs)
 * - Works when you only have a business registry and want to start logging support fast.
 * - FK: businessId
 */
export const SupportBoostSchema = z
  .object({
    // Primary/foreign keys
    id: z.string().uuid().describe('PK: UUID of this support boost'),
    businessId: z.string().uuid().describe('FK: UUID of the business receiving support'),

    // Required core fields
    title: z
      .string()
      .min(2, 'Give the boost a short, human-friendly title')
      .describe("e.g., 'Digital Kickstart Grant'"),
    boostType: BoostTypeEnum.describe('Minimal modality-agnostic categorization of support'),
    modality: ModalityEnum.describe('UNDP implementation modality (keep simple for now)'),
    dimension: z
      .enum(['Digital', 'Finance', 'Market', 'Green', 'Formalization'])
      .optional()
      .describe('Maturity dimension targeted by this support'),
    startDate: AppDateSchema.describe('Support start date'),

    // Nice-to-have, but optional (kept minimal)
    endDate: AppDateSchema.optional(),
    provider: z.string().optional().describe('UNDP unit or partner org (optional)'),
    channel: ChannelEnum.optional(),

    /**
     * Minimal quantity object
     */
    quantity: QuantitySchema.default({}),

    // RBM hooks (merged via RbmFieldsSchema)
    ...RbmFieldsSchema.shape,

    beneficiaryGroup: z.string().optional(), // BeneficiaryGroupEnum was here but let's keep it simple or check if it should be in RbmFields

    // Free-form notes
    notes: z.string().max(MAX_SUPPORT_NOTES_LENGTH).optional(),

    // Minimal audit (keep simple)
    createdAt: AppDateSchema.optional(),
    createdBy: z.string().optional(),
    updatedAt: AppDateSchema.optional(),
    updatedBy: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // Validate end date is after start date
    if (val.endDate && val.startDate) {
      const start = new Date(val.startDate);
      const end = new Date(val.endDate);
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'End date must be after start date',
        });
      }
    }
  });

export type Support = z.infer<typeof SupportBoostSchema>;
