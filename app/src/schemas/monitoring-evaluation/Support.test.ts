import { describe, it, expect } from 'vitest';
import { SupportSchema, SupportModalityEnum, FinanceInstrumentEnum, FinanceSourceEnum } from './Support';

describe('SupportSchema', () => {
  const commonSupport = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    businessId: '123e4567-e89b-12d3-a456-426614174001',
    modality: SupportModalityEnum.enum.POLICY,
    description: 'Provided policy guidance',
    theoryOfChange: 'Improved policy leads to better outcomes',
    sesRiskCategory: 'Low',
    genderMarker: 'GEN0',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid support object', () => {
    expect(() => SupportSchema.parse(commonSupport)).not.toThrow();
  });

  it('should validate a support object with GRANT modality and financeDetails', () => {
    const grantSupport = {
      ...commonSupport,
      modality: SupportModalityEnum.enum.GRANT,
      financeDetails: {
        instrument: FinanceInstrumentEnum.enum.Grant,
        source: FinanceSourceEnum.enum.UNDP_DIRECT,
        amount: 10000,
      },
    };
    expect(() => SupportSchema.parse(grantSupport)).not.toThrow();
  });

  it('should invalidate a support object with GRANT modality but no financeDetails', () => {
    const invalidGrantSupport = {
      ...commonSupport,
      modality: SupportModalityEnum.enum.GRANT,
      financeDetails: undefined,
    };
    expect(() => SupportSchema.parse(invalidGrantSupport)).toThrowError('Finance details are required for this modality');
  });

  it('should invalidate a support object with missing required fields', () => {
    const invalidSupport = {
      ...commonSupport,
      description: undefined, // Missing required field
    };
    // Zod's parse will throw an error with details about the missing field
    expect(() => SupportSchema.parse(invalidSupport)).toThrow();
    // expect(() => SupportSchema.parse(invalidSupport)).toThrowErrorMatchingSnapshot();
  });

  it('should invalidate a support object with invalid enum values', () => {
    const invalidModalitySupport = {
      ...commonSupport,
      modality: 'INVALID_MODALITY', // Invalid enum value
    };
    expect(() => SupportSchema.parse(invalidModalitySupport)).toThrow();
    // expect(() => SupportSchema.parse(invalidModalitySupport)).toThrowErrorMatchingSnapshot();
  });

  it('should invalidate financeDetails with negative amount', () => {
    const invalidFinanceAmount = {
      ...commonSupport,
      modality: SupportModalityEnum.enum.GRANT,
      financeDetails: {
        instrument: FinanceInstrumentEnum.enum.Grant,
        source: FinanceSourceEnum.enum.UNDP_DIRECT,
        amount: -100, // Negative amount
      },
    };
    expect(() => SupportSchema.parse(invalidFinanceAmount)).toThrow();
    // expect(() => SupportSchema.parse(invalidFinanceAmount)).toThrowErrorMatchingSnapshot();
  });
});
