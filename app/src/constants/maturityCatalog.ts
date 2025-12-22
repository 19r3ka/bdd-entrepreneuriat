export const MaturityDimensions = [
  'Digital',
  'Finance',
  'Market',
  'Green',
  'Formalization',
] as const;

export type MaturityDimension = (typeof MaturityDimensions)[number];

export interface MilestoneDefinition {
  level: number;
  name: string; // Mapped from "label" in JSON
  description: string; // Will infer or keep generic if not in JSON
  requiredIndicators: {
    name: string;
    unit: 'boolean' | 'count' | 'percent' | 'currency' | 'index' | 'hours';
    mustEqual?: boolean;
    min?: number;
    targetValue?: number | boolean; // Keeping for backward compat if needed, but JSON uses min/mustEqual
    irrfCode?: string;
    sdgTargets?: string[];
    lnobFlags?: {
      genderDisagg: boolean;
      youthDisagg: boolean;
      disabilityDisagg: boolean;
    };
  }[];
  requiredEvidence: string[];
  suggestedSupport: string; // Mapped from suggestedSupportCategories (simplified for now)
  expectedQuickWins: string[];
  outcomeToTrack?: {
    name: string;
    unit: 'boolean' | 'count' | 'percent' | 'currency' | 'index' | 'hours';
    sustainRule: {
      min?: number;
      mustEqual?: boolean;
      periods: number;
    };
    irrfCode?: string;
    sdgTargets?: string[];
    lnobFlags?: {
      genderDisagg: boolean;
      youthDisagg: boolean;
      disabilityDisagg: boolean;
    };
  }[];
}

