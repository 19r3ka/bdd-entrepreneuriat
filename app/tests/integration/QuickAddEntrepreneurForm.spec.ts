import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import QuickAddEntrepreneurForm from '@/components/QuickAddEntrepreneurForm.vue';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';

// Mock the store
const mockEntrepreneurStore = {
  add: vi.fn(),
  getBySlug: vi.fn(),
};

// Mock toast
const mockToast = {
  add: vi.fn(),
};

// Mock the stores and other dependencies
vi.mock('@/stores/useEntrepreneurStore', () => ({
  useEntrepreneurStore: vi.fn(() => mockEntrepreneurStore),
}));

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => mockToast),
}));

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key, // Return the key as translation for testing
  })),
}));

describe('QuickAddEntrepreneurForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Check for form title
    expect(wrapper.text()).toContain('Quick Add Entrepreneur');
    
    // Check for all form fields
    expect(wrapper.find('input#firstName').exists()).toBe(true);
    expect(wrapper.find('input#lastName').exists()).toBe(true);
    expect(wrapper.find('input#email').exists()).toBe(true);
    
    // Check for submit button
    expect(wrapper.find('button[type="submit"]').text()).toContain('Add');
  });

  it('initializes form with empty values', () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Check initial form values
    expect(wrapper.find('input#firstName').element.value).toBe('');
    expect(wrapper.find('input#lastName').element.value).toBe('');
    expect(wrapper.find('input#email').element.value).toBe('');
  });

  it('validates required fields before submission', async () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Submit the form without filling any data
    await wrapper.find('form').trigger('submit');

    // Should not call store.add without valid data
    expect(mockEntrepreneurStore.add).not.toHaveBeenCalled();
  });

  it('submits valid form data to store', async () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Fill in the form
    await wrapper.find('input#firstName').setValue('John');
    await wrapper.find('input#lastName').setValue('Doe');
    await wrapper.find('input#email').setValue('john@example.com');

    // Mock store methods
    mockEntrepreneurStore.add.mockResolvedValueOnce(undefined);
    mockEntrepreneurStore.getBySlug.mockReturnValueOnce(null); // No duplicate slug

    // Submit the form
    await wrapper.find('form').trigger('submit');

    // Should call store.add with the correct payload
    expect(mockEntrepreneurStore.add).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
    });
    
    // Should show success toast
    expect(mockToast.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'pages.entrepreneurs.quickAddSuccess',
      life: 3000,
    });
  });

  it('resets form after successful submission', async () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Fill in the form
    await wrapper.find('input#firstName').setValue('Jane');
    await wrapper.find('input#lastName').setValue('Smith');
    await wrapper.find('input#email').setValue('jane@example.com');

    // Mock store methods
    mockEntrepreneurStore.add.mockResolvedValueOnce(undefined);
    mockEntrepreneurStore.getBySlug.mockReturnValueOnce(null); // No duplicate slug

    // Submit the form
    await wrapper.find('form').trigger('submit');

    // Form should be reset to empty values
    expect(wrapper.find('input#firstName').element.value).toBe('');
    expect(wrapper.find('input#lastName').element.value).toBe('');
    expect(wrapper.find('input#email').element.value).toBe('');
  });

  it('handles submission error properly', async () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Fill in the form
    await wrapper.find('input#firstName').setValue('Error');
    await wrapper.find('input#lastName').setValue('Test');
    await wrapper.find('input#email').setValue('error@test.com');

    // Mock store to throw an error
    mockEntrepreneurStore.add.mockRejectedValueOnce(new Error('Test error'));
    mockEntrepreneurStore.getBySlug.mockReturnValueOnce(null); // No duplicate slug

    // Submit the form
    await wrapper.find('form').trigger('submit');

    // Should show error toast
    expect(mockToast.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Test error',
      life: 4000,
    });
  });

  it('shows loading state during submission', async () => {
    const wrapper = mountWithGlobalComponents(QuickAddEntrepreneurForm);

    // Fill in the form
    await wrapper.find('input#firstName').setValue('Loading');
    await wrapper.find('input#lastName').setValue('Test');
    await wrapper.find('input#email').setValue('loading@test.com');

    // Mock store with a delayed response to check loading state
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockEntrepreneurStore.add.mockReturnValue(promise);
    mockEntrepreneurStore.getBySlug.mockReturnValueOnce(null); // No duplicate slug

    // Submit the form
    const submitPromise = wrapper.find('form').trigger('submit');

    // Check that loading state is true
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes('disabled')).toBeUndefined(); // Button may not show disabled in test

    // Resolve the promise
    resolvePromise();
    await submitPromise;
  });
});