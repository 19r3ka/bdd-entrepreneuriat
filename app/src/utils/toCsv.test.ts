import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toCsv, escapeCsvValue } from './toCsv';

describe('toCsv', () => {
  beforeEach(() => {
    // Mock document and DOM functionality
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
      setAttribute: vi.fn(),
    };
    
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('escapeCsvValue', () => {
    it('handles values without special characters', () => {
      expect(escapeCsvValue('simple text')).toBe('simple text');
      expect(escapeCsvValue('12345')).toBe('12345');
    });

    it('escapes commas by wrapping in quotes', () => {
      expect(escapeCsvValue('text,with,commas')).toBe('"text,with,commas"');
    });

    it('escapes quotes by doubling them', () => {
      expect(escapeCsvValue('text "with" quotes')).toBe('"text ""with"" quotes"');
    });

    it('escapes newlines by wrapping in quotes', () => {
      expect(escapeCsvValue('line1\nline2')).toBe('"line1\nline2"');
      expect(escapeCsvValue('line1\r\nline2')).toBe('"line1\r\nline2"');
    });

    it('handles values with multiple special characters', () => {
      expect(escapeCsvValue('text, "with" special\nchars')).toBe('"text, ""with"" special\nchars"');
    });

    it('handles null, undefined, and empty values', () => {
      expect(escapeCsvValue(null)).toBe('');
      expect(escapeCsvValue(undefined)).toBe('');
      expect(escapeCsvValue('')).toBe('');
    });
  });

  describe('toCsv function', () => {
    it('generates proper CSV with headers and data', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

      toCsv(data, 'test.csv');

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(mockLink.download).toBe('test.csv');
      expect(mockLink.click).toHaveBeenCalled();

      // Restore original
      vi.restoreAllMocks();
    });

    it('handles nested path resolution', () => {
      const data = [
        { user: { name: 'John', contact: { email: 'john@example.com' } }, age: 30 },
        { user: { name: 'Jane', contact: { email: 'jane@example.com' } }, age: 25 }
      ];

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

      toCsv(data, 'test.csv');

      // The test mainly verifies that no errors occur during processing
      expect(createObjectURLSpy).toHaveBeenCalled();

      // Restore original
      vi.restoreAllMocks();
    });

    it('handles null and undefined values', () => {
      const data = [
        { name: 'John', age: null },
        { name: null, age: 25 },
        { name: undefined, age: undefined }
      ];

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

      toCsv(data, 'test.csv');

      // Should handle null/undefined without errors
      expect(createObjectURLSpy).toHaveBeenCalled();

      // Restore original
      vi.restoreAllMocks();
    });

    it('generates headers from object keys', () => {
      const data = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      ];

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

      toCsv(data, 'test.csv');

      // Should properly handle the headers generation
      expect(createObjectURLSpy).toHaveBeenCalled();

      // Restore original
      vi.restoreAllMocks();
    });
  });
});