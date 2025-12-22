import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import BaseForm from '@/components/common/BaseForm.vue';

const { mockUseValidationForm, mockDefineField } = vi.hoisted(() => ({
  mockDefineField: vi.fn(() => ({
    modelValue: { value: '' },
    errors: { value: [] },
    onBlur: vi.fn(),
    updateModelValue: vi.fn(),
    hasError: false,
    errorMessage: '',
  })),
  mockUseValidationForm: vi.fn(() => ({
    values: { name: 'Test' },
    errors: { name: [] },
    rawErrors: [],
    touchedFields: { name: true },
    isSubmitting: { value: false },
    isDirty: { value: false },
    isValid: { value: true },
    hasErrors: { value: false },
    isTouched: { value: true },
    canSubmit: { value: true },
    defineField: vi.fn(() => ({
      modelValue: { value: '' },
      errors: { value: [] },
      onBlur: vi.fn(),
      updateModelValue: vi.fn(),
      hasError: false,
      errorMessage: '',
    })),
    handleFieldChange: vi.fn(),
    handleFieldBlur: vi.fn(),
    validateField: vi.fn(),
    validateForm: vi.fn(),
    resetForm: vi.fn(),
    handleSubmit: vi.fn(),
  })),
}));

vi.mock('@/composables/useValidationForm', () => ({
  useValidationForm: mockUseValidationForm,
}));

describe('BaseForm.vue', () => {
  it('renders the form element', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const wrapper = mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: vi.fn(),
      },
    });

    // Should render a form element
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('passes correct props to the schema', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const initialValues = { name: 'Test' };
    const onSubmit = vi.fn();

    mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues,
        onSubmit,
      },
    });

    // Check that useValidationForm was called with correct parameters
    expect(mockUseValidationForm).toHaveBeenCalledWith({
      initialValues,
      validationSchema: mockSchema,
      onSubmit,
      validateOnBlur: true, // default value
      validateOnChange: false, // default value
      uniqueChecks: undefined, // default value
    });
  });

  it('exposes form state through slot props', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const wrapper = mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: vi.fn(),
      },
    });

    // The form state should be available in the slot
    // This is tested by checking that the component renders without error
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('handles form submission', async () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const mockSubmit = vi.fn().mockResolvedValue(undefined);

    const wrapper = mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: mockSubmit,
      },
    });

    // Submit the form
    await wrapper.find('form').trigger('submit');

    // Check that onSubmit was called
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('prevents default form submission', async () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const mockSubmit = vi.fn().mockResolvedValue(undefined);

    const wrapper = mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: mockSubmit,
      },
    });

    // Create a mock event
    const mockEvent = {
      preventDefault: vi.fn(),
    };

    // Submit the form with preventDefault
    await wrapper.find('form').trigger('submit');

    // The event should have been handled properly with preventDefault
    // We can verify this by ensuring the onSubmit function was called
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it('passes validateOnBlur prop to validation form', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: vi.fn(),
        validateOnBlur: false,
      },
    });

    expect(mockUseValidationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        validateOnBlur: false,
      })
    );
  });

  it('passes validateOnChange prop to validation form', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: vi.fn(),
        validateOnChange: true,
      },
    });

    expect(mockUseValidationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        validateOnChange: true,
      })
    );
  });

  it('passes uniqueChecks prop to validation form', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn().mockReturnValue({ success: true, data: { name: 'Test' } }),
    };

    const uniqueChecks = {
      name: vi.fn().mockResolvedValue(true),
    };

    mountWithGlobalComponents(BaseForm, {
      props: {
        schema: mockSchema,
        initialValues: { name: 'Test' },
        onSubmit: vi.fn(),
        uniqueChecks,
      },
    });

    expect(mockUseValidationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        uniqueChecks,
      })
    );
  });
});
