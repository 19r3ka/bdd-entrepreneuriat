<template>
  <div class="map-container">
    <div v-if="showOverlay" class="no-location-overlay">
      <span>Location not set</span>
    </div>
    <template v-else>
      <div v-if="isEditable" class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
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
      <l-map ref="mapRef" :zoom="zoom" :center="center" @ready="onMapReady">
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
  import { computed, ref, watch } from 'vue'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
  import L from 'leaflet'
  import 'leaflet.markercluster'
  import { searchAddress, reverseGeocode } from '@/services/geocoding'
  import { useDebounceFn } from '@vueuse/core'

  // Fix for Leaflet markers disappearing in Vue
  import icon from 'leaflet/dist/images/marker-icon.png'
  import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
  import iconShadow from 'leaflet/dist/images/marker-shadow.png'

  delete L.Icon.Default.prototype._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
  })

  /**
   * @interface Location
   * @property {number} lat - Latitude of the location.
   * @property {number} lng - Longitude of the location.
   * @property {string} name - Name or description of the location.
   */
  interface Location {
    lat: number
    lng: number
    name: string
  }

  /**
   * @interface GeocodeResult
   * @property {string} lat - Latitude as a string.
   * @property {string} lon - Longitude as a string.
   * @property {string} display_name - Display name of the geocoded address.
   */
  interface GeocodeResult {
    lat: string
    lon: string
    display_name: string
  }

  /**
   * MapComponent
   * A reusable Vue component for displaying interactive maps using Leaflet.
   * It supports both view-only mode with clustered markers and an editable mode
   * allowing address search and a draggable pin for precise location selection.
   * @typedef Props
   * @property {Location[]} locations - An array of locations to display on the map. In editable mode, only the first location is used for the draggable marker.
   * @property {boolean} isEditable - If true, enables address search and a draggable marker.
   */
  const props = defineProps<{
    locations: Location[]
    isEditable: boolean
  }>()

  /**
   * @event update:location
   * @description Emitted when the draggable marker in editable mode is moved.
   * @property {object} payload - The new coordinates.
   * @property {number} payload.lat - The new latitude.
   * @property {number} payload.lng - The new longitude.
   */
  /**
   * @event update:address
   * @description Emitted when reverse geocoding completes for a new location.
   * @property {string} address - The reverse geocoded address.
   */
  const emit = defineEmits(['update:location', 'update:address'])

  const zoom = ref(2)
  const center = ref([47.41322, -1.219482])
  const mapRef = ref<any>(null)
  let markerClusterGroup: L.MarkerClusterGroup | null = null
  let editableMarker: L.Marker | null = null // To store the draggable marker instance

  const searchQuery = ref('')
  const searchResults = ref<GeocodeResult[]>([])

  const hasLocations = computed(() => props.locations && props.locations.length > 0 && props.locations.some(loc => loc.lat != null && loc.lng != null));
  const showOverlay = computed(() => !props.isEditable && !hasLocations.value);

  /**
   * Performs an address search using the geocoding service.
   * Results are debounced to reduce API calls.
   */
  const performSearch = async () => {
    if (searchQuery.value.length > 2) {
      try {
        searchResults.value = await searchAddress(searchQuery.value)
      } catch (error) {
        console.error('Error searching address:', error)
        searchResults.value = []
      }
    } else {
      searchResults.value = []
    }
  }

  /**
   * Debounced version of `performSearch` to limit API requests.
   */
  const debouncedSearch = useDebounceFn(performSearch, 500)

  /**
   * Selects a search result, updates the map center, zoom level,
   * and sets the search query input to the selected address.
   * @param {GeocodeResult} result - The selected geocoding result.
   */
  const selectSearchResult = (result: GeocodeResult) => {
    center.value = [parseFloat(result.lat), parseFloat(result.lon)]
    zoom.value = 14 // Zoom in to the selected location
    searchQuery.value = result.display_name // Display the full address in the search box
    searchResults.value = [] // Clear search results

    if (props.isEditable && mapRef.value && mapRef.value.leafletObject) {
      if (editableMarker) {
        editableMarker.setLatLng(L.latLng(parseFloat(result.lat), parseFloat(result.lon)))
      } else {
        editableMarker = L.marker([parseFloat(result.lat), parseFloat(result.lon)], {
          draggable: true,
          autoPan: true
        }).addTo(mapRef.value.leafletObject)
        editableMarker.on('dragend', (event) => {
          const newLatLng = event.target.getLatLng()
          emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
        })
      }
      emit('update:location', { lat: parseFloat(result.lat), lng: parseFloat(result.lon) })
    }
  }

  /**
   * Initializes the map once it's ready.
   * Sets up marker clustering for view-only mode or a draggable marker for editable mode.
   */
  const onMapReady = () => {
    if (mapRef.value && mapRef.value.leafletObject) {
      if (props.isEditable) {
        // Add a single draggable marker for editing
        const initialLatLng =
          props.locations.length > 0
            ? L.latLng(props.locations[0].lat, props.locations[0].lng)
            : L.latLng(center.value[0], center.value[1])

        editableMarker = L.marker(initialLatLng, {
          draggable: true,
          autoPan: true
        }).addTo(mapRef.value.leafletObject)

        editableMarker.on('dragend', async (event) => {
          const newLatLng = event.target.getLatLng()
          emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
          // Reverse geocode to get address
          try {
            const address = await reverseGeocode(newLatLng.lat, newLatLng.lng)
            emit('update:address', address)
          } catch (error) {
            console.error('Reverse geocoding failed:', error)
          }
        })

        // Add map click listener to move marker
        mapRef.value.leafletObject.on('click', async (e: L.LeafletMouseEvent) => {
          if (editableMarker) {
            editableMarker.setLatLng(e.latlng);
            emit('update:location', { lat: e.latlng.lat, lng: e.latlng.lng });
            // Reverse geocode to get address
            try {
              const address = await reverseGeocode(e.latlng.lat, e.latlng.lng)
              emit('update:address', address)
            } catch (error) {
              console.error('Reverse geocoding failed:', error)
            }
          }
        });

        // Adjust map center to initial editable marker
        center.value = [initialLatLng.lat, initialLatLng.lng]
        zoom.value = 14 // Zoom in for better editing experience
      } else {
        // For view-only mode, use marker cluster group
        markerClusterGroup = L.markerClusterGroup()
        mapRef.value.leafletObject.addLayer(markerClusterGroup)
        updateMarkers(props.locations)
      }
    }
  }

  /**
   * Updates the markers on the map.
   * Clears existing markers and adds new ones based on the provided locations.
   * This function is used in view-only mode.
   * @param {Location[]} locations - An array of locations to display.
   */
  const updateMarkers = (locations: Location[]) => {
    if (markerClusterGroup) {
      markerClusterGroup.clearLayers()
      locations.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng])
        marker.bindPopup(`<b>${loc.name}</b>`)
        markerClusterGroup?.addLayer(marker)
      })
    }
  }

  /**
   * Watcher for changes in the `locations` prop.
   * Updates markers in view-only mode or the draggable marker in editable mode.
   */
  watch(
    () => props.locations,
    (newLocations) => {
      // Only update markers if not in editable mode, as editable mode has its own marker
      if (!props.isEditable) {
        updateMarkers(newLocations)
      } else if (newLocations.length > 0) {
        // If in editable mode and locations change, update the single editable marker
        // This is useful if the initial location comes from an external source after component load
        if (mapRef.value && mapRef.value.leafletObject) {
          if (editableMarker) {
            editableMarker.setLatLng(L.latLng(newLocations[0].lat, newLocations[0].lng))
          } else {
            // Should ideally not happen if onMapReady correctly initializes
            editableMarker = L.marker([newLocations[0].lat, newLocations[0].lng], {
              draggable: true,
              autoPan: true
            }).addTo(mapRef.value.leafletObject)
            editableMarker.on('dragend', (event) => {
              const newLatLng = event.target.getLatLng()
              emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
            })
          }
          center.value = [newLocations[0].lat, newLocations[0].lng]
          zoom.value = 14
        }
      }
    },
    { deep: true, immediate: true }
  )
</script>

<style scoped>
  .map-container {
    height: 400px;
    width: 100%;
    position: relative; /* Needed for absolute positioning of search results */
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
    z-index: 1001; /* Higher than search bar */
    color: #555;
    font-size: 1.2em;
    border-radius: inherit; /* If map container has one */
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
    box-sizing: border-box; /* Include padding in width */
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
</style>
