# Feature Specification: Schema Refactoring & Optimization

**Feature Branch**: `007-schema-refactor`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "Refactor the current schemas to make them more maintainable, atomic, and aligned with the project's constitution by avoiding repetition and eliminating use of "any" or "unknown", with special attention to the complex Monitoring & Evaluation (M&E) schemas that have significant duplication..."

## Clarifications

### Session 2025-12-10

- Q: How to handle strict typing vs legacy data? → A: Use Zod coercion and preprocessing to clean known legacy patterns (e.g. string numbers) into strict types.
- Q: How to structure polymorphic indicators? → A: Use z.discriminatedUnion with a common discriminator field (e.g., 'type') for best type narrowing.
- Q: Where should new shared schemas/enums reside? → A: In dedicated subdirectories: 'src/schemas/enums' for enums and 'src/schemas/common' for common atomic schemas.
- Q: What is the target format for validated date values? → A: ISO-8601 string (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ").
- Q: How should currency values be represented after validation? → A: As an object '{ amount: number, currencyCode: string }'.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Enum Management (Priority: P1)

Developers must be able to import shared enums from a central location rather than defining them inline, ensuring consistency across the application (e.g., Gender, Currency, Categories).

**Why this priority**: Essential for reducing duplication and preventing inconsistencies where different parts of the app might use slightly different enum values for the same concept.

**Independent Test**: Can be tested by verifying that modifying a single enum definition (e.g., adding a new Gender option) propagates correctly to all consuming schemas without manual updates in multiple files.

**Acceptance Scenarios**:

1. **Given** the codebase has multiple inline definitions of "Gender", **When** the refactor is complete, **Then** there should be a single source of truth for "Gender" imported by all dependent schemas.
2. **Given** a need to add a new currency, **When** it is added to the shared currency enum, **Then** it is automatically valid in all schemas using currency validation.

---

### User Story 2 - Atomic & Composable Schemas (Priority: P1)

Developers must be able to build complex schemas (like Business or Entrepreneur) by composing smaller, atomic schemas (like Address, ContactInfo) rather than nesting deep object definitions.

**Why this priority**: Improves readability, testability, and reusability. Allows specific sub-sections of data to be validated independently.

**Independent Test**: Can be tested by importing an atomic schema (e.g., `AddressSchema`) and using it to validate an isolated address object successfully, and then verifying it works within a parent schema.

**Acceptance Scenarios**:

1. **Given** a `BusinessSchema` and an `EntrepreneurSchema` that both require address information, **When** structured correctly, **Then** both should reference a shared `AddressSchema`.
2. **Given** a large nested schema, **When** refactored, **Then** it is broken down into named exports (e.g., `FinancialInfoSchema`, `OperationalMetricsSchema`) that are composed into the main schema.

---

### User Story 3 - Consolidated M&E Indicator Logic (Priority: P2)

Developers must interact with a unified **discriminated union** schema structure for Indicators, rather than maintaining three distinct but nearly identical schemas for "Indicator", "OutputIndicator", and "Momentum Metric Indicators".

**Why this priority**: The current duplication in M&E schemas creates a high risk of bugs where a change in one indicator type is forgotten in another.

**Independent Test**: Can be tested by creating a factory or utility that can validate any of the three indicator types using the unified schema structure.

**Acceptance Scenarios**:

1. **Given** three different indicator types with 80% overlapping fields, **When** refactored, **Then** the common fields are defined once in a base schema, and specific types extend it.
2. **Given** a need to update the validation logic for "Measurement Frequency", **When** updated in the base schema, **Then** all indicator types reflect this validation rule.

---

### User Story 4 - Strict Type Safety (Priority: P2)

The system must define schemas without using `z.any()` or `z.unknown()`, ensuring that TypeScript inference provides full type safety for all data structures.

**Why this priority**: `any` and `unknown` bypass type checking, defeating the purpose of using Zod and TypeScript, and leading to runtime errors.

**Independent Test**: Can be tested by inspecting the inferred TypeScript types from the Zod schemas and verifying that no fields resolve to `any`.

**Acceptance Scenarios**:

1. **Given** a schema that previously used `z.any()` for a complex field, **When** refactored, **Then** it uses a specific Zod schema or recursive definition that accurately describes the data.
2. **Given** a data import function, **When** validated against the new schemas, **Then** the resulting data structure is fully typed.

---

### Edge Cases

- **Circular Dependencies**: When breaking schemas into atomic parts, circular references might occur (e.g., Parent -> Child -> Parent). The system must handle this using `z.lazy()`.
- **Legacy Data Compatibility**: Refactored schemas must use **Zod coercion and preprocessing** to transform existing slightly malformed data (e.g., stringified numbers) into strict types, ensuring runtime safety without data loss.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define all enums (Gender, Currency, Business Categories, Dimensions, etc.) in shared, exportable files, specifically under `src/schemas/enums`.
- **FR-002**: System MUST replace all inline enum definitions in schemas with references to the shared enums.
- **FR-003**: System MUST define atomic schemas for common structures: Addresses/Locations, Contact Details, Dates/Timeframes, Money/Currency values in `src/schemas/common`.
- **FR-004**: System MUST consolidate "Indicator", "OutputIndicator", and "Momentum Metric" schemas into a unified structure using **z.discriminatedUnion** (e.g., BaseIndicator + extensions) distinguished by a unique `type` field.
- **FR-005**: System MUST remove all occurrences of `z.any()` and `z.unknown()` in the schema definitions, replacing them with concrete types or structured unions.
- **FR-006**: System MUST standardize date validation logic to ensure date values are represented as **ISO-8601 strings**.
- **FR-007**: System MUST normalize currency validation logic into a single reusable schema that represents currency values as an **object `{ amount: number, currencyCode: string }`**.
- **FR-008**: System MUST ensure that inferred TypeScript types from schemas exactly match the intended domain models.
- **FR-009**: System MUST employ Zod preprocessing to normalize legacy data inputs (e.g., "100" -> 100) before strict validation.

### Key Entities

- **BaseIndicator**: The common foundation for all monitoring indicators (RBM fields, basic metadata) acting as the base for the discriminated union.
- **Atomic Schemas**: Reusable blocks like `Address`, `ContactInfo`, `DateRange` (represented as ISO-8601 strings), and `Money` (represented as object `{ amount: number, currencyCode: string }`).
- **Unified Enums**: Centralized definitions for constrained lists of values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 occurrences of `z.any()` or `z.unknown()` in the `src/schemas` directory.
- **SC-002**: 100% of defined enums are shared and reused (no inline `z.enum([...])` for domain concepts).
- **SC-003**: M&E Indicator schemas share at least 90% of their definition via composition/inheritance, reducing code duplication.
- **SC-004**: All existing unit tests related to schema validation pass without modification to the test logic (preserving behavior).
- **SC-005**: Schema files pass strict linting rules regarding duplication and type safety.
