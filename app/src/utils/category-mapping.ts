/**
 * Utility to map Support boostType to strategic outcome category
 * This avoids duplicating category data on Support - we derive it from boostType
 */

export type SupportBoostType =
    | "financial_grant"
    | "financial_match"
    | "training"
    | "advisory_mentoring"
    | "equipment_infrastructure"
    | "workspace_access"
    | "policy_advocacy"
    | "partnership_linkage"
    | "market_access"
    | "digitalization_support";

export type OutcomeCategory =
    | "performance"
    | "employment_inclusion"
    | "finance_access"
    | "innovation"
    | "sustainability"
    | "resilience"
    | "digital_adoption"
    | "market_integration";

/**
 * Maps Support boost types to their primary outcome categories
 */
export const BOOST_TYPE_TO_CATEGORY: Record<SupportBoostType, OutcomeCategory> = {
    financial_grant: "finance_access",
    financial_match: "finance_access",
    training: "employment_inclusion",
    advisory_mentoring: "performance",
    equipment_infrastructure: "innovation",
    workspace_access: "resilience",
    policy_advocacy: "resilience",
    partnership_linkage: "market_integration",
    market_access: "market_integration",
    digitalization_support: "digital_adoption",
};

/**
 * Get the strategic category for a given boost type
 */
export function getCategoryFromBoostType(boostType: SupportBoostType): OutcomeCategory {
    return BOOST_TYPE_TO_CATEGORY[boostType];
}
