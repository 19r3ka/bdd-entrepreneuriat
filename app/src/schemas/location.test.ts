import { LocationSchema } from './location'; // LocationSchema now aliases AddressSchema
import { describe, it, expect } from 'vitest';

// Test constants for location coordinates
const VALID_LATITUDE = 45.678;
const VALID_LONGITUDE = -12.345;
const OUT_OF_RANGE_LONGITUDE = 200; // outside [-180, 180] range
const OUT_OF_RANGE_LATITUDE = 100; // outside [-90, 90] range

describe('LocationSchema (AddressSchema alias)', () => {
  // ✅ Accepts valid latitude/longitude in range
  it('accepts valid latitude/longitude in range', () => {
    const result = LocationSchema.safeParse({
      coordinates: {
        latitude: VALID_LATITUDE,
        longitude: VALID_LONGITUDE,
      },
    });
    expect(result.success).toBe(true);
  });

  // ❌ Rejects out-of-range values (e.g. longitude > 180)
  it('rejects out-of-range longitude values', () => {
    const result = LocationSchema.safeParse({
      coordinates: {
        latitude: VALID_LATITUDE,
        longitude: OUT_OF_RANGE_LONGITUDE, // outside [-180, 180] range
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects out-of-range latitude values', () => {
    const result = LocationSchema.safeParse({
      coordinates: {
        latitude: OUT_OF_RANGE_LATITUDE, // outside [-90, 90] range
        longitude: VALID_LONGITUDE,
      },
    });
    expect(result.success).toBe(false);
  });

  // ✅ Allows optional values
  it('allows optional coordinates', () => {
    const result = LocationSchema.safeParse({
      street: '123 Main St',
      city: 'Nairobi',
      // coordinates is optional
    });
    expect(result.success).toBe(true);
  });

  // ✅ Validates coordinates object properly
  it('validates coordinates object when present', () => {
    const result = LocationSchema.safeParse({
      coordinates: {
        latitude: VALID_LATITUDE,
        longitude: VALID_LONGITUDE,
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coordinates?.latitude).toBe(VALID_LATITUDE);
      expect(result.data.coordinates?.longitude).toBe(VALID_LONGITUDE);
    }
  });
});
