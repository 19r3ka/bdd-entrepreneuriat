import { BusinessSchema } from './business'
import { describe, it, expect } from 'vitest'

describe('BusinessSchema', () => {
  // ✅ Requires entrepreneurId, name, location, contact, primaryBusinessArea
  it('requires entrepreneurId, name, location, contact, primaryBusinessArea', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000', // valid UUID
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date(),
      supportStartDate: new Date()
    })
    expect(result.success).toBe(true)
  })

  // ❌ Rejects invalid UUID for entrepreneurId
  it('rejects invalid UUID for entrepreneurId', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: 'invalid-uuid', // not a valid UUID
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date(),
      supportStartDate: new Date()
    })
    expect(result.success).toBe(false)
  })

  // ✅ Accepts optional secondaryBusinessArea, socialMedia, registrationNumber
  it('accepts optional secondaryBusinessArea, socialMedia, registrationNumber', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Web Development', // optional field
      socialMedia: {
        linkedin: 'https://linkedin.com/test'
      }, // optional field
      registrationNumber: '12345', // optional field
      activityStartDate: new Date(),
      supportStartDate: new Date()
    })
    expect(result.success).toBe(true)
  })

  // ✅ Coerces registrationDate from string → Date
  it('coerces registrationDate from string to Date', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      registrationDate: '2023-01-01', // string that should be coerced to Date
      activityStartDate: new Date(),
      supportStartDate: new Date()
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.registrationDate).toBeInstanceOf(Date)
    }
  })

  // ❌ Rejects missing activityStartDate or supportStartDate
  it('rejects missing activityStartDate', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      // activityStartDate: new Date(), // missing required field
      supportStartDate: new Date()
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing supportStartDate', () => {
    const result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date()
      // supportStartDate: new Date() // missing required field
    })
    expect(result.success).toBe(false)
  })

  // ✅ Accepts avatar as string, File, or null
  it('accepts avatar as string, File, or null', () => {
    const mockFile = new File([], 'avatar.jpg')

    // Test with string avatar
    let result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date(),
      supportStartDate: new Date(),
      avatar: 'https://example.com/avatar.jpg'
    })
    expect(result.success).toBe(true)

    // Test with File avatar
    result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date(),
      supportStartDate: new Date(),
      avatar: mockFile
    })
    expect(result.success).toBe(true)

    // Test with null avatar
    result = BusinessSchema.safeParse({
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Business',
      location: {
        longitude: -12.345,
        latitude: 45.678
      },
      contact: {
        email: 'test@example.com'
      },
      primaryBusinessArea: 'Technology',
      activityStartDate: new Date(),
      supportStartDate: new Date(),
      avatar: null
    })
    expect(result.success).toBe(true)
  })
})
