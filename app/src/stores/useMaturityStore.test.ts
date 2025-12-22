import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useMaturityStore } from './useMaturityStore';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

vi.mock('./useQuickWinStore');

describe('useMaturityStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockQuickWins: QuickWin[] = [
    {
      id: 'qw1',
      businessId: 'b1',
      title: 'Digital Presence',
      category: 'digital_adoption',
      dimension: 'Digital',
      milestone: 1,
      resultSummary: 'Website launched',
      achievedOn: new Date('2025-01-01'),
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: [],
    },
    {
      id: 'qw2',
      businessId: 'b1',
      title: 'Advanced Digital Tools',
      category: 'digital_adoption',
      dimension: 'Digital',
      milestone: 2,
      resultSummary: 'CRM implemented',
      achievedOn: new Date('2025-02-01'),
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: [],
    },
    {
      id: 'qw3',
      businessId: 'b1',
      title: 'Business Registration',
      category: 'finance_access',
      dimension: 'Formalization',
      milestone: 1,
      resultSummary: 'Registered the business',
      achievedOn: new Date('2025-03-01'),
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: [],
    },
    {
      id: 'qw4',
      businessId: 'b1',
      title: 'Opened Bank Account',
      category: 'finance_access',
      dimension: 'Finance',
      milestone: 1,
      resultSummary: 'Opened a corporate bank account',
      achievedOn: new Date('2025-04-01'),
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: [],
    },
  ];

  it('getMaturityLevels should calculate the highest milestone for each dimension', () => {
    const store = useMaturityStore();
    const levels = store.getMaturityLevels(mockQuickWins);

    expect(levels.Digital).toBe(2);
    expect(levels.Formalization).toBe(1);
    expect(levels.Finance).toBe(1);
    expect(levels.Market).toBe(0);
    expect(levels.Green).toBe(0);
  });

  it('getNextMilestones should suggest the next steps', () => {
    const store = useMaturityStore();
    const nextMilestones = store.getNextMilestones(mockQuickWins);

    const digitalSuggestion = nextMilestones.find(m => m.dimension === 'Digital');
    const formalizationSuggestion = nextMilestones.find(m => m.dimension === 'Formalization');
    const financeSuggestion = nextMilestones.find(m => m.dimension === 'Finance');
    const marketSuggestion = nextMilestones.find(m => m.dimension === 'Market');
    const greenSuggestion = nextMilestones.find(m => m.dimension === 'Green');

    const NEXT_DIGITAL_MILESTONE = 3;
    const NEXT_FORMALIZATION_MILESTONE = 2;
    const NEXT_FINANCE_MILESTONE = 2;
    const NEXT_MARKET_MILESTONE = 1;
    const NEXT_GREEN_MILESTONE = 1;

    expect(digitalSuggestion?.milestone.level).toBe(NEXT_DIGITAL_MILESTONE);
    expect(formalizationSuggestion?.milestone.level).toBe(NEXT_FORMALIZATION_MILESTONE);
    expect(financeSuggestion?.milestone.level).toBe(NEXT_FINANCE_MILESTONE);
    expect(marketSuggestion?.milestone.level).toBe(NEXT_MARKET_MILESTONE);
    expect(greenSuggestion?.milestone.level).toBe(NEXT_GREEN_MILESTONE);
  });

  it('getOverallMaturityScore should calculate the correct percentage', () => {
    const store = useMaturityStore();
    const score = store.getOverallMaturityScore(mockQuickWins);

    // Digital: 2, Formalization: 1, Finance: 1, Market: 0, Green: 0
    // Total score = 2 + 1 + 1 + 0 + 0 = 4
    // Max score = 5 dimensions * 4 levels = 20
    // Percentage = (4 / 20) * 100 = 20
    const EXPECTED_MATURITY_SCORE = 20;
    expect(score).toBe(EXPECTED_MATURITY_SCORE);
  });

  it('getMaturityLevels should return all zeros for no quick wins', () => {
    const store = useMaturityStore();
    const levels = store.getMaturityLevels([]);

    expect(levels.Digital).toBe(0);
    expect(levels.Formalization).toBe(0);
    expect(levels.Finance).toBe(0);
    expect(levels.Market).toBe(0);
    expect(levels.Green).toBe(0);
  });

  it('getNextMilestones should suggest level 1 for all dimensions for no quick wins', () => {
    const store = useMaturityStore();
    const nextMilestones = store.getNextMilestones([]);

    const EXPECTED_DIMENSIONS_COUNT = 5;
    expect(nextMilestones.length).toBe(EXPECTED_DIMENSIONS_COUNT);
    expect(nextMilestones.every(m => m.milestone.level === 1)).toBe(true);
  });

  it('getOverallMaturityScore should be 0 for no quick wins', () => {
    const store = useMaturityStore();
    const score = store.getOverallMaturityScore([]);
    expect(score).toBe(0);
  });
});
