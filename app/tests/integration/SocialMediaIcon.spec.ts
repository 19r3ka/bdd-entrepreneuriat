import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import SocialMediaIcon from '@/components/common/SocialMediaIcon.vue';

describe('SocialMediaIcon.vue', () => {
  it('renders LinkedIn icon correctly', () => {
    const url = 'https://linkedin.com/in/test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'linkedin',
        url,
      },
    });

    // Check for the link with correct URL
    expect(wrapper.find('a').attributes('href')).toBe(url);
    
    // Check for the correct aria-label
    expect(wrapper.find('a').attributes('aria-label')).toBe('LinkedIn Profile');
    
    // Check for the presence of the icon
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check for the default label
    expect(wrapper.text()).toContain('LinkedIn');
  });

  it('renders Twitter icon correctly', () => {
    const url = 'https://twitter.com/test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'twitter',
        url,
      },
    });

    // Check for the link with correct URL
    expect(wrapper.find('a').attributes('href')).toBe(url);
    
    // Check for the correct aria-label
    expect(wrapper.find('a').attributes('aria-label')).toBe('Twitter Profile');
    
    // Check for the presence of the icon
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check for the default label
    expect(wrapper.text()).toContain('Twitter');
  });

  it('renders Facebook icon correctly', () => {
    const url = 'https://facebook.com/test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'facebook',
        url,
      },
    });

    // Check for the link with correct URL
    expect(wrapper.find('a').attributes('href')).toBe(url);
    
    // Check for the correct aria-label
    expect(wrapper.find('a').attributes('aria-label')).toBe('Facebook Profile');
    
    // Check for the presence of the icon
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check for the default label
    expect(wrapper.text()).toContain('Facebook');
  });

  it('renders Instagram icon correctly', () => {
    const url = 'https://instagram.com/test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'instagram',
        url,
      },
    });

    // Check for the link with correct URL
    expect(wrapper.find('a').attributes('href')).toBe(url);
    
    // Check for the correct aria-label
    expect(wrapper.find('a').attributes('aria-label')).toBe('Instagram Profile');
    
    // Check for the presence of the icon
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check for the default label
    expect(wrapper.text()).toContain('Instagram');
  });

  it('renders TikTok icon correctly', () => {
    const url = 'https://tiktok.com/@test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'tiktok',
        url,
      },
    });

    // Check for the link with correct URL
    expect(wrapper.find('a').attributes('href')).toBe(url);
    
    // Check for the correct aria-label
    expect(wrapper.find('a').attributes('aria-label')).toBe('TikTok Profile');
    
    // Check for the presence of the icon
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check for the default label
    expect(wrapper.text()).toContain('TikTok');
  });

  it('uses custom label when provided', () => {
    const url = 'https://linkedin.com/in/test';
    const customLabel = 'My LinkedIn';
    
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'linkedin',
        url,
        label: customLabel,
      },
    });

    // Should use the custom label instead of the default one
    expect(wrapper.text()).toContain(customLabel);
    expect(wrapper.find('a').attributes('aria-label')).toBe(`${customLabel} Profile`);
  });

  it('has correct CSS classes for styling', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'linkedin',
        url: 'https://linkedin.com/in/test',
      },
    });

    // Check for PrimeVue button classes
    expect(wrapper.classes()).toContain('p-button');
    expect(wrapper.classes()).toContain('p-button-text');
    expect(wrapper.classes()).toContain('p-button-rounded');
    
    // Check for flex classes
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('items-center');
    expect(wrapper.classes()).toContain('gap-2');
  });

  it('has proper link attributes', () => {
    const url = 'https://twitter.com/test';
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'twitter',
        url,
      },
    });

    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe(url);
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('renders with correct icon size and styles', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'facebook',
        url: 'https://facebook.com/test',
      },
    });

    // Check for the icon container with specific dimensions
    const iconContainer = wrapper.find('span').element.children[0];
    expect(iconContainer).toBeDefined();
    
    // Check for text size class
    const textElement = wrapper.find('span.text-sm');
    expect(textElement.exists()).toBe(true);
  });

  it('renders with SVG icon component', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaIcon, {
      props: {
        icon: 'instagram',
        url: 'https://instagram.com/test',
      },
    });

    // Check that the SVG element is rendered
    expect(wrapper.find('svg').exists()).toBe(true);
    
    // Check that the SVG has the proper attributes
    const svg = wrapper.find('svg');
    expect(svg.attributes('viewBox')).toBe('0 0 24 24');
    expect(svg.attributes('fill')).toBe('currentColor');
  });
});