export const IndicatorCatalog = [
  {
    category: 'performance',
    indicators: [
      {
        name: 'Revenue growth %',
        unit: 'percent',
        irrfCode: 'IRRF-1.1.2',
        sdgTargets: ['8.3'],
        disagg: false
      },
      { name: 'Productivity index', unit: 'index', sdgTargets: ['9.2'], disagg: false },
      { name: 'Cost reduction %', unit: 'percent', disagg: false },
      { name: 'Customer acquisition (count)', unit: 'count', disagg: false }
    ]
  },
  {
    category: 'employment_inclusion',
    indicators: [
      {
        name: 'Jobs created',
        unit: 'count',
        genderDisagg: true,
        sdgTargets: ['8.5'],
        irrfCode: 'IRRF-2.3.1',
        disagg: true
      },
      { name: 'Jobs retained', unit: 'count', genderDisagg: true, disagg: true },
      { name: 'Youth employed', unit: 'count', sdgTargets: ['8.6'], disagg: true }
    ]
  },
  {
    category: 'finance_access',
    indicators: [
      { name: 'Loans secured', unit: 'count', sdgTargets: ['8.3'] },
      { name: 'Capital mobilized', unit: 'currency', currency: 'USD' },
      { name: 'Credit approval rate %', unit: 'percent' }
    ]
  },
  {
    category: 'digital_adoption',
    indicators: [
      { name: 'E-commerce storefront launched', unit: 'boolean' },
      { name: 'Products listed online', unit: 'count' },
      { name: 'Online sales volume', unit: 'currency', currency: 'USD' },
      { name: 'Digital payment integration', unit: 'boolean' }
    ]
  },
  {
    category: 'market_integration',
    indicators: [
      {
        name: 'New markets entered',
        unit: 'count',
        irrfCode: 'IRRF-1.2.1',
        sdgTargets: ['17.11'],
        disagg: false
      },
      { name: 'Export readiness score', unit: 'index', disagg: false },
      { name: 'Partnerships established', unit: 'count', sdgTargets: ['17.17'], disagg: false }
    ]
  },
  {
    category: 'innovation',
    indicators: [
      { name: 'New products/services launched', unit: 'count' },
      { name: 'R&D investment', unit: 'currency', currency: 'USD' }
    ]
  },
  {
    category: 'sustainability',
    indicators: [
      { name: 'Energy saved %', unit: 'percent' },
      { name: 'Green certification obtained', unit: 'boolean' },
      { name: 'Waste reduction %', unit: 'percent' }
    ]
  },
  {
    category: 'resilience',
    indicators: [
      { name: 'Business continuity plan adopted', unit: 'boolean' },
      { name: 'Revenue diversification index', unit: 'index' }
    ]
  }
]

export const QuickWinCategories = [
  { label: 'Digital Adoption', value: 'digital_adoption' },
  { label: 'Finance Access', value: 'finance_access' },
  { label: 'Market Integration', value: 'market_integration' },
  { label: 'Innovation / Sustainability', value: 'innovation' },
  { label: 'Performance', value: 'performance' },
  { label: 'Employment & Inclusion', value: 'employment_inclusion' },
  { label: 'Resilience', value: 'resilience' },
  { label: 'Sustainability', value: 'sustainability' }
]
