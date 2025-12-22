import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import FormField from '@/components/common/FormField.vue';

describe('FormField.vue', () => {
  it('renders with label and input field', () => {
    const name = 'testField';
    const label = 'Test Field';

    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name,
        label,
        modelValue: '',
      },
    });

    // Check for the label
    expect(wrapper.find('label').text()).toContain(label);
    expect(wrapper.find('label').attributes('for')).toBe(name);

    // Check for the input field
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('renders required marker when required prop is true', () => {
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        required: true,
      },
    });

    expect(wrapper.text()).toContain('*');
  });

  it('does not render required marker when required prop is false', () => {
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        required: false,
      },
    });

    expect(wrapper.text()).not.toContain('*');
  });

  it('displays error message when error prop is provided', () => {
    const error = { _errors: ['This field is required'] };
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        error,
      },
    });

    // Check for error class on input
    expect(wrapper.find('input').classes()).toContain('p-invalid');

    // Check for error message
    expect(wrapper.text()).toContain('This field is required');
  });

  it('displays help text when provided', () => {
    const helpText = 'Enter your information here';
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        helpText,
      },
    });

    expect(wrapper.text()).toContain(helpText);
  });

  it('uses correct component type based on props', () => {
    // Test textarea type
    const textareaWrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'bio',
        label: 'Bio',
        modelValue: '',
        type: 'textarea',
      },
    });
    expect(textareaWrapper.find('textarea').exists()).toBe(true);

    // Test default text type
    const textWrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'name',
        label: 'Name',
        modelValue: '',
        type: 'text',
      },
    });
    expect(textWrapper.find('input[type="text"]').exists()).toBe(true);

    // Test email type
    const emailWrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'email',
        label: 'Email',
        modelValue: '',
        type: 'email',
      },
    });
    expect(emailWrapper.find('input[type="email"]').exists()).toBe(true);
  });

  it('applies custom field class when provided', () => {
    const customFieldClass = 'col-12 md:col-6';
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        fieldClass: customFieldClass,
      },
    });

    expect(wrapper.classes()).toContain(customFieldClass);
  });

  it('emits update:modelValue event when input value changes', async () => {
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
      },
    });

    // Update the input value
    await wrapper.find('input').setValue('New Value');

    // Check that the update:modelValue event was emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New Value']);
  });

  it('renders with slot content when provided', () => {
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
      },
      slots: {
        input: '<input type="text" class="custom-input" value="slot-value" />',
      },
    });

    // Should render the slot content instead of default input
    expect(wrapper.find('.custom-input').exists()).toBe(true);
  });

  it('passes correct props to slot', () => {
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: 'initial-value',
      },
      slots: {
        input: '<div class="slot-content">{{ JSON.stringify($slots.input().data.attrs) }}</div>',
      },
    });

    // Should pass the correct slot props
    expect(wrapper.find('.slot-content').exists()).toBe(true);
  });

  it('handles blur event correctly', async () => {
    const mockOnBlur = vi.fn();
    const wrapper = mountWithGlobalComponents(FormField, {
      props: {
        name: 'testField',
        label: 'Test Field',
        modelValue: '',
        onBlur: mockOnBlur,
      },
    });

    // Trigger blur on the input
    await wrapper.find('input').trigger('blur');

    // Check that the onBlur callback was called
    expect(mockOnBlur).toHaveBeenCalled();
  });
});
