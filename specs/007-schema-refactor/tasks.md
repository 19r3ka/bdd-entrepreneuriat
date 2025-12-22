# Tasks: Schema Refactoring & Optimization

**Feature Branch**: `007-schema-refactor`
**Status**: Pending
**Phase**: Implementation

## Implementation Strategy

This refactor will be executed in several phases to systematically address schema definitions and their consumers.

1.  **Phase 1 (Setup)**: Create directory structure and move shared enums. **(Completed)**
2.  **Phase 2 (Atomic)**: Create shared reusable schemas (Address, Money, Dates) and update simple entities (Business, Entrepreneur). **(Completed)**
3.  **Phase 3 (M&E)**: Implement the complex discriminated union for Indicators and update all related M&E schemas. **(Completed)**
4.  **Phase 4 (Strictness - Schema Level)**: Final sweep to eliminate any remaining `any` types in schemas and preliminary verification. **(Ongoing, `tsc` failed here)**
5.  **Phase 5 (Adapting Consumers)**: Update UI components, stores, tests, and other files to correctly use the new, stricter schemas and types.
6.  **Phase 6 (Roadmap Integration)**: Address remaining atomic schema extractions and M&E refinements from the roadmap.
7.  **Phase 7 (Final Verification & Cleanup)**: Run all tests, linting, and perform final cleanup.

**Critical Rule**: Each task must result in a compilable state. When updating a schema, all its dependent files (if any exist in the same scope) should be considered, though we will target schema files primarily.

## Dependencies

1.  **Enums** must be centralized first (US1).
2.  **Atomic Schemas** depend on Enums (US2).
3.  **Entity Schemas** (Business/Entrepreneur) depend on Atomic Schemas (US2).
4.  **Indicator Schemas** (US3) depend on Enums and Atomic Schemas.
5.  **Strict Typing** (US4) is a cross-cutting concern applied throughout. Consumer adaptation (Phase 5) is critical for achieving US4 goals.

## Phase 1: Setup & Unified Enums (User Story 1)

**Goal**: Centralize all enum definitions to be single sources of truth.
**Independent Test**: Verify importing `GenderEnum` or `CurrencyEnum` from `src/schemas/enums` works and that no inline enums remain for these concepts.

- [x] T001 Create schema directory structure in `app/src/schemas` (enums, common)
- [x] T002 [US1] Create `app/src/schemas/enums/common.ts` with Gender, Currency, and Country enums
- [x] T003 [US1] Create `app/src/schemas/enums/business.ts` with BusinessArea, Categories, and Sector enums
- [x] T004 [US1] Create `app/src/schemas/enums/monitoring-evaluation.ts` with RBMLevel, IndicatorUnit, and Dimension enums
- [x] T005 [US1] Create `app/src/schemas/enums/index.ts` to export all enums
- [x] T005b [US1] Update `specs/007-schema-refactor/contracts` with generated TS interfaces (manual or script)
- [x] T006 [P] [US1] Refactor `app/src/schemas/entrepreneur.ts` to use shared `GenderEnum`
- [x] T007 [P] [US1] Refactor `app/src/schemas/business.ts` to use shared Business Enums
- [x] T008 [P] [US1] Refactor `app/src/schemas/monitoring-evaluation/MomentumMetric.ts` to use shared Enums
- [x] T009 [P] [US1] Refactor `app/src/schemas/monitoring-evaluation/OutputIndicator.ts` to use shared Enums

## Phase 2: Atomic & Composable Schemas (User Story 2)

**Goal**: Create reusable building blocks and compose them into main entity schemas.
**Independent Test**: `AddressSchema.parse({...})` works correctly; Business/Entrepreneur schemas import and use it.

- [x] T010 [US2] Create `app/src/schemas/common/dates.ts` with `DateStringSchema` (ISO validation & coercion)
- [x] T011 [US2] Create `app/src/schemas/common/money.ts` with `MoneySchema` (amount/currency object + legacy coercion)
- [x] T012 [US2] Create `app/src/schemas/common/address.ts` with `AddressSchema`
- [x] T013 [US2] Create `app/src/schemas/common/contact.ts` with `ContactInfoSchema`
- [x] T014 [US2] Create `app/src/schemas/common/index.ts` to export all atomic schemas
- [x] T015 [P] [US2] Refactor `app/src/schemas/business.ts` to use `AddressSchema` and `MoneySchema`
- [x] T016 [P] [US2] Refactor `app/src/schemas/entrepreneur.ts` to use `AddressSchema` and `ContactInfoSchema`
- [x] T017 [P] [US2] Refactor `app/src/schemas/location.ts` to alias or extend `AddressSchema`

