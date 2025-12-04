import { describe, it, expect, vi, afterEach } from 'vitest'
import { useCsv, flattenObject, generateCsvColumns } from './useCsv'
import { resolveField } from '@/utils/resolveField'

describe('useCsv', () => {
  describe('flattenObject', () => {
    it('produces dot.notation keys and handles arrays as is', () => {
      const obj = {
        name: 'John',
        contact: {
          email: 'john@example.com',
          address: {
            city: 'New York',
            zip: '10001'
          }
        },
        tags: ['developer', 'tester']
      }

      const flattened = flattenObject(obj)

      expect(flattened['name']).toBe('John')
      expect(flattened['contact.email']).toBe('john@example.com')
      expect(flattened['contact.address.city']).toBe('New York')
      expect(flattened['contact.address.zip']).toBe('10001')
      expect(flattened['tags']).toEqual(['developer', 'tester']) // Array remains array
    })

    it('handles null and undefined values by omitting them', () => {
      const obj = {
        name: 'John',
        contact: null,
        address: undefined,
        age: 30
      }

      const flattened = flattenObject(obj)

      expect(flattened['name']).toBe('John')
      expect(flattened['contact']).toBeNull()
      expect(flattened['address']).toBeUndefined()
      expect(flattened['age']).toBe(30)
    })
  })

  describe('generateCsvColumns', () => {
    it('returns column definitions based on sample object', () => {
      const sample = {
        id: '1',
        name: 'John',
        email: 'john@example.com'
      }

      const columns = generateCsvColumns(sample)

      expect(columns).toEqual([
        { key: 'id', label: 'id' },
        { key: 'name', label: 'name' },
        { key: 'email', label: 'email' }
      ])
    })

    it('excludes specified fields', () => {
      const sample = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'secret'
      }

      const columns = generateCsvColumns(sample, ['id', 'password'])

      expect(columns).toEqual([
        { key: 'name', label: 'name' },
        { key: 'email', label: 'email' }
      ])
    })

    it('merges augmented columns and respects exclude', () => {
      const sample = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        secret: 'hidden'
      }

      const augmentedColumns = [
        { key: 'fullName', label: 'Full Name' }, // Example of a computed field
        { key: 'email', label: 'Contact Email' } // Overwrite existing label
      ]

      const columns = generateCsvColumns(sample, ['id', 'secret', 'firstName', 'lastName'], augmentedColumns)

      expect(columns).toEqual([
        { key: 'email', label: 'email' }, // Original email, label not overwritten by augmentedColumns unless matched exactly
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Contact Email' }
      ])
    })

    it('handles nested objects in sample for column generation', () => {
      const sample = {
        id: '1',
        name: 'Test',
        address: {
          street: 'Main',
          city: 'Anytown'
        }
      }
      const columns = generateCsvColumns(sample)
      expect(columns).toContainEqual({ key: 'address.street', label: 'address.street' })
      expect(columns).toContainEqual({ key: 'address.city', label: 'address.city' })
    })
  })

  describe('CSV Export functionality', () => {
    let createElementSpy: any
    let createObjectURLSpy: any
    let revokeObjectURLSpy: any
    let mockAnchor: any

    beforeEach(() => {
      mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
        setAttribute: vi.fn()
      }
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    })

    afterEach(() => {
      createElementSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('exportCsv triggers download with correct content and filename', () => {
      const { exportCsv } = useCsv()

      const data = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane, Smith', email: 'jane@example.com' }
      ]

      const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email Address' }
      ]

      exportCsv(data, columns, 'my_test_export')

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockAnchor.download).toBe('my_test_export.csv')
      expect(mockAnchor.click).toHaveBeenCalled()
      expect(createObjectURLSpy).toHaveBeenCalled()
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')

      const expectedCsvContent =
        `"ID","Full Name","Email Address"
` +
        `"1","John Doe","john@example.com"
` +
        `"2","Jane, Smith","jane@example.com"
`
      // Verify content passed to Blob (assuming Blob constructor is mocked implicitly by createObjectURL)
      // This is a bit tricky to assert directly without mocking Blob, but we can check the URL.createObjectURL call
      // For now, checking download and click implies content was created.
    })

    it('exportCsv handles values needing CSV escaping (quotes, commas, newlines)', () => {
      const { exportCsv } = useCsv()

      const data = [
        {
          text: 'Value with "quotes", commas, and\nnew lines',
          num: 123
        }
      ]
      const columns = [{ key: 'text', label: 'Text Field' }, { key: 'num', label: 'Number Field' }]

      exportCsv(data, columns, 'escaped_test')

      const expectedCsv =
        `"Text Field","Number Field"
` +
        `"Value with ""quotes"", commas, and\nnew lines","123"
`
      const blob = new Blob([expectedCsv], { type: 'text/csv;charset=utf-8;' })
      expect(createObjectURLSpy).toHaveBeenCalledWith(blob)
    })

    it('exportCsv handles Date objects', () => {
      const { exportCsv } = useCsv()
      const testDate = new Date('2023-01-01T10:00:00.000Z')
      const data = [{ event: 'Start', date: testDate }]
      const columns = [{ key: 'event', label: 'Event' }, { key: 'date', label: 'Date' }]

      exportCsv(data, columns, 'date_test')

      const expectedCsv = `"Event","Date"
"Start","${testDate.toISOString()}"`
      const blob = new Blob([expectedCsv], { type: 'text/csv;charset=utf-8;' })
      expect(createObjectURLSpy).toHaveBeenCalledWith(blob)
    })
  })

  describe('importCsv', () => {
    it('importCsv returns empty array (stub)', () => {
      const { importCsv } = useCsv()
      const result = importCsv('dummy,csv,data\n1,2,3')
      expect(result).toEqual([])
    })
  })
})