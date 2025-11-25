export enum IndicatorType {
  Economic = 'Economic',
  Behavioral = 'Behavioral',
  Institutional = 'Institutional',
}

export type IndicatorDefinition = {
  id: string;
  businessId: string;
  type: IndicatorType;
  name: string;
  description?: string;
  baselineValue: number;
  baselineDate: Date;
  targetValue: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Measurement = {
  id: string;
  indicatorId: string;
  currentValue: number;
  dateRecorded: Date;
  evidenceSource: string; // Assuming this will be a reference to an uploaded file's ID
  contributionNarrative: string;
  createdAt: Date;
  updatedAt: Date;
};
