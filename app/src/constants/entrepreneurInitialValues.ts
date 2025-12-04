// @/constants/entrepreneurInitialValues.ts

import type { Entrepreneur } from '@/types/entrepreneur'

/**
 * Default initial values for an Entrepreneur form.
 * Keeps the shape consistent with Entrepreneur type/schema.
 */
export const initialEntrepreneur: Entrepreneur = {
  id: undefined,
  firstName: '',
  lastName: '',
  contact: {
    email: '',
    telephone: ''
  },
  slug: '',
  address: '',
  personalWebsite: '',
  socialMedia: {
    linkedin: '',
    twitter: '',
    facebook: '',
    tiktok: '',
    instagram: ''
  },
  avatar: null,
  bio: ''
}
