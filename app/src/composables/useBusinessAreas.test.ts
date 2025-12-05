import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBusinessAreas } from './useBusinessAreas'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      // Simple mock: just return the last part of the key
      // In real translations, businessAreas.A becomes "Agriculture, forestry and fishing"
      const mockTranslations: Record<string, string> = {
        'businessAreas.A': 'Agriculture, forestry and fishing',
        'businessAreas.B': 'Mining and quarrying',
        'businessAreas.C': 'Manufacturing',
        'businessAreas.J': 'Information and communication',
        'businessAreas.K': 'Financial and insurance activities',
        'businessAreas.P': 'Education',
        'businessAreas.Q': 'Human health and social work',
        'businessAreas.R': 'Arts, entertainment and recreation'
      }
      return mockTranslations[key] || key
    }
  })
}))

describe('useBusinessAreas', () => {
  it('businessAreaMap correctly maps codes to names', () => {
    const { businessAreaMap } = useBusinessAreas()

    // Test that some common codes map to correct names (using actual business area codes from constants)
    expect(businessAreaMap.value['A']).toBe('Agriculture, forestry and fishing')
    expect(businessAreaMap.value['C']).toBe('Manufacturing')
    expect(businessAreaMap.value['P']).toBe('Education')
    expect(businessAreaMap.value['J']).toBe('Information and communication')
  })

  it('getBusinessAreaLabel returns name for known code, falls back to code for unknown', () => {
    const { getBusinessAreaLabel } = useBusinessAreas()

    // Known code should return name
    expect(getBusinessAreaLabel('A')).toBe('Agriculture, forestry and fishing')
    expect(getBusinessAreaLabel('J')).toBe('Information and communication')

    // Unknown code should return the code itself
    expect(getBusinessAreaLabel('UNKNOWN')).toBe('UNKNOWN')
    expect(getBusinessAreaLabel('XYZ')).toBe('XYZ')
  })

  it('getBusinessAreaOptions returns {value, label} array', () => {
    const { getBusinessAreaOptions } = useBusinessAreas()

    const options = getBusinessAreaOptions()

    // Verify the structure of returned options
    expect(Array.isArray(options)).toBe(true)
    expect(options.length).toBeGreaterThan(0)

    // Check that each option has value and label
    for (const option of options) {
      expect(option).toHaveProperty('value')
      expect(option).toHaveProperty('label')
      expect(typeof option.value).toBe('string')
      expect(typeof option.label).toBe('string')
    }

    // Check a specific option
    const aOption = options.find((o) => o.value === 'A')
    expect(aOption).toEqual({ value: 'A', label: 'Agriculture, forestry and fishing' })
  })

  it('isValidBusinessArea is true for known codes, false for unknown', () => {
    const { isValidBusinessArea } = useBusinessAreas()

    // Known codes should be valid
    expect(isValidBusinessArea('A')).toBe(true)
    expect(isValidBusinessArea('C')).toBe(true)

    // Unknown codes should be invalid
    expect(isValidBusinessArea('UNKNOWN')).toBe(false)
    expect(isValidBusinessArea('XYZ')).toBe(false)
  })
})