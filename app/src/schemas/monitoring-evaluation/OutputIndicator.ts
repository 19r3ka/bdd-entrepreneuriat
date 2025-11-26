import { z } from "zod";

/**
 * OutputIndicator Schema
 * Reusable indicators for measuring outputs across QuickWins and other interventions
 * Aligned with UNDP RBM framework and MSME Strategy
 */
export const OutputIndicatorSchema = z.object({
    id: z.string().uuid().describe("PK: UUID of this indicator"),

    // Core fields
    name: z.string().min(2).max(200).describe("Indicator name (e.g., 'MSMEs trained in financial literacy')"),
    description: z.string().max(500).optional().describe("Detailed description of what this indicator measures"),
    category: z.enum([
        "capacity_development",
        "access_to_finance",
        "market_access",
        "policy_regulatory",
        "innovation_sustainability",
        "digital_transformation"
    ]).optional().describe("UNDP MSME Strategy category"),

    // Measurement
    unit: z.enum([
        "count",           // Number of MSMEs, businesses, etc.
        "percent",         // Percentage increase, completion rate
        "boolean",         // Yes/No, completed/not completed
        "hours",           // Training hours, consultation time
        "currency",        // Financial value
        "index",           // Score, rating
        "text"             // Qualitative description
    ]).describe("Unit of measurement"),

    // UNDP alignment (optional)
    irrfIndicatorCode: z.string().optional().describe("IRRF indicator code"),
    cpdOutputCode: z.string().optional().describe("CPD output code"),
    sdgTargets: z.array(z.string()).optional().describe("SDG targets this indicator contributes to"),

    // Metadata
    isStandard: z.boolean().default(false).describe("Pre-defined standard indicator vs custom"),
    usageCount: z.number().default(0).describe("Track how often this indicator is used"),
    createdAt: z.string().datetime().optional(),
    createdBy: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
    updatedBy: z.string().optional()
});

export type OutputIndicator = z.infer<typeof OutputIndicatorSchema>;
