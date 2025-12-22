// Dexie Schema Definition (TypeScript Interface)

export interface PartialRecord {
  id: string; // UUID
  rawData: Record<string, any>; // The complete row data
  missingFields: string[];
  status: 'pending' | 'ignored';
  importSource: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

// Dexie Table Definition update (to be added to db.ts)
// db.version(X).stores({
//   partial_records: 'id, status, importSource, createdAt' // Indexed fields
// });
