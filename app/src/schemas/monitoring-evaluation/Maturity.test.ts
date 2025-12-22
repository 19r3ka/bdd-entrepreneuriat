import { describe, it, expect } from 'vitest';
import { MaturityAssessmentSchema } from './Maturity';

describe('MaturityAssessmentSchema', () => {
  const validAssessment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    businessId: '123e4567-e89b-12d3-a456-426614174001',
    achievedMilestoneIds: [
      '123e4567-e89b-12d3-a456-426614174002',
      '123e4567-e89b-12d3-a456-426614174003',
    ],
    computedScores: {
      FORMALIZATION: 20,
      FINANCE: 20,
    },
    notes: 'Initial assessment notes',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid maturity assessment object', () => {
    expect(() => MaturityAssessmentSchema.parse(validAssessment)).not.toThrow();
  });

  it('should invalidate an assessment with a non-uuid id', () => {
    const invalidId = { ...validAssessment, id: 'not-a-uuid' };
    expect(() => MaturityAssessmentSchema.parse(invalidId)).toThrow();
  });

  it('should invalidate an assessment with a missing businessId', () => {
    const missingBusinessId = { ...validAssessment, businessId: undefined };
    expect(() => MaturityAssessmentSchema.parse(missingBusinessId)).toThrow();
  });

  it('should invalidate an assessment with an invalid computedScores', () => {
    const invalidScores = { ...validAssessment, computedScores: { INVALID_AREA: 'not-a-number' } };
    expect(() => MaturityAssessmentSchema.parse(invalidScores)).toThrow();
  });

  it('should allow an optional notes field', () => {
    const noNotes = { ...validAssessment, notes: undefined };
    expect(() => MaturityAssessmentSchema.parse(noNotes)).not.toThrow();
  });
});
