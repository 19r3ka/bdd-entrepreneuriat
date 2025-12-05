# Research: Bilingual Support

**Feature**: Bilingual Support (Vue i18n)
**Date**: 2025-12-04

## 1. Vue i18n Configuration & Composition API
**Decision**: Use `createI18n` with `legacy: false` to enable Composition API mode.
**Rationale**: The project uses Vue 3 Composition API. `legacy: false` ensures full compatibility and better type inference.
**Implementation Details**:
- Initialize in `main.ts`.
- Use `useI18n()` in components.
- Global scope for common translations is preferred for efficiency.

## 2. Message Optimization (DRY)
**Decision**: Use Linked Messages (Reference) syntax.
**Rationale**: To avoid repeating common strings like "Cancel" or brand names across different keys.
**Syntax**: `@:path.to.key`
**Example**:
```json
{
  "common": {
    "cancel": "Cancel"
  },
  "forms": {
    "user": {
      "cancel_edit": "@:common.cancel"
    }
  }
}
```

## 3. Pluralization
**Decision**: Use the pipe `|` separator for pluralization.
**Rationale**: Standard `vue-i18n` feature.
**Example**:
```json
{
  "car": "car | cars",
  "apple": "no apples | one apple | {count} apples"
}
```
**Usage**: `$t('apple', 10)` or `$t('apple', { count: 10 })`

## 4. Gender Handling (French)
**Decision**: Use nested structure or specific keys for gender variance where strict grammar is required, or custom formatters if complexity is high. For this app, explicit keys are clearer.
**Alternative**: `vue-i18n` supports custom pluralization rules that can be adapted for gender, but explicit keys (e.g., `role.admin.male`, `role.admin.female`) or context-based keys are often simpler for maintainability unless the content is highly dynamic.
**Proposed Pattern**:
```json
{
  "greeting": "Hello {name}",
  "status_connected": "Connecté | Connectée" // Simple gender switch if using pluralization hack, otherwise:
}
```
*Refined approach for gender*: Since standard pluralization is for numbers, using a dedicated helper or simple conditional logic in the template is often cleaner for gender.
**Selected Approach**: Use explicit keys suffixed with `_male` / `_female` where necessary, or utilize `vue-i18n`'s message format syntax `{gender, select, male {...} female {...}}` if using the ICU message format.
**Constraint**: `vue-i18n` default formatter doesn't support ICU `select`.
**Final Decision**: Use explicit keys (e.g., `user.role_male`, `user.role_female`) resolved by a helper composable if the user object has a gender property, OR simple distinct keys used in templates.

## 5. Persistence
**Decision**: Use `@vueuse/core`'s `useStorage`.
**Rationale**: One-line implementation to bind a reactive variable to `localStorage`.
**Key**: `app-locale-preference`.

## 6. Type Safety
**Decision**: Define a schema type based on the English file (Master) and use `GlobalI18n` interface augmentation (if feasible) or simply strict typing in the store.
