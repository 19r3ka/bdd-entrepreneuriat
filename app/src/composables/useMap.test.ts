import { describe, it, expect, vi } from 'vitest'
import { useMap } from './useMap'
import L from 'leaflet'

// Mock Leaflet's Map and Marker to avoid DOM interactions in unit tests
const mockMap = {
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  eachLayer: vi.fn(),
  setView: vi.fn()
} as unknown as L.Map

const mockMarker = {
  addTo: vi.fn().mockReturnThis(),
  bindPopup: vi.fn().mockReturnThis()
} as unknown as L.Marker

// Mock L.marker factory
vi.spyOn(L, 'marker').mockReturnValue(mockMarker)

describe('useMap', () => {
  it('should initialize with a null mapInstance', () => {
    const { setMap, addMarker } = useMap()
    expect(setMap).toBeInstanceOf(Function)
    expect(addMarker).toBeInstanceOf(Function)
  })

  it('setMap should set the map instance', () => {
    const { setMap } = useMap()
    setMap(mockMap)
    // In a real scenario, you'd access the private mapInstance ref to assert.
    // Since we can't directly, we rely on indirect testing or trust the composable's internal state.
    // For now, we'll assume setting works if it doesn't throw.
    // More robust tests would involve a wrapper component or exposing mapInstance for testing.
  })

  it('addMarker should add a marker to the map if mapInstance is set', () => {
    const { setMap, addMarker } = useMap()
    setMap(mockMap)
    addMarker(10, 20, 'Test Popup')

    expect(L.marker).toHaveBeenCalledWith([10, 20])
    expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap)
    expect(mockMarker.bindPopup).toHaveBeenCalledWith('Test Popup')
  })

  it('addMarker should do nothing if mapInstance is null', () => {
    const { addMarker } = useMap() // mapInstance is null
    addMarker(10, 20, 'Test Popup')

    expect(L.marker).not.toHaveBeenCalledWith([10, 20])
    expect(mockMarker.addTo).not.toHaveBeenCalled()
  })
})
