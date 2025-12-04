<!--
Sync Impact Report:
- Version: 0.0.0 -> 1.0.0 (Initial Ratification)
- Adopted "Coding Constitution" with 8 key sections.
- Added Principles: Foundational, Architecture, Naming, Implementation, Documentation, Error Prevention.
- Added Sections: Execution Protocols, Guiding Philosophy.
- Templates Checked:
    - plan-template.md: Compatible (delegates to constitution).
    - spec-template.md: Compatible (focuses on requirements/tests).
    - tasks-template.md: Compatible (workflow agnostic).
-->
# Entrepreneurs Registry App Constitution

## Core Principles

### I. Foundational Principles
**KISS (Keep It Simple, Stupid):** Code must be simple, direct, and free of unnecessary complexity. Prefer clarity over cleverness.

**DRY (Don’t Repeat Yourself):** No duplication of logic, markup, or styles. Extract shared logic into composables, helpers, or base components.

**Object Calisthenics:** Follow rules that encourage small, focused classes/components, clear responsibilities, and minimal side effects.

**Vue Style Guide:** Always adhere to the official Vue 3 style guide for naming, structure, and conventions unless explicitly overridden.

### II. Architecture & Structure
**Single File Components (SFCs):** Each `.vue` file defines one component, self-contained with template, script, and style.

**Directory Responsibilities:**
- Shared logic → `composables/`
- Shared markup/styles → `components/base/` or `components/common/`
- Helpers & Utils → `utils/` or `helpers/` (non-Vue logic)

**Schemas & Types:**
- Schemas, inferred types, and interfaces are the single source of truth.
- No `any` or `unknown` types allowed.
- Types must cascade through props, composables, API calls, and tests.

### III. Naming & Readability
**Conventions:**
- Components → `PascalCase`
- Variables → `camelCase`
- Constants → `SCREAMING_SNAKE_CASE`

**Readability First:**
- No cryptic abbreviations.
- Limit nesting depth (max 3). Prefer early returns over imbricated `if/else`.
- Code for humans, optimized for machines: Clear, predictable, and self-explanatory.

### IV. Implementation Rules
**Avoid Ad Hoc Implementations:**
- No magic strings. Use constants or enums.
- Defaults must be explicit and documented.

**Determinism & Testability:**
- Same inputs → same outputs.
- Favor pure functions.
- Every unit must be testable in isolation.

**Third-Party Libraries:**
- Built-in features first.
- Use libraries (e.g., `vueuse`) only if they reduce complexity more than they increase bundle size.
- Always weigh bundle size vs maintainability.

### V. Documentation & Self-Explanation
**Self-Documenting Code:** Structure, naming, and contracts must explain intent.

**JSDoc:** Anything not obvious must be documented with JSDoc for IntelliSense support.

**README Style Guides:** Each module or feature should include usage examples, architectural rationale, and developer notes.

### VI. Error Prevention & Safety
**Type Safety:**
- Use `?? undefined` for nullable props.
- Use optional chaining (`?.`) or non-null assertions (`!`) for array/object access.

**Boolean Hygiene:**
- `.value` only on `Ref<boolean>`.
- Plain booleans must not use `.value`.

**Tests & Mocks:**
- All composables and helpers must expose clear contracts.
- Mocks must include all expected methods.
- Global references → `globalThis`.

## Execution Protocols

### VII. Execution Order for Fixes
When errors occur, fixes must follow this order:

1. **Schema/Type Exports:** Verify the source of truth.
2. **Dependencies:** Install missing packages or create missing files.
3. **Boolean Hygiene:** Check for incorrect `.value` usage.
4. **Type Mismatches:** Align contracts.
5. **Undefined Checks:** Add optional chaining or assertions.
6. **Miscellaneous:** Fix naming, duplication, or missing props.

## Guiding Philosophy

### VIII. Core Philosophy
- **Clarity over cleverness.**
- **Contracts over assumptions.**
- **Predictability over improvisation.**
- **Maintainability over shortcuts.**
- **Empower future contributors.**

## Governance

**Supremacy:** This Constitution supersedes all other project documentation and practices. In cases of conflict, this document prevails.

**Amendments:** Changes to this Constitution require a Pull Request with:
1. Explicit justification for the change.
2. Assessment of impact on existing code and templates.
3. Migration plan for non-compliant legacy code.
4. Approval from project maintainers.

**Compliance:** All Pull Requests must be verified against these principles. Code reviews are the primary enforcement mechanism. Complexity must be explicitly justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04