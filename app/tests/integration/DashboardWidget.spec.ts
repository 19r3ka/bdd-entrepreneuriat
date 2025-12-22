import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import DashboardWidget from '@/components/DashboardWidget.vue';

describe('DashboardWidget.vue', () => {
  it('renders title and count props correctly', () => {
    const title = 'Total Users';
    const count = 42;
    const wrapper = mountWithGlobalComponents(DashboardWidget, {
      props: {
        title,
        count,
      },
    });

    expect(wrapper.text()).toContain(title);
    expect(wrapper.text()).toContain(count.toString());
    expect(wrapper.get('.text-500').text()).toBe(title);
    expect(wrapper.get('.text-900').text()).toBe(count.toString());
  });

  it('emits click event when widget is clicked', async () => {
    const wrapper = mountWithGlobalComponents(DashboardWidget, {
      props: {
        title: 'Test Widget',
        count: 10,
      },
    });

    // Check that no event has been emitted initially
    expect(wrapper.emitted()).not.toHaveProperty('click');

    // Trigger click
    await wrapper.trigger('click');

    // Verify the click event was emitted
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('has correct CSS classes and structure', () => {
    const wrapper = mountWithGlobalComponents(DashboardWidget, {
      props: {
        title: 'Test Widget',
        count: 10,
      },
    });

    // Check for the main widget class
    expect(wrapper.classes()).toContain('dashboard-widget');

    // Check for PrimeVue surface classes
    expect(wrapper.classes()).toContain('surface-0');
    expect(wrapper.classes()).toContain('shadow-2');
    expect(wrapper.classes()).toContain('p-3');
    expect(wrapper.classes()).toContain('border-1');
    expect(wrapper.classes()).toContain('border-50');
    expect(wrapper.classes()).toContain('border-round');

    // Check for hover cursor class
    expect(wrapper.classes()).toContain('cursor-pointer');
  });

  it('handles click event with callback', async () => {
    const mockCallback = vi.fn();
    const wrapper = mountWithGlobalComponents(DashboardWidget, {
      props: {
        title: 'Test Widget',
        count: 10,
      },
      attrs: {
        onClick: mockCallback,
      },
    });

    // Trigger click
    await wrapper.trigger('click');

    // Check that the callback was called
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
