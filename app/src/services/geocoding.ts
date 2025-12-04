const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

interface GeocodeResult {
  lat: string
  lon: string
  display_name: string
}

export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json'
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params.toString()}`, {
    headers: {
      'User-Agent': 'Entrepreneurs App / 1.0' // As per Nominatim usage policy
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch from Nominatim API')
  }

  const results: GeocodeResult[] = await response.json()
  return results
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json'
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params.toString()}`, {
    headers: {
      'User-Agent': 'Entrepreneurs App / 1.0'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to reverse geocode')
  }

  const result: { display_name: string } = await response.json()
  return result.display_name
}
