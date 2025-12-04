/**
 * Constants representing the available actions for a business.
 * Used to avoid magic strings in the application.
 */
export const BUSINESS_ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
  LOG_INTERVENTION: 'log_intervention',
  LOG_QUICK_WIN: 'log_quick_win',
  TRACK_PERFORMANCE: 'track_performance'
} as const

/**
 * Type definition for BusinessAction derived from the constants.
 */
export type BusinessAction = (typeof BUSINESS_ACTIONS)[keyof typeof BUSINESS_ACTIONS]
