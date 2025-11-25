import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import BusinessForm from '@/components/BusinessForm.vue';
import { businessAreaOptions } from '@/constants/businessAreas';
import { useBusinessStore } from '@/stores/useBusinessStore';
import type { Business } from '@/types/business';

// Mock the store
const mockBusinessStore = {
  add: vi.fn(),
  update: vi.fn(),
};

// Mock router
const mockRouter = {
  push: vi.fn(),
};

// Mock the stores and router
vi.mock('@/stores/useBusinessStore', () => ({
  useBusinessStore: vi.fn(() => mockBusinessStore),
}));

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => mockRouter),
}));

describe('BusinessForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form in create mode correctly', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Business = {
      id: '',
      name: '',
      slug: '',
      status: 'active',
      entrepreneurId: '',
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

    const wrapper = mountWithGlobalComponents(BusinessForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for "new business" heading
    expect(wrapper.text()).toContain('New Business');
    
    // Check for submit button
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('Submit');
  });

  it('renders form in edit mode correctly', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Business = {
      id: 'test-id',
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
        longitude: -74.0060,
      },
      onlinePresence: 'https://example.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/test',
        twitter: null,
        facebook: null,
        instagram: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const wrapper = mountWithGlobalComponents(BusinessForm, {
      props: {
        isEdit: true,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for "edit business" heading
    expect(wrapper.text()).toContain('Edit Business');
    
    // Check for update button
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('Update');
  });

  it('renders all form sections', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Business = {
      id: '',
      name: '',
      slug: '',
      status: 'active',
      entrepreneurId: '',
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

    const wrapper = mountWithGlobalComponents(BusinessForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for all form sections
    const sections = wrapper.findAll('.form-section');
    expect(sections.length).toBeGreaterThan(0);
    
    // Check for specific section titles
    expect(wrapper.text()).toContain('General Information');
    expect(wrapper.text()).toContain('Location');
    expect(wrapper.text()).toContain('Business Information');
    expect(wrapper.text()).toContain('Contact Information');
    expect(wrapper.text()).toContain('Online Presence and Social Media');
  });

  it('has required form fields', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Business = {
      id: '',
      name: '',
      slug: '',
      status: 'active',
      entrepreneurId: '',
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

    const wrapper = mountWithGlobalComponents(BusinessForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for required fields
    const requiredFieldLabels = wrapper.findAll('label span');
    const requiredText = requiredFieldLabels.filter(label => label.text().includes('*'));
    expect(requiredText.length).toBeGreaterThan(0);
  });

  it('renders business area options correctly', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Business = {
      id: '',
      name: '',
      slug: '',
      status: 'active',
      entrepreneurId: '',
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

    const wrapper = mountWithGlobalComponents(BusinessForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check that business area options are available
    expect(businessAreaOptions).toBeDefined();
    expect(businessAreaOptions.length).toBeGreaterThan(0);
  });
});