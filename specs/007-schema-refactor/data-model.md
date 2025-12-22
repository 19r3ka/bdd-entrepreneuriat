# Data Model: Schema Refactoring

**Feature**: 007-schema-refactor

## Schema Hierarchy

### 1. Enums (`src/schemas/enums/`)

Centralized definitions for all constrained lists.

| Enum | Values (Example) | Used In |
|------|------------------|---------|
| `GenderEnum` | `Woman`, `Man`, `Non-binary`, ... | Entrepreneur, Disagg |
| `CurrencyCodeEnum` | `USD`, `EUR`, `KES`, ... | Money, Financials |
| `IndicatorUnitEnum` | `count`, `percent`, `currency`, `boolean`, ... | Indicators |
| `RBMLevelEnum` | `input`, `output`, `outcome`, `impact` | Support, LogicModel |
| `DimensionEnum` | `Digital`, `Finance`, `Green`, ... | MomentumMetric |

### 2. Common/Atomic Schemas (`src/schemas/common/`)

Reusable building blocks.

#### `AddressSchema`
- `street`: string
- `city`: string
- `postalCode`: string
- `country`: string
- `coordinates`: `{ lat: number, lng: number }` (optional)

#### `MoneySchema`
- `amount`: number
- `currencyCode`: `CurrencyCodeEnum`

#### `DateStringSchema`
- Validates string as ISO-8601 datetime.
- Coerces `Date` objects to ISO string.

### 3. Monitoring & Evaluation (`src/schemas/monitoring-evaluation/`)

#### `IndicatorSchema` (Discriminated Union)

**Base Fields**:
- `id`: UUID
- `name`: string
- `description`: string (optional)
- `unit`: `IndicatorUnitEnum`
- `type`: string (Discriminator)

**Variants**:

1.  **`StandardIndicator`** (`type: 'standard'`)
    - `businessId`: UUID
    - `baseline`: number
    - `baselineDate`: ISO Date
    - `target`: number
    - `targetDate`: ISO Date

2.  **`OutputIndicator`** (`type: 'output'`)
    - `category`: `OutputCategoryEnum`
    - `isStandard`: boolean
    - `sdgTargets`: string[]

3.  **`MomentumIndicator`** (`type: 'momentum'`)
    - `baseline`: number (optional)
    - `target`: number (optional)
    - `currency`: string (optional, if unit is currency)
    - `evidenceId`: UUID

### 4. Entity Schemas (`src/schemas/`)

#### `EntrepreneurSchema`
- Uses `GenderEnum`.
- Uses `AddressSchema` for location.
- Uses `DateStringSchema` for dob/dates.

#### `BusinessSchema`
- Uses `AddressSchema` for location.
- Uses `MoneySchema` for financial data.
