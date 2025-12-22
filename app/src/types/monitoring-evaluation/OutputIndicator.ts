export type OutputIndicator = {
  id: string;
  name: string;
  description?: string;
  category?:
    | 'capacity_development'
    | 'access_to_finance'
    | 'market_access'
    | 'policy_regulatory'
    | 'innovation_sustainability'
    | 'digital_transformation';
  unit: 'count' | 'percent' | 'boolean' | 'hours' | 'currency' | 'index' | 'text';
  type: 'output';
  irrfIndicatorCode?: string;
  cpdOutputCode?: string;
  sdgTargets?: string[];
  isStandard: boolean;
  usageCount: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
};
