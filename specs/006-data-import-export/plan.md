# Implementation Plan: Data Import and Export

**Branch**: `006-data-import-export` | **Date**: 2025-12-06 | **Spec**: [specs/006-data-import-export/spec.md](../spec.md)
**Input**: Feature specification from `/specs/006-data-import-export/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a robust data import/export system allowing users to download business data in CSV/Excel formats and upload files to populate the registry. It handles imperfect data by introducing a "Partial Record" workflow, where invalid or incomplete rows are quarantined as draft entities. A dashboard widget notifies users of these pending records, and a remediation interface allows for fixing and promoting them to full Business status.

## Technical Context

**Language/Version**: TypeScript ~5.9.0, Vue 3.5.22
**Primary Dependencies**: 
- **Existing**: Pinia (State), PrimeVue (UI), Zod (Validation), Dexie/Supabase (Storage)
- **New**: SheetJS (`xlsx`) - Preferred for unified CSV and Excel parsing/writing (replaces separate CSV/Excel research).
**Storage**: Dexie (Primary - IndexedDB), Supabase (Planned/Future Sync)
**Testing**: Vitest, Vue Test Utils
**Target Platform**: Web Application (Browser-based)
**Performance Goals**: Support import files up to 5,000 rows (FR-008) with responsive UI.
**Constraints**: Offline-first architecture. Must handle "dirty" data gracefully without corrupting the main registry. Strict type safety (Zod).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **KISS**: Complexity is managed by splitting "Partial" vs "Full" records clearly. Duplicate detection is strict/simple (FR).
- [x] **DRY**: Import logic will be centralized in composables/services.
- [x] **Object Calisthenics**: Validation logic will be encapsulated in Zod schemas.
- [x] **Vue Style Guide**: Standard SFC structure will be used.
- [x] **Third-Party Libraries**: SheetJS chosen to handle complex format parsing (CSV/Excel) robustly, avoiding brittle manual parsing.

## Project Structure

### Documentation (this feature)

```text
specs/006-data-import-export/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/src/
├── components/
│   ├── dashboard/
│   │   └── PartialRecordsWidget.vue  # New widget
│   ├── import-export/
│   │   ├── DataExportControl.vue     # Export UI
│   │   ├── DataImportUpload.vue      # File upload & initial parsing
│   │   └── PartialRecordEditor.vue   # Remediation UI
│   └── ...
├── composables/
│   ├── useImportExport.ts            # Logic for file handling
│   └── usePartialRecords.ts          # Logic for managing partials
├── schemas/
│   ├── partialRecord.ts              # Zod schema for partials
│   └── ...
├── services/
│   ├── importParser.ts               # Wrapper for SheetJS
│   └── ...
├── stores/
│   ├── usePartialRecordStore.ts      # Pinia store
│   └── ...
└── views/
    └── PartialRecordsView.vue        # Full list/edit view
```

**Structure Decision**: Standard Vue feature modularity. UI components split by function, logic in composables/stores.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New Dependency (SheetJS) | Core requirement (FR-001, FR-002) | Writing parsers from scratch is error-prone and violates KISS (reinventing wheel). SheetJS covers both CSV/Excel. |