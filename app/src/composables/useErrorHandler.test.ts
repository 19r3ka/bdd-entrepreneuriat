import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useErrorHandler, type AppError } from './useErrorHandler'
import { useToast } from 'primevue/usetoast'

// Mock PrimeVue toast and vue-i18n
vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn()
  }))
}))

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key // Simple translation mock
  }))
}))

describe('useErrorHandler', () => {
  let mockToastAdd: any

  beforeEach(() => {
    // We need to get the mock `add` function from the `useToast` mock
    mockToastAdd = vi.fn()
    vi.mocked(useToast).mockReturnValue({
      add: mockToastAdd,
      remove: vi.fn(),
      removeGroup: vi.fn(),
      removeAllGroups: vi.fn()
    })
    vi.spyOn(console, 'error').mockImplementation(() => {}) // Suppress console.error
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('handleApiError', () => {
    it('should show toast with a string error and log it', () => {
      const { handleApiError } = useErrorHandler()
      handleApiError('Network failed')

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Network failed',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('API Error:', 'Network failed')
    })

    it('should show toast with an Error object message and log it', () => {
      const { handleApiError } = useErrorHandler()
      const error = new Error('Server overload')
      handleApiError(error)

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Server overload',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('API Error:', error)
    })

    it('should use a custom message when provided', () => {
      const { handleApiError } = useErrorHandler()
      const error = new Error('Original error')
      handleApiError(error, 'Please try again later.')

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Please try again later.',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('API Error:', error)
    })
  })

  describe('handleValidationError', () => {
    it('should handle a single string error', () => {
      const { handleValidationError } = useErrorHandler()
      handleValidationError('Email is required.')

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Email is required.',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('Validation Error:', 'Email is required.')
    })

    it('should handle an array of errors by using a generic message', () => {
      const { handleValidationError } = useErrorHandler()
      const errors: AppError[] = ['Invalid name', { message: 'Email taken' }]
      handleValidationError(errors)

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Validation failed', // Default message for array
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('Validation Error:', 'Invalid name')
      expect(console.error).toHaveBeenCalledWith('Validation Error:', { message: 'Email taken' })
    })
  })

  describe('handleGenericError', () => {
    it('should show a toast with the provided error message', () => {
      const { handleGenericError } = useErrorHandler()
      const error = new Error('Something broke')
      handleGenericError(error)

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Something broke',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('Generic Error:', error)
    })

    it('should use a default message if the error is not standard', () => {
      const { handleGenericError } = useErrorHandler()
      const unusualError = { code: 500, status: 'Internal' }
      handleGenericError(unusualError as any)

      expect(mockToastAdd).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred',
        life: 5000
      })
      expect(console.error).toHaveBeenCalledWith('Generic Error:', unusualError)
    })
  })
})