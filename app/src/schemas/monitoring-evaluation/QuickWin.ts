import { z } from "zod";
import { GenderMarkerEnum } from "../common/genderMarker";

/**
 * QuickWinIndicatorValue Schema
 * Links a QuickWin to an OutputIndicator with specific values
 */
export const QuickWinIndicatorValueSchema = z.object({
    indicatorId: z.string().uuid().describe("FK: Reference to OutputIndicator"),
    baseline: z.number().optional().describe("Baseline value before intervention"),
    target: z.number().optional().describe("Target value to achieve"),
    currentValue: z.union([z.number(), z.boolean(), z.string()]).optional().describe("Actual achieved value"),
    currency: z.string().length(3).optional().describe("ISO 4217 currency code (when unit is currency)"),
    notes: z.string().max(200).optional().describe("Additional notes about this indicator value")
});

/**
 * QuickWin Schema
 * Represents immediate outputs/results from UNDP support
 * Outputs are tangible deliverables that answer: "What changed immediately because of our support?"
 */
export const QuickWinSchema = z.object({
    id: z.string().uuid().describe("PK: UUID of this quick win"),
    businessId: z.string().uuid().describe("FK: Business that achieved this output"),
    supportBoostId: z.string().uuid().optional().describe("FK: Optional link to support that enabled this output"),

    // Core fields (required)
    title: z.string().min(2).max(140).describe("Short, descriptive title of the output (e.g., 'Digital storefront launched')"),
    category: z.enum([
        'digital_adoption',
        'finance_access',
        'market_integration',
        'innovation',
        'performance',
        'employment_inclusion',
        'resilience',
        'sustainability'
    ]).describe("Category of the quick win"),
    dimension: z.enum(["Digital", "Finance", "Market", "Green", "Formalization"]).optional()
        .describe("Maturity dimension achieved"),
    milestone: z.number().min(1).max(4).optional()
        .describe("Maturity milestone level (1-4)"),
    resultSummary: z.string().min(10).max(500).describe("What changed? What was achieved?"),
    achievedOn: z.string().date().describe("Date when this output was achieved (YYYY-MM-DD)"),

    // RBM alignment (optional)
    rbmLevel: z.literal("output").default("output").describe("RBM level - always 'output' for QuickWins"),
    cpdOutputCode: z.string().optional().describe("CPD output code for reporting"),
    spOutcomeCode: z.string().optional().describe("Strategic Plan outcome code"),
    irrfIndicatorIds: z.array(z.string()).optional().describe("IRRF indicator IDs this output contributes to"),
    sdgTargets: z.array(z.string()).optional().describe("SDG targets this output contributes to"),
    genderMarker: GenderMarkerEnum.optional().describe("Gender equality marker"),

    // Indicators (links to OutputIndicator table)
    indicatorValues: z.array(QuickWinIndicatorValueSchema).optional().default([]).describe("Measured indicators for this output"),

    // Evidence & categorization
    evidenceIds: z.array(z.string().uuid()).optional().default([]).describe("Evidence/attachments (future feature)"),
    tags: z.array(z.string()).optional().default([]).describe("Tags for categorization"),

    // Metadata
    createdAt: z.string().datetime().optional(),
    createdBy: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
    updatedBy: z.string().optional()
}).superRefine((val, ctx) => {
    // Note: achievedOn validation against support startDate will be done in the form
    // where we can fetch the linked support data
    if (val.supportBoostId && val.achievedOn) {
        // Placeholder for validation logic
        // Actual validation in QuickWinForm component
    }
});

export type QuickWinIndicatorValue = z.infer<typeof QuickWinIndicatorValueSchema>;
export type QuickWin = z.infer<typeof QuickWinSchema>;
