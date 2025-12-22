import { businessAreaOptions } from '@/constants/businessAreas';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import type { Business } from '@/schemas/business';

/**
 * Resolve entrepreneur ID to name
 */
export function resolveEntrepreneurName(entrepreneurId: string): string {
  const entrepreneurStore = useEntrepreneurStore();
  const entrepreneur = entrepreneurStore.entrepreneurs.find(e => e.id === entrepreneurId);

  if (entrepreneur) {
    return `${entrepreneur.lastName}, ${entrepreneur.firstName}`;
  }

  return entrepreneurId; // Fallback to ID if not found
}

/**
 * Resolve business area code to human-readable label
 */
export function resolveBusinessAreaName(code: string): string {
  const area = businessAreaOptions.find(businessArea => businessArea.code === code);
  return area ? area.name : code;
}

/**
 * Formats a date for export
 */
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

/**
 * Helper to safely get string values or default to empty string
 */
function getVal(val: any): string {
  return val ?? '';
}

/**
 * Maps location fields for export
 */
function mapLocationForExport(business: Business): Record<string, string | number> {
  return {
    'location.street': getVal(business.location?.street),
    'location.city': getVal(business.location?.city),
    'location.state': getVal(business.location?.state),
    'location.postalCode': getVal(business.location?.postalCode),
    'location.country': getVal(business.location?.country),
    'location.latitude': business.location?.coordinates?.latitude ?? '',
    'location.longitude': business.location?.coordinates?.longitude ?? '',
  };
}

/**
 * Maps contact fields for export
 */
function mapContactForExport(business: Business): Record<string, string> {
  return {
    'contact.email': getVal(business.contact?.email),
    'contact.phone': getVal(business.contact?.telephone),
  };
}

/**
 * Maps social media fields for export
 */
function mapSocialMediaForExport(business: Business): Record<string, string> {
  const sm = business.socialMedia;
  if (!sm) return {};
  return {
    'socialMedia.facebook': getVal(sm.facebook),
    'socialMedia.twitter': getVal(sm.twitter),
    'socialMedia.linkedin': getVal(sm.linkedin),
    'socialMedia.instagram': getVal(sm.instagram),
    'socialMedia.tiktok': getVal(sm.tiktok),
    'socialMedia.website': getVal(sm.website),
    'socialMedia.github': getVal(sm.github),
  };
}

/**
 * Transform a Business object for export with human-readable FKs
 * @param business - Business object to transform
 * @returns Record<string, unknown> - Transformed business object
 */
export function transformBusinessForExport(business: Business): Record<string, unknown> {
  const result: Record<string, unknown> = {
    id: business.id,
    name: business.name,
    owner: resolveEntrepreneurName(business.entrepreneurId),
    entrepreneurId: business.entrepreneurId,
    registrationNumber: getVal(business.registrationNumber),
    registrationDate: formatDate(business.registrationDate),
    activityStartDate: formatDate(business.activityStartDate),
    supportStartDate: formatDate(business.supportStartDate),
    primaryBusinessArea: resolveBusinessAreaName(business.primaryBusinessArea),
    secondaryBusinessArea: business.secondaryBusinessArea
      ? resolveBusinessAreaName(business.secondaryBusinessArea)
      : '',
  };

  return {
    ...result,
    ...mapLocationForExport(business),
    ...mapContactForExport(business),
    ...mapSocialMediaForExport(business),
  };
}

/**
 * Get available export fields for user selection
 */
export function getAvailableExportFields(): Array<{ key: string; labelKey: string }> {
  return [
    { key: 'id', labelKey: 'importExport.fields.id' },
    { key: 'name', labelKey: 'importExport.fields.name' },
    { key: 'owner', labelKey: 'importExport.fields.owner' },
    { key: 'entrepreneurId', labelKey: 'importExport.fields.entrepreneurId' },
    { key: 'registrationNumber', labelKey: 'importExport.fields.registrationNumber' },
    { key: 'registrationDate', labelKey: 'importExport.fields.registrationDate' },
    { key: 'activityStartDate', labelKey: 'importExport.fields.activityStartDate' },
    { key: 'supportStartDate', labelKey: 'importExport.fields.supportStartDate' },
    { key: 'primaryBusinessArea', labelKey: 'importExport.fields.primaryBusinessArea' },
    { key: 'secondaryBusinessArea', labelKey: 'importExport.fields.secondaryBusinessArea' },
    // Granular location fields
    { key: 'location.street', labelKey: 'importExport.fields.location.street' },
    { key: 'location.city', labelKey: 'importExport.fields.location.city' },
    { key: 'location.state', labelKey: 'importExport.fields.location.state' },
    { key: 'location.postalCode', labelKey: 'importExport.fields.location.postalCode' },
    { key: 'location.country', labelKey: 'importExport.fields.location.country' },
    { key: 'location.latitude', labelKey: 'importExport.fields.location.latitude' },
    { key: 'location.longitude', labelKey: 'importExport.fields.location.longitude' },
    { key: 'contact.email', labelKey: 'importExport.fields.contact.email' },
    { key: 'contact.phone', labelKey: 'importExport.fields.contact.phone' },
    { key: 'socialMedia.facebook', labelKey: 'importExport.fields.socialMedia.facebook' },
    { key: 'socialMedia.twitter', labelKey: 'importExport.fields.socialMedia.twitter' },
    { key: 'socialMedia.linkedin', labelKey: 'importExport.fields.socialMedia.linkedin' },
    { key: 'socialMedia.instagram', labelKey: 'importExport.fields.socialMedia.instagram' },
  ];
}
