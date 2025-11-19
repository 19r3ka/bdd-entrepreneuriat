<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - I. Code Quality & Standards (added sub-sections)
  - III. Documentation (added sub-sections)
- Added sections:
  - VII. Internationalization (i18n)
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
- Follow-up TODOs: None
-->
# Entrepreneurs App Constitution

## Core Principles

### I. Code Quality & Standards
Enforce clean, modular, and testable code.
Require automated linting, formatting, and static analysis.
Mandate unit, integration, and end-to-end testing with high coverage targets.

#### I.a. Vue 3 & TypeScript Conventions
- **Composition API:** All new components MUST use the Composition API with `<script setup>` for better logic reuse and type inference.
- **Props:** Component props MUST be explicitly typed using TypeScript interfaces.
- **Reactivity:** Use `ref` for primitive values and `reactive` for objects.
- **Typing:** Avoid the `any` type. Define clear interfaces and types for all data structures.

#### I.b. Pinia Store Design
- **Modularity:** Each feature domain MUST have its own Pinia store.
- **Structure:** Stores MUST be organized with a clear separation of `state`, `getters`, and `actions`.
- **Actions:** All state mutations and business logic, including asynchronous operations, MUST be encapsulated within actions.
- **Naming:** Stores MUST be named using the `use...Store` convention (e.g., `useBusinessStore`).

#### I.c. Form Handling & Validation
- **Validation Library:** A consistent, project-wide form validation library (e.g., VeeValidate, Zod) MUST be used.
- **User Feedback:** Forms MUST provide clear, immediate, and accessible error messages for each field.
- **Server-Side Validation:** All form submissions MUST be re-validated on the server-side to ensure data integrity.

#### I.d. DRY & Abstraction
- **Reusability:** Create reusable components and composables to avoid code duplication.
- **Single Responsibility:** Each component and function MUST have a single, well-defined responsibility.
- **Abstraction:** Hide complex implementation details behind simple, intuitive APIs.

#### I.e. Data Fetching & Performance
- **Centralized Fetching:** Data fetching logic MUST be abstracted into composables or services, separate from components.
- **State Management:** Use Pinia stores to share and cache fetched data across the application.
- **Lazy Loading:** Components and routes SHOULD be lazy-loaded to improve initial page load performance.
- **Virtual Scrolling:** For long lists, virtual scrolling MUST be implemented to maintain a smooth user experience.

#### I.f. Testing & QA
- **Unit Tests:** All new functions and composables MUST have accompanying unit tests.
- **Component Tests:** All new components MUST have tests covering their props, events, and user interactions.
- **E2E Tests:** Critical user flows MUST be covered by end-to-end tests.
- **Test Runner:** A consistent test runner and framework (e.g., Vitest, Cypress) MUST be used across the project.

### II. Collaboration & Workflow
Use GitHub Flow with feature branches, pull requests, and mandatory code reviews.
Require clear commit messages and conventional changelog standards.
Encourage pair programming or async review for critical features.

### III. Documentation
Maintain up-to-date README, architecture diagrams, and API docs.
Require inline code comments for complex logic.
Use ADRs (Architecture Decision Records) for major technical choices.

#### III.a. Component Documentation
- All components MUST be documented using JSDoc/TSDoc, explaining their purpose, props, and events.

#### III.b. README
- The project's `README.md` file MUST be kept up-to-date with setup instructions, available scripts, and a clear project overview.

### IV. Integration & CI/CD
Automate builds, tests, and deployments via GitHub Actions (or equivalent).
Require all tests to pass before merging.
Support continuous delivery with staging and production environments.

### V. Security & Compliance
Enforce dependency scanning and vulnerability checks.
Require secure coding practices (input validation, secrets management).
Follow OWASP Top 10 guidelines.

### VI. Continuous Improvement
Encourage regular retrospectives and feedback loops.
Track technical debt and prioritize refactoring.
Adopt metrics (e.g., lead time, deployment frequency, change failure rate) to measure DevOps health.

### VII. Internationalization (i18n)
- **i18n Library:** A dedicated library (e.g., `vue-i18n`) MUST be used for all user-facing strings.
- **Translation Files:** All translation strings MUST be stored in separate JSON files for each locale.
- **Keys:** Use semantic keys for all translation strings.

## Governance

Amendments to this constitution require a pull request and approval from the project maintainers.

**Version**: 1.1.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-11-04
