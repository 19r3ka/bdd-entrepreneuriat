import { z } from 'zod';

export const RBM_LEVEL_OPTIONS = ['input', 'output', 'outcome', 'impact'] as const;
export const RBMLevelEnum = z.enum(RBM_LEVEL_OPTIONS);
export type RBMLevel = z.infer<typeof RBMLevelEnum>;

export const INDICATOR_UNIT_OPTIONS = [
  'count',
  'percent',
  'boolean',
  'hours',
  'currency',
  'index',
  'text',
] as const;
export const IndicatorUnitEnum = z.enum(INDICATOR_UNIT_OPTIONS);
export type IndicatorUnit = z.infer<typeof IndicatorUnitEnum>;

export const DIMENSION_OPTIONS = [
  'Digital',
  'Finance',
  'Market',
  'Green',
  'Formalization',
] as const;
export const DimensionEnum = z.enum(DIMENSION_OPTIONS);
export type Dimension = z.infer<typeof DimensionEnum>;
