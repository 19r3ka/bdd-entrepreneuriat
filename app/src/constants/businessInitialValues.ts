import type { Business } from '@/schemas/business';
import { v4 as uuidv4 } from 'uuid'; // For default UUID

/**
 * Default initial values for a Business form.
 */
export const initialBusiness: Business = {
  id: undefined, // Optional, undefined until persisted
  entrepreneurId: uuidv4(), // Required UUID, generate a placeholder
  name: '', // required string
  location: {
    // Reflects AddressSchema. All fields are optional initially.
    street: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: undefined, // Optional, no coordinates initially
  },
  contact: {
    // Reflects ContactInfoSchema
    email: '',
    telephone: '',
  },
  primaryBusinessArea: 'G', // Default to 'Wholesale and retail trade; repair of motor vehicles and motorcycles' (the G code)
  secondaryBusinessArea: undefined, // optional
  socialMedia: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: '',
    github: '',
  },
  registrationNumber: '', // optional string
  registrationDate: null, // optional date - Schema uses DateStringSchema now
  activityStartDate: null, // required date - Schema uses DateStringSchema now
  supportStartDate: null, // required date - Schema uses DateStringSchema now
  avatar: null, // optional, can be File or string later
  maturityLevels: undefined, // optional
};
