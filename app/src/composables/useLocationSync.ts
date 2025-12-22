import { watch, type Ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { searchAddress, type GeocodeResult } from '@/services/geocoding';

interface FormContext {
  setFieldValue: (field: string, value: unknown) => void;
  values: Record<string, unknown>;
}

const MIN_QUERY_LENGTH = 5;

/**
 * Composable for syncing location between form and map.
 */
export function useLocationSync(
  formRef: Ref<FormContext | null | undefined>,
  fieldPrefix: string = 'address'
) {
  // Handlers for Map -> Form sync

  const handleLocationUpdate = (coords: { lat: number; lng: number }) => {
    if (formRef.value) {
      formRef.value.setFieldValue(`${fieldPrefix}.coordinates.latitude`, coords.lat);
      formRef.value.setFieldValue(`${fieldPrefix}.coordinates.longitude`, coords.lng);
    }
  };

  const handleAddressUpdate = (_address: string) => {
    // Fallback if needed
  };

  const handleStructuredAddressUpdate = (addressParts: GeocodeResult['address']) => {
    if (!formRef.value || !addressParts) return;

    const set = (field: string, val: unknown) =>
      formRef.value?.setFieldValue(`${fieldPrefix}.${field}`, val);

    // Populate fields
    if (addressParts.road) {
      const street = addressParts.house_number
        ? `${addressParts.house_number} ${addressParts.road}`
        : addressParts.road;
      set('street', street);
    }

    // City logic: prefer city, then town, then village, then suburb
    const city =
      addressParts.city || addressParts.town || addressParts.village || addressParts.suburb;
    if (city) {
      set('city', city);
    }

    if (addressParts.state) {
      set('state', addressParts.state);
    }

    if (addressParts.postcode) {
      set('postalCode', addressParts.postcode);
    }

    if (addressParts.country) {
      set('country', addressParts.country);
    }
  };

  // Logic for Form -> Map sync

  const addressFields = computed(() => {
    if (!formRef.value?.values) return '';

    // We access the nested object based on prefix
    // Assuming values structure matches the prefix, e.g. values.address or values.location
    const group = (formRef.value.values[fieldPrefix] || {}) as Record<string, any>;
    const { street, city, state, country } = group;

    return `${street || ''} ${city || ''} ${state || ''} ${country || ''}`.trim();
  });

  const performGeocodeSearch = async (query: string) => {
    if (!query || query.length < MIN_QUERY_LENGTH) return;

    try {
      const results = await searchAddress(query);
      if (results && results.length > 0) {
        const topResult = results[0];
        if (topResult) {
          const lat = parseFloat(topResult.lat);
          const lng = parseFloat(topResult.lon);

          if (formRef.value) {
            formRef.value.setFieldValue(`${fieldPrefix}.coordinates.latitude`, lat);
            formRef.value.setFieldValue(`${fieldPrefix}.coordinates.longitude`, lng);
          }
        }
      }
    } catch (e) {
      console.error('Geo search failed', e);
    }
  };

  const debouncedGeocodeSearch = useDebounceFn((query: string) => {
    performGeocodeSearch(query);
  }, 1000);

  const setupAddressWatcher = () => {
    watch(addressFields, newQuery => {
      // Only search if user is actively typing address info
      debouncedGeocodeSearch(newQuery);
    });
  };

  return {
    handleLocationUpdate,
    handleAddressUpdate,
    handleStructuredAddressUpdate,
    setupAddressWatcher,
  };
}
