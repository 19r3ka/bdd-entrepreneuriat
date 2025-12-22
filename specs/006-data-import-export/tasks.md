# Tasks: Data Import and Export

**Feature**: Data Import and Export (006)
**Branch**: `006-data-import-export`
**Spec**: [specs/006-data-import-export/spec.md](../spec.md)

## Phase 1: Setup
**Goal**: Initialize project dependencies and base structures for import/export.

- [x] T001 Install SheetJS (`xlsx`) dependency
- [x] T002 [P] Create `PartialRecord` interface and update Dexie schema in `app/src/services/local-db.ts` (refer to `contracts/dexie-schema.ts`)
- [x] T003 [P] Create Zod schema for `PartialRecord` in `app/src/schemas/partialRecord.ts`
- [x] T004 [P] Create `usePartialRecordStore` in `app/src/stores/usePartialRecordStore.ts` with basic state (count, list)
- [x] T005 Create `importParser` service wrapper in `app/src/services/importParser.ts` to handle SheetJS interactions

## Phase 2: Foundational
**Goal**: Implement core parsing and validation logic required for all stories.

- [x] T006 Implement `parseFile` function in `app/src/services/importParser.ts` (CSV/Excel to JSON array)
- [x] T007 Implement validation logic in `app/src/composables/useImportExport.ts` to check against `BusinessSchema`
- [x] T007b Implement strict "Minimum Viability" check (FR-009: Name + Owner required) in `app/src/services/importParser.ts` - reject row if failed
- [x] T008 Implement `useImportExport` composable with `processImport` method that splits valid/invalid records
- [x] T009 Implement strict duplicate detection (exact match name/reg ID) in `app/src/composables/useImportExport.ts` (FR Edge Case)

## Phase 3: Export Business Data (User Story 1 - P1)
**Goal**: Allow users to export data to CSV/Excel with readable FKs.

- [x] T010 [US1] Implement FK resolution helper (UUID -> Name) in `app/src/utils/exportHelpers.ts` using existing Pinia stores (Sector, Location, etc.)
- [x] T011 [US1] Implement `exportData` function in `app/src/composables/useImportExport.ts` supporting CSV and XLSX formats
- [x] T012 [US1] Create `DataExportControl.vue` in `app/src/components/import-export/DataExportControl.vue` (UI Dialog)
- [x] T013 [US1] Implement "Export" triggers in `app/src/components/BusinessPerformanceTab.vue` (or wherever business list lives)
- [x] T014 [US1] Display Toast notifications for success/failure in UI

## Phase 4: Import Business Data (User Story 2 - P2)
**Goal**: Allow users to import files, validating and quarantining bad data.

- [x] T015 [US2] Add file upload UI in `app/src/components/import-export/DataImportUpload.vue`
- [x] T016 [US2] Implement "Import" button in `app/src/components/BusinessPerformanceTab.vue` (or global header)
- [x] T017 [US2] Display summary modal after import (Valid: X, Partial: Y, Rejected: Z)
- [x] T018 [US2] Implement logic to save Valid records to `BusinessStore` and Partial to `PartialRecordStore`

## Phase 5: Remediation Workflow (User Story 3 - P2)
**Goal**: Dashboard widget and editing interface for partial records.

- [x] T019 [US3] Create `PartialRecordsWidget.vue` in `app/src/components/dashboard/PartialRecordsWidget.vue` (shows count)
- [x] T020 [US3] Integrate widget into `app/src/views/PortfolioDashboardView.vue`
- [x] T021 [US3] Create `PartialRecordsView.vue` in `app/src/views/PartialRecordsView.vue` (List view)
- [x] T022 [US3] Add route for `/partial-records` in `app/src/router/index.ts`
- [x] T023 [US3] Create `PartialRecordEditor.vue` in `app/src/components/import-export/PartialRecordEditor.vue` (Edit form)
- [x] T024 [US3] Implement "Promote to Business" logic in `app/src/composables/usePartialRecords.ts` including duplicate name checks/conflict handling
- [x] T025 [US3] Implement "Ignore/Delete" logic in `app/src/composables/usePartialRecords.ts`

## Phase 6: Polish & Cross-Cutting
**Goal**: Ensure robustness, performance, and UX quality.

- [ ] T026 Add error handling for corrupted files in `importParser.ts` (FR Edge Case)
- [ ] T027 Enforce 5,000 row limit check in `importParser.ts` (FR-008)
- [ ] T028 Add loading states/spinners to Import/Export UI during processing
- [ ] T030 Verify offline behavior (IndexedDB persistence) for all new features

## Implementation Strategy
- **MVP Scope**: Phases 1, 2, 3, and 4. (Import/Export basic flow).
- **Incremental**: Start with solid parsing/validation (Phases 1-2), then add Export (Phase 3), then Import (Phase 4), finally Remediation (Phase 5).

## Dependencies
- T001 -> T005, T006 (SheetJS needed for parsing)
- T002, T003 -> T004, T018 (Schema needed for store/saving)
- T006 -> T008 (Parser needed for composable)
- T008 -> T016 (Composable needed for UI)
- T004 -> T020 (Store needed for dashboard widget)
