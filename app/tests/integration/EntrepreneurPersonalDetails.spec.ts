import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import EntrepreneurPersonalDetails from '@/components/common/EntrepreneurPersonalDetails.vue';
import type { Entrepreneur } from '@/types/entrepreneur';

describe('EntrepreneurPersonalDetails.vue', () => {
  it('renders entrepreneur personal information correctly', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      bio: 'Software developer and entrepreneur',
      avatar: null,
      contact: {
        email: 'john@example.com',
        telephone: '123-456-7890',
      },
      address: '123 Main St',
      personalWebsite: 'https://johndoe.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // Check that personal information is displayed
    expect(wrapper.text()).toContain('John');
    expect(wrapper.text()).toContain('Doe');
    expect(wrapper.text()).toContain('Software developer and entrepreneur');
    expect(wrapper.text()).toContain('https://johndoe.com');
  });

  it('displays "Not Available" for missing information', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: '',
      lastName: '',
      slug: 'empty-entrepreneur',
      bio: '',
      avatar: null,
      contact: {
        email: '',
        telephone: '',
      },
      address: '',
      personalWebsite: null,
      socialMedia: {
        linkedin: null,
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // Check that "Not Available" is shown for empty fields
    expect(wrapper.text()).toContain('Not Available');
  });

  it('renders with the personal information heading', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Smith',
      slug: 'jane-smith',
      bio: 'Business owner',
      avatar: null,
      contact: {
        email: 'jane@example.com',
        telephone: '098-765-4321',
      },
      address: '456 Oak Ave',
      personalWebsite: 'https://janesmith.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // Check for the "Personal Information" heading
    expect(wrapper.text()).toContain('Personal Information');
  });

  it('has correct CSS classes and structure', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      slug: 'test-user',
      bio: 'Test bio',
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '',
      },
      address: '',
      personalWebsite: null,
      socialMedia: {
        linkedin: null,
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // Check for PrimeFlex grid classes
    expect(wrapper.classes()).toContain('grid');
    expect(wrapper.classes()).toContain('formgrid');
    
    // Check for field classes
    expect(wrapper.findAll('.field').length).toBeGreaterThan(0);
  });

  it('renders all expected personal detail fields', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      slug: 'test-user',
      bio: 'Test bio',
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '',
      },
      address: '',
      personalWebsite: 'https://test.com',
      socialMedia: {
        linkedin: null,
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // Check that all expected field headings are present
    expect(wrapper.text()).toContain('First Name');
    expect(wrapper.text()).toContain('Last Name');
    expect(wrapper.text()).toContain('Bio');
    expect(wrapper.text()).toContain('Personal Website');
  });

  it('handles non-empty fields correctly', () => {
    const mockEntrepreneur: Entrepreneur = {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      slug: 'alice-johnson',
      bio: 'Experienced entrepreneur focusing on tech startups',
      avatar: null,
      contact: {
        email: 'alice@example.com',
        telephone: '555-123-4567',
      },
      address: '789 Pine St',
      personalWebsite: 'https://alicejohnson.dev',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/alicejohnson',
        twitter: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(EntrepreneurPersonalDetails, {
      props: {
        entrepreneur: mockEntrepreneur,
      },
    });

    // All fields should display their actual values, not "Not Available"
    expect(wrapper.text()).toContain('Alice');
    expect(wrapper.text()).toContain('Johnson');
    expect(wrapper.text()).toContain('Experienced entrepreneur focusing on tech startups');
    expect(wrapper.text()).toContain('https://alicejohnson.dev');
    
    // Should not contain "Not Available" since all important fields have values
    expect(wrapper.text()).not.toContain('Not Available');
  });
});