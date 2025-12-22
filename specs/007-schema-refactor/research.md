# Research: Schema Refactoring

**Feature**: Schema Refactoring & Optimization (`007-schema-refactor`)
**Date**: 2025-12-10

## Unknowns & Clarifications

### 1. Duplicate Enums
**Findings**:
- **Gender**: Defined in `entrepreneur.ts`, `Disagg.ts`, and `genderMarker.ts` (partial). Values are inconsistent (`Woman` vs `female` vs `GEN0`).
- **Indicator Units**: Defined in `OutputIndicator.ts` (7 values) and `MomentumMetricsIndicator.ts` (6 values).
- **Business Areas/Categories**: `business.ts` refers to `VALID_BUSINESS_AREA_CODES` (imported), while `MomentumMetric.ts` has an inline `category` enum.
- **RBM Levels**: Inline in `Support.ts` (`input`, `output`, `outcome`, `impact`).

**Decision**:
- Create `src/schemas/enums/index.ts` to export all enums.
- Standardize **Gender** to a single enum (likely the `entrepreneur.ts` one or a standard ISO one, mapping others via preprocessing).
- Standardize **IndicatorUnit** to the superset (7 values from OutputIndicator).
- Move **RBMLevel** to `src/schemas/enums/monitoring-evaluation.ts`.

### 2. M&E Indicator Duplication
**Findings**:
- Three distinct schemas (`Indicator.ts`, `OutputIndicator.ts`, `MomentumMetricsIndicator.ts`) share core concepts: naming, targets, baselines, and units.
- Inconsistent naming: `baselineValue` vs `baseline`, `targetValue` vs `target`.
- Inconsistent Date handling: `z.date()` (JS Date) vs `z.iso.datetime()` (String).

**Decision**:
- Implement a **Discriminated Union** (`BaseIndicator` + extensions).
- **Normalization**:
  - Use `baseline` and `target` (shorter, cleaner).
  - Use `z.string().datetime()` (ISO 8601) for all dates per spec.
- **Legacy Support**: Use `z.preprocess` to map `baselineValue` -> `baseline` during validation to support existing data/code without immediate massive refactor of UI code (though UI types will update).

### 3. Date & Currency Handling
**Findings**:
- Dates are currently mixed (JS Date objects vs ISO strings).
- Currency is strictly `number` or `string` depending on file.

**Decision**:
- **Date**: Enforce `z.string().datetime()` for all schema outputs.
- **Currency**: Enforce `{ amount: number, currencyCode: string }` object structure for explicitly monetary fields. Simple "value" fields in indicators might remain `number` but with a separate `currency` field in the object (as seen in MomentumIndicator).

## Structure Proposal

```
src/schemas/
├── enums/
│   ├── common.ts       # Gender, Currency, etc.
│   ├── business.ts     # BusinessArea, Categories
│   └── me.ts           # RBM Levels, Units, Dimensions
├── common/
│   ├── address.ts
│   ├── contact.ts
│   ├── money.ts
│   └── dates.ts
├── monitoring-evaluation/
│   ├── indicators.ts   # The new unified schema
│   └── ...
└── ...
```
