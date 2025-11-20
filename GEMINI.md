# entrepreneurs_app Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-31

## Active Technologies
- Dexie.js (IndexedDB) (002-data-model-refactor)

- JavaScript (ES2023) + Vue 3, Vite, PrimeVue, Pinia (001-business-tracker-app)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

JavaScript (ES2023): Follow standard conventions

## Data Fetching

- Core stores (e.g., `useEntrepreneurStore`, `useBusinessStore`) are populated on application load in `App.vue`.
- Other, less frequently used, or view-specific stores must be explicitly fetched within the component or view that requires them.

## Recent Changes
- 002-data-model-refactor: Added Dexie.js (IndexedDB)

- 001-business-tracker-app: Added JavaScript (ES2023) + Vue 3, Vite, PrimeVue, Pinia

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->