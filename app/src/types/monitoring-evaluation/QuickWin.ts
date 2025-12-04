export type QuickWinIndicatorValue = {
  indicatorId: string
  baseline?: number
  target?: number
  currentValue?: number | boolean | string
  currency?: string
  notes?: string
}

export type QuickWin = {
  id: string
  businessId: string
  supportBoostId?: string
  title: string
  category:
    | 'digital_adoption'
    | 'finance_access'
    | 'market_integration'
    | 'innovation'
    | 'performance'
    | 'employment_inclusion'
    | 'resilience'
    | 'sustainability'
  dimension?: string
  milestone?: number
  resultSummary: string
  achievedOn: string
  rbmLevel: 'output'
  cpdOutputCode?: string
  spOutcomeCode?: string
  irrfIndicatorIds?: string[]
  sdgTargets?: string[]
  genderMarker?: 'GEN0' | 'GEN1' | 'GEN2' | 'GEN3'
  indicatorValues: QuickWinIndicatorValue[]
  evidenceIds: string[]
  tags: string[]
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}
