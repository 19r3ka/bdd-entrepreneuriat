import { SocialMediaSchema } from './socialMedia';
import { describe, it, expect } from 'vitest';

describe('SocialMediaSchema', () => {
  // ✅ Accepts valid URLs for each platform
  it('accepts valid URLs for each platform', () => {
    const result = SocialMediaSchema.safeParse({
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test',
      facebook: 'https://facebook.com/test',
      tiktok: 'https://tiktok.com/@test',
      instagram: 'https://instagram.com/test',
    });
    expect(result.success).toBe(true);
  });

  // ✅ Invalid URLs are caught and return empty string
  it('handles invalid URLs by returning empty string via .catch("")', () => {
    const result = SocialMediaSchema.safeParse({
      linkedin: 'not-a-url',
      website: 'invalid',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkedin).toBe('');
      expect(result.data.website).toBe('');
    }
  });

  // ✅ Optional fields default to empty string via .catch('')
  it('defaults to empty string via .catch("") when missing', () => {
    const result = SocialMediaSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      // All optional fields should be empty string due to .catch('')
      expect(result.data.linkedin).toBe('');
      expect(result.data.twitter).toBe('');
      expect(result.data.facebook).toBe('');
      expect(result.data.tiktok).toBe('');
      expect(result.data.instagram).toBe('');
      expect(result.data.website).toBe('');
      expect(result.data.github).toBe('');
    }
  });

  it('defaults to empty string for null values via .catch("")', () => {
    const result = SocialMediaSchema.safeParse({
      linkedin: null,
      twitter: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkedin).toBe('');
      expect(result.data.twitter).toBe('');
    }
  });
});
