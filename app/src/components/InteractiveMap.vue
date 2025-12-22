<template>
  <div class="map-container" :style="containerStyle">
    <div v-if="showOverlay" class="no-location-overlay">
      <span>Location not set</span>
    </div>
    <template v-else>
      <div v-if="isEditable" class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for an address..."
          @input="debouncedSearch"
        />
        <ul v-if="searchResults.length && searchQuery" class="search-results">
          <li
            v-for="result in searchResults"
            :key="result.lat + result.lon"
            @click="selectSearchResult(result)"
          >
            {{ result.display_name }}
          </li>
        </ul>
      </div>
      <l-map
        ref="mapRef"
        :zoom="zoom"
        :center="center"
        style="height: 100%; width: 100%"
        @ready="onMapReady"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { searchAddress, reverseGeocode, type GeocodeResult } from '@/services/geocoding';
import { useDebounceFn } from '@vueuse/core';

// Fix for Leaflet markers disappearing in Vue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { LatLngBounds } from 'leaflet';

type LeafletMap = InstanceType<typeof LMap>;

interface Location {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

// interface GeocodeResult is now imported

const props = withDefaults(
  defineProps<{
    locations: Location[];
    isEditable: boolean;
    height?: string;
    width?: string;
  }>(),
  {
    height: '400px',
    width: '100%',
  }
);

const emit = defineEmits<{
  (e: 'update:location', value: { lat: number; lng: number }): void;
  (e: 'update:address', value: string): void;
  (e: 'update:structured-address', value: GeocodeResult['address'] | undefined): void;
  (e: 'update:bounds', value: LatLngBounds): void;
}>();

// Fix Leaflet icon issue - type workaround
if ('_getIconUrl' in L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const DEFAULT_CENTER_LAT = 6.124756330755172;
const DEFAULT_CENTER_LNG = 1.2171878686183069;
const EDITABLE_ZOOM = 14;
const SINGLE_LOCATION_ZOOM = 13;
const DETAIL_ZOOM = 18;
const MAX_CLUSTER_ZOOM = 12;
const MAP_PADDING = 50;
const SEARCH_DEBOUNCE_MS = 500;
const BOUNDS_UPDATE_DELAY_MS = 500;

const zoom = ref(2);
const center = ref<[number, number]>([DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG]);
const mapRef = ref<LeafletMap | null>(null);
let markerClusterGroup: L.MarkerClusterGroup | null = null;
let editableMarker: L.Marker | null = null;

const searchQuery = ref('');
const searchResults = ref<GeocodeResult[]>([]);

const containerStyle = computed(() => ({
  height: props.height,
  width: props.width,
}));

const hasLocations = computed(
  () =>
    props.locations &&
    props.locations.length > 0 &&
    props.locations.some(loc => loc.lat != null && loc.lng != null)
);
const showOverlay = computed(() => !props.isEditable && !hasLocations.value);

/**
 * Helpers functions to make much easier to reduce complexity
 */

/**
 * Helper function to update location and geocode
 * @param lat - latitude
 * @param lng - longitude
 * @returns void
 */
const updateLocationAndGeocode = async (lat: number, lng: number) => {
  emit('update:location', { lat, lng });
  try {
    const result = await reverseGeocode(lat, lng);
    emit('update:address', result.display_name);
    emit('update:structured-address', result.address);
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
};

/**
 * Helper function to setup editable marker
 * @param map - Leaflet map instance
 * @returns void
 */
const setupEditableMarker = (map: L.Map) => {
  const initialLatLng =
    props.locations.length > 0
      ? L.latLng(props.locations[0]!.lat, props.locations[0]!.lng)
      : L.latLng(center.value[0], center.value[1]);

  editableMarker = L.marker(initialLatLng, {
    draggable: true,
    autoPan: true,
  }).addTo(map);

  editableMarker.on('dragend', async event => {
    const newLatLng = event.target.getLatLng();
    await updateLocationAndGeocode(newLatLng.lat, newLatLng.lng);
  });

  map.on('click', async (e: L.LeafletMouseEvent) => {
    if (editableMarker) {
      editableMarker.setLatLng(e.latlng);
      await updateLocationAndGeocode(e.latlng.lat, e.latlng.lng);
    }
  });

  center.value = [initialLatLng.lat, initialLatLng.lng];
  zoom.value = EDITABLE_ZOOM;
};

/**
 * Helper function to fit map to single location
 * @param map - Leaflet map instance
 * @param loc - location object
 * @returns void
 */
const fitToSingleLocation = (map: L.Map, loc: Location) => {
  if (loc && loc.lat != null && loc.lng != null) {
    center.value = [loc.lat, loc.lng];
    zoom.value = SINGLE_LOCATION_ZOOM;
    map.setView([loc.lat, loc.lng], SINGLE_LOCATION_ZOOM);
  }
};

/**
 * Helper function to fit map to multiple locations
 * @param map - Leaflet map instance
 * @param locations - array of location objects
 * @returns void
 */
const fitToMultipleLocations = (map: L.Map, locations: Location[]) => {
  const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
  map.fitBounds(bounds, {
    padding: [MAP_PADDING, MAP_PADDING],
    maxZoom: MAX_CLUSTER_ZOOM,
  });
};

/**
 * Helper function to setup bounds tracking
 * @param map - Leaflet map instance
 * @returns void
 */
const setupBoundsTracking = (map: L.Map) => {
  setTimeout(() => {
    if (mapRef.value?.leafletObject) {
      const bounds = (mapRef.value.leafletObject as L.Map).getBounds();
      emit('update:bounds', bounds);
    }
  }, BOUNDS_UPDATE_DELAY_MS);

  map.on('moveend', () => {
    if (mapRef.value?.leafletObject) {
      const bounds = mapRef.value.leafletObject.getBounds();
      emit('update:bounds', bounds);
    }
  });
};

/**
 * Helper function to setup readonly map
 * @param map - Leaflet map instance
 * @returns void
 */
const setupReadonlyMap = (map: L.Map) => {
  markerClusterGroup = L.markerClusterGroup();
  map.addLayer(markerClusterGroup);
  updateMarkers(props.locations);

  if (props.locations.length > 0) {
    if (props.locations.length === 1) {
      fitToSingleLocation(map, props.locations[0]!);
    } else {
      fitToMultipleLocations(map, props.locations);
    }
  }

  setupBoundsTracking(map);
};

/**
 * Helper function to update readonly map view based on locations
 * @param map - Leaflet map instance
 * @param locations - array of location objects
 * @returns void
 */
const updateReadonlyMapView = (map: L.Map, locations: Location[]) => {
  if (locations.length === 0) return;

  if (locations.length === 1) {
    fitToSingleLocation(map, locations[0]!);
  } else {
    fitToMultipleLocations(map, locations);
  }
};

/**
 * Helper function to create or update editable marker
 * @param map - Leaflet map instance
 * @param loc - location object
 * @returns void
 */
const updateEditableMarker = (map: L.Map, loc: Location) => {
  if (!loc || loc.lat == null || loc.lng == null) return;

  const latLng = L.latLng(loc.lat, loc.lng);

  if (editableMarker) {
    editableMarker.setLatLng(latLng);
  } else {
    editableMarker = L.marker([loc.lat, loc.lng], {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    editableMarker.on('dragend', event => {
      const newLatLng = event.target.getLatLng();
      emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng });
    });
  }

  center.value = [loc.lat, loc.lng];
  zoom.value = EDITABLE_ZOOM;
};

/**
 * Helper function to handle readonly mode location updates
 * @param map - Leaflet map instance
 * @param locations - array of location objects
 * @returns void
 */
const handleReadonlyLocationUpdate = (map: L.Map, locations: Location[]) => {
  updateMarkers(locations);
  updateReadonlyMapView(map, locations);
};

/**
 * Helper function to handle editable mode location updates
 * @param map - Leaflet map instance
 * @param locations - array of location objects
 * @returns void
 */
const handleEditableLocationUpdate = (map: L.Map, locations: Location[]) => {
  if (locations.length === 0) return;
  updateEditableMarker(map, locations[0]!);
};

const performSearch = async () => {
  if (searchQuery.value.length > 2) {
    try {
      searchResults.value = await searchAddress(searchQuery.value);
    } catch (error) {
      console.error('Error searching address:', error);
      searchResults.value = [];
    }
  } else {
    searchResults.value = [];
  }
};

const debouncedSearch = useDebounceFn(performSearch, SEARCH_DEBOUNCE_MS);

const selectSearchResult = (result: GeocodeResult) => {
  const lat = parseFloat(result.lat);
  const lng = parseFloat(result.lon);
  center.value = [lat, lng];
  zoom.value = 14;
  searchQuery.value = '';
  searchResults.value = [];

  if (props.isEditable && mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject as L.Map;
    if (editableMarker) {
      editableMarker.setLatLng([lat, lng]);
    } else {
      editableMarker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
      }).addTo(map);
      editableMarker.on('dragend', event => {
        const newLatLng = event.target.getLatLng();
        emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng });
      });
    }
    emit('update:location', { lat, lng });
    emit('update:address', result.display_name);
    emit('update:structured-address', result.address);
  }
};

