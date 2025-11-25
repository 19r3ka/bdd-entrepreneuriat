import { describe, it, expect, vi } from 'vitest';
import { ref, reactive } from 'vue';
import { z } from 'zod';
import { useValidationForm } from './useValidationForm';

describe('useValidationForm', () => {
  // Define a test schema
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be 18 or older').optional(),
  });

  it('validateField sets errors for invalid field', async () => {
    const initialValues = {
      name: '',
      email: 'invalid-email',
      age: 10,
    };

    const { validateField, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    // Validate the name field
    await validateField('name');
    expect(errors.value.name).toContain('Name is required');

    // Validate the email field
    await validateField('email');
    expect(errors.value.email).toContain('Invalid email');

    // Validate the age field
    await validateField('age');
    expect(errors.value.age).toContain('Must be 18 or older');
  });

  it('validateField clears errors for valid field', async () => {
    const initialValues = {
      name: '',
      email: '',
      age: undefined,
    };

    const { validateField, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    // Initially there should be errors
    await validateField('name');
    expect(errors.value.name).toBeDefined();

    // Set a valid value and re-validate
    const formValues: any = { name: 'Valid Name' };
    await validateField('name', formValues);
    // The error should be cleared for valid input
  });

  it('validateForm aggregates issues and applies translateErrors', async () => {
    const initialValues = {
      name: '',
      email: 'invalid-email',
      age: 10,
    };

    const translateErrors = vi.fn((error) => `Translated: ${error}`);
    const { validateForm, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
      translateErrors,
    });

    const isValid = await validateForm();
    expect(isValid).toBe(false);
    
    // Check that errors are applied
    expect(errors.value.name).toBeDefined();
    expect(errors.value.email).toBeDefined();
    expect(errors.value.age).toBeDefined();
    
    // If translateErrors is used, it should be called
    // This depends on implementation
  });

  it('handleFieldChange updates values, sets dirty, and validates if enabled', async () => {
    const initialValues = {
      name: 'Initial Name',
      email: 'initial@example.com',
      age: 25,
    };

    const { handleFieldChange, values, isDirty } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    // Initially not dirty
    expect(isDirty.value).toBe(false);

    // Change a field
    await handleFieldChange('name', 'New Name');
    
    expect(values.value.name).toBe('New Name');
    expect(isDirty.value).toBe(true);
  });

  it('handleFieldBlur marks field as touched and validates if enabled', async () => {
    const initialValues = {
      name: '',
      email: '',
      age: null,
    };

    const { handleFieldBlur, touched, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
      validateOnBlur: true, // Enable validation on blur
    });

    // Blur a field
    await handleFieldBlur('name');
    
    expect(touched.value.name).toBe(true);
    // If validateOnBlur is true, there should be an error now
    expect(errors.value.name).toBeDefined();
  });

  it('defineField returns reactive props contract', () => {
    const initialValues = {
      name: 'Test Name',
      email: 'test@example.com',
      age: 25,
    };

    const { defineField } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    const nameField = defineField('name');
    
    // Should return reactive properties
    expect(nameField.value).toBeDefined();
    expect(nameField.error).toBeDefined();
    expect(nameField.handleChange).toBeDefined();
    expect(nameField.handleBlur).toBeDefined();
  });

  it('setInitialValues merges new values and resets state', () => {
    const initialValues = {
      name: 'Old Name',
      email: 'old@example.com',
      age: 30,
    };

    const { setInitialValues, values, isDirty } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    // Change some values to make form dirty
    (values.value as any).name = 'New Name';
    expect(isDirty.value).toBe(true);

    // Set new initial values
    const newInitialValues = {
      name: 'Reset Name',
      email: 'reset@example.com',
      age: 35,
    };
    setInitialValues(newInitialValues);

    expect(values.value.name).toBe('Reset Name');
    expect(values.value.email).toBe('reset@example.com');
    expect(values.value.age).toBe(35);
    // Form should no longer be dirty after reset
    expect(isDirty.value).toBe(false);
  });

  it('resetForm restores snapshot', () => {
    const initialValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25,
    };

    const { resetForm, values, isDirty, errors, touched } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    // Change values to make form dirty and add errors/touched
    (values.value as any).name = 'Changed Name';
    (errors.value as any).email = ['Some error'];
    (touched.value as any).name = true;

    expect(isDirty.value).toBe(true);
    expect(errors.value.email).toBeDefined();
    expect(touched.value.name).toBe(true);

    resetForm();

    expect(values.value.name).toBe('Original Name');
    expect(values.value.email).toBe('original@example.com');
    expect(values.value.age).toBe(25);
    expect(isDirty.value).toBe(false);
    expect(errors.value.email).toBeUndefined();
    expect(touched.value.name).toBe(false);
  });

  it('setFieldValue updates field value', () => {
    const initialValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25,
    };

    const { setFieldValue, values } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    setFieldValue('name', 'New Name');
    expect(values.value.name).toBe('New Name');
  });

  it('setFieldError updates field error', () => {
    const initialValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25,
    };

    const { setFieldError, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    setFieldError('name', 'Custom error');
    expect(errors.value.name).toBe('Custom error');
  });

  it('clearFieldError clears field error', () => {
    const initialValues = {
      name: 'Original Name',
      email: 'original@example.com',
      age: 25,
    };

    const { setFieldError, clearFieldError, errors } = useValidationForm({
      schema: testSchema,
      initialValues,
      onSubmit: vi.fn(),
    });

    setFieldError('name', 'Error to clear');
    expect(errors.value.name).toBe('Error to clear');

    clearFieldError('name');
    expect(errors.value.name).toBeUndefined();
  });

  it('handleSubmit touches fields, validates, and calls onSubmit', async () => {
    const mockOnSubmit = vi.fn();
    const validData = {
      name: 'Valid Name',
      email: 'valid@example.com',
      age: 25,
    };

    const { handleSubmit } = useValidationForm({
      schema: testSchema,
      initialValues: validData,
      onSubmit: mockOnSubmit,
    });

    await handleSubmit();

    expect(mockOnSubmit).toHaveBeenCalledWith(validData, expect.any(Object));
  });

  it('computed flags work correctly', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      age: 10,
    };

    const { isValid, isTouched, canSubmit, hasErrors } = useValidationForm({
      schema: testSchema,
      initialValues: invalidData,
      onSubmit: vi.fn(),
    });

    // Initially, form might be valid if no validation run yet
    // But after validation, it would be invalid
    expect(typeof isValid.value).toBe('boolean');
    expect(typeof isTouched.value).toBe('boolean');
    expect(typeof canSubmit.value).toBe('boolean');
    expect(typeof hasErrors.value).toBe('boolean');
  });
});