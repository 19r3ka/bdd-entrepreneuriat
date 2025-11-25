import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import AvatarUpload from '@/components/common/AvatarUpload.vue';

// Mock the useImageResolver composable
vi.mock('@/composables/useImageResolver', () => ({
  useImageResolver: vi.fn((src) => ({
    resolvedSrc: src, // For testing, just return the source as resolved
  })),
}));

describe('AvatarUpload.vue', () => {
  it('renders the FileUpload component with correct props', () => {
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
      },
    });

    // Should have the FileUpload component
    expect(wrapper.find('.p-fileupload').exists()).toBe(true);
    
    // Should have the default choose label
    expect(wrapper.text()).toContain('Choose Avatar');
  });

  it('uses custom label when provided', () => {
    const customLabel = 'Upload Photo';
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
        label: customLabel,
      },
    });

    expect(wrapper.text()).toContain(customLabel);
  });

  it('shows preview image when modelValue is provided', () => {
    const testImage = 'https://example.com/test.jpg';
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: testImage,
        altText: 'Test image',
      },
    });

    // Should show preview image
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(testImage);
    expect(img.attributes('alt')).toBe('Test image');
  });

  it('emits update:modelValue event when file is selected', async () => {
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
      },
    });

    // Create a mock file
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    // Trigger the select event (simulated)
    const fileUpload = wrapper.find('.p-fileupload');
    await fileUpload.trigger('select', {
      files: [mockFile],
    });

    // Check that the update:modelValue event was emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([mockFile]);
  });

  it('emits null when clear button is clicked', async () => {
    const testImage = 'https://example.com/test.jpg';
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: testImage,
      },
    });

    // Find and click the remove button
    const clearButton = wrapper.find('button[aria-label="Remove avatar"]');
    await clearButton.trigger('click');

    // Check that the update:modelValue event was emitted with null
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([null]);
  });

  it('displays error message when hasError is true', () => {
    const errorMessage = 'Invalid file type';
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
        hasError: true,
        errorMessage,
      },
    });

    // Should show the error message
    expect(wrapper.text()).toContain(errorMessage);
    
    // Should have error class
    expect(wrapper.find('.p-fileupload').classes()).toContain('p-invalid');
  });

  it('does not show preview when modelValue is null', () => {
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
      },
    });

    // Should not show any image
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('accepts only image files', () => {
    const wrapper = mountWithGlobalComponents(AvatarUpload, {
      props: {
        modelValue: null,
      },
    });

    // The FileUpload should have accept="image/*" prop
    const fileUpload = wrapper.find('.p-fileupload');
    expect(fileUpload.attributes('accept')).toBe('image/*');
  });
});