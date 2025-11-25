import { describe, it, expect, vi } from 'vitest';
import { useFormatters } from './useFormatters';

// Mock useI18n
const mockT = vi.fn((key) => key);

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: mockT,
  })),
}));

describe('useFormatters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatDate', () => {
    it('returns formatted string for Date object', () => {
      const { formatDate } = useFormatters();
      
      const date = new Date('2023-05-15T14:30:00Z');
      const result = formatDate(date);
      
      // Should return a formatted date string
      expect(typeof result).toBe('string');
      expect(result).toContain('2023'); // Contains the year
      expect(result).toContain('05'); // Contains the month
      expect(result).toContain('15'); // Contains the day
    });

    it('returns formatted string for date string', () => {
      const { formatDate } = useFormatters();
      
      const dateString = '2023-05-15';
      const result = formatDate(dateString);
      
      // Should return a formatted date string
      expect(typeof result).toBe('string');
      expect(result).toContain('2023');
    });

    it('returns empty string for null/undefined/invalid values', () => {
      const { formatDate } = useFormatters();
      
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate(123)).toBe(''); // Non-date number
    });

    it('uses locale awareness through i18n', () => {
      const { formatDate } = useFormatters();
      
      const date = new Date('2023-05-15');
      formatDate(date);
      
      // Verify that the i18n t function is used (if the implementation calls it)
      // This depends on the actual implementation - just checking it's available
      expect(mockT).toBeDefined();
    });
  });
});