## Phase 3: Consolidated M&E Indicator Logic (User Story 3)

**Goal**: Unify three disparate indicator schemas into one polymorphic structure.
**Independent Test**: Validate that a single `IndicatorSchema` can correctly parse and distinguish between standard, output, and momentum indicators based on `type`.

- [x] T018 [US3] Create `app/src/schemas/monitoring-evaluation/indicators/base.ts` with `BaseIndicatorSchema` (common fields)
- [x] T019 [US3] Create `app/src/schemas/monitoring-evaluation/indicators/standard.ts` (Standard variant)
- [x] T020 [US3] Create `app/src/schemas/monitoring-evaluation/indicators/output.ts` (Output variant)
- [x] T021 [US3] Create `app/src/schemas/monitoring-evaluation/indicators/momentum.ts` (Momentum variant)
- [x] T022 [US3] Create `app/src/schemas/monitoring-evaluation/indicators/index.ts` exporting the Discriminated Union
- [x] T023 [US3] Update `app/src/schemas/monitoring-evaluation/index.ts` to export the new structure
- [x] T024 [P] [US3] Refactor `app/src/schemas/monitoring-evaluation/Indicator.ts` to use/re-export new schemas (compatibility shim if needed)
- [x] T025 [P] [US3] Refactor `app/src/schemas/monitoring-evaluation/OutputIndicator.ts` to use/re-export new schemas
- [x] T026 [P] [US3] Refactor `app/src/schemas/monitoring-evaluation/MomentumMetricsIndicator.ts` to use/re-export new schemas

## Phase 4: Strictness - Schema Level (User Story 4)

**Goal**: Ensure zero `any` types and strictly inferred TypeScript types *within schema definitions*.
**Independent Test**: Run a script or check that confirms no `z.any()` usage exists in `src/schemas`.

- [x] T027 [US4] Scan and replace `z.any()`/`z.unknown()` in `app/src/schemas/partialRecord.ts` with specific types or unions
- [x] T028 [US4] Verify TypeScript inference for `Business` type matches expected interface
- [x] T029 [US4] Verify TypeScript inference for `Indicator` union type matches expected interface
- [x] T030 Run full type check (`tsc --noEmit`) to ensure no breaking changes in consuming code - **FAILED**

## Phase 5: Adapting Consumers (UI Components & Stores)

**Goal**: Update all consuming code to align with the new, stricter schema definitions and types.
**Independent Test**: `tsc --noEmit` runs successfully after all tasks in this phase are complete.

### Sub-phase: Initial Values & BaseForm Usage
- [x] T032 [US4] Update `app/src/constants/businessInitialValues.ts` to align with `AddressSchema`
- [x] T033 [US4] Update `app/src/constants/entrepreneurInitialValues.ts` to align with `AddressSchema`
- [x] T034 [US4] Refactor `app/src/components/common/BaseForm.vue` to ensure proper type inference for `values: z.infer<T>` in `onSubmit`
- [x] T035 [US4] Refactor `app/src/components/common/FormField.vue` to correctly handle `ComputedRef<unknown>` types for `modelValue`

### Sub-phase: Business & Entrepreneur Forms
- [x] T036 [US4] Refactor `app/src/components/BusinessForm.vue` to use new `AddressSchema` fields (coordinates) and updated date types
- [x] T037 [US4] Refactor `app/src/components/EntrepreneurForm.vue` to use new `AddressSchema` fields (coordinates) and updated date types
- [x] T038 [US4] Update `app/src/components/BusinessOverviewTab.vue` to use new `AddressSchema` fields
- [x] T039 [US4] Update `app/src/views/EntrepreneurDetailView.vue` to use new `AddressSchema` fields (for InteractiveMap and ContactDetailsCard)
- [x] T040 [US4] Update `app/src/views/HomeView.vue` to use new `AddressSchema` fields for map filtering

### Sub-phase: Monitoring & Evaluation Forms
- [x] T041 [US4] Refactor `app/src/components/monitoring-evaluation/GoalForm.vue` to use new `IndicatorDefinitionSchema` (which is `StandardIndicatorSchema`) and updated date types
- [x] T042 [US4] Refactor `app/src/components/monitoring-evaluation/MeasurementForm.vue` to use updated `MeasurementSchema` and date types
- [x] T043 [US4] Refactor `app/src/components/monitoring-evaluation/OutputIndicatorForm.vue` to use new `OutputIndicatorSchema` and `IndicatorUnitEnum`
- [x] T044 [US4] Refactor `app/src/components/monitoring-evaluation/QuickWinForm.vue` to use new indicator schemas and handle `values: unknown` properly
- [x] T045 [US4] Refactor `app/src/components/monitoring-evaluation/SupportBoostForm.vue` to use updated schemas and date types
- [x] T046 [US4] Refactor `app/src/components/monitoring-evaluation/SupportForm.vue` to use updated schemas and date types

