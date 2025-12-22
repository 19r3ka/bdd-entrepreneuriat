import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import SocialMediaLinks from '@/components/common/SocialMediaLinks.vue';
import type { SocialMedia } from '@/types/socialMedia';

describe('SocialMediaLinks.vue', () => {
  it('renders with social media heading', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: null,
      },
    });

    // Check for the social media heading
    expect(wrapper.text()).toContain('Social Media');
  });

  it('displays social media links when provided', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
      facebook: null,
      instagram: 'https://instagram.com/test',
      tiktok: null,
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check that provided social media links are displayed
    expect(wrapper.text()).toContain('https://linkedin.com/in/test');
    expect(wrapper.text()).toContain('https://twitter.com/test');
    expect(wrapper.text()).toContain('https://instagram.com/test');

    // Check that labels are displayed
    expect(wrapper.text()).toContain('LinkedIn');
    expect(wrapper.text()).toContain('Twitter');
    expect(wrapper.text()).toContain('Instagram');
  });

  it('does not display empty social media fields', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: null,
      twitter: null,
      facebook: null,
      instagram: null,
      tiktok: null,
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Should not contain any social media URLs since all are null
    expect(wrapper.text()).not.toContain('http');
  });

  it('shows "Not Available" when no social media is provided', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: null,
      },
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('shows "Not Available" when social media object has no values', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: null,
      twitter: null,
      facebook: null,
      instagram: null,
      tiktok: null,
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('has correct CSS classes and structure', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
      twitter: null,
      facebook: null,
      instagram: null,
      tiktok: null,
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check for PrimeFlex grid classes
    expect(wrapper.classes()).toContain('grid');
    expect(wrapper.classes()).toContain('formgrid');

    // Check for field classes
    expect(wrapper.findAll('.field').length).toBeGreaterThan(0);
  });

  it('renders all social media platforms when all are provided', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
      facebook: 'https://facebook.com/test',
      instagram: 'https://instagram.com/test',
      tiktok: 'https://tiktok.com/@test',
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check that all social media platforms are displayed
    expect(wrapper.text()).toContain('https://linkedin.com/in/test');
    expect(wrapper.text()).toContain('https://twitter.com/test');
    expect(wrapper.text()).toContain('https://facebook.com/test');
    expect(wrapper.text()).toContain('https://instagram.com/test');
    expect(wrapper.text()).toContain('https://tiktok.com/@test');
  });

  it('renders responsive grid layout', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check for responsive column classes
    const fieldCols = wrapper.findAll('.col-12.md\\:col-6');
    expect(fieldCols.length).toBe(2); // Should have 2 columns for the provided social media
  });

  it('renders labels for each social media platform', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
      facebook: 'https://facebook.com/test',
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check that all labels are rendered
    expect(wrapper.text()).toContain('LinkedIn');
    expect(wrapper.text()).toContain('Twitter');
    expect(wrapper.text()).toContain('Facebook');
  });

  it('uses proper typography for values', () => {
    const mockSocialMedia: SocialMedia = {
      linkedin: 'https://linkedin.com/in/test',
    };

    const wrapper = mountWithGlobalComponents(SocialMediaLinks, {
      props: {
        socialMedia: mockSocialMedia,
      },
    });

    // Check that the value is displayed in a paragraph element
    const pTag = wrapper.find('p');
    expect(pTag.exists()).toBe(true);
    expect(pTag.text()).toBe('https://linkedin.com/in/test');
  });
});
