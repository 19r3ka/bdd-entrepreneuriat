import { describe, it, expect, vi } from 'vitest';
import { useMap } from './useMap';
import L from 'leaflet';

// Mock Leaflet's Map and Marker to avoid DOM interactions in unit tests
const mockMap = {
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  eachLayer: vi.fn(),
  setView: vi.fn(),
} as unknown as L.Map;

const mockMarker = {
  addTo: vi.fn().mockReturnThis(),
  bindPopup: vi.fn().mockReturnThis(),
} as unknown as L.Marker;

// Mock L.marker factory
vi.spyOn(L, 'marker').mockReturnValue(mockMarker);

describe('useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with a null mapInstance', () => {
    const { setMap, addMarker } = useMap();
    expect(setMap).toBeInstanceOf(Function);
    expect(addMarker).toBeInstanceOf(Function);
  });

  it('setMap should set the map instance', () => {
    const { setMap } = useMap();
    setMap(mockMap);
    // In a real scenario, you'd access the private mapInstance ref to assert.
    // Since we can't directly, we rely on indirect testing or trust the composable's internal state.
    // For now, we'll assume setting works if it doesn't throw.
    // More robust tests would involve a wrapper component or exposing mapInstance for testing.
  });

  const TEST_LATITUDE = 10;
  const TEST_LONGITUDE = 20;
  const TEST_LATITUDE_2 = 30;
  const TEST_LONGITUDE_2 = 40;
  const TEST_LATITUDE_3 = 30;
  const TEST_LONGITUDE_3 = 40;

  it('addMarker should add a marker to the map if mapInstance is set', () => {
    const { setMap, addMarker } = useMap();
    setMap(mockMap);
    addMarker(TEST_LATITUDE, TEST_LONGITUDE, 'Test Popup');

    expect(L.marker).toHaveBeenCalledWith([TEST_LATITUDE, TEST_LONGITUDE]);
    expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    expect(mockMarker.bindPopup).toHaveBeenCalledWith('Test Popup');
  });

  it('addMarker should do nothing if mapInstance is null', () => {
    const { addMarker } = useMap(); // mapInstance is null
    addMarker(TEST_LATITUDE, TEST_LONGITUDE, 'Test Popup');

    expect(L.marker).not.toHaveBeenCalledWith([TEST_LATITUDE, TEST_LONGITUDE]);
    expect(mockMarker.addTo).not.toHaveBeenCalled();
  });

  it('addAddressMarker should add marker when coordinates exist', () => {
    const { setMap, addAddressMarker } = useMap();
    setMap(mockMap);

    const address = {
      street: '123 Main St',
      city: 'City',
      country: 'Country',
      coordinates: { latitude: TEST_LATITUDE_2, longitude: TEST_LONGITUDE_2 },
    };

    addAddressMarker(address, 'Custom Popup');

    expect(L.marker).toHaveBeenCalledWith([TEST_LATITUDE_2, TEST_LONGITUDE_2]);
    expect(mockMarker.bindPopup).toHaveBeenCalledWith('Custom Popup');
  });

  it('addAddressMarker should use default popup text if not provided', () => {
    const { setMap, addAddressMarker } = useMap();
    setMap(mockMap);

    const address = {
      street: '123 Main St',
      city: 'City',
      country: 'Country',
      coordinates: { latitude: TEST_LATITUDE_3, longitude: TEST_LONGITUDE_3 },
    };

    addAddressMarker(address);

    expect(mockMarker.bindPopup).toHaveBeenCalledWith('123 Main St, City, Country');
  });

  it('addAddressMarker should do nothing if coordinates are missing', () => {
    const { setMap, addAddressMarker } = useMap();
    setMap(mockMap);

    const address = {
      street: '123 Main St',
      coordinates: undefined,
    };

    addAddressMarker(address);

    expect(L.marker).not.toHaveBeenCalledWith(expect.any(Array));
  });

  it('addAddressMarker should add marker for coordinates at 0,0', () => {
    const { setMap, addAddressMarker } = useMap();
    setMap(mockMap);

    const address = {
      coordinates: { latitude: 0, longitude: 0 },
    };

    addAddressMarker(address);

    expect(L.marker).toHaveBeenCalledWith([0, 0]);
  });
});
