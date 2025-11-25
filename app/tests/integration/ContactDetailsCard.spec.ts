import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import ContactDetailsCard from '@/components/common/ContactDetailsCard.vue';

// Mock window.location for testing
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

describe('ContactDetailsCard.vue', () => {
  it('renders with default title when no title is provided', () => {
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email: 'test@example.com',
      },
    });

    // Should use the default translation for contact information
    expect(wrapper.text()).toContain('Contact Information');
  });

  it('renders with custom title when provided', () => {
    const customTitle = 'Entrepreneur Contact Info';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        title: customTitle,
        email: 'test@example.com',
      },
    });

    expect(wrapper.text()).toContain(customTitle);
  });

  it('displays email with proper mailto link', () => {
    const email = 'test@example.com';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email,
      },
    });

    expect(wrapper.text()).toContain(email);
    
    // Check for the mailto link
    const mailLink = wrapper.find(`a[href="mailto:${email}"]`);
    expect(mailLink.exists()).toBe(true);
    expect(mailLink.text()).toBe(email);
  });

  it('displays telephone with proper tel link', () => {
    const telephone = '+1-555-123-4567';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        telephone,
      },
    });

    expect(wrapper.text()).toContain(telephone);
    
    // Check for the tel link
    const telLink = wrapper.find(`a[href="tel:${telephone}"]`);
    expect(telLink.exists()).toBe(true);
    expect(telLink.text()).toBe(telephone);
  });

  it('displays address correctly', () => {
    const address = '123 Main St, New York, NY 10001';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        address,
      },
    });

    expect(wrapper.text()).toContain(address);
  });

  it('displays website with proper href', () => {
    const website = 'https://example.com';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        website,
      },
    });

    expect(wrapper.text()).toContain('example.com'); // Displayed host only
    
    // Check for the website link
    const websiteLink = wrapper.find(`a[href="${website}"]`);
    expect(websiteLink.exists()).toBe(true);
  });

  it('handles non-HTTPS website URLs correctly', () => {
    const website = 'www.example.com';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        website,
      },
    });

    // Should add https:// prefix to URLs that don't have a protocol
    const websiteLink = wrapper.find(`a[href="https://${website}"]`);
    expect(websiteLink.exists()).toBe(true);
    
    // Should still display the clean host name
    expect(wrapper.text()).toContain('example.com');
  });

  it('shows "Not Available" when no contact info is provided', () => {
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {},
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('does not show "Not Available" when at least one contact info is provided', () => {
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email: 'test@example.com',
      },
    });

    expect(wrapper.text()).not.toContain('Not Available');
  });

  it('renders all contact details when all are provided', () => {
    const email = 'test@example.com';
    const telephone = '+1-555-123-4567';
    const address = '123 Main St, New York, NY 10001';
    const website = 'https://example.com';

    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email,
        telephone,
        address,
        website,
      },
    });

    // All contact details should be present
    expect(wrapper.text()).toContain(email);
    expect(wrapper.text()).toContain(telephone);
    expect(wrapper.text()).toContain(address);
    expect(wrapper.text()).toContain('example.com');
  });

  it('renders icons for each contact type', () => {
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email: 'test@example.com',
        telephone: '+1-555-123-4567',
        address: '123 Main St',
        website: 'https://example.com',
      },
    });

    // Check for the presence of relevant icons
    const icons = wrapper.findAll('i');
    expect(icons).toHaveLength(4); // One for each contact type
    
    // Check for specific icon classes
    expect(wrapper.find('.pi-envelope').exists()).toBe(true);
    expect(wrapper.find('.pi-phone').exists()).toBe(true);
    expect(wrapper.find('.pi-map-marker').exists()).toBe(true);
    expect(wrapper.find('.pi-globe').exists()).toBe(true);
  });

  it('handles click on email link', async () => {
    const email = 'test@example.com';
    const wrapper = mountWithGlobalComponents(ContactDetailsCard, {
      props: {
        email,
      },
    });

    // Mock window.location assignment
    const originalHref = window.location.href;
    const mailLink = wrapper.find(`a[href="mailto:${email}"]`);
    
    await mailLink.trigger('click');
    
    // The click handler should update window.location.href
    expect(window.location.href).toBe(`mailto:${email}`);
    
    // Reset for other tests
    window.location.href = originalHref;
  });
});