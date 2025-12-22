// @/constants/entrepreneurInitialValues.ts

import type { Entrepreneur } from '@/schemas/entrepreneur'; // Use schema for type inference

/**
 * Default initial values for an Entrepreneur form.
 * Keeps the shape consistent with Entrepreneur type/schema.
 */
export const initialEntrepreneur: Entrepreneur = {
  id: undefined, // undefined for new entries
  firstName: '',
  lastName: '',
  gender: undefined, // Default gender
  dateOfBirth: undefined, // Default date
  contact: {
    email: '',
    telephone: '',
  },
  slug: '',
  address: {
    // Aligns with AddressSchema
    street: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: undefined,
  },
  socialMedia: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: '',
    github: '',
  },
  avatar: null,
  bio: '',
};
