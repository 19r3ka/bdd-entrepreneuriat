import { describe, it, expect } from 'vitest'
import { MomentumMetricSchema } from './MomentumMetric'
import { z } from 'zod'

describe('MomentumMetricSchema', () => {
  const validMomentumMetric = {
    momentumMetricId: '123e4567-e89b-12d3-a456-426614174000',
    businessId: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Revenue Growth',
    category: 'performance',
    dimension: 'Finance',
    rbmLevel: 'outcome',
    indicators: [
      {
        name: 'Monthly Revenue',
        unit: 'currency',
        baseline: 5000,
        target: 7500,
        currency: 'USD',
        readings: [
          {
            value: 6000,
            asOf: '2023-06-15',
            currency: 'USD'
          }
        ]
      }
    ],
    evidenceIds: ['123e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174004'],
    contributionNarrative: 'Increased revenue through new marketing channel',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'test-user',
    updatedAt: '2023-01-01T00:00:00Z',
    updatedBy: 'test-user'
  }

  it('should accept valid momentum metric data', () => {
    const result = MomentumMetricSchema.safeParse(validMomentumMetric)
    expect(result.success).toBe(true)
  })

  it('should reject momentum metric with invalid UUIDs', () => {
    const invalidMomentumMetric = {
      ...validMomentumMetric,
      momentumMetricId: 'invalid-uuid'
    }
    const result = MomentumMetricSchema.safeParse(invalidMomentumMetric)
    expect(result.success).toBe(false)
  })

  it('should reject momentum metric with missing required fields', () => {
    const incompleteMomentumMetric = {
      ...validMomentumMetric,
      title: '' // Missing required field
    }
    const result = MomentumMetricSchema.safeParse(incompleteMomentumMetric)
    expect(result.success).toBe(false)
    expect(result.error!.issues[0]!.message).toContain('Too small') // Updated to match actual error message
  })

  it('should require currency code when unit is currency', () => {
    const momentumMetricWithInvalidIndicator = {
      ...validMomentumMetric,
      indicators: [
        {
          name: 'Monthly Revenue',
          unit: 'currency', // Currency unit requires currency code
          baseline: 5000,
          target: 7500
          // Missing currency field
        }
      ]
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithInvalidIndicator)
    expect(result.success).toBe(false)
    expect(result.error!.issues[0]!.message).toContain("Indicators with unit='currency' must include a 3-letter currency code.")
  })

  it('should accept momentum metric with valid category values', () => {
    const categories = [
      'performance',
      'employment_inclusion',
      'finance_access',
      'innovation',
      'sustainability',
      'resilience',
      'digital_adoption',
      'market_integration'
    ]

    for (const category of categories) {
      const momentumMetric = {
        ...validMomentumMetric,
        category: category
      }
      const result = MomentumMetricSchema.safeParse(momentumMetric)
      expect(result.success).toBe(true)
    }
  })

  it('should reject momentum metric with invalid category', () => {
    const invalidMomentumMetric = {
      ...validMomentumMetric,
      category: 'invalid_category' as any
    }
    const result = MomentumMetricSchema.safeParse(invalidMomentumMetric)
    expect(result.success).toBe(false)
  })

  it('should accept momentum metric with valid dimension values', () => {
    const dimensions = ['Digital', 'Finance', 'Market', 'Green', 'Formalization']

    for (const dimension of dimensions) {
      const momentumMetric = {
        ...validMomentumMetric,
        dimension: dimension
      }
      const result = MomentumMetricSchema.safeParse(momentumMetric)
      expect(result.success).toBe(true)
    }
  })

  it('should accept momentum metric with optional fields omitted', () => {
    const momentumMetricWithoutOptionals = {
      momentumMetricId: '123e4567-e89b-12d3-a456-426614174000',
      businessId: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Revenue Growth',
      category: 'performance',
      rbmLevel: 'outcome' // rbmLevel has a default value
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithoutOptionals)
    expect(result.success).toBe(true)
  })

  it('should accept momentum metric with complex indicators and readings', () => {
    const complexMomentumMetric = {
      momentumMetricId: '123e4567-e89b-12d3-a456-426614174000',
      businessId: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Customer Acquisition',
      category: 'performance',
      indicators: [
        {
          name: 'New Customers',
          unit: 'count',
          baseline: 100,
          target: 200,
          readings: [
            {
              value: 120,
              asOf: '2023-04-15',
              disagg: {
                gender: 'female',
                ageBand: '25-34',
                disability: false,
                location: 'Urban'
              }
            }
          ]
        }
      ]
    }
    const result = MomentumMetricSchema.safeParse(complexMomentumMetric)
    expect(result.success).toBe(true)
  })

  it('should validate date format in indicator readings', () => {
    const momentumMetricWithInvalidDate = {
      ...validMomentumMetric,
      indicators: [
        {
          name: 'Revenue',
          unit: 'currency',
          baseline: 5000,
          target: 7500,
          currency: 'USD',
          readings: [
            {
              value: 6000,
              asOf: 'invalid-date' // Invalid date format
            }
          ]
        }
      ]
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithInvalidDate)
    expect(result.success).toBe(false)
  })

  it('should validate currency code format', () => {
    const momentumMetricWithInvalidCurrency = {
      ...validMomentumMetric,
      indicators: [
        {
          name: 'Revenue',
          unit: 'currency',
          baseline: 5000,
          target: 7500,
          currency: 'US' // Invalid currency code - should be 3 letters
        }
      ]
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithInvalidCurrency)
    expect(result.success).toBe(false)
  })

  it('should validate UUID format in evidenceIds', () => {
    const momentumMetricWithInvalidEvidenceIds = {
      ...validMomentumMetric,
      evidenceIds: ['invalid-uuid']
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithInvalidEvidenceIds)
    expect(result.success).toBe(false)
  })

  it('should respect max length for contributionNarrative', () => {
    const momentumMetricWithLongNarrative = {
      ...validMomentumMetric,
      contributionNarrative: 'a'.repeat(501) // Exceeds max length of 500
    }
    const result = MomentumMetricSchema.safeParse(momentumMetricWithLongNarrative)
    expect(result.success).toBe(false)
  })
})