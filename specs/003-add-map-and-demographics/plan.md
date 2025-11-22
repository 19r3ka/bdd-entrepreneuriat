# Implementation Plan: Inclusive Data and Pluggable Business Map

**Branch**: `003-add-map-and-demographics` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-add-map-and-demographics/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature introduces two major enhancements: a pluggable map component for visualizing business locations and the addition of inclusive demographic data (gender, age) for entrepreneurs. The map component will be used on the dashboard, business detail pages, and in business forms. The demographic data will be added to the entrepreneur data model and forms. This plan also includes replacing the Biome linter with an ESLint and Prettier setup.

## Technical Context

**Language/Version**: TypeScript ~5.9.0, Node >=22.12.0
**Primary Dependencies**: Vue ^3.5.22, Pinia ^3.0.3, PrimeVue ^4.4.1, Leaflet.js (latest), vue3-leaflet (latest), OpenStreetMap Nominatim API
**Storage**: Dexie.js ^4.2.1 (IndexedDB)
**Testing**: Vitest ^4.0.6
**Target Platform**: Web Browser
**Project Type**: Web application (frontend)
**Performance Goals**: Map view page load time with all business pins rendered is under 3 seconds.
**Constraints**: Replace Biome with ESLint + Prettier.
**Scale/Scope**: The application is designed for a community of entrepreneurs, with an expected small to medium user base.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **Code Quality & Standards**: All code must be clean, modular, and testable. Automated linting, formatting, and static analysis must be configured. Unit, integration, and end-to-end tests with high coverage targets are required.
    * **Vue 3 & TypeScript Conventions**: All new components MUST use the Composition API with `<script setup>` for better logic reuse and type inference. Component props MUST be explicitly typed using TypeScript interfaces.
    * **Pinia Store Design**: Each feature domain MUST have its own Pinia store. Stores MUST be organized with a clear separation of `state`, `getters`, and `actions`.
    * **Form Handling & Validation**: A consistent, project-wide form validation library MUST be used. Forms MUST provide clear, immediate, and accessible error messages for each field.
    * **DRY & Abstraction**: Create reusable components and composables to avoid code duplication. Each component and function MUST have a single, well-defined responsibility.
    * **Data Fetching & Performance**: Data fetching logic MUST be abstracted into composables or services. Use Pinia stores to share and cache fetched data.
    * **Testing & QA**: All new functions, composables, and components MUST have accompanying tests. Critical user flows MUST be covered by end-to-end tests.
* **Collaboration & Workflow**: All work must follow GitHub Flow with feature branches, pull requests, and mandatory code reviews. Commit messages must be clear and follow conventional changelog standards.
* **Documentation**: All features must have up-to-date READMEs, architecture diagrams, and API docs. Inline code comments are required for complex logic. Major technical choices must be documented with ADRs.
    * **Component Documentation**: All components MUST be documented using JSDoc/TSDoc, explaining their purpose, props, and events.
    * **README**: The project's `README.md` file MUST be kept up-to-date with setup instructions, available scripts, and a clear project overview.
* **Integration & CI/CD**: All builds, tests, and deployments must be automated. All tests must pass before merging. Continuous delivery with staging and production environments is required.
* **Security & Compliance**: All code must be scanned for dependencies and vulnerabilities. Secure coding practices must be followed, including input validation and secrets management. OWASP Top 10 guidelines must be followed.
* **Continuous Improvement**: Regular retrospectives and feedback loops are encouraged. Technical debt must be tracked and prioritized for refactoring. DevOps health must be measured with metrics like lead time, deployment frequency, and change failure rate.
* **Internationalization (i18n)**: A dedicated library MUST be used for all user-facing strings.

**Initial Assessment**: The plan is compliant with the constitution. The introduction of Leaflet and the linter change align with the principles of using established tools and improving the development environment.

## Project Structure

### Documentation (this feature)

```text
specs/003-add-map-and-demographics/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── src/
│   ├── components/
│   │   └── MapComponent.vue       # New reusable map component
│   ├── views/
│   │   ├── DashboardView.vue      # Will use MapComponent
│   │   ├── BusinessDetailView.vue # Will use MapComponent
│   │   └── BusinessEditView.vue   # Will use MapComponent
│   ├── composables/
│   │   └── useMap.ts              # Composable for map logic
│   ├── services/
│   │   └── geocoding.ts           # Service for Nominatim API
│   └── schemas/
│       └── entrepreneur.ts        # To be updated
└── tests/
    ├── integration/
    │   └── MapComponent.spec.ts   # Tests for the new component
    └── unit/
        └── useMap.spec.ts         # Tests for the map composable
```

**Structure Decision**: The existing frontend structure will be used. New components and composables will be added to `app/src/components` and `app/src/composables` respectively. Views will be updated to include the new map component.

## Complexity Tracking

No violations to the constitution are anticipated.