import { describe, it, expect } from 'vitest';
import { OutputIndicatorSchema } from './OutputIndicator';

describe('OutputIndicatorSchema', () => {
  const validOutputIndicator = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'MSMEs trained in financial literacy',
    description: 'Number of MSMEs that completed financial literacy training',
    unit: 'count', // IndicatorUnitEnum value
    type: 'output', // OutputIndicator has type: 'output'
    category: 'capacity_development',
    isStandard: true,
    sdgTargets: ['SDG1', 'SDG8'],
    irrfIndicatorCode: 'IRRF123',
    cpdOutputCode: 'CPD456',
    createdAt: new Date().toISOString(), // ISO string instead of custom field
    updatedAt: new Date().toISOString(), // ISO string instead of custom field
  };

  it('should accept valid output indicator data', () => {
    const result = OutputIndicatorSchema.safeParse(validOutputIndicator);
    expect(result.success).toBe(true);
  });

  it('should reject output indicator with invalid UUID', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      id: 'invalid-uuid',
    };
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator);
    expect(result.success).toBe(false);
  });

  it('should reject output indicator with missing required fields', () => {
    const incompleteOutputIndicator = {
      ...validOutputIndicator,
      name: '', // Missing required field
    };
    const result = OutputIndicatorSchema.safeParse(incompleteOutputIndicator);
    expect(result.success).toBe(false);
  });

  it('should accept output indicator with valid category values', () => {
    const categories = [
      'capacity_development',
      'access_to_finance',
      'market_access',
      'policy_regulatory',
      'innovation_sustainability',
      'digital_transformation',
    ];

    for (const category of categories) {
      const outputIndicator = {
        ...validOutputIndicator,
        category: category,
      };
      const result = OutputIndicatorSchema.safeParse(outputIndicator);
      expect(result.success).toBe(true);
    }
  });

  it('should reject output indicator with invalid category', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      category: 'invalid_category' as any,
    };
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator);
    expect(result.success).toBe(false);
  });

  it('should accept output indicator with valid unit values', () => {
    const units = ['count', 'percent', 'boolean', 'hours', 'currency', 'index', 'text'];

    for (const unit of units) {
      const outputIndicator = {
        ...validOutputIndicator,
        unit: unit,
      };
      const result = OutputIndicatorSchema.safeParse(outputIndicator);
      expect(result.success).toBe(true);
    }
  });

  it('should reject output indicator with invalid unit', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      unit: 'invalid_unit' as any,
    };
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator);
    expect(result.success).toBe(false);
  });

  it('should accept output indicator with optional fields omitted', () => {
    const outputIndicatorWithoutOptionals = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'MSMEs trained',
      unit: 'count',
      type: 'output', // type is required
    };
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithoutOptionals);
    expect(result.success).toBe(true);
  });

  it('should have default value for isStandard and usageCount', () => {
    const outputIndicatorWithoutIsStandard = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Indicator',
      unit: 'count',
      type: 'output', // type is required
    };
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithoutIsStandard);
    expect(result.success).toBe(true);

    // Check that default is applied
    if (result.success) {
      expect(result.data.isStandard).toBe(false);
      expect(result.data.usageCount).toBe(0);
    }
  });

  it('should have correct type literal', () => {
    const result = OutputIndicatorSchema.safeParse(validOutputIndicator);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('output');
    }
  });
});
