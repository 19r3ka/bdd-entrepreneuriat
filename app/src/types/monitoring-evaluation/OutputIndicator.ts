export type OutputIndicator = {
  id: string
  name: string
  description?: string
  category?:
    | 'capacity_development'
    | 'access_to_finance'
    | 'market_access'
    | 'policy_regulatory'
    | 'innovation_sustainability'
    | 'digital_transformation'
  unit: 'count' | 'percent' | 'boolean' | 'hours' | 'currency' | 'index' | 'text'
  irrfIndicatorCode?: string
  cpdOutputCode?: string
  sdgTargets?: string[]
  isStandard: boolean
  usageCount: number
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}
