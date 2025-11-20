# Quickstart: Data Model Refactor

This guide provides a quick overview of how to use the new data model, validation schemas, and reusable components and composables introduced in this refactor.

## Zod Schemas

All data models are now defined as Zod schemas in the `src/schemas` directory. These schemas are the single source of truth for validation and type generation.

### Usage

To use a schema for validation, you can use the `parse` or `safeParse` methods:

```typescript
import { EntrepreneurSchema } from '@/schemas/entrepreneur';

const newEntrepreneur = {
  // ...
};

try {
  const validatedEntrepreneur = EntrepreneurSchema.parse(newEntrepreneur);
  // ...
} catch (error) {
  // ...
}
```

To infer a TypeScript type from a schema, use `z.infer`:

```typescript
import { z } from 'zod';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';

type Entrepreneur = z.infer<typeof EntrepreneurSchema>;
```

## Reusable Form Components

New reusable form components have been introduced in `src/components/common`:

- `<BaseForm>`: A base component that handles form submission and validation errors.
- `<FormField>`: A component that wraps a form input and displays validation errors.

### Usage

```vue
<template>
  <BaseForm :schema="EntrepreneurSchema" @submit="onSubmit">
    <FormField name="firstName" label="First Name" />
    <FormField name="lastName" label="Last Name" />
    <FormField name="email" label="Email" />
    <button type="submit">Save</button>
  </BaseForm>
</template>

<script setup lang="ts">
import { BaseForm, FormField } from '@/components/common';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';

function onSubmit(values: any) {
  // ...
}
</script>
```

## Reusable Composables

New reusable composables have been introduced in `src/composables`:

- `useForm`: A composable that provides form state, validation, and submission handling.
- `useCrudStore`: A composable that provides generic CRUD operations for Pinia stores.

### Usage

```typescript
// useForm
import { useForm } from '@/composables/useForm';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';

const { values, errors, defineField, handleSubmit } = useForm({
  validationSchema: EntrepreneurSchema,
});

const onSubmit = handleSubmit(values => {
  // ...
});

// useCrudStore
import { defineStore } from 'pinia';
import { useCrudStore } from '@/composables/useCrudStore';
import { Entrepreneur } from '@/types';

export const useEntrepreneurStore = defineStore('entrepreneur', () => {
  const crud = useCrudStore<Entrepreneur>('entrepreneurs');

  return {
    ...crud,
  };
});
```