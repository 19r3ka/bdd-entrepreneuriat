# Quickstart: Using Refactored Schemas

## Importing Schemas

Stop importing from individual entity files for common types. Use the centralized exports.

```typescript
// OLD
import { Gender } from '@/schemas/entrepreneur' // (inline enum)
import { Address } from '@/schemas/business' // (nested object)

// NEW
import { GenderEnum } from '@/schemas/enums'
import { AddressSchema } from '@/schemas/common'
```

## Validating Data

Use the atomic schemas to validate partial data.

```typescript
import { AddressSchema } from '@/schemas/common'

const userAddress = {
  street: "123 Main St",
  city: "Nairobi",
  // ...
}

const result = AddressSchema.safeParse(userAddress)
if (result.success) {
  // result.data is typed strictly
}
```

## Working with Indicators

The `IndicatorSchema` is now a polymorphic type (Discriminated Union). You **must** check the `.type` field to narrow the type.

```typescript
import { IndicatorSchema } from '@/schemas/monitoring-evaluation'

function handleIndicator(indicator: z.infer<typeof IndicatorSchema>) {
  if (indicator.type === 'standard') {
    // TypeScript knows this has `businessId`
    console.log(indicator.businessId)
  } else if (indicator.type === 'output') {
    // TypeScript knows this has `sdgTargets`
    console.log(indicator.sdgTargets)
  }
}
```

## Legacy Data Handling

The new schemas automatically coerce legacy formats where safe.

```typescript
// Legacy data with string number
const data = { amount: "500.50", currencyCode: "USD" }

// MoneySchema automatically coerces "500.50" -> 500.50 (number)
const validMoney = MoneySchema.parse(data)
```
