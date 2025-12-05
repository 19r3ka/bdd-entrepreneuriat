// useErrorHandler.ts

import type { ToastServiceMethods } from 'primevue/toastservice'
import { useToast } from 'primevue/usetoast'

// Define the shapes of errors we expect to handle
export type AppError = Error | string | { message: string; code?: string }

/**
 *
 */
export function useErrorHandler() {
  const toast: ToastServiceMethods = useToast()

  /**
   *
   */
  function normalizeError(error: AppError, customMessage?: string): string {
    if (customMessage) return customMessage

    if (typeof error === 'string') {
      return error
    }
    if (error instanceof Error) {
      return error.message
    }
    if ('message' in error) {
      return error.message
    }
    return 'An unexpected error occurred'
  }

  /**
   *
   */
  function handleApiError(error: AppError, customMessage?: string): void {
    const message = normalizeError(error, customMessage)

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    })

    console.error('API Error:', error)
  }

  /**
   *
   */
  function handleValidationError(errors: AppError[] | AppError, customMessage?: string): void {
    const message = normalizeError(
      typeof errors === 'string' || errors instanceof Error || 'message' in (errors as any)
        ? (errors as AppError)
        : { message: 'Validation failed' },
      customMessage
    )

    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: message,
      life: 5000
    })

    if (Array.isArray(errors)) {
      errors.forEach((err) => console.error('Validation Error:', err))
    } else {
      console.error('Validation Error:', errors)
    }
  }

  /**
   *
   */
  function handleGenericError(error: AppError, customMessage?: string): void {
    const message = normalizeError(error, customMessage)

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    })

    console.error('Generic Error:', error)
  }

  return {
    handleApiError,
    handleValidationError,
    handleGenericError
  }
}
