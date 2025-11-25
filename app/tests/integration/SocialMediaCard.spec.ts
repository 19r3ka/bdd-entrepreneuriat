import { describe, it, expect } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import SocialMediaCard, { type SocialPlatform } from '@/components/common/SocialMediaCard.vue';

describe('SocialMediaCard.vue', () => {
  it('renders with default title when no title is provided', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaCard);

    // Should use the default translation for online presence
    expect(wrapper.text()).toContain('Online Presence');
  });

  it('renders with custom title when provided', () => {
    const customTitle = 'Social Media Links';
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        title: customTitle,
      },
    });

    expect(wrapper.text()).toContain(customTitle);
  });

  it('displays social media links correctly', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
        username: 'test-user'
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/test',
        icon: 'pi-twitter',
        username: 'test'
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Check that both social platforms are displayed
    expect(wrapper.text()).toContain('LinkedIn');
    expect(wrapper.text()).toContain('Twitter');
    expect(wrapper.text()).toContain('test-user');
    expect(wrapper.text()).toContain('test');
  });

  it('renders social media icons', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Check for the social media icon
    expect(wrapper.find('.pi-linkedin').exists()).toBe(true);
  });

  it('shows "Not Available" when no socials are provided', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: [],
      },
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('shows "Not Available" when socials prop is undefined', () => {
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: undefined,
      },
    });

    expect(wrapper.text()).toContain('Not Available');
  });

  it('has correct CSS classes and structure', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Check for PrimeVue card classes
    expect(wrapper.classes()).toContain('shadow-2');
    expect(wrapper.classes()).toContain('mb-4');
    
    // Check for flex wrapper for social links
    expect(wrapper.find('.flex').classes()).toContain('flex-wrap');
    expect(wrapper.find('.flex').classes()).toContain('gap-2');
    expect(wrapper.find('.flex').classes()).toContain('mt-2');
  });

  it('renders links with proper attributes', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe('https://linkedin.com/in/test');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
    expect(link.attributes('aria-label')).toBe('LinkedIn');
  });

  it('renders only icon when username is not provided', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
        // No username provided
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Should only contain the icon, not a username text
    expect(wrapper.find('.pi-linkedin').exists()).toBe(true);
    // Should not contain extra text besides the icon
    expect(wrapper.text()).not.toContain('undefined');
  });

  it('renders multiple social platforms correctly', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
        username: 'test-user'
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/test',
        icon: 'pi-twitter',
        username: 'test'
      },
      {
        name: 'Facebook',
        url: 'https://facebook.com/test',
        icon: 'pi-facebook',
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Check for all three platforms
    const socialLinks = wrapper.findAll('a');
    expect(socialLinks).toHaveLength(3);
    
    // Check that usernames are only shown for the first two
    expect(wrapper.text()).toContain('test-user');
    expect(wrapper.text()).toContain('test');
  });

  it('has proper accessibility attributes', () => {
    const socialPlatforms: SocialPlatform[] = [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/test',
        icon: 'pi-linkedin',
      }
    ];
    
    const wrapper = mountWithGlobalComponents(SocialMediaCard, {
      props: {
        socials: socialPlatforms,
      },
    });

    // Check for aria-label on the card
    expect(wrapper.attributes('aria-label')).toBe('Social Media Links');
    
    // Check for aria attributes on the link
    expect(wrapper.find('a').attributes('aria-label')).toBe('LinkedIn');
    expect(wrapper.find('i').attributes('aria-hidden')).toBe('true');
  });
});