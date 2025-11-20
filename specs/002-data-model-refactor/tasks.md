# Tasks: Data Model Refactor

**Input**: Design documents from `/specs/002-data-model-refactor/`

## Phase 1: Setup

- [X] T001 [P] Create directory `app/src/types`
- [X] T002 [P] Create directory `app/src/schemas`
- [X] T003 [P] Create directory `app/src/composables`
- [X] T004 [P] Create directory `app/src/components/common`
- [X] T005 Install Zod: `npm install zod`
- [X] T006 Install a toast notification library (e.g., `vue-toastification`): `npm install vue-toastification@next`

---

## Phase 2: Foundational

- [X] T007 [P] Create `app/src/schemas/entrepreneur.ts` with `EntrepreneurSchema`
- [X] T008 [P] Create `app/src/schemas/business.ts` with `BusinessSchema`
- [X] T009 [P] Add a Zod refinement to `BusinessSchema` to ensure `entrepreneurId` exists in the entrepreneur store. <!-- NOTE: This validation will be handled at the form submission level, not in the schema itself, to maintain separation of concerns. -->
- [X] T010 [P] Create `app/src/types/entrepreneur.ts` and infer `Entrepreneur` type from schema
- [X] T011 [P] Create `app/src/types/business.ts` and infer `Business` type from schema

---

## Phase 3: User Story 1 & 2 - Standardized Data Models & Robust Data Typing

**Goal**: Refactor existing code to use the new Zod-inferred types and eliminate `any`.

**Independent Test**: The application compiles without TypeScript errors and all data-related types are imported from `app/src/types`.

- [X] T012 [US1] Refactor `app/src/stores/entrepreneur.ts` to use the `Entrepreneur` type
- [X] T013 [US1] Refactor `app/src/stores/business.ts` to use the `Business` type
- [X] T014 [US1] Refactor `app/src/components/EntrepreneurForm.vue` to use the `Entrepreneur` type
- [X] T015 [US1] Refactor `app/src/components/BusinessForm.vue` to use the `Business` type
- [X] T016 [US2] Remove all instances of the `any` type from the codebase.

---

## Phase 4: User Story 3 - Centralized Validation & Error Handling UX

**Goal**: Implement Zod-based validation and a standardized UX for displaying errors.

**Independent Test**: Forms display validation errors from Zod, prevent submission with invalid data, and show toast notifications on error.

- [X] T017 [US3] Add validation refinements to `app/src/schemas/entrepreneur.ts` (phone, email, slug)
- [X] T018 [US3] Add validation refinements to `app/src/schemas/business.ts` (phone, email, URL)
- [X] T019 [US3] Refactor `app/src/components/EntrepreneurForm.vue` to use `EntrepreneurSchema` for validation
- [X] T020 [US3] Refactor `app/src/components/BusinessForm.vue` to use `BusinessSchema` for validation
- [X] T021 [US3] Implement logic in `BaseForm.vue` to disable the submit button when the form is invalid.
- [X] T022 [US3] Implement a global error handler that shows toast notifications for API errors.
- [X] T023 [US3] Ensure all form field error messages have a consistent style.

---

## Phase 5: Internationalization (i18n)

**Goal**: Externalize all user-facing strings for translation.

**Independent Test**: All UI text, including validation messages, is rendered from i18n locale files.

- [X] T024 [P] Create locale files for English and French in `app/src/locales`
- [X] T025 [P] Externalize all validation messages in Zod schemas to use the i18n library.
- [X] T026 [P] Externalize all labels and UI text in `BaseForm.vue` and `FormField.vue`.
- [X] T027 [P] Externalize all other UI text in the application.

---

## Phase 6: User Story 4 - Improved Code Reusability

**Goal**: Abstract form and store logic into reusable composables and components.

**Independent Test**: The new composables and components are used in the existing forms and stores.

