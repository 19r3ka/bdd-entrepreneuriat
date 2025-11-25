import { describe, it, expect, vi } from 'vitest';
import { useErrorHandler } from './useErrorHandler';

// Mock PrimeVue toast
const mockToastAdd = vi.fn();

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({
    add: mockToastAdd,
  })),
}));

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key), // Return key as translation
  })),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('normalizeError', () => {
    it('handles string errors', () => {
      const { normalizeError } = useErrorHandler();
      
      const result = normalizeError('Something went wrong');
      expect(result).toBe('Something went wrong');
    });

    it('handles Error objects', () => {
      const { normalizeError } = useErrorHandler();
      
      const error = new Error('Test error message');
      const result = normalizeError(error);
      expect(result).toBe('Test error message');
    });

    it('handles object errors with message property', () => {
      const { normalizeError } = useErrorHandler();
      
      const errorObj = { message: 'Object error message' };
      const result = normalizeError(errorObj);
      expect(result).toBe('Object error message');
    });

    it('handles object errors with error.message property', () => {
      const { normalizeError } = useErrorHandler();
      
      const errorObj = { error: { message: 'Nested error message' } };
      const result = normalizeError(errorObj);
      expect(result).toBe('Nested error message');
    });

    it('uses customMessage when available', () => {
      const { normalizeError } = useErrorHandler();
      
      const error = new Error('Original error');
      const result = normalizeError(error, 'Custom error message');
      expect(result).toBe('Custom error message');
    });

    it('returns default message for unknown error types', () => {
      const { normalizeError } = useErrorHandler();
      
      const result = normalizeError(123);
      expect(result).toBe('An error occurred');
    });
  });

  describe('handleApiError', () => {
    it('shows toast and logs error', () => {
      const { handleApiError } = useErrorHandler();
      
      handleApiError('API Error');
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'API Error',
        life: 5000,
      });
    });

    it('uses custom message when provided', () => {
      const { handleApiError } = useErrorHandler();
      
      handleApiError(new Error('Original'), 'Custom API Error');
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Custom API Error',
        life: 5000,
      });
    });
  });

  describe('handleValidationError', () => {
    it('shows toast for single validation error', () => {
      const { handleValidationError } = useErrorHandler();
      
      const error = 'Field is required';
      handleValidationError(error);
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Field is required',
        life: 5000,
      });
    });

    it('shows toast for multiple validation errors', () => {
      const { handleValidationError } = useErrorHandler();
      
      const errors = ['Field 1 is required', 'Field 2 is invalid'];
      handleValidationError(errors);
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Errors',
        detail: '• Field 1 is required\n• Field 2 is invalid',
        life: 5000,
      });
    });
  });

  describe('handleGenericError', () => {
    it('shows toast and logs generic error', () => {
      const { handleGenericError } = useErrorHandler();
      
      handleGenericError('Generic error');
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Generic error',
        life: 5000,
      });
    });

    it('uses default message when no error provided', () => {
      const { handleGenericError } = useErrorHandler();
      
      handleGenericError();
      
      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'An unexpected error occurred',
        life: 5000,
      });
    });
  });
});