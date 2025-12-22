import { computed, toValue, type MaybeRef } from 'vue';
import { MaturityDimensions, type MaturityDimension } from '@/constants/maturityCatalog';
import type { Business } from '@/types/business';

// Constants for maturity levels
const MAX_MATURITY_LEVEL = 4;
const MAX_ADVISABLE_LEVEL = 3; // Levels 1-3 can advance to next level

/**
 * Composable for maturity-related calculations shared between MaturityPortfolioView and MaturityNexus
 */
export function useMaturityCalculations(
  businessesOrLevelsRef: MaybeRef<Business[] | Record<MaturityDimension, number>>
) {
  // Calculate average maturity levels across all dimensions
  const avgMaturityLevels = computed(() => {
    const businessesOrLevels = toValue(businessesOrLevelsRef);
    const isBusinessArray = Array.isArray(businessesOrLevels);

    if (isBusinessArray) {
      const businesses = businessesOrLevels as Business[];
      const totals: Record<string, number> = {};
      MaturityDimensions.forEach(d => (totals[d] = 0));

      if (businesses.length === 0) return totals;

      businesses.forEach(b => {
        MaturityDimensions.forEach(d => {
          // Use real maturity level or default to 1 if missing (should be present now)
          const level = b.maturityLevels?.[d] || 1;
          if (totals[d] !== undefined) {
            totals[d] += level;
          }
        });
      });

      const averages: Record<string, number> = {};
      MaturityDimensions.forEach(d => {
        if (totals[d] !== undefined) {
          averages[d] = parseFloat((totals[d] / businesses.length).toFixed(1));
        } else {
          averages[d] = 0;
        }
      });
      return averages;
    } else {
      // Already levels object, just return it
      return businessesOrLevels as Record<MaturityDimension, number>;
    }
  });

  // Calculate milestone distribution (for portfolio view)
  const milestoneDistribution = computed(() => {
    const businessesOrLevels = toValue(businessesOrLevelsRef);
    const isBusinessArray = Array.isArray(businessesOrLevels);

    if (!isBusinessArray) return {};

    const businesses = businessesOrLevels as Business[];
    const dist: Record<string, Record<number, number>> = {};

    MaturityDimensions.forEach(d => {
      dist[d] = { 1: 0, 2: 0, 3: 0, [MAX_MATURITY_LEVEL]: 0 };
      businesses.forEach(b => {
        const level = b.maturityLevels?.[d] || 1;
        if (dist[d] && dist[d][level] !== undefined) dist[d][level]++;
      });
    });

    // Convert to percentages
    const percentages: Record<string, Record<number, string>> = {};
    MaturityDimensions.forEach(d => {
      percentages[d] = {};
      [1, 2, MAX_ADVISABLE_LEVEL, MAX_MATURITY_LEVEL].forEach(l => {
        const count = dist[d]?.[l] || 0;
        const pct = businesses.length > 0 ? Math.round((count / businesses.length) * 100) : 0;
        if (percentages[d]) {
          percentages[d][l] = `${pct}%`;
        }
      });
    });

    return percentages;
  });

  // Calculate next milestone advisories - businesses at each level that need to advance
  const nextMilestoneAdvisories = computed(() => {
    const businessesOrLevels = toValue(businessesOrLevelsRef);
    const isBusinessArray = Array.isArray(businessesOrLevels);

    if (!isBusinessArray) return [];

    const businesses = businessesOrLevels as Business[];
    const advisories: Array<{
      dimension: MaturityDimension;
      level: number;
      nextLevel: number;
      count: number;
      businesses: Business[];
      message: string;
    }> = [];

    // For each dimension, find businesses at levels 1-MAX_ADVISABLE_LEVEL (can advance to next level)
    MaturityDimensions.forEach(dimension => {
      for (let level = 1; level <= MAX_ADVISABLE_LEVEL; level++) {
        const businessesAtLevel = businesses.filter(b => {
          const maturityLevel = b.maturityLevels?.[dimension] || 1;
          return maturityLevel === level;
        });

        if (businessesAtLevel.length > 0) {
          const nextLevel = level + 1;
          advisories.push({
            dimension,
            level,
            nextLevel,
            count: businessesAtLevel.length,
            businesses: businessesAtLevel,
            message: getAdvisoryMessage(dimension, level, nextLevel),
          });
        }
      }
    });

    // Sort by count (descending) to show most impactful advisories first
    return advisories.sort((a, b) => b.count - a.count);
  });

  return {
    avgMaturityLevels,
    milestoneDistribution,
    nextMilestoneAdvisories,
  };
}

// Constants for advisory messages
const MATURE_LEVEL_1 = 1;
const MATURE_LEVEL_2 = 2;
const MATURE_LEVEL_3 = 3; // Highest advisable level in the messages

/**
 * Generate advisory message based on dimension and levels
 */
function getAdvisoryMessage(
  dimension: MaturityDimension,
  currentLevel: number,
  nextLevel: number
): string {
  const messages: Record<MaturityDimension, Record<number, string>> = {
    Green: {
      [MATURE_LEVEL_1]: 'businesses need support with energy efficiency measures.',
      [MATURE_LEVEL_2]: 'businesses are ready for green certification.',
      [MATURE_LEVEL_3]: 'businesses are ready for circular economy practices.',
    },
    Finance: {
      [MATURE_LEVEL_1]: 'businesses need support opening business bank accounts.',
      [MATURE_LEVEL_2]: 'businesses are ready to secure loans.',
      [MATURE_LEVEL_3]: 'businesses are ready for blended finance access.',
    },
    Digital: {
      [MATURE_LEVEL_1]: 'businesses need support establishing online presence.',
      [MATURE_LEVEL_2]: 'businesses are ready for e-commerce enablement.',
      [MATURE_LEVEL_3]: 'businesses are ready for advanced analytics.',
    },
    Market: {
      [MATURE_LEVEL_1]: 'businesses are ready for regional expansion.',
      [MATURE_LEVEL_2]: 'businesses are ready for export readiness training.',
      [MATURE_LEVEL_3]: 'businesses are ready for international partnerships.',
    },
    Formalization: {
      [MATURE_LEVEL_1]: 'businesses are ready for business registration.',
      [MATURE_LEVEL_2]: 'businesses need support with tax compliance.',
      [MATURE_LEVEL_3]: 'businesses are ready for governance structure development.',
    },
  };

  return (
    messages[dimension]?.[currentLevel] ||
    `businesses need support advancing from Level ${currentLevel} to Level ${nextLevel}.`
  );
}