- [X] T028 [US4] Create `app/src/composables/useForm.ts`
- [X] T029 [US4] Create `app/src/composables/useCrudStore.ts`
- [X] T030 [US4] Create `app/src/components/common/BaseForm.vue`
- [X] T031 [US4] Create `app/src/components/common/FormField.vue`
- [X] T032 [US4] Refactor `app/src/components/EntrepreneurForm.vue` to use `useForm` and `BaseForm`
- [X] T033 [US4] Refactor `app/src/components/BusinessForm.vue` to use `useForm` and `BaseForm`
- [X] T034 [US4] Refactor `app/src/stores/entrepreneur.ts` to use `useCrudStore`
- [X] T035 [US4] Refactor `app/src/stores/business.ts` to use `useCrudStore`

---

## Phase 7: User Story 5 - Enhanced Performance

**Goal**: Improve performance by fetching only necessary data and using optimistic updates.

**Independent Test**: Detail views load faster and UI updates are instantaneous.

- [X] T036 [US5] Add `fetchOne` function to `useCrudStore` in `app/src/composables/useCrudStore.ts`
- [X] T037 [US5] Refactor `app/src/views/EntrepreneurDetailView.vue` to use `fetchOne`
- [X] T038 [US5] Refactor `app/src/views/BusinessDetailView.vue` to use `fetchOne`
- [X] T039 [US5] Implement optimistic updates for `create`, `update`, and `delete` operations in `useCrudStore`

---

## Phase 8: User Story 6 - Reporting Flows

**Goal**: Implement reporting functionality for entrepreneurs and businesses.

**Independent Test**: Reports can be generated and verified for accuracy.

- [X] T040 [US6] Create a new view `app/src/views/ReportingView.vue`
- [X] T041 [US6] Add a route for the reporting view in `app/src/router/index.ts`
- [X] T042 [US6] Implement UI for generating entrepreneur and business reports in `ReportingView.vue`

---

## Phase 9: Testing & QA

**Goal**: Add comprehensive tests for the new architecture.

**Independent Test**: All tests pass.

- [X] T043 [P] [US6] Write unit tests for `EntrepreneurSchema` in `app/tests/unit/schemas/entrepreneur.spec.ts`
- [X] T044 [P] [US6] Write unit tests for `BusinessSchema` in `app/tests/unit/schemas/business.spec.ts`
- [X] T045 [P] [US6] Write unit tests for `useCrudStore` in `app/tests/unit/stores/crud.spec.ts`
- [X] T046 [P] [US6] Write integration tests for `EntrepreneurForm.vue` and `BusinessForm.vue`.
- [X] T047 [P] [US6] Write integration tests for the `entrepreneur` and `business` stores.
- [X] T048 [US6] Write end-to-end tests for the reporting flows.
- [X] T049 [US6] Write tests for the optimistic update functionality, including failure and rollback scenarios.
- [X] T050 [US6] Write tests for the `fetchOne` functionality.

---

## Phase 10: Tooling & Documentation

**Goal**: Improve the developer experience with better tooling and documentation.

**Independent Test**: The `README.md` is updated and the linter runs without errors.

- [X] T051 [P] Verify the Biome configuration and update it to enforce the project's coding standards.
- [X] T052 [P] Update the `README.md` to document the new architecture, including the use of Zod schemas, composables, and the new store patterns.

---

## Phase 11: Polish & Cross-Cutting Concerns

- [X] T053 Code cleanup and final review
- [X] T054 Validate quickstart.md and update if necessary
- [X] T055 Implement robust avatar upload feature with offline support using Dexie.
- [X] T056 Create `useImageResolver` composable for DRY image source handling.
- [X] T057 Refactor `AvatarDisplay`, `AvatarUpload`, and `DetailLayout` to use `useImageResolver`.
- [X] T058 Refactor business CSV export to reduce data redundancy.
- [X] T059 Fix random image fetching by switching to a more reliable service.
- [X] T060 Apply styling fixes to social media links and delete buttons.
