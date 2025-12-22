# Contracts: Type Definitions

For this internal refactoring feature, the "contracts" are the strict TypeScript interfaces exported by the schema definitions.

The canonical source of truth for these types is the inferred type from the Zod schemas.

## Key Types

### `Indicator` (Union)

```typescript
export type Indicator = 
  | StandardIndicator
  | OutputIndicator
  | MomentumIndicator;
```

### `Address`

```typescript
export type Address = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}
```

(See `src/schemas` source files for full definitions).
