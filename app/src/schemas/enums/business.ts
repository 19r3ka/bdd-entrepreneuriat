import { z } from 'zod';
import { VALID_BUSINESS_AREA_CODES } from '@/constants/businessAreaCodes';

export const BusinessAreaEnum = z.enum([...VALID_BUSINESS_AREA_CODES] as [string, ...string[]]);
export type BusinessArea = z.infer<typeof BusinessAreaEnum>;

export const BUSINESS_CATEGORY_OPTIONS = ['micro', 'small', 'medium', 'large'] as const;
export const BusinessCategoryEnum = z.enum(BUSINESS_CATEGORY_OPTIONS);
export type BusinessCategory = z.infer<typeof BusinessCategoryEnum>;

export const BUSINESS_SECTOR_OPTIONS = ['formal', 'informal'] as const;
export const BusinessSectorEnum = z.enum(BUSINESS_SECTOR_OPTIONS);
export type BusinessSector = z.infer<typeof BusinessSectorEnum>;
