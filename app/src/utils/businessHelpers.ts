import { type Business } from '@/schemas/business';
import { isProfileCompletedStrict } from '@/utils/schemaCompletion';
import { BusinessSchema } from '@/schemas/business';
import type { z } from 'zod';

type BusinessInput = z.input<typeof BusinessSchema>;

/**
 * Converts a date to ISO string safely
 */
export const toIsoString = (date: string | Date | null | undefined): string | null => {
  if (!date) return null;
  if (typeof date === 'string') {
    return !isNaN(Date.parse(date)) ? new Date(date).toISOString() : null;
  }
  return date instanceof Date ? date.toISOString() : null;
};

/**
 * Maps social media fields safely
 */
export const mapSocialMedia = (social?: Business['socialMedia']) => {
  if (!social) return undefined;
  return {
    linkedin: social.linkedin ?? '',
    twitter: social.twitter ?? '',
    facebook: social.facebook ?? '',
    tiktok: social.tiktok ?? '',
    instagram: social.instagram ?? '',
    website: social.website ?? '',
    github: social.github ?? '',
  };
};

/**
 * Enriches a business object with computed fields for UI
 */
export const enrichBusiness = (parsedBusiness: any, entrepreneur: any) => {
  return {
    ...parsedBusiness,
    ownerName: entrepreneur ? `${entrepreneur.firstName} ${entrepreneur.lastName}` : null,
    registrationDate: parsedBusiness.registrationDate
      ? new Date(parsedBusiness.registrationDate)
      : null,
    activityStartDate: parsedBusiness.activityStartDate
      ? new Date(parsedBusiness.activityStartDate)
      : null,
    supportStartDate: parsedBusiness.supportStartDate
      ? new Date(parsedBusiness.supportStartDate)
      : null,
    isRegistered: Boolean(parsedBusiness.registrationNumber && parsedBusiness.registrationDate),
    profileCompleted: isProfileCompletedStrict(BusinessSchema, parsedBusiness),
  };
};

/**
 * Prepares business data for persistence
 */
export const mapToBusinessInput = (business: any): BusinessInput => ({
  id: business.id,
  entrepreneurId: business.entrepreneurId,
  name: business.name,
  location: {
    street: business.location?.street,
    city: business.location?.city,
    state: business.location?.state,
    postalCode: business.location?.postalCode,
    country: business.location?.country,
    coordinates: business.location?.coordinates,
  },
  contact: {
    email: business.contact?.email,
    telephone: business.contact?.telephone,
  },
  primaryBusinessArea: business.primaryBusinessArea,
  secondaryBusinessArea: business.secondaryBusinessArea,
  socialMedia: mapSocialMedia(business.socialMedia),
  registrationNumber: business.registrationNumber,
  registrationDate: toIsoString(business.registrationDate),
  activityStartDate: toIsoString(business.activityStartDate),
  supportStartDate: toIsoString(business.supportStartDate),
  avatar: business.avatar,
  maturityLevels: business.maturityLevels,
});
