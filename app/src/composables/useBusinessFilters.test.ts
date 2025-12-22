import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { reactive } from 'vue';
import { useBusinessFilters } from './useBusinessFilters';
import { useBusinessStore } from '@/stores/useBusinessStore';

// Mock the useBusinessStore
vi.mock('@/stores/useBusinessStore', () => ({
  useBusinessStore: vi.fn(() => ({
    businesses: [],
  })),
}));

// Mock useBusinessAreas composable
vi.mock('./useBusinessAreas', () => ({
  useBusinessAreas: vi.fn(() => ({
    getBusinessAreaLabel: vi.fn((code: string) => `Area: ${code}`),
  })),
}));

describe('useBusinessFilters', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('ownerOptions returns unique, sorted owner names (excludes null)', () => {
    // Mock business store with businesses
    const mockBusinessStore = {
      businesses: [
        { ownerName: 'John Doe' },
        { ownerName: 'Jane Smith' },
        { ownerName: 'John Doe' }, // duplicate
        { ownerName: null }, // should be excluded
        { ownerName: 'Bob Johnson' },
        { ownerName: undefined }, // should be excluded
      ],
    };

    vi.mocked(useBusinessStore).mockReturnValue(mockBusinessStore as any);

    const { ownerOptions } = useBusinessFilters();

    // Should return unique, sorted names, excluding null/undefined
    expect(ownerOptions.value).toEqual([
      { label: 'Bob Johnson', value: 'Bob Johnson' },
      { label: 'Jane Smith', value: 'Jane Smith' },
      { label: 'John Doe', value: 'John Doe' },
    ]);
  });

  it('businessAreaOptions returns unique primaryBusinessArea codes with correct labels', () => {
    // Mock business store with businesses
    const mockBusinessStore = {
      businesses: [
        { primaryBusinessArea: 'IT' },
        { primaryBusinessArea: 'FIN' },
        { primaryBusinessArea: 'IT' }, // duplicate
        { primaryBusinessArea: 'MFG' },
      ],
    };

    vi.mocked(useBusinessStore).mockReturnValue(mockBusinessStore as any);

    const { businessAreaOptions } = useBusinessFilters();

    const options = businessAreaOptions.value;

    const EXPECTED_UNIQUE_BUSINESS_AREAS = 3; // Based on the mock data with IT, FIN, and MFG

    // Should return unique business areas with proper structure
    expect(options.length).toBe(EXPECTED_UNIQUE_BUSINESS_AREAS); // unique values only

    // Check that each option has label and value
    const labels = options.map(opt => opt.label);
    const values = options.map(opt => opt.value);

    expect(labels).toContain('Area: IT');
    expect(labels).toContain('Area: FIN');
    expect(labels).toContain('Area: MFG');

    expect(values).toContain('IT');
    expect(values).toContain('FIN');
    expect(values).toContain('MFG');
  });

  it('handles reactivity: adding/removing businesses recomputes options', () => {
    const businessStore: any = {
      businesses: reactive([]),
    };

    vi.mocked(useBusinessStore).mockReturnValue(businessStore);

    const { ownerOptions } = useBusinessFilters();

    // Initially empty
    expect(ownerOptions.value).toEqual([]);

    // Add a business
    businessStore.businesses.push({ ownerName: 'John Doe' });

    // Options should update
    expect(ownerOptions.value).toEqual([{ label: 'John Doe', value: 'John Doe' }]);

    // Add another business with same name (should remain unique)
    businessStore.businesses.push({ ownerName: 'John Doe' });
    expect(ownerOptions.value).toEqual([{ label: 'John Doe', value: 'John Doe' }]);

    // Add different name
    businessStore.businesses.push({ ownerName: 'Jane Smith' });
    expect(ownerOptions.value.sort((a, b) => a.label.localeCompare(b.label))).toEqual([
      { label: 'Jane Smith', value: 'Jane Smith' },
      { label: 'John Doe', value: 'John Doe' },
    ]); // Check they're both there
  });
});
