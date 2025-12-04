import { describe, it, expect } from 'vitest'
import { IndicatorDefinitionSchema, MeasurementSchema, IndicatorTypeEnum } from './Indicator'

const validUUID = '123e4567-e89b-12d3-a456-426614174000'
const validUUID2 = '123e4567-e89b-12d3-a456-426614174001'

describe('IndicatorDefinitionSchema', () => {
  const validIndicator = {
    id: validUUID,
    businessId: validUUID2,
    type: IndicatorTypeEnum.enum.Economic,
    name: 'Revenue Growth',
    description: 'Increase in monthly revenue',
    baselineValue: 1000,
    baselineDate: new Date(),
    targetValue: 2000,
    targetDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should validate a valid indicator object', () => {
    expect(() => IndicatorDefinitionSchema.parse(validIndicator)).not.toThrow()
  })

  it('should invalidate an indicator object with missing required fields', () => {
    const invalidIndicator = {
      ...validIndicator,
      name: undefined
    }
    expect(() => IndicatorDefinitionSchema.parse(invalidIndicator)).toThrow()
  })

  it('should invalidate an indicator object with invalid enum values', () => {
    const invalidTypeIndicator = {
      ...validIndicator,
      type: 'INVALID_TYPE'
    }
    expect(() => IndicatorDefinitionSchema.parse(invalidTypeIndicator)).toThrow()
  })
})

describe('MeasurementSchema', () => {
  const validMeasurement = {
    id: validUUID,
    indicatorId: validUUID2,
    currentValue: 1500,
    dateRecorded: new Date(),
    evidenceSource: 'file-id-123',
    contributionNarrative: 'Revenue increased due to new marketing campaign',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('should validate a valid measurement object', () => {
    expect(() => MeasurementSchema.parse(validMeasurement)).not.toThrow()
  })

  it('should invalidate a measurement object with missing evidenceSource', () => {
    const invalidMeasurement = {
      ...validMeasurement,
      evidenceSource: '' // Empty string should fail min(1)
    }
    expect(() => MeasurementSchema.parse(invalidMeasurement)).toThrow()
  })

  it('should invalidate a measurement object with missing contributionNarrative', () => {
    const invalidMeasurement = {
      ...validMeasurement,
      contributionNarrative: '' // Empty string should fail min(1)
    }
    expect(() => MeasurementSchema.parse(invalidMeasurement)).toThrow()
  })
})
