import { SupportBoostSchema } from './Support'
import { describe, it, expect } from 'vitest'
import { v4 as uuidv4 } from 'uuid'

describe('SupportBoostSchema', () => {
  const validSupport = {
    id: uuidv4(),
    businessId: uuidv4(),
    title: 'Digital Kickstart Grant',
    boostType: 'financial_grant',
    modality: 'DIM',
    startDate: '2023-01-01',
    genderMarker: 'GEN2',
  }

  it('accepts valid support data', () => {
    const result = SupportBoostSchema.safeParse(validSupport)
    expect(result.success).toBe(true)
  })

  it('requires core fields', () => {
    const result = SupportBoostSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path[0])
      expect(issues).toContain('id')
      expect(issues).toContain('businessId')
      expect(issues).toContain('title')
      expect(issues).toContain('boostType')
      expect(issues).toContain('modality')
      expect(issues).toContain('startDate')
    }
  })

  it('validates boostType enum', () => {
    const result = SupportBoostSchema.safeParse({
      ...validSupport,
      boostType: 'invalid_type',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      // Zod default error for enum
      expect(result.error.issues[0]!.message).toContain('Invalid option')
    }
  })

  it('validates date logic (end date after start date)', () => {
    const result = SupportBoostSchema.safeParse({
      ...validSupport,
      startDate: '2023-01-10',
      endDate: '2023-01-01', // Before start date
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain('End date must be after start date')
    }
  })

  it('validates currency requirement when unit is currency', () => {
    const result = SupportBoostSchema.safeParse({
      ...validSupport,
      quantity: {
        value: 1000,
        unit: 'currency',
        // Missing currency code
      },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain('Provide a 3-letter currency code')
    }
  })

  it('accepts currency when code is provided', () => {
    const result = SupportBoostSchema.safeParse({
      ...validSupport,
      quantity: {
        value: 1000,
        unit: 'currency',
        currency: 'USD',
      },
    })
    expect(result.success).toBe(true)
  })

  it('validates currency code length', () => {
    const result = SupportBoostSchema.safeParse({
      ...validSupport,
      quantity: {
        value: 1000,
        unit: 'currency',
        currency: 'US', // Too short
      },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      // Zod default error for length
      expect(result.error.issues[0]!.message).toContain('Too small')
    }
  })
})