import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import AvatarDisplay from '@/components/common/AvatarDisplay.vue';

// Mock the useImageResolver composable
vi.mock('@/composables/useImageResolver', () => ({
  useImageResolver: vi.fn(src => ({
    resolvedSrc: src, // For testing, just return the source as resolved
  })),
}));

// Mock the string helpers
vi.mock('@/utils/string.helpers', () => ({
  generateInitials: vi.fn((name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0).toUpperCase()).join('');
  }),
  getRandomColorClass: vi.fn(() => 'bg-blue-100'),
}));

describe('AvatarDisplay.vue', () => {
  it('renders with label initials when no src is provided', () => {
    const label = 'John Doe';
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
      },
    });

    // Should show initials based on the label
    expect(wrapper.text()).toBe('JD');

    // Should have the avatar-initials class
    expect(wrapper.classes()).toContain('avatar-initials');

    // Should have the random color class
    expect(wrapper.classes()).toContain('bg-blue-100');
  });

  it('renders with provided image when src is provided', () => {
    const label = 'Jane Smith';
    const src = 'https://example.com/avatar.jpg';
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
        src,
      },
    });

    // Should render the image instead of initials
    expect(wrapper.attributes('image')).toBe(src);
    expect(wrapper.text()).toBe(''); // No initials when image is available
  });

  it('applies correct size prop', () => {
    const label = 'Test User';
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
        size: 'large',
      },
    });

    expect(wrapper.attributes('size')).toBe('large');
  });

  it('applies correct shape prop', () => {
    const label = 'Test User';
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
        shape: 'circle',
      },
    });

    expect(wrapper.attributes('shape')).toBe('circle');
  });

  it('applies custom class when provided', () => {
    const label = 'Test User';
    const customClass = 'my-custom-class';
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
        customClass,
      },
    });

    expect(wrapper.classes()).toContain(customClass);
  });

  it('applies custom styles when provided', () => {
    const label = 'Test User';
    const style = { backgroundColor: 'red' };
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label,
        style,
      },
    });

    expect(wrapper.attributes('style')).toContain('background-color: red');
  });

  it('generates correct initials from label', () => {
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label: 'John Doe',
      },
    });

    expect(wrapper.text()).toBe('JD');
  });

  it('generates correct initials for single name', () => {
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label: 'John',
      },
    });

    expect(wrapper.text()).toBe('J');
  });

  it('generates correct initials for names with multiple words', () => {
    const wrapper = mountWithGlobalComponents(AvatarDisplay, {
      props: {
        label: 'John William Doe',
      },
    });

    expect(wrapper.text()).toBe('JWD');
  });
});
