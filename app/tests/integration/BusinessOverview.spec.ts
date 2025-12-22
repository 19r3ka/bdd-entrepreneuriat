import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import BusinessOverview from '@/components/common/BusinessOverview.vue';
import type { Business } from '@/types/business';

describe('BusinessOverview.vue', () => {
  it('renders business information correctly', () => {
    const mockBusiness: Business = {
      id: '1',
      name: 'Test Business',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Consulting',
      registrationNumber: '12345',
      registrationDate: new Date('2023-01-01'),
      activityStartDate: new Date('2023-02-01'),
      supportStartDate: new Date('2023-03-01'),
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '123-456-7890',
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      onlinePresence: 'https://test.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check that business information is displayed
    expect(wrapper.text()).toContain('Test Business');
    expect(wrapper.text()).toContain('Technology');
    expect(wrapper.text()).toContain('Consulting');
    expect(wrapper.text()).toContain('https://test.com');
    expect(wrapper.text()).toContain('12345');
  });

  it('displays "Not Available" for missing information', () => {
    const mockBusiness: Business = {
      id: '1',
      name: '',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: '',
      secondaryBusinessArea: '',
      registrationNumber: '',
      registrationDate: null,
      activityStartDate: null,
      supportStartDate: null,
      avatar: null,
      contact: {
        email: '',
        telephone: '',
      },
      location: {
        latitude: null,
        longitude: null,
      },
      onlinePresence: null,
      socialMedia: {
        linkedin: null,
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check that "Not Available" is shown for empty fields
    expect(wrapper.text()).toContain('Not Available');
  });

  it('formats dates correctly', () => {
    const mockBusiness: Business = {
      id: '1',
      name: 'Test Business',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Consulting',
      registrationNumber: '12345',
      registrationDate: new Date('2023-01-01'),
      activityStartDate: new Date('2023-02-01'),
      supportStartDate: new Date('2023-03-01'),
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '123-456-7890',
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      onlinePresence: 'https://test.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check that dates are formatted as expected (this will depend on the system's locale)
    expect(wrapper.text()).toContain('1/1/2023'); // This might be different based on locale
    expect(wrapper.text()).toContain('2/1/2023'); // This might be different based on locale
    expect(wrapper.text()).toContain('3/1/2023'); // This might be different based on locale
  });

  it('renders with the overview heading', () => {
    const mockBusiness: Business = {
      id: '1',
      name: 'Test Business',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Consulting',
      registrationNumber: '12345',
      registrationDate: new Date('2023-01-01'),
      activityStartDate: new Date('2023-02-01'),
      supportStartDate: new Date('2023-03-01'),
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '123-456-7890',
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      onlinePresence: 'https://test.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check for the "Overview" heading
    expect(wrapper.text()).toContain('Overview');
  });

  it('has correct CSS classes and structure', () => {
    const mockBusiness: Business = {
      id: '1',
      name: 'Test Business',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Consulting',
      registrationNumber: '12345',
      registrationDate: new Date('2023-01-01'),
      activityStartDate: new Date('2023-02-01'),
      supportStartDate: new Date('2023-03-01'),
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '123-456-7890',
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      onlinePresence: 'https://test.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check for PrimeFlex grid classes
    expect(wrapper.classes()).toContain('grid');
    expect(wrapper.classes()).toContain('formgrid');

    // Check for field classes
    expect(wrapper.findAll('.field').length).toBeGreaterThan(0);
  });

  it('renders all expected overview fields', () => {
    const mockBusiness: Business = {
      id: '1',
      name: 'Test Business',
      slug: 'test-business',
      status: 'active',
      entrepreneurId: 'ent-1',
      primaryBusinessArea: 'Technology',
      secondaryBusinessArea: 'Consulting',
      registrationNumber: '12345',
      registrationDate: new Date('2023-01-01'),
      activityStartDate: new Date('2023-02-01'),
      supportStartDate: new Date('2023-03-01'),
      avatar: null,
      contact: {
        email: 'test@example.com',
        telephone: '123-456-7890',
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      onlinePresence: 'https://test.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessOverview, {
      props: {
        business: mockBusiness,
      },
    });

    // Check that all expected field headings are present
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain('Primary Business Area');
    expect(wrapper.text()).toContain('Secondary Business Area');
    expect(wrapper.text()).toContain('Online Presence');
    expect(wrapper.text()).toContain('Registration Number');
    expect(wrapper.text()).toContain('Registration Date');
    expect(wrapper.text()).toContain('Activity Start Date');
    expect(wrapper.text()).toContain('Support Start Date');
  });
});
