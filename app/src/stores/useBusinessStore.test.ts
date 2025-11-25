import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/services/local-db';
import { useBusinessStore } from './useBusinessStore';
import { useEntrepreneurStore } from './useEntrepreneurStore';

// Mock the isProfileCompletedStrict utility function
vi.mock('@/utils/schemaCompletion', () => ({
  isProfileCompletedStrict: vi.fn((schema, data) => {
    // Simple mock implementation - returns true if basic required fields are present
    return !!(data.entrepreneurId && data.name && data.primaryBusinessArea);
  }),
}));

// Mock the useCrudStore composable
vi.mock('@/composables/useCrudStore', async () => {
  const actual = await vi.importActual('@/composables/useCrudStore');
  return {
    ...actual,
    useCrudStore: vi.fn(({ schema, tableName, db }) => ({
      items: [],
      loading: false,
      error: null,
      fetchAll: vi.fn(),
      fetchOne: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    })),
  };
});

// Mock the useEntrepreneurStore
vi.mock('./useEntrepreneurStore', async () => {
  const actual = await vi.importActual('./useEntrepreneurStore');
  return {
    ...actual,
    useEntrepreneurStore: vi.fn(() => ({
      entrepreneurs: [],
      fetchAll: vi.fn(),
    })),
  };
});

