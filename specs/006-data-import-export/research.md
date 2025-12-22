# Research: Data Import and Export

**Feature**: Data Import and Export (006)
**Status**: Complete

## Key Decisions

### 1. File Parsing Library
**Decision**: Use **SheetJS (`xlsx`)**.
**Rationale**:
- **Unified Handling**: Supports both CSV and Excel (XLSX) formats with a single API.
- **Browser Compatibility**: Excellent support for client-side parsing, reducing server load.
- **Community Standard**: Widely used, well-documented, and robust.
**Alternatives Considered**:
- *PapaParse*: Excellent for CSV but requires a separate library for Excel.
- *ExcelJS*: Good for Excel, but SheetJS is often lighter for simple read/write operations and widely adopted.

### 2. Partial Record Storage (Dexie / IndexedDB)
**Decision**: Use a `partial_records` table in the local Dexie database.
**Rationale**:
- **Offline-First**: Matches the project's core architecture. Users must be able to import/fix data without internet.
- **Flexibility**: IndexedDB supports storing arbitrary JavaScript objects (JSON-like) directly, making it perfect for unstructured `raw_data`.
- **Performance**: Local access is instant, preventing UI lag during heavy remediation tasks.
**Alternatives Considered**:
- *Supabase*: Rejected for this phase as synchronization is not yet implemented.
- *LocalStorage*: Too limited in size (5MB) for potentially large import batches.

### 3. Large File Handling
**Decision**: Client-side chunking/streaming is not required for the 5,000 row limit (approx < 1MB data).
**Rationale**:
- 5,000 rows of typical business data is small enough to load into memory and parse synchronously or with a simple Web Worker without complex streaming.
- Keep implementation simple (KISS).

### 4. Export Strategy & Foreign Key Handling
**Decision**: Resolve Foreign Keys to Human-Readable Values (Names) for CSV/Excel; Nested Objects for JSON.
**Rationale**:
- Users analyzing data in Excel/PowerBI need readable context (e.g., "Sector: Agriculture"), not raw UUIDs.
- **CSV/Excel**: Flatten the data structure. Swap IDs for Display Names (e.g., `entrepreneur_id` -> `entrepreneur_name`).
- **JSON**: Maintain the full graph structure or nested objects (e.g., `business: { id: "...", sector: { name: "Agri" } }`) to support programmatic usage.
- **Filtering**: Client-side filtering (Dexie `.where()` or `.filter()`) before export generation.

## Implementation Notes

- **SheetJS Import**: `import * as XLSX from 'xlsx';`
- **Type Safety**: Use Zod to parse the *result* of SheetJS into our `PartialRecord` structure, not to parse the file itself.
- **Performance**: If UI blocks during parse, wrap SheetJS calls in a `requestAnimationFrame` or simple `setTimeout` loop, or move to a Web Worker (start simple first).