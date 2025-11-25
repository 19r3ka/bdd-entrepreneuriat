import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import EntrepreneurForm from '@/components/EntrepreneurForm.vue';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import type { Entrepreneur } from '@/types/entrepreneur';

// Mock the store
const mockEntrepreneurStore = {
  add: vi.fn(),
  update: vi.fn(),
};

// Mock router
const mockRouter = {
  push: vi.fn(),
};

// Mock the stores and router
vi.mock('@/stores/useEntrepreneurStore', () => ({
  useEntrepreneurStore: vi.fn(() => mockEntrepreneurStore),
}));

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => mockRouter),
}));

describe('EntrepreneurForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form in create mode correctly', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: '',
      firstName: '',
      lastName: '',
      slug: '',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for "new entrepreneur" heading
    expect(wrapper.text()).toContain('New Entrepreneur');
    expect(wrapper.text()).toContain('Entrepreneur Form');
    
    // Check for submit button
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('Submit');
  });

  it('renders form in edit mode correctly', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      bio: 'Software developer',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: true,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for "edit entrepreneur" heading
    expect(wrapper.text()).toContain('Edit Entrepreneur');
    
    // Check for update button
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain('Update');
  });

  it('renders all form sections', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: '',
      firstName: '',
      lastName: '',
      slug: '',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check for all form sections
    expect(wrapper.text()).toContain('Personal Information');
    expect(wrapper.text()).toContain('Contact Information');
    expect(wrapper.text()).toContain('Social & Digital Presence');
  });

  it('has required form fields', () => {
    const mockSchema = {
      parse: vi.fn(),
      safeParse: vi.fn(),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: '',
      firstName: '',
      lastName: '',
      slug: '',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Check that required fields are present
    const firstNameField = wrapper.find('[name="firstName"]');
    const lastNameField = wrapper.find('[name="lastName"]');
    const emailField = wrapper.find('[name="contact.email"]');
    
    expect(firstNameField.exists()).toBe(true);
    expect(lastNameField.exists()).toBe(true);
    expect(emailField.exists()).toBe(true);
  });

  it('submits the form and calls the appropriate store method', async () => {
    const mockSchema = {
      parse: vi.fn().mockReturnValue({}),
      safeParse: vi.fn().mockReturnValue({ success: true, data: {} }),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: '',
      firstName: '',
      lastName: '',
      slug: '',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: false,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Submit the form (simulating valid submission)
    await wrapper.find('form').trigger('submit');
    
    // Check that the store's add method was called for create mode
    expect(mockEntrepreneurStore.add).toHaveBeenCalled();
  });

  it('calls update method in edit mode', async () => {
    const mockSchema = {
      parse: vi.fn().mockReturnValue({}),
      safeParse: vi.fn().mockReturnValue({ success: true, data: {} }),
    };
    
    const mockInitialValues: Entrepreneur = {
      id: 'test-id',
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

    const wrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: true,
        initialValues: mockInitialValues,
        schema: mockSchema,
      },
    });

    // Submit the form (simulating valid submission)
    await wrapper.find('form').trigger('submit');
    
    // Check that the store's update method was called for edit mode
    expect(mockEntrepreneurStore.update).toHaveBeenCalled();
  });
});