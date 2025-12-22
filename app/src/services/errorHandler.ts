// Global error handler service
import type { ToastServiceMethods } from 'primevue/toastservice';

/**
 *
 */
export class ErrorHandler {
  // Handle API errors - this method should be called from components where toast service is available
  /**
   *
   */
  handleApiError(error: unknown, toast?: ToastServiceMethods, customMessage?: string): void {
    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      message = (error as { message: string }).message;
    }

    if (customMessage) {
      message = customMessage;
    }

    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    } else {
      console.error('Toast service not provided, showing in console:', message);
    }

    console.error('API Error:', error);
  }

  // Handle validation errors from Zod schema
  /**
   *
   */
  handleValidationError(
    errors: unknown,
    toast?: ToastServiceMethods,
    customMessage?: string
  ): void {
    const message = customMessage || 'Validation failed';

    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: message,
        life: 5000,
      });
    } else {
      console.error('Toast service not provided, showing in console:', message);
    }

    // Log the validation errors for debugging
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        console.error('Validation Error:', error);
      });
    } else {
      console.error('Validation Error:', errors);
    }
  }

  // Handle generic errors
  /**
   *
   */
  handleGenericError(error: unknown, toast?: ToastServiceMethods, customMessage?: string): void {
    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      message = (error as { message: string }).message;
    }

    if (customMessage) {
      message = customMessage;
    }

    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    } else {
      console.error('Toast service not provided, showing in console:', message);
    }

    console.error('Generic Error:', error);
  }
}

// Create a singleton instance
export const errorHandler = new ErrorHandler();
