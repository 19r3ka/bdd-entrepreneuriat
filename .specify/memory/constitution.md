<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Modified principles:
  - I. Code Quality & Standards (strengthened rules for TypeScript, DRY, Testing, and added Tooling section)
  - IV. Integration & CI/CD (added linting enforcement)
  - VII. Internationalization (i18n) (clarified rule)
- Governance section updated.
-->
# Entrepreneurs App Constitution

## Core Principles

### I. Code Quality & Standards
Enforce clean, modular, and testable code. These rules apply to all contributors, including human developers and AI agents, to ensure consistency and maintainability.
Require automated linting, formatting, and static analysis.
Mandate unit, integration, and end-to-end testing with high coverage targets.

#### I.a. TypeScript & Vue Conventions
- **Composition API:** All new components MUST use the Composition API with `<script setup>`.
- **Comprehensive Typing:** All props, store state, and composable return values MUST be explicitly typed.
- **No `any` Type:** The `any` type is strictly forbidden. Always prefer narrow, explicit typings. Expand type scope only when necessary, but keep contracts strict.
- **Reactivity:** Use `ref` for primitive values and `reactive` for objects.
- **Component Toolkit:** Prefer PrimeVue components and PrimeFlex utilities over custom implementations.
- **Reuse Existing Logic:** Never reinvent the wheel. Reuse proven existing features, helpers, and utils from available packages instead of recreating them.

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
- **Enforce DRY:** Do not repeat code. Shared logic MUST be abstracted into helpers or composables. No copy-paste duplication across components.
- **Lightweight Components:** Components must remain light. Delegate repeated or complex business logic to composables or wrappers.
- **Single Responsibility:** Each component/composable must have one clear purpose.
- **Abstraction:** Hide complexity behind intuitive APIs.

#### I.e. Data Fetching & Performance
- **Centralized Fetching:** Data fetching logic MUST be abstracted into composables or services, separate from components.
- **State Management:** Use Pinia stores to share and cache fetched data across the application.
- **Lazy Loading:** Components and routes SHOULD be lazy-loaded to improve initial page load performance.
- **Virtual Scrolling:** For long lists, virtual scrolling MUST be implemented to maintain a smooth user experience.

#### I.f. Testing & QA
- **Test Frameworks:** Use Vitest for unit and integration testing, and Cypress for E2E tests.
- **Test Location:** Unit tests MUST be colocated with composables and schemas. Component tests MUST be stored in `/tests/integration` and not colocated.
- **Test Coverage:** All new code MUST include tests for props, events, and user-facing contracts.

#### I.g. Tooling & Environment
- **Linting & Formatting:** Use ESLint + Prettier consistently across the project.
- **Forbidden Tools:** Do not use Biome (not mature enough for Vue SFC).
- **CI Enforcement:** Linting MUST be enforced in CI/CD pipelines.

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
Require all tests and linting to pass before merging.
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
- **i18n Library:** All user-facing strings must use `vue-i18n`.
- **Translation Files:** All translation strings MUST be stored in separate JSON files for each locale.
- **Keys:** Use semantic keys for all translation strings.

## Governance

Amendments to this constitution require a pull request and approval from the project maintainers. The constitution must be kept current with enforced practices.

**Version**: 1.2.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-11-20