const onMapReady = () => {
  if (!mapRef.value?.leafletObject) return;

  const map = mapRef.value.leafletObject as L.Map;

  if (props.isEditable) {
    setupEditableMarker(map);
  } else {
    setupReadonlyMap(map);
  }
};

const updateMarkers = (locations: Location[]) => {
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng]);
      const popupContent = loc.address
        ? `<b>${loc.name}</b><br>${loc.address}`
        : `<b>${loc.name}</b>`;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (mapRef.value?.leafletObject) {
          (mapRef.value.leafletObject as L.Map).setView([loc.lat, loc.lng], DETAIL_ZOOM);
        }
      });

      markerClusterGroup?.addLayer(marker);
    });
  }
};

watch(
  () => props.locations,
  newLocations => {
    const map = mapRef.value?.leafletObject as L.Map;
    if (!map) return;

    if (props.isEditable) {
      handleEditableLocationUpdate(map, newLocations);
    } else {
      handleReadonlyLocationUpdate(map, newLocations);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.map-container {
  position: relative;
  z-index: 1;
}

.no-location-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.8);
  z-index: 1001;
  color: #555;
  font-size: 1.2em;
  border-radius: inherit;
}

.search-bar {
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 1000;
  width: 300px;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

.search-results {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  border: 1px solid #eee;
  border-radius: 3px;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
}

.search-results li {
  padding: 8px;
  cursor: pointer;
  color: #333;
}

.search-results li:hover {
  background-color: #f0f0f0;
}

:deep(.marker-cluster-small) {
  background-color: rgba(181, 226, 140, 0.6);
}
:deep(.marker-cluster-small div) {
  background-color: rgba(110, 204, 57, 0.6);
}
:deep(.marker-cluster-medium) {
  background-color: rgba(241, 211, 87, 0.6);
}
:deep(.marker-cluster-medium div) {
  background-color: rgba(240, 194, 12, 0.6);
}
:deep(.marker-cluster-large) {
  background-color: rgba(253, 156, 115, 0.6);
}
:deep(.marker-cluster-large div) {
  background-color: rgba(241, 128, 23, 0.6);
}

:deep(.marker-cluster) {
  background-clip: padding-box;
  border-radius: 20px;
}
:deep(.marker-cluster div) {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  margin-top: 5px;
  text-align: center;
  border-radius: 15px;
  font:
    12px 'Helvetica Neue',
    Arial,
    Helvetica,
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: bold;
}
:deep(.marker-cluster span) {
  line-height: 30px;
}
</style>
