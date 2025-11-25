/**
 * Valid ISIC Rev.4 business area codes (A-U)
 * These codes correspond to the business areas defined in /constants/businessAreas.ts
 */
export const VALID_BUSINESS_AREA_CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'] as const;

export type BusinessAreaCode = typeof VALID_BUSINESS_AREA_CODES[number];
