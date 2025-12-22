import { z } from 'zod';

export const QUICK_WIN_CATEGORY_OPTIONS = [
  'digital_adoption',
  'employment_inclusion',
  'finance_access',
  'innovation',
  'market_integration',
  'performance',
  'resilience',
  'sustainability',
] as const;

export const QuickWinCategoryEnum = z.enum(QUICK_WIN_CATEGORY_OPTIONS);

export type QuickWinCategory = z.infer<typeof QuickWinCategoryEnum>;
