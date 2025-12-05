# Implementation Plan: Bilingual Support

**Branch**: `005-add-bilingual-support` | **Date**: 2025-12-04 | **Spec**: [specs/005-add-bilingual-support/spec.md](../spec.md)
**Input**: Feature specification from `/specs/005-add-bilingual-support/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement full bilingual support (English/French) using `vue-i18n`. The system will default to French, allow dynamic switching without page reloads, and persist user preferences. Key focus on optimizing translation strings (avoiding repetition) and leveraging built-in handling for plurals and gender, particularly for French grammar rules.

## Technical Context

**Language/Version**: TypeScript ~5.9.0, Vue 3.5.22
**Primary Dependencies**: `vue-i18n` (^11.1.12), `pinia` (^3.0.3), `@vueuse/core` (^14.0.0)
**Storage**: Local Storage (via `@vueuse/core` `useStorage`) for persisting language preference.
**Testing**: `vitest` for unit/integration testing of locale switching and formatting.
**Target Platform**: Web (SPA)
**Project Type**: Web application
**Performance Goals**: Language switch < 1s (perceived). Zero layout shift ideal.
**Constraints**: No full page reload on language switch. Strict type safety for translation keys desirable.
**Scale/Scope**: Initial support for 2 languages (EN/FR). Scalable directory structure for translation files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **KISS**: Using established `vue-i18n` library rather than custom solution.
- [x] **DRY**: Using `vue-i18n`'s linked messages to avoid repeating common strings (e.g., "Cancel", "Save").
- [x] **Object Calisthenics**: Translation logic encapsulated in composable/store.
- [x] **Vue Style Guide**: Usage of Composition API (`useI18n`) aligns with project style.
- [x] **SFCs**: Language switcher will be a dedicated SFC.
- [x] **Types**: leveraging `vue-i18n` type definitions.
- [x] **Third-Party Libraries**: `vue-i18n` is standard; `vueuse` is already in project.

## Project Structure

### Documentation (this feature)

```text
specs/005-add-bilingual-support/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/src/
├── components/
│   └── common/
│       └── LanguageSwitcher.vue  # New component
├── composables/
│   └── useLanguage.ts            # Logic for switching and persistence (or Pinia store)
├── locales/                      # New directory for translation files
│   ├── en.json
│   └── fr.json
├── main.ts                       # Update to install i18n plugin
└── stores/
    └── useLanguageStore.ts       # Store for language state
```

**Structure Decision**: Adopting standard `vue-i18n` structure with a dedicated `locales/` directory and a Pinia store for managing the active locale state and persistence.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |