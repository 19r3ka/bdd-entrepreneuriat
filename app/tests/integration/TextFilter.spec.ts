import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import TextFilter from '@/components/common/TextFilter.vue';

describe('TextFilter.vue', () => {
  it('renders the input text field', () => {
    const wrapper = mountWithGlobalComponents(TextFilter);

    // Check for the input text component
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('accepts and displays placeholder text', () => {
    const placeholder = 'Search...';
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        placeholder,
      },
    });

    expect(wrapper.find('input').attributes('placeholder')).toBe(placeholder);
  });

  it('has correct CSS classes', () => {
    const wrapper = mountWithGlobalComponents(TextFilter);

    // Check for the w-full class
    expect(wrapper.classes()).toContain('w-full');
  });

  it('handles v-model binding correctly', async () => {
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        modelValue: 'initial value',
      },
    });

    // Check initial value
    expect(wrapper.find('input').element.value).toBe('initial value');

    // Update the input value
    await wrapper.find('input').setValue('new value');

    // Check that the update:modelValue event was emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value']);

    // Check that the value was updated
    expect(wrapper.props().modelValue).toBe('new value');
  });

  it('accepts null as initial value', () => {
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        modelValue: null,
      },
    });

    // Input should be empty when null is provided
    expect(wrapper.find('input').element.value).toBe('');
  });

  it('works with empty string as initial value', () => {
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        modelValue: '',
      },
    });

    // Input should be empty when empty string is provided
    expect(wrapper.find('input').element.value).toBe('');
  });

  it('has the correct input type', () => {
    const wrapper = mountWithGlobalComponents(TextFilter);

    // Check for text input type
    expect(wrapper.find('input').attributes('type')).toBe('text');
  });

  it('renders without any props provided', () => {
    const wrapper = mountWithGlobalComponents(TextFilter);

    // Component should render without errors when no props are provided
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('emits update:modelValue event when input changes', async () => {
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        modelValue: '',
      },
    });

    // Change the input value
    const input = wrapper.find('input');
    await input.setValue('test input');

    // Check that update:modelValue was emitted with the new value
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test input']);
  });

  it('maintains proper accessibility attributes', () => {
    const placeholder = 'Filter by name';
    const wrapper = mountWithGlobalComponents(TextFilter, {
      props: {
        placeholder,
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('placeholder')).toBe(placeholder);

    // Check for proper input attributes
    expect(input.attributes('role')).toBeUndefined(); // Input doesn't need explicit role
  });
});
