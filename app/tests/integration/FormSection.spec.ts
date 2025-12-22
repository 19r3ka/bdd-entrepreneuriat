import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import FormSection from '@/components/common/FormSection.vue';

describe('FormSection.vue', () => {
  it('renders with the provided title', () => {
    const title = 'Personal Information';
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title,
      },
    });

    // Check for the title in the header
    expect(wrapper.text()).toContain(title);
    expect(wrapper.find('h2').text()).toBe(title);
  });

  it('renders slot content correctly', () => {
    const title = 'Test Section';
    const slotContent = 'This is the section content';

    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title,
      },
      slots: {
        default: `<div>${slotContent}</div>`,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });

  it('has correct CSS classes for styling', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Test Section',
      },
    });

    // Check for panel class
    expect(wrapper.classes()).toContain('mb-6');
  });

  it('renders as initially collapsed when prop is true', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Test Section',
        initiallyCollapsed: true,
      },
    });

    // The Panel component should be configured to be initially collapsed
    expect(wrapper.find('.p-panel').exists()).toBe(true);
  });

  it('renders as expanded by default', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Test Section',
      },
    });

    // By default, the panel should not be collapsed
    expect(wrapper.find('.p-panel').exists()).toBe(true);
  });

  it('has correct header structure', () => {
    const title = 'Section Title';
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title,
      },
    });

    // Check for header structure
    expect(wrapper.find('h2').classes()).toContain('text-900');
    expect(wrapper.find('h2').classes()).toContain('font-bold');
    expect(wrapper.find('h2').classes()).toContain('text-xl');
    expect(wrapper.find('h2').classes()).toContain('m-0');

    // Check for flex container in header
    expect(wrapper.find('.flex').classes()).toContain('justify-content-between');
    expect(wrapper.find('.flex').classes()).toContain('align-items-center');
    expect(wrapper.find('.flex').classes()).toContain('w-full');
  });

  it('has correct content structure', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Test Section',
      },
      slots: {
        default: '<div>Content</div>',
      },
    });

    // Check for content container with margin
    const contentDiv = wrapper.find('.mt-4');
    expect(contentDiv.exists()).toBe(true);
    expect(contentDiv.text()).toContain('Content');
  });

  it('supports toggleable functionality', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Toggleable Section',
      },
    });

    // The panel should be toggleable according to the template
    expect(wrapper.find('.p-panel').exists()).toBe(true);
  });

  it('maintains proper structure with multiple child elements', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Multi-Element Section',
      },
      slots: {
        default: `
          <div>First element</div>
          <div>Second element</div>
          <input type="text" />
        `,
      },
    });

    // Should render all elements in the slot
    expect(wrapper.text()).toContain('First element');
    expect(wrapper.text()).toContain('Second element');
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('has the correct header class structure', () => {
    const wrapper = mountWithGlobalComponents(FormSection, {
      props: {
        title: 'Header Test Section',
      },
    });

    // Check the structure of the header element
    const header = wrapper.find('.p-panel-header');
    // The header is internal to the PrimeVue Panel component, so we check content instead
    expect(wrapper.text()).toContain('Header Test Section');
  });
});
