# Tasks for Feature: Inclusive Data and Pluggable Business Map

**Branch**: `003-add-map-and-demographics` | **Spec**: [spec.md](./spec.md)

This document outlines the development tasks required to implement the feature. Tasks are organized by phase and priority.

## Phase 1: Environment Setup

- [X] T001 Install mapping libraries: `npm install leaflet vue3-leaflet && npm install --save-dev @types/leaflet` in `app/`
- [X] T002 Install new linting and formatting packages: `npm install --save-dev eslint prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier` in `app/`
- [X] T003 Remove Biome dependency: `npm uninstall @biomejs/biome` in `app/`
- [X] T004 Create ESLint configuration file at `app/.eslintrc.cjs` with content from `quickstart.md`
- [X] T005 Create Prettier configuration file at `app/.prettierrc.json` with content from `quickstart.md`
- [X] T006 Update `scripts` in `app/package.json` to replace biome with eslint and prettier commands.
- [X] T007 Update `app/.gitignore` to include `.env*`.

## Phase 2: Foundational Components

- [X] T008 [P] Create the base map component file at `app/src/components/MapComponent.vue`
- [X] T009 [P] Create the map composable file at `app/src/composables/useMap.ts`
- [X] T010 [P] Create the geocoding service file at `app/src/services/geocoding.ts` to interact with the Nominatim API.
- [X] T011 Implement basic map initialization logic in `app/src/composables/useMap.ts` using Leaflet.

## Phase 3: User Story 1 - Dashboard Map (P1)

**Goal**: Display all businesses on an interactive map on the dashboard.
**Independent Test**: The dashboard loads and displays a map with clustered business locations. Clicking a pin shows an info popup.

- [X] T012 [US1] Integrate `MapComponent.vue` into `app/src/views/HomeView.vue` (verify this is the correct dashboard view file before proceeding).
- [X] T013 [US1] Fetch business locations from the `useBusinessStore` and pass them as props to `MapComponent.vue`.
- [X] T014a [US1] Install marker cluster plugin: `npm install leaflet.markercluster && npm install --save-dev @types/leaflet.markercluster` in `app/`
- [X] T014b [US1] Implement pin rendering and clustering logic within `app/src/components/MapComponent.vue`.
- [X] T015 [US1] Implement the info window popup on pin click in `app/src/components/MapComponent.vue`.

## Phase 4: User Story 2 - Map in Business Form (P1)

**Goal**: Allow admins to set a business location using an interactive map in the business form.
**Independent Test**: Open the business edit form, search for an address, drag the pin, and save. Verify the new coordinates are saved.

- [ ] T016 [US2] Add an "edit mode" to `app/src/components/MapComponent.vue` controlled by a prop.
- [ ] T017 [US2] Implement address search functionality in `MapComponent.vue` using the `geocoding.ts` service.
- [ ] T018 [US2] Implement pin dragging logic in `MapComponent.vue` that emits coordinate updates.
- [ ] T019 [US2] Integrate `MapComponent.vue` (in edit mode) into `app/src/components/BusinessForm.vue`.

## Phase 5: User Story 3 - Map on Detail Page (P2)

**Goal**: Display a single business's location on its detail page.
**Independent Test**: Navigate to a business detail page and verify a map appears showing the correct location.

- [ ] T020 [US3] Integrate `MapComponent.vue` (in view-only mode) into `app/src/views/BusinessDetailView.vue`.
- [ ] T021 [US3] Fetch the single business's location and pass it to the `MapComponent.vue`.

## Phase 6: User Story 4 - Inclusive Entrepreneur Data (P2)

**Goal**: Add gender and age fields to entrepreneur profiles.
**Independent Test**: Edit an entrepreneur, add gender and date of birth, save, and verify the data is displayed on their profile.

- [ ] T022 [US4] Update the Zod schema in `app/src/schemas/entrepreneur.ts` to include `gender` and `dateOfBirth`.
- [ ] T023 [US4] Update the form in `app/src/components/EntrepreneurForm.vue` to include a dropdown for `gender` and a date picker for `dateOfBirth`.
- [ ] T024 [US4] Update `app/src/views/EntrepreneurDetailView.vue` to display the new gender and calculated age.
- [ ] T025 [US4] Update the `useEntrepreneurStore` to handle the new fields.

## Phase 7: Polish & Testing

- [ ] T026 [P] Add JSDoc comments to `app/src/components/MapComponent.vue` and `app/src/composables/useMap.ts`.
- [ ] T027 [P] Write unit tests for `app/src/composables/useMap.ts`.
- [ ] T028 [P] Write integration tests for `app/src/components/MapComponent.vue`.
- [ ] T029 [P] Write unit tests for the schema changes in `app/src/schemas/entrepreneur.ts`.
- [ ] T030 Review all UI changes for visual consistency and responsiveness.
- [ ] T031 [P] Create and run a performance test to verify that the dashboard map with all business pins loads in under 3 seconds (SC-003).

## Dependency Graph

- **US1 (Dashboard Map)** depends on: `Phase 2`
- **US2 (Form Map)** depends on: `Phase 2`
- **US3 (Detail Map)** depends on: `Phase 2`
- **US4 (Demographics)** is **independent**.

Story implementation can be ordered `(US1, US2)` in parallel, then `US3`, then `US4`. Or `US4` can be done at any time after Phase 1. A more accurate graph:

```
Phase 1 (Setup) -> Phase 2 (Foundational) -> US1, US2, US3
Phase 1 (Setup) -> US4
```

## Parallel Execution Examples

- **Story 1 (Dashboard Map)**: Tasks T012-T015 can be worked on in parallel with User Story 2 tasks as they affect different views, though they share the `MapComponent`. It's recommended one developer focuses on `MapComponent` enhancements while another integrates it.
- **Story 4 (Demographics)**: Tasks T022-T025 can be implemented completely independently of the map-related stories.

## Implementation Strategy

The suggested approach is to implement the foundational components first (Phase 2). Then, tackle the user stories. User Story 4 can be developed in parallel at any point. The map-related stories (US1, US2, US3) can also be partially parallelized. The MVP (Minimum Viable Product) for this feature would be the completion of User Story 4 and User Story 2, as this delivers the core data updates and the mechanism to input location data accurately. A secondary MVP would be delivering the Dashboard Map (US1).