const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

/**
 * Searches for an address using the Nominatim API.
 */
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1', // Request structured address details
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
    headers: {
      'User-Agent': 'Entrepreneurs App / 1.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Nominatim API');
  }

  const results: GeocodeResult[] = await response.json();
  return results;
}

/**
 * Reverse geocodes coordinates to a structured address.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params.toString()}`, {
    headers: {
      'User-Agent': 'Entrepreneurs App / 1.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reverse geocode');
  }

  const result: GeocodeResult = await response.json();
  return result;
}
