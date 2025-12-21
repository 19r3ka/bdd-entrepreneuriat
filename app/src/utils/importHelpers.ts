import { db } from '@/services/local-db';
import type { Business } from '@/schemas/business';

/**
 * Check if a record meets minimum viability requirements (FR-009)
 * Must have business name and owner name
 */
export function meetsMinimumViability(row: Record<string, unknown>): boolean {
  const name = row.name || row['Business Name'] || row['Company Name'] || row.businessName;
  const entrepreneurId = row.entrepreneurId || row['Entrepreneur ID'] || row.ownerId;

  return Boolean(name && entrepreneurId);
}

/**
 * Find existing business for duplicate detection
 * Case-insensitive name match OR registration number match
 */
export async function findExisting(businessData: Partial<Business>): Promise<Business | null> {
  const list = await db.businesses.toArray();

  return (
    list.find(b => {
      const nameMatch =
        businessData.name && b.name.toLowerCase() === businessData.name.toLowerCase();
      const regMatch =
        businessData.registrationNumber && b.registrationNumber === businessData.registrationNumber;
      const emailMatch =
        businessData.contact?.email && b.contact?.email === businessData.contact.email;

      return nameMatch || regMatch || emailMatch;
    }) || null
  );
}

/**
 * Map row to contact info
 */
export function mapContact(row: Record<string, unknown>) {
  const email = row.email || row['Email'];
  const telephone = row.telephone || row['Phone'] || row['Telephone'] || row['Contact Number'];
  return email || telephone ? { email: email || '', telephone: telephone || '' } : undefined;
}

/**
 * Parse coordinates from row data
 */
export function parseCoordinates(row: Record<string, unknown>) {
  const lat = row.latitude || row['Latitude'] || row['Lat'];
  const lng = row.longitude || row['Longitude'] || row['Lng'] || row['Long'];

  if (lat && lng) {
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return { latitude, longitude };
    }
  }
  return undefined;
}

/**
 * Get basic address field from row
 */
export function getAddressField(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    if (row[key]) return String(row[key]);
  }
  return '';
}

/**
 * Map row to location info
 */
export function mapLocation(row: Record<string, unknown>) {
  return {
    street: getAddressField(row, ['street', 'Street', 'Address', 'Address Line 1']),
    city: getAddressField(row, ['city', 'City']),
    state: getAddressField(row, ['state', 'State', 'Province']),
    country: getAddressField(row, ['country', 'Country']),
    postalCode: getAddressField(row, ['postalCode', 'Postal Code', 'Zip']),
    coordinates: parseCoordinates(row),
  };
}

/**
 * Map common column names to Business schema fields
 */
export function mapRowToBusiness(row: Record<string, unknown>): Partial<Business> {
  const mapped: Record<string, unknown> = {
    name: row.name || row['Business Name'] || row['Company Name'] || row.businessName,
    registrationNumber: row.registrationNumber || row['Registration Number'] || row['Reg Number'],
    primaryBusinessArea: row.primaryBusinessArea || row['Business Area'] || row['Primary Area'],
    entrepreneurId: row.entrepreneurId || row['Entrepreneur ID'] || row['Owner ID'] || row.ownerId,
    registrationDate: row.registrationDate || row['Registration Date'],
    activityStartDate: row.activityStartDate || row['Activity Start Date'] || row['Start Date'],
    supportStartDate: row.supportStartDate || row['Support Start Date'],
    contact: mapContact(row),
    location: mapLocation(row),
  };

  // Clean up undefineds and empty strings
  Object.keys(mapped).forEach(key => {
    if (mapped[key] === undefined || mapped[key] === '') {
      delete mapped[key];
    }
  });
  return mapped as Partial<Business>;
}
