# Quickstart: Data Import and Export

## Overview
This feature adds the ability to import businesses from CSV/Excel files and export data. It handles "dirty" data by saving it as **Partial Records** in the local database (IndexedDB) for later fixing.

## Dependencies
- `xlsx` (SheetJS): For parsing/writing files.
- `dexie`: For storing partial records locally.

## Key Components

### 1. `useImportExport` (Composable)
Handles the file reading logic.
```typescript
const { parseFile, exportData } = useImportExport();
const results = await parseFile(fileObject); 
// Returns { valid: [], partial: [] }
```

### 2. `usePartialRecordStore` (Store)
Manages the state of pending imports.
```typescript
const store = usePartialRecordStore();
await store.saveImportBatch(results.partial);
const count = store.pendingCount; // displayed in dashboard
```

### 3. Dashboard Widget
A simple notification component in `src/components/dashboard/PartialRecordsWidget.vue` that alerts the user if `pendingCount > 0`.

## Data Flow

1. **Upload**: User drops `.csv` or `.xlsx` in `DataImportUpload.vue`.
2. **Parse**: `xlsx` reads the file -> array of objects.
3. **Validate**: Each row is checked against `BusinessSchema` (Zod).
4. **Split**:
   - **Valid**: Immediately saved to `businesses` table (Dexie).
   - **Invalid**: Wrapped as `PartialRecord` and saved to `partial_records` table (Dexie).
5. **Notify**: Dashboard updates to show "X Pending Records".
6. **Fix**: User clicks widget -> `PartialRecordsView.vue` -> Edits data -> Re-validates -> Promotes to Business.

## Usage Example

### Exporting
```typescript
import { useImportExport } from '@/composables/useImportExport';

const { exportTable } = useImportExport();
// Exports current list to 'businesses-2025-12-06.xlsx'
await exportTable('businesses', dataArray, 'xlsx');
```
