import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from './errorHandler';

describe('ErrorHandler', () => {
  let mockToast: any;
  let consoleErrorSpy: any;

  const TEST_ERROR_VALUE = 123;

  beforeEach(() => {
    mockToast = { add: vi.fn() };
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  describe('handleApiError', () => {
    it('normalizeError handles Error objects', () => {
      const error = new Error('API error occurred');
      errorHandler.handleApiError(error, mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'API error occurred',
        life: 5000,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error:', error);
    });

    it('handles string errors', () => {
      errorHandler.handleApiError('API error message', mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'API error message',
        life: 5000,
      });
    });

    it('uses custom message when provided', () => {
      const error = new Error('Original error');
      errorHandler.handleApiError(error, mockToast, 'Custom error message');

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Custom error message',
        life: 5000,
      });
    });

    it('logs to console when toast is not provided', () => {
      const error = new Error('API error occurred');
      errorHandler.handleApiError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Toast service not provided, showing in console:',
        'API error occurred'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error:', error);
    });
  });

  describe('handleValidationError', () => {
    it('handles single validation error', () => {
      errorHandler.handleValidationError('Invalid input', mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Validation failed', // Default message
        life: 5000,
      });
    });

    it('handles multiple validation errors', () => {
      const errors = ['Field is required', 'Invalid format'];
      errorHandler.handleValidationError(errors, mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Validation failed', // Default message
        life: 5000,
      });

      // Verify individual errors are logged to console
      expect(consoleErrorSpy).toHaveBeenCalledWith('Validation Error:', 'Field is required');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Validation Error:', 'Invalid format');
    });

    it('uses custom message when provided', () => {
      errorHandler.handleValidationError('Error', mockToast, 'Custom validation error');

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Custom validation error',
        life: 5000,
      });
    });

    it('logs to console when toast is not provided', () => {
      errorHandler.handleValidationError(['Error'], undefined, 'Custom validation error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Toast service not provided, showing in console:',
        'Custom validation error'
      );
    });
  });

  describe('handleGenericError', () => {
    it('handles Error objects', () => {
      const error = new Error('Generic error occurred');
      errorHandler.handleGenericError(error, mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Generic error occurred',
        life: 5000,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Generic Error:', error);
    });

    it('handles string errors', () => {
      errorHandler.handleGenericError('Generic error message', mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Generic error message',
        life: 5000,
      });
    });

    it('uses custom message when provided', () => {
      const error = new Error('Original error');
      errorHandler.handleGenericError(error, mockToast, 'Custom generic error');

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Custom generic error',
        life: 5000,
      });
    });

    it('defaults to "An unexpected error occurred" for unknown error types', () => {
      errorHandler.handleGenericError(TEST_ERROR_VALUE, mockToast);

      expect(mockToast.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred',
        life: 5000,
      });
    });

    it('logs to console when toast is not provided', () => {
      errorHandler.handleGenericError('Generic error', undefined);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Toast service not provided, showing in console:',
        'Generic error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('Generic Error:', 'Generic error');
    });
  });
});
