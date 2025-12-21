import { type Entrepreneur } from '@/schemas/entrepreneur';
import { isProfileCompletedStrict } from '@/utils/schemaCompletion';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';

export type EnrichedEntrepreneur = Entrepreneur & {
  profileCompleted: boolean;
};

/**
 * Enrichment logic for entrepreneurs
 */
export const enrichEntrepreneur = (entrepreneur: Entrepreneur): EnrichedEntrepreneur => {
  return {
    ...entrepreneur,
    profileCompleted: isProfileCompletedStrict(EntrepreneurSchema, entrepreneur),
  };
};
