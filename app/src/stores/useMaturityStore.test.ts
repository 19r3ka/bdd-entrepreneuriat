import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useMaturityStore } from './useMaturityStore'
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
import { useQuickWinStore } from './useQuickWinStore'

vi.mock('./useQuickWinStore', () => ({
  useQuickWinStore: vi.fn(() => ({
    // Mock any necessary state or actions from useQuickWinStore if needed
  }))
}))

describe('useMaturityStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockQuickWins: QuickWin[] = [
    {
      id: 'qw1',
      businessId: 'b1',
      title: 'Digital Presence',
      category: 'digital_adoption',
      dimension: 'Digital',
      milestone: 1,
      resultSummary: 'Website launched',
      achievedOn: '2025-01-01',
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: []
    },
    {
      id: 'qw2',
      businessId: 'b1',
      title: 'Advanced Digital Tools',
      category: 'digital_adoption',
      dimension: 'Digital',
      milestone: 2,
      resultSummary: 'CRM implemented',
      achievedOn: '2025-02-01',
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: []
    },
    {
      id: 'qw3',
      businessId: 'b1',
      title: 'Business Registration',
      category: 'finance_access',
      dimension: 'Formalization',
      milestone: 1,
      resultSummary: 'Registered the business',
      achievedOn: '2025-03-01',
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: []
    },
    {
      id: 'qw4',
      businessId: 'b1',
      title: 'Opened Bank Account',
      category: 'finance_access',
      dimension: 'Finance',
      milestone: 1,
      resultSummary: 'Opened a corporate bank account',
      achievedOn: '2025-04-01',
      rbmLevel: 'output',
      indicatorValues: [],
      evidenceIds: [],
      tags: []
    }
  ]

  it('getMaturityLevels should calculate the highest milestone for each dimension', () => {
    const store = useMaturityStore()
    const levels = store.getMaturityLevels(mockQuickWins)

    expect(levels.Digital).toBe(2)
    expect(levels.Formalization).toBe(1)
    expect(levels.Finance).toBe(1)
    expect(levels.Market).toBe(0)
    expect(levels.Green).toBe(0)
  })

  it('getNextMilestones should suggest the next steps', () => {
    const store = useMaturityStore()
    const nextMilestones = store.getNextMilestones(mockQuickWins)

    const digitalSuggestion = nextMilestones.find((m) => m.dimension === 'Digital')
    const formalizationSuggestion = nextMilestones.find((m) => m.dimension === 'Formalization')
    const financeSuggestion = nextMilestones.find((m) => m.dimension === 'Finance')
    const marketSuggestion = nextMilestones.find((m) => m.dimension === 'Market')
    const greenSuggestion = nextMilestones.find((m) => m.dimension === 'Green')

    expect(digitalSuggestion?.milestone.level).toBe(3)
    expect(formalizationSuggestion?.milestone.level).toBe(2)
    expect(financeSuggestion?.milestone.level).toBe(2)
    expect(marketSuggestion?.milestone.level).toBe(1)
    expect(greenSuggestion?.milestone.level).toBe(1)
  })

  it('getOverallMaturityScore should calculate the correct percentage', () => {
    const store = useMaturityStore()
    const score = store.getOverallMaturityScore(mockQuickWins)

    // Digital: 2, Formalization: 1, Finance: 1, Market: 0, Green: 0
    // Total score = 2 + 1 + 1 + 0 + 0 = 4
    // Max score = 5 dimensions * 4 levels = 20
    // Percentage = (4 / 20) * 100 = 20
    expect(score).toBe(20)
  })

  it('getMaturityLevels should return all zeros for no quick wins', () => {
    const store = useMaturityStore()
    const levels = store.getMaturityLevels([])

    expect(levels.Digital).toBe(0)
    expect(levels.Formalization).toBe(0)
    expect(levels.Finance).toBe(0)
    expect(levels.Market).toBe(0)
    expect(levels.Green).toBe(0)
  })

  it('getNextMilestones should suggest level 1 for all dimensions for no quick wins', () => {
    const store = useMaturityStore()
    const nextMilestones = store.getNextMilestones([])

    expect(nextMilestones.length).toBe(5)
    expect(nextMilestones.every((m) => m.milestone.level === 1)).toBe(true)
  })

  it('getOverallMaturityScore should be 0 for no quick wins', () => {
    const store = useMaturityStore()
    const score = store.getOverallMaturityScore([])
    expect(score).toBe(0)
  })
})