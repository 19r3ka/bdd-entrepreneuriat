import { z } from 'zod';

// Constants for coordinate validation
const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number().min(MIN_LATITUDE).max(MAX_LATITUDE),
      longitude: z.number().min(MIN_LONGITUDE).max(MAX_LONGITUDE),
    })
    .optional(),
});

export type Address = z.infer<typeof AddressSchema>;
