# Implementation Plan: Schema Refactoring & Optimization

**Branch**: `007-schema-refactor` | **Date**: 2025-12-10 | **Spec**: [specs/007-schema-refactor/spec.md](spec.md)
**Input**: Feature specification from `specs/007-schema-refactor/spec.md`

## Summary

Refactor the existing Zod schemas to eliminate duplication, strictly enforce types (removing `any`/`unknown`), and improve maintainability. Key changes include centralizing enums, creating atomic shared schemas, and implementing a discriminated union for the complex Monitoring & Evaluation (M&E) indicators.

## Technical Context

**Language/Version**: TypeScript ~5.9.0
**Primary Dependencies**: Zod (existing)
**Storage**: N/A (Schema validation layer only)
**Testing**: Vitest
**Target Platform**: Web (Vue 3 application)
**Project Type**: Single web project
**Performance Goals**: Validation performance must remain comparable to current implementation; TS inference speed should improve or stay neutral.
**Constraints**: Must handle legacy data via Zod preprocessing/coercion; strict typing is mandatory.
**Scale/Scope**: Refactoring ~10-15 schema files in `src/schemas`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Complexity**: **PASS**. Reduces cyclomatic complexity and code duplication.
- **Dependencies**: **PASS**. No new dependencies; leveraging existing Zod library more effectively.
- **Maintainability**: **PASS**. Atomic schemas and shared enums significantly improve maintainability.
- **Performance**: **PASS**. Optimized schemas should behave similarly at runtime.

## Project Structure

### Documentation (this feature)

```text
specs/007-schema-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (TypeScript Interfaces)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── schemas/
│   ├── enums/           # [NEW] Shared enum definitions
│   │   ├── index.ts
│   │   └── [domain].ts
│   ├── common/          # [NEW] Atomic shared schemas
│   │   ├── address.ts
│   │   ├── money.ts
│   │   ├── dates.ts
│   │   └── index.ts
│   ├── business.ts
│   ├── entrepreneur.ts
│   ├── indicator.ts     # [REFACTOR] Unified indicator schema
│   └── ...
└── ...
```

**Structure Decision**: Refactor in-place within `src/schemas`, introducing `enums/` and `common/` subdirectories to organize shared assets, matching the approved design option.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |