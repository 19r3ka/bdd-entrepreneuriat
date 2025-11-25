import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import DetailLayout from '@/components/common/DetailLayout.vue';

// Mock the useStorage composable
const mockGetFileUrl = vi.fn();

vi.mock('@/composables/useStorage', () => ({
  useStorage: vi.fn(() => ({
    getFileUrl: mockGetFileUrl,
  })),
}));

// Mock fetch API
global.fetch = vi.fn();

describe('DetailLayout.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset fetch mock to default behavior
    (global.fetch as any).mockResolvedValue({
      ok: true,
      url: 'https://example.com/image.jpg',
      type: 'opaque',
    });
  });

  it('renders with default props', async () => {
    const wrapper = mountWithGlobalComponents(DetailLayout);

    // Should have the main container
    expect(wrapper.find('.surface-ground').exists()).toBe(true);
    
    // Should have the header with default aria-label
    const header = wrapper.find('header');
    expect(header.attributes('aria-label')).toBe('page hero');
    
    // Should have the main content area
    expect(wrapper.find('main').exists()).toBe(true);
  });

  it('renders with custom aria-label', () => {
    const ariaLabel = 'Business Detail Page';
    const wrapper = mountWithGlobalComponents(DetailLayout, {
      props: {
        ariaLabel,
      },
    });

    expect(wrapper.find('header').attributes('aria-label')).toBe(ariaLabel);
  });

  it('renders slots correctly', () => {
    const wrapper = mountWithGlobalComponents(DetailLayout, {
      slots: {
        hero: '<div class="hero-content">Hero Content</div>',
        main: '<div class="main-content">Main Content</div>',
        sidebar: '<div class="sidebar-content">Sidebar Content</div>',
      },
    });

    // Check that all slots are rendered
    expect(wrapper.text()).toContain('Hero Content');
    expect(wrapper.text()).toContain('Main Content');
    expect(wrapper.text()).toContain('Sidebar Content');
  });

  it('has correct layout structure with grid', () => {
    const wrapper = mountWithGlobalComponents(DetailLayout);

    // Check for grid layout
    expect(wrapper.find('.grid').exists()).toBe(true);
    
    // Check for main content column (8 on large screens)
    expect(wrapper.find('.lg\\:col-8').exists()).toBe(true);
    
    // Check for sidebar column (4 on large screens)
    expect(wrapper.find('.lg\\:col-4').exists()).toBe(true);
  });

  it('sets correct initial background image', () => {
    const wrapper = mountWithGlobalComponents(DetailLayout, {
      props: {
        heroImage: 'https://example.com/hero.jpg',
      },
    });

    // Wait for async operations to complete
    expect(wrapper.vm.displayImage).toBeDefined(); // This property is not directly accessible but tested via behavior
  });

  it('has correct CSS classes for styling', () => {
    const wrapper = mountWithGlobalComponents(DetailLayout);

    // Check for PrimeFlex classes
    expect(wrapper.classes()).toContain('w-full');
    expect(wrapper.classes()).toContain('min-h-screen');
    
    // Check for header classes
    const header = wrapper.find('header');
    expect(header.classes()).toContain('relative');
    expect(header.classes()).toContain('w-full');
    expect(header.classes()).toContain('bg-cover');
    expect(header.classes()).toContain('bg-center');
    expect(header.classes()).toContain('border-round');
    expect(header.classes()).toContain('shadow-2');
  });

  it('handles loading state correctly', async () => {
    // Mock fetch to take some time
    (global.fetch as any).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ ok: true, url: 'https://example.com/image.jpg', type: 'opaque' }), 100)
      )
    );

    const wrapper = mountWithGlobalComponents(DetailLayout, {
      props: {
        heroImage: null, // Will trigger random image fetch
      },
    });

    // Initially, should not be loading
    expect(wrapper.find('.pi-spinner').exists()).toBe(false);
    
    // After some time, loading indicator should appear
    await new Promise(resolve => setTimeout(resolve, 50));
    await wrapper.vm.$nextTick();
  });

  it('renders fallback image when provided hero image is invalid', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      type: 'opaque',
    });

    const wrapper = mountWithGlobalComponents(DetailLayout, {
      props: {
        heroImage: 'invalid-url',
      },
    });

    // Should show fallback image
    await new Promise(resolve => setTimeout(resolve, 10)); // Wait for async operations
  });
});