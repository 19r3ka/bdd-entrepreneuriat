import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import Header from '@/components/Header.vue';
import { useI18n } from 'vue-i18n';

describe('Header.vue', () => {
  it('renders the app name and logo', () => {
    const wrapper = mountWithGlobalComponents(Header);

    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('/logo.svg');
    
    // Check that the app name is rendered (using mock translation)
    expect(wrapper.text()).toContain('Entrepreneur App');
  });

  it('renders navigation links correctly', () => {
    const wrapper = mountWithGlobalComponents(Header);

    const navLinks = wrapper.findAll('a');
    expect(navLinks).toHaveLength(4);
    
    expect(navLinks[0].attributes('href')).toBe('/');
    expect(navLinks[0].text()).toContain('Dashboard');
    
    expect(navLinks[1].attributes('href')).toBe('/entrepreneurs');
    expect(navLinks[1].text()).toContain('Entrepreneurs');
    
    expect(navLinks[2].attributes('href')).toBe('/businesses');
    expect(navLinks[2].text()).toContain('Businesses');
    
    expect(navLinks[3].attributes('href')).toBe('/reports');
    expect(navLinks[3].text()).toContain('Reports');
  });

  it('renders user profile elements', () => {
    const wrapper = mountWithGlobalComponents(Header);

    // Check for notification button
    expect(wrapper.find('.p-button-text').exists()).toBe(true);
    
    // Check for user avatar
    expect(wrapper.find('.p-avatar').exists()).toBe(true);
  });

  it('has mobile menu button for responsive design', () => {
    const wrapper = mountWithGlobalComponents(Header);

    // Check for mobile menu button (visible on small screens)
    const mobileMenuButton = wrapper.find('a.lg\\:hidden');
    expect(mobileMenuButton.exists()).toBe(true);
    expect(mobileMenuButton.find('i.pi-bars').exists()).toBe(true);
  });

  it('applies correct CSS classes and structure', () => {
    const wrapper = mountWithGlobalComponents(Header);

    // Check main container classes
    expect(wrapper.classes()).toContain('surface-0');
    expect(wrapper.classes()).toContain('p-3');
    
    // Check flex layout classes
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('align-items-center');
    expect(wrapper.classes()).toContain('justify-content-between');
    
    // Check border classes
    expect(wrapper.classes()).toContain('border-b');
    expect(wrapper.classes()).toContain('surface-border');
  });
});