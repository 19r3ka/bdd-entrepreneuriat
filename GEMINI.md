# entrepreneurs_app Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-31

## Active Technologies
- Dexie.js (IndexedDB) (002-data-model-refactor)
- TypeScript ~5.9.0, Node >=22.12.0 + Vue ^3.5.22, Pinia ^3.0.3, PrimeVue ^4.4.1, Leaflet.js (latest), vue3-leaflet (latest), Mapbox Geocoding API (003-add-map-and-demographics)
- Dexie.js ^4.2.1 (IndexedDB) (003-add-map-and-demographics)

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
- 003-add-map-and-demographics: Added TypeScript ~5.9.0, Node >=22.12.0 + Vue ^3.5.22, Pinia ^3.0.3, PrimeVue ^4.4.1, Leaflet.js (latest), vue3-leaflet (latest), Mapbox Geocoding API
- 002-data-model-refactor: Added Dexie.js (IndexedDB)

- 001-business-tracker-app: Added JavaScript (ES2023) + Vue 3, Vite, PrimeVue, Pinia

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
