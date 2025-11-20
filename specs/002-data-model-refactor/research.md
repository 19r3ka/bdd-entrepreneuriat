# Research: Data Model Refactor

## Summary

This research phase focuses on establishing best practices for the data model refactoring, including data modeling with Zod, validation strategies, creating reusable components and composables, and implementing optimistic updates in Pinia.

## Research Topics

### 1. Data Modeling with Zod and TypeScript

- **Decision**: Zod will be used as the single source of truth for both validation and type generation.
- **Rationale**: This approach eliminates the need to maintain separate TypeScript interfaces and Zod schemas, reducing code duplication and ensuring consistency. The `z.infer<typeof schema>` utility will be used to automatically generate TypeScript types from the Zod schemas.
- **Alternatives considered**: Manually defining both TypeScript interfaces and Zod schemas was rejected as it is error-prone and leads to code duplication.

### 2. Togolese Phone Number Validation

- **Decision**: A regular expression will be used to validate Togolese phone numbers.
- **Rationale**: Togolese phone numbers have a predictable format (8 digits, starting with 7, 9, or 0). A regex is a lightweight and effective way to enforce this format.
- **Regex**: `^(7|9|0)[0-9]{7}$`
- **Alternatives considered**: Using a library like `libphonenumber-js` was considered but rejected as it is a large dependency for a single validation rule.

### 3. Reusable Form and Store Logic

- **Decision**: Reusable logic will be extracted into Vue 3 composables.
- **Rationale**: Composables are the idiomatic way to share reactive logic in Vue 3. They are flexible, reusable, and easy to test.
- **`useForm` composable**: Will handle form state, validation, and submission.
- **`useCrudStore` composable**: Will provide a generic implementation for common CRUD operations in Pinia stores.

### 4. Optimistic Updates in Pinia

- **Decision**: Optimistic updates will be implemented directly within the Pinia store actions.
- **Rationale**: This approach keeps the logic self-contained within the store and allows for easy error handling (reverting the state) in case of a failed API call.
- **Implementation**: The store action will first update the state locally, then make the API call. If the API call fails, the action will catch the error and revert the state to its previous value.