# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

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

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
