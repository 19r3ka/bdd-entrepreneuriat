import { defineStore } from 'pinia';
import {
  MaturityCatalog,
  MaturityDimensions,
  type MaturityDimension,
  type MilestoneDefinition,
} from '@/constants/maturityCatalog';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

export const useMaturityStore = defineStore('maturity', () => {
  // State
  // We don't strictly need state if we compute everything from QuickWins,
  // but caching could be useful if calculation is heavy. For now, computed is fine.

  // Getters
  const getMaturityLevels = (quickWins: QuickWin[]) => {
    const levels: Record<MaturityDimension, number> = {
      Digital: 0,
      Finance: 0,
      Market: 0,
      Green: 0,
      Formalization: 0,
    };

    quickWins.forEach(qw => {
      if (qw.dimension && qw.milestone) {
        // Cast string to specific union type if needed, or rely on validation
        const dim = qw.dimension as MaturityDimension;
        if (MaturityDimensions.includes(dim)) {
          if (qw.milestone > levels[dim]) {
            levels[dim] = qw.milestone;
          }
        }
      }
    });

    return levels;
  };

  const getNextMilestones = (quickWins: QuickWin[]) => {
    const currentLevels = getMaturityLevels(quickWins);
    const suggestions: { dimension: MaturityDimension; milestone: MilestoneDefinition }[] = [];

    MaturityDimensions.forEach(dim => {
      const currentLevel = currentLevels[dim];
      const nextLevel = currentLevel + 1;
      const milestoneDef = MaturityCatalog[dim].find(m => m.level === nextLevel);

      if (milestoneDef) {
        suggestions.push({
          dimension: dim,
          milestone: milestoneDef,
        });
      }
    });

    return suggestions;
  };

  const getOverallMaturityScore = (quickWins: QuickWin[]) => {
    const levels = getMaturityLevels(quickWins);
    let totalScore = 0;
    const MAX_MATURITY_LEVEL = 4;
    const maxScore = MaturityDimensions.length * MAX_MATURITY_LEVEL; // 5 dimensions * 4 levels

    Object.values(levels).forEach(level => {
      totalScore += level;
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  return {
    getMaturityLevels,
    getNextMilestones,
    getOverallMaturityScore,
  };
});
