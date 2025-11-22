# Quickstart: Inclusive Data and Pluggable Business Map

This guide provides the steps to set up the development environment for the new feature.

## 1. Install New Dependencies

Install the new npm packages required for the map component and linting.

```bash
npm install leaflet vue3-leaflet
npm install --save-dev eslint prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

You will also need types for leaflet:
```bash
npm install --save-dev @types/leaflet
```

## 2. Configure ESLint and Prettier

1.  Create a `.eslintrc.cjs` file in the `app` directory with the following content:

    ```javascript
    /* eslint-env node */
    module.exports = {
      root: true,
      'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        'prettier'
      ],
      parserOptions: {
        ecmaVersion: 'latest'
      }
    }
    ```

2.  Create a `.prettierrc.json` file in the `app` directory:

    ```json
    {
      "semi": false,
      "singleQuote": true
    }
    ```

3.  Remove the `biome.json` file from the `app` directory if it exists.

4.  Update the `scripts` in `app/package.json` to use the new linter:

    ```json
    "scripts": {
      "dev": "vite",
      "build": "run-p type-check \"build-only {@}\" --",
      "preview": "vite preview",
      "test": "vitest",
      "build-only": "vite build",
      "type-check": "vue-tsc --build",
      "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
      "format": "prettier --write src/"
    },
    ```

## 3. Geocoding Service

This feature will use the OpenStreetMap Nominatim API for geocoding. This is a free service and does not require an API key. However, it is subject to a strict [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/). Key points include:
- Maximum of 1 request per second.
- Provide a valid User-Agent in requests.
- Do not actively batch requests.

The implementation in `app/src/services/geocoding.ts` must adhere to these rules.

## 4. Using the Map Component

The new map component can be used in different modes.

### View-Only Mode (e.g., on a dashboard or detail page)

```vue
<template>
  <MapComponent :locations="businessLocations" :is-editable="false" />
</template>

<script setup>
import MapComponent from '@/components/MapComponent.vue'
import { ref } from 'vue'

// Example for showing multiple locations
const businessLocations = ref([
  { lat: 51.505, lng: -0.09, name: 'Business 1' },
  { lat: 51.51, lng: -0.1, name: 'Business 2' },
]);
</script>
```

### Edit Mode (e.g., in a form)

```vue
<template>
  <MapComponent
    :locations="[businessLocation]"
    :is-editable="true"
    @update:location="onLocationUpdate"
  />
</template>

<script setup>
import MapComponent from '@/components/MapComponent.vue'
import { ref } from 'vue'

const businessLocation = ref({ lat: 51.505, lng: -0.09, name: 'My Business' });

function onLocationUpdate(newCoords) {
  businessLocation.value.lat = newCoords.lat;
  businessLocation.value.lng = newCoords.lng;
  console.log('New location:', businessLocation.value);
}
</script>
```
