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
import { computed, ref, watch, onMounted } from 'vue'
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
import type { LatLngBounds } from 'leaflet'

type LeafletMap = InstanceType<typeof LMap>

interface Location {
  lat: number
  lng: number
  name: string
  address?: string
}

interface GeocodeResult {
  lat: string
  lon: string
  display_name: string
}

const props = withDefaults(
  defineProps<{
    locations: Location[]
    isEditable: boolean
    height?: string
    width?: string
  }>(),
  {
    height: '400px',
    width: '100%'
  }
)

const emit = defineEmits<{
  (e: 'update:location', value: { lat: number; lng: number }): void
  (e: 'update:address', value: string): void
  (e: 'update:bounds', value: LatLngBounds): void
}>()

  // Fix Leaflet icon issue - type workaround
  if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl
  }

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
  shadowUrl: iconShadow
})

const zoom = ref(2)
const center = ref<[number, number]>([47.41322, -1.219482])
const mapRef = ref<LeafletMap | null>(null)
let markerClusterGroup: L.MarkerClusterGroup | null = null
let editableMarker: L.Marker | null = null

const searchQuery = ref('')
const searchResults = ref<GeocodeResult[]>([])

const containerStyle = computed(() => ({
  height: props.height,
  width: props.width
}))

const hasLocations = computed(
  () =>
    props.locations &&
    props.locations.length > 0 &&
    props.locations.some((loc) => loc.lat != null && loc.lng != null)
)
const showOverlay = computed(() => !props.isEditable && !hasLocations.value)

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

const debouncedSearch = useDebounceFn(performSearch, 500)

const selectSearchResult = (result: GeocodeResult) => {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)
  center.value = [lat, lng]
  zoom.value = 14
  searchQuery.value = result.display_name
  searchResults.value = []

  if (props.isEditable && mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject as L.Map
    if (editableMarker) {
      editableMarker.setLatLng([lat, lng])
    } else {
      editableMarker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true
      }).addTo(map)
      editableMarker.on('dragend', (event) => {
        const newLatLng = event.target.getLatLng()
        emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
      })
    }
    emit('update:location', { lat, lng })
  }
}

const onMapReady = () => {
  if (mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject as L.Map
    if (props.isEditable) {
      const initialLatLng =
        props.locations.length > 0
          ? L.latLng(props.locations[0]!.lat, props.locations[0]!.lng)
          : L.latLng(center.value[0], center.value[1])

      editableMarker = L.marker(initialLatLng, {
        draggable: true,
        autoPan: true
      }).addTo(map)

      editableMarker.on('dragend', async (event) => {
        const newLatLng = event.target.getLatLng()
        emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
        try {
          const address = await reverseGeocode(newLatLng.lat, newLatLng.lng)
          emit('update:address', address)
        } catch (error) {
          console.error('Reverse geocoding failed:', error)
        }
      })

      map.on('click', async (e: L.LeafletMouseEvent) => {
        if (editableMarker) {
          editableMarker.setLatLng(e.latlng)
          emit('update:location', { lat: e.latlng.lat, lng: e.latlng.lng })
          try {
            const address = await reverseGeocode(e.latlng.lat, e.latlng.lng)
            emit('update:address', address)
          } catch (error) {
            console.error('Reverse geocoding failed:', error)
          }
        }
      })

      center.value = [initialLatLng.lat, initialLatLng.lng]
      zoom.value = 14
    } else {
      markerClusterGroup = L.markerClusterGroup()
      map.addLayer(markerClusterGroup)
      updateMarkers(props.locations)

      if (props.locations.length > 0) {
        if (props.locations.length === 1) {
          const loc = props.locations[0]
          if (loc && loc.lat != null && loc.lng != null) {
            center.value = [loc.lat, loc.lng]
            zoom.value = 13
            map.setView([loc.lat, loc.lng], 13)
          }
        } else {
          const bounds = L.latLngBounds(props.locations.map((l) => [l.lat, l.lng]))
          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 12
          })
        }
      }

      setTimeout(() => {
        if (mapRef.value?.leafletObject) {
          const bounds = (mapRef.value.leafletObject as L.Map).getBounds()
          emit('update:bounds', bounds)
        }
      }, 500)

      map.on('moveend', () => {
        if (mapRef.value?.leafletObject) {
          const bounds = mapRef.value.leafletObject.getBounds()
          emit('update:bounds', bounds)
        }
      })
    }
  }
}

const updateMarkers = (locations: Location[]) => {
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers()
    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng])
      const popupContent = loc.address
        ? `<b>${loc.name}</b><br>${loc.address}`
        : `<b>${loc.name}</b>`
      marker.bindPopup(popupContent)

      marker.on('click', () => {
        if (mapRef.value?.leafletObject) {
          ;(mapRef.value.leafletObject as L.Map).setView([loc.lat, loc.lng], 18)
        }
      })

      markerClusterGroup?.addLayer(marker)
    })
  }
}

watch(
  () => props.locations,
  (newLocations) => {
    const map = mapRef.value?.leafletObject as L.Map
    if (!map) return

    if (!props.isEditable) {
      updateMarkers(newLocations)
        if (newLocations.length > 0) {
          if (newLocations.length === 1) {
            const loc = newLocations[0]
            if (loc && loc.lat != null && loc.lng != null) {
              center.value = [loc.lat, loc.lng]
              zoom.value = 13
              if (map) {
                map.setView([loc.lat, loc.lng], 13)
              }
            }
          } else {
            const bounds = L.latLngBounds(newLocations.map((l) => [l.lat, l.lng]))
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 12
            })
          }
        }
      } else if (newLocations.length > 0) {
        const loc = newLocations[0]
        if (map && loc && loc.lat != null && loc.lng != null) {
          if (editableMarker) {
            editableMarker.setLatLng(L.latLng(loc.lat, loc.lng))
          } else {
            editableMarker = L.marker([loc.lat, loc.lng], {
              draggable: true,
              autoPan: true
            }).addTo(map)
            editableMarker.on('dragend', (event) => {
              const newLatLng = event.target.getLatLng()
              emit('update:location', { lat: newLatLng.lat, lng: newLatLng.lng })
            })
          }
          center.value = [loc.lat, loc.lng]
      zoom.value = 14
    }
  }
  },
  { deep: true, immediate: true }
)
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