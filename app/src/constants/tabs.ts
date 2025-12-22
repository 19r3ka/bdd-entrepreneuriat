/**
 * Constants representing the tabs in the Business Detail View.
 * Used to manage tab state and avoid magic strings/numbers.
 */
export const BUSINESS_TABS = {
  OVERVIEW: 'overview',
  REPORTS: 'reports',
  SUPPORTS: 'supports',
  QUICK_WINS: 'quick_wins',
  OUTCOMES: 'outcomes',
  MATURITY: 'maturity',
} as const;

/**
 * Type definition for BusinessTab derived from the constants.
 */
export type BusinessTab = (typeof BUSINESS_TABS)[keyof typeof BUSINESS_TABS];
