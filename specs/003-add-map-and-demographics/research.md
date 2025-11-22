# Research: Geocoding API and Linter Setup

## Geocoding API

- **Decision**: Use the OpenStreetMap Nominatim API.
- **Rationale**: As requested, we will use a free alternative for geocoding. Nominatim is a widely-used service based on OpenStreetMap data. It is important to adhere to its usage policy, which includes a maximum of 1 request per second and providing a valid User-Agent. This choice prioritizes cost-effectiveness.
- **Alternatives considered**:
    - **Mapbox Geocoding API**: A robust commercial service. Initially considered for its reliability, but rejected in favor of a free alternative.

## Map Component Library

- **Decision**: Use Leaflet.js with the `vue3-leaflet` wrapper.
- **Rationale**: Leaflet is a lightweight, open-source, and highly popular mapping library. `vue3-leaflet` provides a convenient Vue 3 wrapper, aligning with our project's stack and allowing for rapid development of the map component.
- **Alternatives considered**:
    - **OpenLayers**: More powerful but also more complex than Leaflet. Considered overkill for the current requirements.
    - **Google Maps API**: A powerful option, but comes with more restrictive licensing and a more complex pricing model.

## Linter and Formatter Setup

- **Decision**: Replace Biome with ESLint and Prettier.
- **Rationale**: As noted in the feature description, the developer community has found that Biome's support for Vue Single File Components (.vue) is not as mature as the established ESLint + Prettier combination. `eslint-plugin-vue` provides robust linting rules specific to Vue 3's Composition API and `<script setup>` syntax, ensuring higher code quality and adherence to best practices. Prettier will be used for consistent code formatting.
- **Alternatives considered**:
    - **Sticking with Biome**: Rejected due to the developer feedback and potential issues with Vue SFC support.
