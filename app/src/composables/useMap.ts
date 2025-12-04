import { ref } from 'vue'
import type { Map as LeafletMap } from 'leaflet'
import L from 'leaflet'

/**
 * @typedef {Object} UseMapReturn
 * @property {function(Map): void} setMap - Sets the Leaflet map instance.
 * @property {function(number, number, string): void} addMarker - Adds a marker to the map.
 */

/**
 * Composable for managing Leaflet map instances and basic map operations.
 * Provides functions to set the map instance and add markers.
 * @returns {UseMapReturn}
 */
export function useMap() {
  const mapInstance = ref<LeafletMap | null>(null)

  /**
   * Sets the internal Leaflet map instance.
   * @param {LeafletMap} map - The Leaflet map object.
   */
  function setMap(map: LeafletMap) {
    mapInstance.value = map
  }

  /**
   * Adds a marker to the map at the specified coordinates with a popup.
   * @param {number} lat - Latitude of the marker.
   * @param {number} lng - Longitude of the marker.
   * @param {string} popupText - Content for the marker's popup.
   */
  function addMarker(lat: number, lng: number, popupText: string) {
    if (mapInstance.value) {
      L.marker([lat, lng]).addTo(mapInstance.value as any).bindPopup(popupText)
    }
  }

  return {
    setMap,
    addMarker
  }
}
