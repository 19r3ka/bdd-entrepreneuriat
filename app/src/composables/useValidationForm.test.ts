import { describe, it, expect, vi } from 'vitest'
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useValidationForm } from './useValidationForm'

describe('useValidationForm', () => {
  // Define a test schema
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18 or older').optional()
  })

  type TestFormValues = z.infer<typeof testSchema>

  it('validateField sets errors for invalid field', async () => {
    const initialValues: TestFormValues = {
      name: '',
      email: 'invalid-email',
      age: 10
    }

    const { validateField, errors } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    // Validate the name field
    validateField('name')
    expect(errors.value.name!._errors[0]).toContain('Name is required')

    // Validate the email field
    validateField('email')
    expect(errors.value.email!._errors[0]).toContain('Invalid email')

    // Validate the age field
    validateField('age')
    expect(errors.value.age!._errors[0]).toContain('Must be 18 or older')
  })

  it('validateField clears errors for valid field', async () => {
    const initialValues: TestFormValues = {
      name: '',
      email: '',
      age: undefined
    }

    const { validateField, errors, values } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    // Initially there should be errors
    validateField('name')
    expect(errors.value.name).toBeDefined()

    // Set a valid value and re-validate
    ;(values.value as TestFormValues).name = 'Valid Name'
    validateField('name')
    // The error should be cleared for valid input
    expect(errors.value.name).toBeUndefined()
  })

  it('validateForm aggregates issues and applies translateErrors', async () => {
    const initialValues: TestFormValues = {
      name: '',
      email: 'invalid-email',
      age: 10
    }

    const translateErrors = vi.fn((issues: z.core.$ZodIssue[]) =>
      issues.map((issue: z.core.$ZodIssue) => ({ ...issue, message: `Translated: ${issue.message}` }))
    )
    const { validateForm, errors } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
      translateErrors
    })

    const isValid = validateForm()
    expect(isValid).toBe(false)

    // Check that errors are applied
    expect(errors.value.name).toBeDefined()
    expect(errors.value.email).toBeDefined()
    expect(errors.value.age).toBeDefined()

    // If translateErrors is used, it should be called
    expect(translateErrors).toHaveBeenCalled()
    expect(errors.value.name!._errors[0]).toContain('Translated:')
    expect(errors.value.email!._errors[0]).toContain('Translated:')
    expect(errors.value.age!._errors[0]).toContain('Translated:')
  })

  it('handleFieldChange updates values, sets dirty, and validates if enabled', () => {
    const initialValues: TestFormValues = {
      name: 'Initial Name',
      email: 'initial@example.com',
      age: 25
    }

    const { handleFieldChange, values, isDirty } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    // Initially not dirty
    expect(isDirty.value).toBe(false)

    // Change a field
    handleFieldChange('name', 'New Name')

    expect((values.value as TestFormValues).name).toBe('New Name')
    expect(isDirty.value).toBe(true)
  })

  it('handleFieldBlur marks field as touched and validates if enabled', async () => {
    const initialValues: TestFormValues = {
      name: '',
      email: '',
      age: undefined
    }

    const { handleFieldBlur, touchedFields, errors } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
      validateOnBlur: true // Enable validation on blur
    })

    // Blur a field
    handleFieldBlur('name')

    expect(touchedFields.value.has('name')).toBe(true)
    // If validateOnBlur is true, there should be an error now
    expect(errors.value.name!._errors[0]).toBeDefined()
  })

  it('defineField returns reactive props contract', () => {
    const initialValues: TestFormValues = {
      name: 'Test Name',
      email: 'test@example.com',
      age: 25
    }

    const { defineField } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    const nameField = defineField('name')

    // Should return reactive properties
    expect(nameField.modelValue.value).toBeDefined()
    expect(nameField.error.value).toBeUndefined()
    expect(nameField['onUpdate:modelValue']).toBeTypeOf('function')
    expect(nameField.onBlur).toBeTypeOf('function')
  })

  it('setInitialValues merges new values and resets state', () => {
    const initialValues: TestFormValues = {
      name: 'Old Name',
      email: 'old@example.com',
      age: 30
    }

    const { setInitialValues, values, isDirty, setFieldValue } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    // Change some values to make form dirty
    setFieldValue('name', 'New Name')
    expect(isDirty.value).toBe(true)

    // Set new initial values
    const newInitialValues: TestFormValues = {
      name: 'Reset Name',
      email: 'reset@example.com',
      age: 35
    }
    setInitialValues(newInitialValues)

    expect((values.value as TestFormValues).name).toBe('Reset Name')
    expect((values.value as TestFormValues).email).toBe('reset@example.com')
    expect((values.value as TestFormValues).age).toBe(35)
    // Form should no longer be dirty after reset
    expect(isDirty.value).toBe(false)
  })

  it('resetForm restores snapshot', () => {
    const initialValues: TestFormValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25
    }

    const { resetForm, values, isDirty, errors, touchedFields, setFieldValue, setFieldError, handleFieldBlur } =
      useValidationForm({
        validationSchema: testSchema,
        initialValues,
        onSubmit: vi.fn()
      })

    // Change values to make form dirty and add errors/touched
    setFieldValue('name', 'Changed Name')
    setFieldError('email', 'Some error')
    handleFieldBlur('name')

    expect(isDirty.value).toBe(true)
    expect(errors.value.email).toBeDefined()
    expect(touchedFields.value.has('name')).toBe(true)

    resetForm()

    expect((values.value as TestFormValues).name).toBe('Original Name')
    expect((values.value as TestFormValues).email).toBe('original@example.com')
    expect((values.value as TestFormValues).age).toBe(25)
    expect(isDirty.value).toBe(false)
    expect(errors.value.email).toBeUndefined()
    expect(touchedFields.value.has('name')).toBe(false)
  })

  it('setFieldValue updates field value', () => {
    const initialValues: TestFormValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25
    }

    const { setFieldValue, values } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    setFieldValue('name', 'New Name')
    expect((values.value as TestFormValues).name).toBe('New Name')
  })

  it('setFieldError updates field error', () => {
    const initialValues: TestFormValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25
    }

    const { setFieldError, errors } = useValidationForm({
      validationSchema: testSchema,
      initialValues,
      onSubmit: vi.fn()
    })

    setFieldError('name', 'Custom error')
    expect(errors.value.name!._errors[0]).toBe('Custom error')
  })
})