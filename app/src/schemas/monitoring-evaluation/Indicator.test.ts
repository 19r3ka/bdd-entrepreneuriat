import { describe, it, expect } from 'vitest';
import { IndicatorDefinitionSchema, MeasurementSchema } from './Indicator';

const validUUID = '123e4567-e89b-12d3-a456-426614174000';
const validUUID2 = '123e4567-e89b-12d3-a456-426614174001';

describe('IndicatorDefinitionSchema', () => {
  const validIndicator = {
    id: validUUID,
    businessId: validUUID2,
    type: 'standard', // StandardIndicator has type: 'standard'
    name: 'Revenue Growth',
    description: 'Increase in monthly revenue',
    unit: 'count', // Use one of the valid units from IndicatorUnitEnum
    baseline: 1000,
    baselineDate: new Date().toISOString(),
    target: 2000,
    targetDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should validate a valid indicator object', () => {
    const result = IndicatorDefinitionSchema.safeParse(validIndicator);
    expect(result.success).toBe(true);
  });

  it('should invalidate an indicator object with missing required fields', () => {
    const invalidIndicator = {
      ...validIndicator,
      name: undefined,
    };
    const result = IndicatorDefinitionSchema.safeParse(invalidIndicator);
    expect(result.success).toBe(false);
  });

  it('should require type to be "standard" for StandardIndicator', () => {
    const invalidTypeIndicator = {
      ...validIndicator,
      type: 'INVALID_TYPE',
    };
    const result = IndicatorDefinitionSchema.safeParse(invalidTypeIndicator);
    expect(result.success).toBe(false);
  });
});

describe('MeasurementSchema', () => {
  const validMeasurement = {
    id: validUUID,
    indicatorId: validUUID2,
    currentValue: 1500,
    dateRecorded: new Date().toISOString(), // Use ISO string instead of Date object
    evidenceSource: 'file-id-123',
    contributionNarrative: 'Revenue increased due to new marketing campaign',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should validate a valid measurement object', () => {
    const result = MeasurementSchema.safeParse(validMeasurement);
    expect(result.success).toBe(true);
  });

  it('should invalidate a measurement object with missing evidenceSource', () => {
    const invalidMeasurement = {
      ...validMeasurement,
      evidenceSource: '', // Empty string should fail min(1)
    };
    const result = MeasurementSchema.safeParse(invalidMeasurement);
    expect(result.success).toBe(false);
  });

  it('should invalidate a measurement object with missing contributionNarrative', () => {
    const invalidMeasurement = {
      ...validMeasurement,
      contributionNarrative: '', // Empty string should fail min(1)
    };
    const result = MeasurementSchema.safeParse(invalidMeasurement);
    expect(result.success).toBe(false);
  });
});
