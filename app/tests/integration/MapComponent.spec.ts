import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MapComponent from '@/components/MapComponent.vue';
import L from 'leaflet';
import 'leaflet.markercluster';
import * as GeocodingService from '@/services/geocoding';
import { useDebounceFn } from '@vueuse/core';

// Mock Leaflet and its plugins
vi.mock('leaflet', () => {
  const mockLayer = {
    addTo: vi.fn(),
    remove: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    setLatLng: vi.fn(),
    getLatLng: vi.fn(() => ({ lat: 0, lng: 0 })),
    bindPopup: vi.fn(),
    options: {},
  };
  const mockMap = {
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    setView: vi.fn(),
    eachLayer: vi.fn((callback) => {
      // Simulate iterating over layers, including our mock marker
      callback(mockLayer);
    }),
  };
  return {
    default: {
      map: vi.fn(() => mockMap),
      tileLayer: vi.fn(() => mockLayer),
      marker: vi.fn(() => mockLayer),
      latLng: vi.fn((lat, lng) => ({ lat, lng })),
      Marker: vi.fn(() => mockLayer), // Mock the class for instanceof checks
      MarkerClusterGroup: vi.fn(() => ({
        addLayer: vi.fn(),
        clearLayers: vi.fn(),
        addTo: vi.fn(),
      })),
    },
  };
});

// Mock geocoding service
vi.mock('@/services/geocoding', () => ({
  searchAddress: vi.fn(),
}));

// Mock useDebounceFn from vueuse/core
vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn) => fn), // Immediately execute the function for tests
}));


describe('MapComponent.vue', () => {
  const initialLocations = [
    { lat: 51.505, lng: -0.09, name: 'Location A' },
    { lat: 51.51, lng: -0.1, name: 'Location B' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in view-only mode with clustered markers', async () => {
    const wrapper = mount(MapComponent, {
      props: {
        locations: initialLocations,
        isEditable: false,
      },
      global: {
        stubs: {
          LMap: {
            template: '<div><slot></slot></div>',
            props: ['zoom', 'center'],
          },
          LTileLayer: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-bar').exists()).toBe(false);

    // Expect map to be initialized and markers added via clustering
    // The actual Leaflet map instance and marker cluster group are mocked
    // We can check if the mocked methods were called
    await wrapper.vm.$nextTick(); // Wait for onMapReady
    // @ts-ignore
    expect(L.MarkerClusterGroup).toHaveBeenCalled();
    // @ts-ignore
    expect(L.marker).toHaveBeenCalledTimes(initialLocations.length);
  });

  it('renders correctly in editable mode with a search bar and a draggable marker', async () => {
    const wrapper = mount(MapComponent, {
      props: {
        locations: [{ lat: 51.505, lng: -0.09, name: 'Editable Location' }],
        isEditable: true,
      },
      global: {
        stubs: {
          LMap: {
            template: '<div><slot></slot></div>',
            props: ['zoom', 'center'],
          },
          LTileLayer: true,
        },
      },
    });

    expect(wrapper.find('.search-bar').exists()).toBe(true);
    await wrapper.vm.$nextTick(); // Wait for onMapReady
    // @ts-ignore
    expect(L.marker).toHaveBeenCalledWith([51.505, -0.09], { draggable: true, autoPan: true });
  });

  it('performs address search and updates map center', async () => {
    const mockSearchResults = [
      { lat: '40.7128', lon: '-74.0060', display_name: 'New York City, USA' },
    ];
    vi.mocked(GeocodingService.searchAddress).mockResolvedValue(mockSearchResults);

    const wrapper = mount(MapComponent, {
      props: {
        locations: [],
        isEditable: true,
      },
      global: {
        stubs: {
          LMap: {
            template: '<div id="test-map-id"><slot></slot></div>',
            props: ['zoom', 'center'],
          },
          LTileLayer: true,
        },
      },
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('New York');
    await wrapper.vm.$nextTick();

    expect(GeocodingService.searchAddress).toHaveBeenCalledWith('New York');

    // Simulate clicking a search result
    const searchResultItem = wrapper.find('.search-results li');
    await searchResultItem.trigger('click');

    // Check if map center and zoom were updated
    expect(wrapper.vm.center).toEqual([40.7128, -74.0060]);
    expect(wrapper.vm.zoom).toBe(14);
    expect(wrapper.vm.searchQuery).toBe('New York City, USA');
  });

  it('emits update:location when the draggable marker is moved', async () => {
    // @ts-ignore
    L.marker.mockImplementationOnce((latlng, options) => {
      const marker = L.Layer.prototype; // Base Leaflet Layer
      Object.assign(marker, {
        on: vi.fn((event, cb) => {
          if (event === 'dragend') {
            marker.fire = (e: any) => cb({ target: { getLatLng: () => L.latLng(52, 0) } });
          }
        }),
        getLatLng: vi.fn(() => L.latLng(51.505, -0.09)),
        setLatLng: vi.fn(),
        addTo: vi.fn().mockReturnThis(),
        bindPopup: vi.fn(),
        options: options,
      });
      return marker;
    });

    const wrapper = mount(MapComponent, {
      props: {
        locations: [{ lat: 51.505, lng: -0.09, name: 'Test' }],
        isEditable: true,
      },
      global: {
        stubs: {
          LMap: {
            template: '<div><slot></slot></div>',
            props: ['zoom', 'center'],
          },
          LTileLayer: true,
        },
      },
    });

    await wrapper.vm.$nextTick(); // Wait for onMapReady
    // Simulate dragend event
    // @ts-ignore
    L.marker().fire({ type: 'dragend' });

    expect(wrapper.emitted('update:location')).toBeTruthy();
    expect(wrapper.emitted('update:location')[0][0]).toEqual({ lat: 52, lng: 0 });
  });

  it('updates editable marker position when locations prop changes', async () => {
    const wrapper = mount(MapComponent, {
      props: {
        locations: [{ lat: 10, lng: 10, name: 'Initial' }],
        isEditable: true,
      },
      global: {
        stubs: {
          LMap: {
            template: '<div><slot></slot></div>',
            props: ['zoom', 'center'],
          },
          LTileLayer: true,
        },
      },
    });

    await wrapper.vm.$nextTick();
    // @ts-ignore
    const markerInstance = L.marker(); // Get the mocked marker instance

    await wrapper.setProps({ locations: [{ lat: 20, lng: 20, name: 'Updated' }] });
    await wrapper.vm.$nextTick();

    // The setLatLng method on the mocked marker should have been called
    expect(markerInstance.setLatLng).toHaveBeenCalledWith({ lat: 20, lng: 20 });
    expect(wrapper.vm.center).toEqual([20, 20]);
  });
});
