---
description: "Task list for Bilingual Support feature"
---

# Tasks: Bilingual Support

**Input**: Design documents from `/specs/005-add-bilingual-support/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md
**Feature**: `005-add-bilingual-support`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify `vue-i18n` and `@vueuse/core` are installed in `app/package.json`
- [x] T002 Create directory `app/src/locales` for translation files

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories can be implemented

- [x] T003 Create `app/src/locales/en.json` implementing the schema from `data-model.md`
- [x] T004 Create `app/src/locales/fr.json` implementing the schema from `data-model.md` (defaulting to French content)
- [x] T005 Create unit tests `app/src/stores/useLanguageStore.test.ts` for store logic (TDD)
- [x] T006 Implement `app/src/stores/useLanguageStore.ts` matching `contracts/store-interface.ts`
- [x] T007 Configure `createI18n` in `app/src/i18n.ts` (legacy: false, missingWarn: false) and register in `app/src/main.ts`

**Checkpoint**: App builds with i18n plugin active.

## Phase 3: User Story 1 - Dynamic Language Switching (Priority: P1)

**Goal**: Users can switch between English and French, updating UI immediately.
**Independent Test**: Toggle language in header, observe text change without reload.

- [x] T008 [US1] Configure global date/number formats in `app/src/i18n.ts` and sync `primevue/config` locale in `app/src/main.ts` (or store)
- [x] T009 [US1] Create `app/src/components/common/LanguageSwitcher.vue` using `useLanguageStore`
- [x] T010 [US1] Integrate `LanguageSwitcher` into `app/src/components/AppHeader.vue`
- [x] T011 [US1] Migrate AppHeader navigation labels to use `$t()` keys from `en.json`/`fr.json` to verify switching

## Phase 4: User Story 2 - State Persistence During Switch (Priority: P1)

**Goal**: Form inputs and active state remain intact when language changes.
**Independent Test**: Fill `BusinessForm`, switch language, verify data remains.

- [x] T012 [US2] Migrate `app/src/components/BusinessForm.vue` labels/placeholders to use i18n keys
- [x] T013 [US2] Verify `BusinessForm.vue` maintains `v-model` state during locale change (manual verification task)

## Phase 5: User Story 3 & 4 - Defaults & Persistence (Priority: P2/P3)

**Goal**: App defaults to French and remembers user preference.
**Independent Test**: Clear storage -> loads French. Change to English -> Reload -> loads English.

- [x] T014 [US3] Update `app/src/stores/useLanguageStore.ts` initialization logic to default to 'fr'
- [x] T015 [US4] Integrate `useStorage` from `@vueuse/core` in `app/src/stores/useLanguageStore.ts` to persist `currentLocale` string

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Optimization and full migration

- [x] T016 [P] Implement TypeScript type augmentation for i18n keys in `app/src/i18n.d.ts` (or similar) for strict typing
- [x] T017 [P] Audit `app/src/locales/` files to ensure Linked Messages (`@:key`) are used for repetitions (DRY)
- [x] T018 [P] Verify pluralization rules work for French (e.g., 0 items) using sample text
- [x] T019 [P] Document new i18n usage in `app/README.md`

## Dependencies & Execution Order

1. **T001-T007** (Setup & Foundational) must be done first.
2. **T008-T011** (US1) depend on Foundational.
3. **T012-T013** (US2) depend on US1.
4. **T014-T015** (US3/4) depend on Foundational.

## Implementation Strategy

1. **MVP (US1)**: Setup i18n, store, switcher.
2. **Increment (US2)**: Verify form persistence.
3. **Increment (US3/4)**: Add persistence logic.
4. **Polish**: Type safety and DRY audit.