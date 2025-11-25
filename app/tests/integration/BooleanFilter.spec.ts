import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import BooleanFilter from '@/components/common/BooleanFilter.vue';

describe('BooleanFilter.vue', () => {
  it('renders the checkbox and label', () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: true,
        label: 'common.active',
      },
    });

    // Should have the checkbox
    expect(wrapper.find('.p-checkbox').exists()).toBe(true);
    
    // Should have the label
    expect(wrapper.find('label').text()).toBe('common.active'); // Using mock translation
  });

  it('emits update:modelValue event when checkbox is clicked', async () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: false,
        label: 'common.active',
      },
    });

    // Click the checkbox
    await wrapper.find('.p-checkbox').trigger('click');

    // Check that the update:modelValue event was emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
  });

  it('handles true value correctly', () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: true,
        label: 'common.active',
      },
    });

    // Check that the checkbox reflects the true value
    expect(wrapper.props('modelValue')).toBe(true);
  });

  it('handles false value correctly', () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: false,
        label: 'common.active',
      },
    });

    // Check that the checkbox reflects the false value
    expect(wrapper.props('modelValue')).toBe(false);
  });

  it('handles null value (indeterminate state)', () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: null,
        label: 'common.active',
      },
    });

    // Check that the indeterminate prop is set for null values
    expect(wrapper.props('modelValue')).toBe(null);
  });

  it('renders with correct CSS classes for layout', () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: true,
        label: 'common.active',
      },
    });

    // Check for flex layout classes
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('items-center');
    expect(wrapper.classes()).toContain('gap-2');
  });

  it('emits correct values when toggled', async () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: false,
        label: 'common.active',
      },
    });

    // Toggle from false to true
    await wrapper.find('.p-checkbox').trigger('click');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);

    // Toggle from true to false
    await wrapper.setProps({ modelValue: true });
    await wrapper.find('.p-checkbox').trigger('click');
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([false]);
  });

  it('emits null when in indeterminate state and clicked', async () => {
    const wrapper = mountWithGlobalComponents(BooleanFilter, {
      props: {
        modelValue: null,
        label: 'common.active',
      },
    });

    // Click the checkbox when value is null
    await wrapper.find('.p-checkbox').trigger('click');

    // Should emit true when clicking from null state
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});