### Sub-phase: Stores & Utilities
- [x] T047 [US4] Refactor `app/src/stores/useBusinessHealthStore.ts` to use new `Indicator` types
- [x] T048 [US4] Refactor `app/src/stores/useBusinessStore.ts` to use new `AddressSchema` and handle `id` typing
- [x] T049 [US4] Refactor `app/src/stores/useEntrepreneurStore.ts` to use new `EntrepreneurSchema` and handle `id` typing
- [x] T050 [US4] Refactor `app/src/composables/useCrudStore.ts` and its tests (`useCrudStore.test.ts`) to handle `id` typing and generic schema types correctly
- [x] T051 [US4] Refactor `app/src/composables/useImportExport.ts` and its tests (`useImportExport.test.ts`) for schema changes
- [x] T052 [US4] Refactor `app/src/composables/useMap.ts` to align with `AddressSchema`
- [x] T053 [US4] Refactor `app/src/utils/exportHelpers.ts` to align with `AddressSchema`
- [x] T054 [US4] Refactor `app/src/utils/validationTranslator.ts` for improved type safety

### Sub-phase: Test Files Update
- [x] T055 [US4] Update `app/src/schemas/location.test.ts` to reflect `AddressSchema` changes
- [x] T056 [US4] Update `app/src/schemas/monitoring-evaluation/Indicator.test.ts` to reflect `StandardIndicatorSchema`
- [x] T057 [US4] Update `app/src/schemas/monitoring-evaluation/OutputIndicator.test.ts` to reflect `OutputIndicatorSchema` and properties like `usageCount`

## Phase 6: Roadmap Integration & Further Refinements

**Goal**: Incorporate additional atomic schema extractions and M&E refinements from the roadmap that were not part of the initial task generation.
**Independent Test**: New schemas are defined and used.

### Sub-phase: Remaining Enum Extractions
- [x] T058 [US1] Create `app/src/schemas/enums/quickwin.ts` for `QuickWinCategoryEnum`
- [x] T059 [US1] Create `app/src/schemas/enums/activity.ts` for `ActivityStatusEnum` (if applicable)
- [x] T060 [US1] Create `app/src/schemas/enums/support.ts` for `BoostTypeEnum` and `ModalityEnum`
- [x] T061 [US1] Update `app/src/schemas/enums/index.ts` to export new enums
- [x] T062 [P] [US1] Refactor `app/src/schemas/monitoring-evaluation/QuickWin.ts` to use `QuickWinCategoryEnum`
- [x] T063 [P] [US1] Refactor `app/src/schemas/monitoring-evaluation/Support.ts` to use `BoostTypeEnum` and `ModalityEnum`

### Sub-phase: M&E Atomic Schemas & Unification
- [x] T064 [US3] Create `app/src/schemas/monitoring-evaluation/common/rbmFields.ts` with `RbmFieldsSchema`
- [x] T065 [US3] Create `app/src/schemas/monitoring-evaluation/common/quantity.ts` with `QuantitySchema` (value, unit, currency combination)
- [x] T066 [US3] Create `app/src/schemas/monitoring-evaluation/common/evidence.ts` with `EvidenceSchema` (for tracking evidence IDs)
- [x] T067 [US3] Review `app/src/schemas/monitoring-evaluation/Measurement.ts` and `app/src/schemas/monitoring-evaluation/IndicatorReading.ts` for unification potential (e.g., `ReadingSchema`)
- [x] T068 [US3] Update relevant M&E schemas to use `RbmFieldsSchema`, `QuantitySchema`, `EvidenceSchema`

## Phase 7: Final Verification & Cleanup

**Goal**: Ensure the entire codebase is type-safe, consistent, and clean.
**Independent Test**: All checks pass, no legacy files remain.

- [x] T069 Run full type check (`tsc --noEmit`) to ensure all errors are resolved (final pass for T030)
- [x] T070 Run unit tests (`npm test`) to verify SC-004 (no regressions)
- [x] T071 Run linter (`npm run lint`) to verify SC-005 (code quality)
- [x] T072 Remove any unused legacy schema files (if they were fully replaced and not just refactored in place)
- [x] T073 Update `app/src/i18n.ts` if any new validation messages are needed.
- [x] T074 Review `app/src/types/` for any types that can now be inferred directly from schemas.