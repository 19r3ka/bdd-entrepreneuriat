import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  isProfileCompletedStrict,
  isProfileCompletedRequired,
  getMissingFields
} from './schemaCompletion'

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1)
    })
    .optional()
})

describe('schemaCompletion', () => {
  describe('isProfileCompletedStrict', () => {
    it('returns true only when all fields are present and not empty', () => {
      const completeData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        address: { street: '123 Main St', city: 'Anytown' }
      }
      expect(isProfileCompletedStrict(testSchema, completeData)).toBe(true)
    })

    it('returns false if any required field is missing', () => {
      const incompleteData = { email: 'john@example.com', age: 30 }
      expect(isProfileCompletedStrict(testSchema, incompleteData as any)).toBe(false)
    })

    it('returns false if any optional field is missing', () => {
      const incompleteData = { name: 'John', email: 'john@example.com' }
      expect(isProfileCompletedStrict(testSchema, incompleteData as any)).toBe(false)
    })

    it('returns false if a field is an empty string', () => {
      const dataWithEmptyString = {
        name: '',
        email: 'john@example.com',
        age: 30,
        address: { street: '123 Main St', city: 'Anytown' }
      }
      expect(isProfileCompletedStrict(testSchema, dataWithEmptyString)).toBe(false)
    })
  })

  describe('isProfileCompletedRequired', () => {
    it('returns true when all required (non-optional) fields are present', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com'
      }
      expect(isProfileCompletedRequired(testSchema, data)).toBe(true)
    })

    it('returns true even if optional fields are missing', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com'
        // age and address are optional
      }
      expect(isProfileCompletedRequired(testSchema, data)).toBe(true)
    })

    it('returns false if a required field is missing', () => {
      const incompleteData = { name: 'John Doe' } // email is missing
      expect(isProfileCompletedRequired(testSchema, incompleteData as any)).toBe(false)
    })

    it('returns false if a required field is an empty string', () => {
      const dataWithEmptyString = { name: '', email: 'john@example.com' }
      expect(isProfileCompletedRequired(testSchema, dataWithEmptyString)).toBe(false)
    })
  })

  describe('getMissingFields', () => {
    it('returns an empty array in required mode when all required fields are present', () => {
      const data = { name: 'John', email: 'john@example.com' }
      const missing = getMissingFields(testSchema, data) // strict=false is default
      expect(missing).toEqual([])
    })

    it('returns the list of missing required fields in required mode', () => {
      const incompleteData = { name: 'John' }
      const missing = getMissingFields(testSchema, incompleteData as any)
      expect(missing).toEqual(['email'])
    })

    it('returns an empty array in strict mode when all fields are present', () => {
      const completeData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        address: { street: '123 Main St', city: 'Anytown' }
      }
      const missing = getMissingFields(testSchema, completeData, true)
      expect(missing).toEqual([])
    })

    it('returns the list of all missing fields in strict mode', () => {
      const incompleteData = { name: 'John' }
      const missing = getMissingFields(testSchema, incompleteData as any, true)
      expect(missing).toHaveLength(3)
      expect(missing).toContain('email')
      expect(missing).toContain('age')
      expect(missing).toContain('address')
    })

    it('correctly identifies empty strings as missing fields', () => {
      const data = { name: '', email: 'john@example.com' }
      const missingRequired = getMissingFields(testSchema, data as any)
      expect(missingRequired).toContain('name')

      const missingStrict = getMissingFields(testSchema, data as any, true)
      expect(missingStrict).toContain('name')
      expect(missingStrict).toContain('age')
      expect(missingStrict).toContain('address')
    })
  })
})