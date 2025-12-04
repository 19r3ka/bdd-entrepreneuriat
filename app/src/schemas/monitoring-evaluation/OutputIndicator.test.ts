import { describe, it, expect } from 'vitest'
import { OutputIndicatorSchema } from './OutputIndicator'
import { z } from 'zod'

describe('OutputIndicatorSchema', () => {
  const validOutputIndicator = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'MSMEs trained in financial literacy',
    description: 'Number of MSMEs that completed financial literacy training',
    category: 'capacity_development',
    unit: 'count',
    irrfIndicatorCode: 'IRRF123',
    cpdOutputCode: 'CPD456',
    sdgTargets: ['SDG1', 'SDG8'],
    isStandard: true,
    usageCount: 5,
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'test-user',
    updatedAt: '2023-01-01T00:00:00Z',
    updatedBy: 'test-user'
  }

  it('should accept valid output indicator data', () => {
    const result = OutputIndicatorSchema.safeParse(validOutputIndicator)
    expect(result.success).toBe(true)
  })

  it('should reject output indicator with invalid UUID', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      id: 'invalid-uuid'
    }
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator)
    expect(result.success).toBe(false)
  })

  it('should reject output indicator with missing required fields', () => {
    const incompleteOutputIndicator = {
      ...validOutputIndicator,
      name: '' // Missing required field
    }
    const result = OutputIndicatorSchema.safeParse(incompleteOutputIndicator)
    expect(result.success).toBe(false)
    expect(result.error!.issues[0]!.message).toContain('Too small')
  })

  it('should accept output indicator with valid category values', () => {
    const categories = [
      'capacity_development',
      'access_to_finance',
      'market_access',
      'policy_regulatory',
      'innovation_sustainability',
      'digital_transformation'
    ]

    for (const category of categories) {
      const outputIndicator = {
        ...validOutputIndicator,
        category: category
      }
      const result = OutputIndicatorSchema.safeParse(outputIndicator)
      expect(result.success).toBe(true)
    }
  })

  it('should reject output indicator with invalid category', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      category: 'invalid_category' as any
    }
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator)
    expect(result.success).toBe(false)
  })

  it('should accept output indicator with valid unit values', () => {
    const units = [
      'count',
      'percent',
      'boolean',
      'hours',
      'currency',
      'index',
      'text'
    ]

    for (const unit of units) {
      const outputIndicator = {
        ...validOutputIndicator,
        unit: unit
      }
      const result = OutputIndicatorSchema.safeParse(outputIndicator)
      expect(result.success).toBe(true)
    }
  })

  it('should reject output indicator with invalid unit', () => {
    const invalidOutputIndicator = {
      ...validOutputIndicator,
      unit: 'invalid_unit' as any
    }
    const result = OutputIndicatorSchema.safeParse(invalidOutputIndicator)
    expect(result.success).toBe(false)
  })

  it('should accept output indicator with optional fields omitted', () => {
    const outputIndicatorWithoutOptionals = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'MSMEs trained',
      unit: 'count'
    }
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithoutOptionals)
    expect(result.success).toBe(true)
  })

  it('should respect max length for name', () => {
    const outputIndicatorWithLongName = {
      ...validOutputIndicator,
      name: 'a'.repeat(201) // Exceeds max length of 200
    }
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithLongName)
    expect(result.success).toBe(false)
  })

  it('should respect max length for description', () => {
    const outputIndicatorWithLongDescription = {
      ...validOutputIndicator,
      description: 'a'.repeat(501) // Exceeds max length of 500
    }
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithLongDescription)
  })

  it('should accept default values', () => {
    const outputIndicatorWithDefaults = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Indicator',
      unit: 'count'
      // isStandard and usageCount should have defaults
    }
    const result = OutputIndicatorSchema.safeParse(outputIndicatorWithDefaults)
    expect(result.success).toBe(true)
    
    // Check that defaults are applied
    if (result.success) {
      expect(result.data.isStandard).toBe(false)
      expect(result.data.usageCount).toBe(0)
    }
  })
})