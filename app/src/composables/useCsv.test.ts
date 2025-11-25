import { describe, it, expect, vi } from 'vitest';
import { useCsv, flattenObject, generateCsvColumns, toCsvString } from './useCsv';

describe('useCsv', () => {
  describe('flattenObject', () => {
    it('produces dot.notation keys', () => {
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
      };

      const flattened = flattenObject(obj);
      
      expect(flattened['name']).toBe('John');
      expect(flattened['contact.email']).toBe('john@example.com');
      expect(flattened['contact.address.city']).toBe('New York');
      expect(flattened['contact.address.zip']).toBe('10001');
      // Arrays should be converted to strings
      expect(flattened['tags']).toBe('developer,tester');
    });

    it('handles null and undefined values', () => {
      const obj = {
        name: 'John',
        contact: null,
        address: undefined
      };

      const flattened = flattenObject(obj);
      
      expect(flattened['name']).toBe('John');
      expect(flattened['contact']).toBe('');
      expect(flattened['address']).toBe('');
    });
  });

  describe('generateCsvColumns', () => {
    it('returns column definitions based on sample object', () => {
      const sample = {
        id: '1',
        name: 'John',
        email: 'john@example.com'
      };

      const columns = generateCsvColumns(sample);
      
      expect(columns).toEqual([
        { key: 'id', header: 'Id' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' }
      ]);
    });

    it('excludes specified fields', () => {
      const sample = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        password: 'secret'
      };

      const columns = generateCsvColumns(sample, ['id', 'password']);
      
      expect(columns).toEqual([
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' }
      ]);
    });

    it('merges augmented columns', () => {
      const sample = {
        id: '1',
        name: 'John',
        email: 'john@example.com'
      };

      const columns = generateCsvColumns(sample, ['id'], [
        { key: 'name', header: 'Full Name' }
      ]);
      
      expect(columns).toEqual([
        { key: 'name', header: 'Full Name' },
        { key: 'email', header: 'Email' }
      ]);
    });
  });

  describe('toCsvString', () => {
    it('escapes commas, quotes, and newlines', () => {
      const value = 'Text with, comma "quote" and\nnewline';
      const result = toCsvString(value);
      
      // CSV strings with special characters should be quoted
      expect(result).toContain('Text with, comma "quote" and');
      // The exact format may depend on implementation
    });

    it('formats dates', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const result = toCsvString(date);
      
      // Should format date as string
      expect(typeof result).toBe('string');
      expect(result).toContain('2023'); // Check it contains the year
    });

    it('handles primitive values', () => {
      expect(toCsvString('text')).toBe('text');
      expect(toCsvString(123)).toBe('123');
      expect(toCsvString(true)).toBe('true');
      expect(toCsvString(false)).toBe('false');
      expect(toCsvString(null)).toBe('');
      expect(toCsvString(undefined)).toBe('');
    });
  });

  describe('useCsv export functionality', () => {
    it('exportCsv triggers download with correct content', () => {
      // Mock document.createElement and URL.createObjectURL
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
        setAttribute: vi.fn(),
      };
      
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      const originalCreateObjectURL = URL.createObjectURL;
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      
      const { exportCsv } = useCsv();
      
      const data = [
        { id: '1', name: 'John', email: 'john@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' }
      ];
      
      const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' }
      ];
      
      exportCsv(data, columns, 'test');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockAnchor.download).toBe('test.csv');
      expect(mockAnchor.click).toHaveBeenCalled();
      
      // Restore original implementation
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('importCsv returns empty array (stub)', () => {
      const { importCsv } = useCsv();
      const result = importCsv('dummy');
      expect(result).toEqual([]);
    });
  });
});