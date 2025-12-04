import { describe, it, expect } from 'vitest'
import { MaturityAssessmentSchema } from './Maturity'

describe('MaturityAssessmentSchema', () => {
  const validAssessment = {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    businessId: 'f0e9d8c7-b6a5-4321-9876-543210fedcba',
    achievedMilestoneIds: ['FORM_1', 'FIN_1'],
    computedScores: {
      FORMALIZATION: 20,
      FINANCE: 20
    },
    notes: 'Initial assessment notes',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should validate a valid maturity assessment object', () => {
    expect(() => MaturityAssessmentSchema.parse(validAssessment)).not.toThrow()
  })

  it('should invalidate an assessment with a non-uuid id', () => {
    const invalidId = { ...validAssessment, id: 'not-a-uuid' }
    expect(() => MaturityAssessmentSchema.parse(invalidId)).toThrow()
  })

  it('should invalidate an assessment with a missing businessId', () => {
    const missingBusinessId = { ...validAssessment, businessId: undefined }
    expect(() => MaturityAssessmentSchema.parse(missingBusinessId)).toThrow()
  })

  it('should invalidate an assessment with an invalid computedScores', () => {
    const invalidScores = { ...validAssessment, computedScores: { INVALID_AREA: 'not-a-number' } }
    expect(() => MaturityAssessmentSchema.parse(invalidScores)).toThrow()
  })

  it('should allow an optional notes field', () => {
    const noNotes = { ...validAssessment, notes: undefined }
    expect(() => MaturityAssessmentSchema.parse(noNotes)).not.toThrow()
  })
})