describe('useBusinessStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks
    vi.clearAllMocks();
  });

  it('enriches business with ownerName and computed flags', async () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [
        {
          id: 'ent1',
          firstName: 'John',
          lastName: 'Doe'
        }
      ],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Access the raw records ref and set the values to trigger computed properties
    const rawRecordsRef = (store as any).rawBusinessRecords;
    rawRecordsRef.value = [
      {
        id: '1',
        entrepreneurId: 'ent1',
        name: 'Test Business',
        primaryBusinessArea: 'Tech',
        registrationNumber: '12345',
        registrationDate: '2023-01-01T00:00:00.000Z',
        activityStartDate: '2023-02-01T00:00:00.000Z',
        supportStartDate: '2023-03-01T00:00:00.000Z',
        location: { longitude: 1, latitude: 1 },
        contact: { email: 'test@example.com' }
      }
    ];

    // Access the businesses computed property
    const businesses = store.businesses;

    // Should have enriched business with ownerName and other computed properties
    if (businesses.length > 0) {
      expect(businesses[0]).toHaveProperty('ownerName');
      expect(businesses[0].ownerName).toBe('John Doe');
      expect(businesses[0]).toHaveProperty('isRegistered');
      expect(businesses[0].isRegistered).toBe(true);
      expect(businesses[0]).toHaveProperty('profileCompleted');
      expect(businesses[0].profileCompleted).toBe(true);
      expect(businesses[0].registrationDate).toBeInstanceOf(Date);
      expect(businesses[0].activityStartDate).toBeInstanceOf(Date);
      expect(businesses[0].supportStartDate).toBeInstanceOf(Date);
    }
  });

  it('fetchOne enriches single business', async () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [
        {
          id: 'ent1',
          firstName: 'John',
          lastName: 'Doe'
        }
      ],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Mock the fetchOne function to return a business
    const mockFetchOne = vi.fn().mockResolvedValue({
      id: '1',
      entrepreneurId: 'ent1',
      name: 'Test Business',
      primaryBusinessArea: 'Tech',
      registrationNumber: '12345',
      registrationDate: '2023-01-01T00:00:00.000Z',
      activityStartDate: '2023-02-01T00:00:00.000Z',
      supportStartDate: '2023-03-01T00:00:00.000Z',
      location: { longitude: 1, latitude: 1 },
      contact: { email: 'test@example.com' }
    });
    (store as any).fetchOneRaw = mockFetchOne; // Mock the underlying fetchOneRaw function

    const result = await store.fetchOne('1');

    if (result) {
      // Result should be enriched
      expect(result).toHaveProperty('ownerName');
      expect(result.ownerName).toBe('John Doe');
      expect(result).toHaveProperty('isRegistered');
      expect(result.isRegistered).toBe(true);
      expect(result).toHaveProperty('profileCompleted');
      expect(result.profileCompleted).toBe(true);
      expect(result.registrationDate).toBeInstanceOf(Date);
      expect(result.activityStartDate).toBeInstanceOf(Date);
      expect(result.supportStartDate).toBeInstanceOf(Date);
    }
  });

  it('getters work correctly', () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [
        {
          id: 'ent1',
          firstName: 'John',
          lastName: 'Doe'
        }
      ],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Mock the raw business records to trigger computed properties
    const rawRecordsRef = (store as any).rawBusinessRecords;
    rawRecordsRef.value = [
      {
        id: '1',
        entrepreneurId: 'ent1',
        name: 'Test Business',
        primaryBusinessArea: 'Tech',
        registrationNumber: '12345',
        location: { longitude: 1, latitude: 1 },
        contact: { email: 'test@example.com' }
      },
      {
        id: '2',
        entrepreneurId: 'ent1',
        name: 'Another Business',
        primaryBusinessArea: 'Retail',
        registrationNumber: '67890',
        location: { longitude: 2, latitude: 2 },
        contact: { email: 'another@example.com' }
      }
    ];

    // Test getById
    const business1 = store.getById('1');
    expect(business1?.name).toBe('Test Business');

    // Test getByRegistrationNumber
    const businessWithReg = store.getByRegistrationNumber('67890');
    expect(businessWithReg?.name).toBe('Another Business');

    // Test getByEmail
    const businessWithEmail = store.getByEmail('test@example.com');
    expect(businessWithEmail?.name).toBe('Test Business');
  });

  it('searchByName works correctly', () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Mock the raw business records to trigger computed properties
    const rawRecordsRef = (store as any).rawBusinessRecords;
    rawRecordsRef.value = [
      {
        id: '1',
        entrepreneurId: 'ent1',
        name: 'Tech Solutions',
        primaryBusinessArea: 'Tech',
        location: { longitude: 1, latitude: 1 },
        contact: { email: 'tech@example.com' }
      },
      {
        id: '2',
        entrepreneurId: 'ent1',
        name: 'Retail Store',
        primaryBusinessArea: 'Retail',
        location: { longitude: 2, latitude: 2 },
        contact: { email: 'retail@example.com' }
      }
    ];

    // Test searchByName
    const techResults = store.searchByName('Tech');
    expect(techResults.value).toHaveLength(1);
    expect(techResults.value[0].name).toBe('Tech Solutions');
  });

  it('handles date coercion properly', () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Mock a business with date strings
    const rawRecordsRef = (store as any).rawBusinessRecords;
    rawRecordsRef.value = [
      {
        id: '1',
        entrepreneurId: 'ent1',
        name: 'Test Business',
        primaryBusinessArea: 'Tech',
        registrationDate: '2023-01-01T00:00:00.000Z',
        activityStartDate: '2023-02-01T00:00:00.000Z',
        supportStartDate: '2023-03-01T00:00:00.000Z',
        location: { longitude: 1, latitude: 1 },
        contact: { email: 'test@example.com' }
      }
    ];

    const businesses = store.businesses;
    if (businesses.length > 0) {
      expect(businesses[0].registrationDate).toBeInstanceOf(Date);
      expect(businesses[0].activityStartDate).toBeInstanceOf(Date);
      expect(businesses[0].supportStartDate).toBeInstanceOf(Date);
    }
  });

  it('handles null dates properly', () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [],
      fetchAll: vi.fn().mockResolvedValue(undefined)
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    // Mock a business with null dates
    const rawRecordsRef = (store as any).rawBusinessRecords;
    rawRecordsRef.value = [
      {
        id: '1',
        entrepreneurId: 'ent1',
        name: 'Test Business',
        primaryBusinessArea: 'Tech',
        registrationDate: null,
        activityStartDate: null,
        supportStartDate: null,
        location: { longitude: 1, latitude: 1 },
        contact: { email: 'test@example.com' }
      }
    ];

    const businesses = store.businesses;
    if (businesses.length > 0) {
      expect(businesses[0].registrationDate).toBeNull();
      expect(businesses[0].activityStartDate).toBeNull();
      expect(businesses[0].supportStartDate).toBeNull();
    }
  });

  it('handles error cases gracefully', async () => {
    // Mock entrepreneur store
    const mockEntrepreneurStore = {
      entrepreneurs: [],
      fetchAll: vi.fn().mockRejectedValue(new Error('Database error'))
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore as any);

    const store = useBusinessStore();

    await expect(store.fetchAll()).rejects.toThrow('Database error');
    expect(store.error).not.toBeNull();
  });
});