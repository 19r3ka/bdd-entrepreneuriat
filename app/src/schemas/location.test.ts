import { LocationSchema } from './location'
import { describe, it, expect } from 'vitest'

describe('LocationSchema', () => {
  // ✅ Accepts valid latitude/longitude in range
  it('accepts valid latitude/longitude in range', () => {
    const result = LocationSchema.safeParse({
      longitude: -12.345,
      latitude: 45.678
    })
    expect(result.success).toBe(true)
  })

  // ❌ Rejects out-of-range values (e.g. longitude > 180)
  it('rejects out-of-range longitude values', () => {
    const result = LocationSchema.safeParse({
      longitude: 200, // outside [-180, 180] range
      latitude: 45.678
    })
    expect(result.success).toBe(false)
  })

  it('rejects out-of-range latitude values', () => {
    const result = LocationSchema.safeParse({
      longitude: -12.345,
      latitude: 100 // outside [-90, 90] range
    })
    expect(result.success).toBe(false)
  })

  // ✅ Allows null values
  it('allows null values', () => {
    const result = LocationSchema.safeParse({
      longitude: null,
      latitude: null
    })
    expect(result.success).toBe(true)
  })

  // ✅ Coerces string numbers into numbers
  it('coerces string numbers into numbers', () => {
    const result = LocationSchema.safeParse({
      longitude: '-12.345',
      latitude: '45.678'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.longitude).toBe(-12.345)
      expect(result.data.latitude).toBe(45.678)
    }
  })
})
