export interface PartialRecord {
  id: string; // UUID
  rawData: Record<string, unknown>; // The complete row data from import
  missingFields: string[]; // List of fields that failed validation
  status: 'pending' | 'ignored';
  importSource: string; // Filename or batch ID
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}
