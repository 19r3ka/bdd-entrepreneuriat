import { describe, it, expect } from 'vitest'
import { useBusinessAreas } from './useBusinessAreas'

describe('useBusinessAreas', () => {
  it('businessAreaMap correctly maps codes to names', () => {
    const { businessAreaMap } = useBusinessAreas()

    // Test that some common codes map to correct names
    expect(businessAreaMap['IT']).toBe('Information Technology')
    expect(businessAreaMap['FIN']).toBe('Financial Services')
    expect(businessAreaMap['HLTH']).toBe('Healthcare')
    expect(businessAreaMap['EDU']).toBe('Education')
    expect(businessAreaMap['MFG']).toBe('Manufacturing')
    expect(businessAreaMap['AGR']).toBe('Agriculture')
    expect(businessAreaMap['TRVL']).toBe('Travel & Tourism')
  })

  it('getBusinessAreaLabel returns name for known code, falls back to code for unknown', () => {
    const { getBusinessAreaLabel } = useBusinessAreas()

    // Known code should return name
    expect(getBusinessAreaLabel('IT')).toBe('Information Technology')
    expect(getBusinessAreaLabel('FIN')).toBe('Financial Services')

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
    const itOption = options.find((o) => o.value === 'IT')
    expect(itOption).toEqual({ value: 'IT', label: 'Information Technology' })
  })

  it('isValidBusinessArea is true for known codes, false for unknown', () => {
    const { isValidBusinessArea } = useBusinessAreas()

    // Known codes should be valid
    expect(isValidBusinessArea('IT')).toBe(true)
    expect(isValidBusinessArea('FIN')).toBe(true)

    // Unknown codes should be invalid
    expect(isValidBusinessArea('UNKNOWN')).toBe(false)
    expect(isValidBusinessArea('XYZ')).toBe(false)
  })
})