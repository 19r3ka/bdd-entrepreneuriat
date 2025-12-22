import { z } from 'zod';

export const ACTIVITY_ACTION_OPTIONS = ['create', 'update', 'delete'] as const;
export const ActivityActionEnum = z.enum(ACTIVITY_ACTION_OPTIONS);
export type ActivityAction = z.infer<typeof ActivityActionEnum>;

export const ACTIVITY_ENTITY_TYPE_OPTIONS = [
  'business',
  'entrepreneur',
  'support',
  'quick_win',
  'metric',
] as const;
export const ActivityEntityTypeEnum = z.enum(ACTIVITY_ENTITY_TYPE_OPTIONS);
export type ActivityEntityType = z.infer<typeof ActivityEntityTypeEnum>;
