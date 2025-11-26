import { z } from 'zod';
import { GenderMarkerEnum } from "../common/genderMarker";

/**
 * Minimal, relational-friendly SupportBoost schema (Inputs)
 * - Works when you only have a business registry and want to start logging support fast.
 * - FK: businessId
 */
export const SupportBoostSchema = z.object({
  // Primary/foreign keys
  id: z.string().uuid().describe("PK: UUID of this support boost"),
  businessId: z.string().uuid().describe("FK: UUID of the business receiving support"),

  // Required core fields
  title: z.string()
    .min(2, "Give the boost a short, human-friendly title")
    .describe("e.g., 'Digital Kickstart Grant'"),
  boostType: z.enum([
    "financial_grant",
    "financial_match",
    "training",
    "advisory_mentoring",
    "equipment_infrastructure",
    "workspace_access",
    "policy_advocacy",
    "partnership_linkage",
    "market_access",
    "digitalization_support",
  ]).describe("Minimal modality-agnostic categorization of support"),
  modality: z.enum(["DIM", "NIM", "hybrid"])
    .describe("UNDP implementation modality (keep simple for now)"),
  startDate: z.string().date().describe("ISO date string (YYYY-MM-DD)"),

  // Nice-to-have, but optional (kept minimal)
  endDate: z.string().date().optional(),
  provider: z.string().optional().describe("UNDP unit or partner org (optional)"),
  channel: z.enum(["in-person", "online", "hybrid"]).optional(),

  /**
   * Minimal quantity object: don’t overspecify now.
   * - One generic numeric value + a simple unit enum.
   * - Add specialized fields later (currencyAmount, sessions, hours, items, etc.)
   */
  quantity: z.object({
    value: z.number().positive().optional()
      .describe("How much support was delivered (generic numeric)"),
    unit: z.enum([
      "currency",
      "sessions",
      "hours",
      "participants",
      "items",
      "linkages",
      "docs"
    ]).optional()
      .describe("Choose a simple unit that best fits the boost"),
    currency: z.string().length(3).optional()
      .describe("ISO-4217 (required only if unit='currency')"),
  }).default({}).describe("Keep it generic early; refine per boostType later"),

  // Light RBM hooks (optional now; helpful later)
  rbmLevel: z.enum(["input", "output", "outcome", "impact"]).optional(),
  cpdOutputCode: z.string().optional(),
  spOutcomeCode: z.string().optional(),
  irrfIndicatorIds: z.array(z.string()).optional(),
  sdgTargets: z.array(z.string()).optional(),
  genderMarker: GenderMarkerEnum,

  // Free-form notes
  notes: z.string().max(2000).optional(),

  // Minimal audit (keep simple)
  createdAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
})
  // Soft refinement: if unit=currency, then currency code should be present
  .superRefine((val, ctx) => {
    const unit = val.quantity?.unit;
    const curr = val.quantity?.currency;
    if (unit === "currency" && !curr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity", "currency"],
        message: "Provide a 3-letter currency code when unit='currency' (e.g., 'XOF', 'USD')",
      });
    }

    // Validate end date is after start date
    if (val.endDate && val.startDate) {
      const start = new Date(val.startDate);
      const end = new Date(val.endDate);
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date must be after start date",
        });
      }
    }
  });

