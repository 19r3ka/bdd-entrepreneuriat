import { describe, it, expect } from 'vitest'
import { z } from 'zod' // Import z from zod
import { optionalString, capitalize, generateInitials, getRandomColorClass } from './string.helpers'

describe('string.helpers', () => {
  describe('optionalString', () => {
    it('converts empty string to undefined', () => {
      const schema = optionalString(z.string())
      const result = schema.safeParse('')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeUndefined()
      }
    })

    it('keeps non-empty string as is', () => {
      const schema = optionalString(z.string())
      const result = schema.safeParse('hello')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('hello')
      }
    })

    it('passes through other values', () => {
      const schema = optionalString(z.string())
      const result = schema.safeParse(undefined)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeUndefined()
      }
    })
  })

  describe('capitalize', () => {
    it('capitalizes the first letter of a word', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('handles already capitalized words', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('handles empty strings', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalize('h')).toBe('H')
    })
  })

  describe('generateInitials', () => {
    it('generates initials for single name', () => {
      expect(generateInitials('John')).toBe('J')
    })

    it('generates initials for two names', () => {
      expect(generateInitials('John Doe')).toBe('JD')
    })

    it('generates initials for multiple names', () => {
      expect(generateInitials('John William Doe')).toBe('JD') // First and last
    })

    it('handles extra whitespace', () => {
      expect(generateInitials('  John   Doe  ')).toBe('JD')
    })

    it('handles single character names', () => {
      expect(generateInitials('J D')).toBe('JD')
    })

    it('handles empty string', () => {
      expect(generateInitials('')).toBe('')
    })
  })

  describe('getRandomColorClass', () => {
    it('returns a deterministic color class based on input', () => {
      // Same input should always return same color
      const color1 = getRandomColorClass('John Doe')
      const color2 = getRandomColorClass('John Doe')
      expect(color1).toBe(color2)

      // Different inputs should return different colors (most of the time)
      const color3 = getRandomColorClass('Jane Doe')
      // Note: There's a possibility they could be the same due to hash collisions,
      // but we're testing that it returns a valid color class
      expect(typeof color3).toBe('string')
      expect(color3).toMatch(
        /^bg-(red|green|blue|purple|teal|orange|indigo|yellow|pink|gray)-[1-9]00$/
      )
    })

    it('returns gray-400 as fallback for empty input', () => {
      expect(getRandomColorClass('')).toBe('bg-gray-400')
    })

    it('returns one of the valid color classes', () => {
      const color = getRandomColorClass('test user')
      expect(color).toMatch(
        /^bg-(red|green|blue|purple|teal|orange|indigo|yellow|pink|gray)-[1-9]00$/
      )
    })
  })
})