export const MaturityCatalog: Record<MaturityDimension, MilestoneDefinition[]> = {
  Digital: [
    {
      level: 1,
      name: 'Basic connectivity',
      description: 'Business has verified internet access.',
      requiredIndicators: [
        {
          name: 'Internet access',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-DIG-1',
          sdgTargets: ['9.c'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['photo', 'bill', 'certificate'],
      suggestedSupport: 'Digitalization Support',
      expectedQuickWins: ['Connectivity verified'],
      outcomeToTrack: [
        {
          name: 'Uptime',
          unit: 'percent',
          sustainRule: { min: 90, periods: 2 },
          irrfCode: 'IRRF-DIG-1A',
          sdgTargets: ['9.c'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 2,
      name: 'Online presence',
      description: 'Business has a visible online presence.',
      requiredIndicators: [
        {
          name: 'Website launched',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-DIG-2',
          sdgTargets: ['9.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
        {
          name: 'Products listed',
          unit: 'count',
          min: 10,
          irrfCode: 'IRRF-DIG-2B',
          sdgTargets: ['8.3', '9.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['screenshot', 'url'],
      suggestedSupport: 'Advisory Mentoring',
      expectedQuickWins: ['Company website live'],
      outcomeToTrack: [
        {
          name: 'Products listed',
          unit: 'count',
          sustainRule: { min: 10, periods: 1 },
          irrfCode: 'IRRF-DIG-2B',
          sdgTargets: ['8.3', '9.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 3,
      name: 'E-commerce enabled',
      description: 'Business can sell products or services online.',
      requiredIndicators: [
        {
          name: 'Digital payment integration',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-DIG-3',
          sdgTargets: ['8.3', '9.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
        {
          name: 'Online sales volume',
          unit: 'currency',
          min: 100000,
          irrfCode: 'IRRF-DIG-3A',
          sdgTargets: ['8.2', '8.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['screenshot', 'integration-confirmation'],
      suggestedSupport: 'Partnership Linkage',
      expectedQuickWins: ['Storefront launched'],
      outcomeToTrack: [
        {
          name: 'Online sales volume',
          unit: 'currency',
          sustainRule: { min: 100000, periods: 2 },
          irrfCode: 'IRRF-DIG-3A',
          sdgTargets: ['8.2', '8.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 4,
      name: 'Advanced analytics',
      description: 'Business uses data analytics to drive decisions.',
      requiredIndicators: [
        {
          name: 'Analytics dashboard active',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-DIG-4',
          sdgTargets: ['9.5'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['screenshot', 'dashboard-export'],
      suggestedSupport: 'Advisory Mentoring',
      expectedQuickWins: ['Analytics configured'],
      outcomeToTrack: [
        {
          name: 'Conversion rate',
          unit: 'percent',
          sustainRule: { min: 2.0, periods: 2 },
          irrfCode: 'IRRF-DIG-4A',
          sdgTargets: ['9.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
  ],
  Finance: [
    {
      level: 1,
      name: 'Basic bookkeeping',
      description: 'Business maintains basic financial records.',
      requiredIndicators: [
        {
          name: 'Bookkeeping system in place',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FIN-1',
          sdgTargets: ['8.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['ledger-screenshot', 'software-invoice'],
      suggestedSupport: 'Training',
      expectedQuickWins: ['Bookkeeping enabled'],
      outcomeToTrack: [
        {
          name: 'Monthly close rate',
          unit: 'percent',
          sustainRule: { min: 80, periods: 2 },
          irrfCode: 'IRRF-FIN-1A',
          sdgTargets: ['8.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 2,
      name: 'Bank account opened',
      description: 'Business has a formal bank account.',
      requiredIndicators: [
        {
          name: 'Business bank account',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FIN-2',
          sdgTargets: ['8.10'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['bank-letter', 'account-statement'],
      suggestedSupport: 'Financial Grant',
      expectedQuickWins: ['Account active'],
      outcomeToTrack: [
        {
          name: 'Average monthly deposits',
          unit: 'currency',
          sustainRule: { min: 50000, periods: 2 },
          irrfCode: 'IRRF-FIN-2A',
          sdgTargets: ['8.10'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 3,
      name: 'Loan secured',
      description: 'Business has successfully accessed credit.',
      requiredIndicators: [
        {
          name: 'Loans secured',
          unit: 'count',
          min: 1,
          irrfCode: 'IRRF-FIN-3',
          sdgTargets: ['8.3', '8.10'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['loan-agreement'],
      suggestedSupport: 'Financial Grant',
      expectedQuickWins: ['Loan approval'],
      outcomeToTrack: [
        {
          name: 'Capital mobilized',
          unit: 'currency',
          sustainRule: { min: 200000, periods: 1 },
          irrfCode: 'IRRF-FIN-3A',
          sdgTargets: ['8.3', '8.10'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 4,
      name: 'Access to blended finance',
      description: 'Business accesses diverse funding sources.',
      requiredIndicators: [
        {
          name: 'Blended finance instrument accessed',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FIN-4',
          sdgTargets: ['17.3', '17.17'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['agreement', 'program-acceptance'],
      suggestedSupport: 'Partnership Linkage',
      expectedQuickWins: ['Investment readiness'],
      outcomeToTrack: [
        {
          name: 'Debt service coverage ratio',
          unit: 'index',
          sustainRule: { min: 1.2, periods: 2 },
          irrfCode: 'IRRF-FIN-4A',
          sdgTargets: ['8.2', '17.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
  ],
  Market: [
    {
      level: 1,
      name: 'Local sales only',
      description: 'Business operates and sells within the local community.',
      requiredIndicators: [
        {
          name: 'Local customers',
          unit: 'count',
          min: 10,
          irrfCode: 'IRRF-MKT-1',
          sdgTargets: ['8.2'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['receipts', 'POS-report'],
      suggestedSupport: 'Market Access',
      expectedQuickWins: ['Local channel activated'],
      outcomeToTrack: [
        {
          name: 'Repeat purchase rate',
          unit: 'percent',
          sustainRule: { min: 20, periods: 2 },
          irrfCode: 'IRRF-MKT-1A',
          sdgTargets: ['8.2'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 2,
      name: 'Regional expansion',
      description: 'Business sells to other regions within the country.',
      requiredIndicators: [
        {
          name: 'New market entries',
          unit: 'count',
          min: 1,
          irrfCode: 'IRRF-MKT-2',
          sdgTargets: ['9.1'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['distribution-agreement', 'regional-license'],
      suggestedSupport: 'Partnership Linkage',
      expectedQuickWins: ['Regional distributor signed'],
      outcomeToTrack: [
        {
          name: 'Regional sales volume',
          unit: 'currency',
          sustainRule: { min: 150000, periods: 2 },
          irrfCode: 'IRRF-MKT-2A',
          sdgTargets: ['8.2', '9.1'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 3,
      name: 'Export readiness',
      description: 'Business is ready to export or has started exporting.',
      requiredIndicators: [
        {
          name: 'Export readiness score',
          unit: 'index',
          min: 0.7,
          irrfCode: 'IRRF-MKT-3',
          sdgTargets: ['17.11'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['compliance-checklist', 'quality-cert'],
      suggestedSupport: 'Policy Advocacy',
      expectedQuickWins: ['Export compliance passed'],
      outcomeToTrack: [
        {
          name: 'Export sales',
          unit: 'currency',
          sustainRule: { min: 300000, periods: 1 },
          irrfCode: 'IRRF-MKT-3A',
          sdgTargets: ['17.11'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 4,
      name: 'International partnerships',
      description: 'Business has established international partnerships.',
      requiredIndicators: [
        {
          name: 'MoUs signed',
          unit: 'count',
          min: 1,
          irrfCode: 'IRRF-MKT-4',
          sdgTargets: ['17.17'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['MoU-document'],
      suggestedSupport: 'Partnership Linkage',
      expectedQuickWins: ['Partnership formalized'],
      outcomeToTrack: [
        {
          name: 'Partnership performance index',
          unit: 'index',
          sustainRule: { min: 0.6, periods: 2 },
          irrfCode: 'IRRF-MKT-4A',
          sdgTargets: ['17.17'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
  ],
  Green: [
    {
      level: 1,
      name: 'Awareness of sustainability',
      description: 'Business is aware of sustainability practices.',
      requiredIndicators: [
        {
          name: 'Sustainability policy adopted',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-GRN-1',
          sdgTargets: ['12.6'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['policy-document'],
      suggestedSupport: 'Training',
      expectedQuickWins: ['Policy issued'],
      outcomeToTrack: [
        {
          name: 'Training hours on sustainability',
          unit: 'hours',
          sustainRule: { min: 10, periods: 1 },
          irrfCode: 'IRRF-GRN-1A',
          sdgTargets: ['12.8'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 2,
      name: 'Energy efficiency measures',
      description: 'Business has implemented energy or waste efficiency measures.',
      requiredIndicators: [
        {
          name: 'Energy saved %',
          unit: 'percent',
          min: 5,
          irrfCode: 'IRRF-GRN-2',
          sdgTargets: ['7.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['audit-report'],
      suggestedSupport: 'Equipment Infrastructure',
      expectedQuickWins: ['Efficiency upgrade completed'],
      outcomeToTrack: [
        {
          name: 'Energy saved %',
          unit: 'percent',
          sustainRule: { min: 5, periods: 2 },
          irrfCode: 'IRRF-GRN-2A',
          sdgTargets: ['7.3'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 3,
      name: 'Green certification',
      description: 'Business has obtained a recognized green certification.',
      requiredIndicators: [
        {
          name: 'Certification obtained',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-GRN-3',
          sdgTargets: ['12.6', '12.5'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['certificate'],
      suggestedSupport: 'Advisory Mentoring',
      expectedQuickWins: ['Certification passed'],
      outcomeToTrack: [
        {
          name: 'Waste reduction %',
          unit: 'percent',
          sustainRule: { min: 10, periods: 2 },
          irrfCode: 'IRRF-GRN-3A',
          sdgTargets: ['12.5'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
    {
      level: 4,
      name: 'Circular economy practices',
      description: 'Business practices circular economy principles.',
      requiredIndicators: [
        {
          name: 'Recycled inputs share %',
          unit: 'percent',
          min: 20,
          irrfCode: 'IRRF-GRN-4',
          sdgTargets: ['12.5', '12.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
      requiredEvidence: ['supplier-attestations', 'inventory-audit'],
      suggestedSupport: 'Partnership Linkage',
      expectedQuickWins: ['Circular supply in place'],
      outcomeToTrack: [
        {
          name: 'Recycled inputs share %',
          unit: 'percent',
          sustainRule: { min: 20, periods: 2 },
          irrfCode: 'IRRF-GRN-4A',
          sdgTargets: ['12.5', '12.2'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
  ],
  Formalization: [
    {
      level: 1,
      name: 'Informal',
      description: 'Business is operating informally.',
      requiredIndicators: [
        {
          name: 'Registered business',
          unit: 'boolean',
          mustEqual: false,
          irrfCode: 'IRRF-FRM-1',
          sdgTargets: ['8.3'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: [],
      suggestedSupport: 'Policy Advocacy',
      expectedQuickWins: ['Pre-registration counseling'],
      outcomeToTrack: [
        {
          name: 'Registration intent',
          unit: 'boolean',
          sustainRule: { mustEqual: true, periods: 1 },
          irrfCode: 'IRRF-FRM-1A',
          sdgTargets: ['8.3'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 2,
      name: 'Registered',
      description: 'Business is legally registered.',
      requiredIndicators: [
        {
          name: 'Company registration',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FRM-2',
          sdgTargets: ['8.3', '16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['registration-certificate'],
      suggestedSupport: 'Policy Advocacy',
      expectedQuickWins: ['Registration completed'],
      outcomeToTrack: [
        {
          name: 'Compliance filings on time',
          unit: 'percent',
          sustainRule: { min: 80, periods: 2 },
          irrfCode: 'IRRF-FRM-2A',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 3,
      name: 'Tax compliant',
      description: 'Business is compliant with tax regulations.',
      requiredIndicators: [
        {
          name: 'Tax ID obtained',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FRM-3',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
        {
          name: 'Tax filings submitted',
          unit: 'count',
          min: 1,
          irrfCode: 'IRRF-FRM-3B',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['tax-id', 'filing-receipts'],
      suggestedSupport: 'Advisory Mentoring',
      expectedQuickWins: ['Tax compliance achieved'],
      outcomeToTrack: [
        {
          name: 'On-time filing rate',
          unit: 'percent',
          sustainRule: { min: 80, periods: 2 },
          irrfCode: 'IRRF-FRM-3A',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
    },
    {
      level: 4,
      name: 'Governance structure in place',
      description: 'Business has a formal governance structure.',
      requiredIndicators: [
        {
          name: 'Board or governance charter',
          unit: 'boolean',
          mustEqual: true,
          irrfCode: 'IRRF-FRM-4',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: true, youthDisagg: true, disabilityDisagg: true },
        },
      ],
      requiredEvidence: ['governance-charter'],
      suggestedSupport: 'Advisory Mentoring',
      expectedQuickWins: ['Governance adopted'],
      outcomeToTrack: [
        {
          name: 'Board meeting frequency',
          unit: 'count',
          sustainRule: { min: 2, periods: 2 },
          irrfCode: 'IRRF-FRM-4A',
          sdgTargets: ['16.6'],
          lnobFlags: { genderDisagg: false, youthDisagg: false, disabilityDisagg: false },
        },
      ],
    },
  ],
};
