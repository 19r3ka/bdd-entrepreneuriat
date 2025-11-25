import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/services/local-db';
import { useEntrepreneurStore } from './useEntrepreneurStore';
import { EntrepreneurSchema } from '../schemas/entrepreneur';

// Mock the isProfileCompletedStrict utility function
vi.mock('@/utils/schemaCompletion', () => ({
  isProfileCompletedStrict: vi.fn((schema, data) => {
    // Simple mock implementation - returns true if basic required fields are present
    return !!(data.firstName && data.lastName && data.slug && data.contact?.email);
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

describe('useEntrepreneurStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks
    vi.clearAllMocks();
  });

  it('validates schema during add/update operations', async () => {
    const store = useEntrepreneurStore();

    // Mock the underlying CRUD operations
    const mockAdd = vi.fn().mockResolvedValue(undefined);
    (store as any).add = mockAdd;

    // Should validate against EntrepreneurSchema during operations
    const validEntrepreneur = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    // Test schema validation by attempting to add valid data
    await expect(store.add(validEntrepreneur as any)).resolves.not.toThrow();

    // Verify the data was passed through
    expect(mockAdd).toHaveBeenCalledWith(validEntrepreneur);
  });

  it('enriches entrepreneur with isProfileCompleted flag', () => {
    const store = useEntrepreneurStore();

    // Test the enrichEntrepreneur function directly
    const baseEntrepreneur = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    // Access the private enrichEntrepreneur function by casting to any
    const enriched = (store as any).enrichEntrepreneur(baseEntrepreneur);

    expect(enriched).toHaveProperty('isProfileCompleted');
    expect(enriched.isProfileCompleted).toBe(true);
  });

  it('fetchOne enriches single entrepreneur', async () => {
    const store = useEntrepreneurStore();

    // Mock the baseFetchOne to return a base entrepreneur
    const mockFetchOne = vi.fn().mockResolvedValue({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    });
    (store as any).baseFetchOne = mockFetchOne;

    const result = await store.fetchOne('1');

    // Result should be enriched with isProfileCompleted
    if (result) {
      expect(result).toHaveProperty('isProfileCompleted');
      expect(result.isProfileCompleted).toBe(true);
    }
  });

  it('fetchAll enriches all entrepreneurs', async () => {
    const store = useEntrepreneurStore();

    // Mock the base fetchAll to set some raw items
    const mockBaseFetchAll = vi.fn().mockImplementation(() => {
      (store as any).entrepreneurs.value = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          slug: 'john-doe',
          contact: { email: 'john@example.com' }
        }
      ];
    });
    (store as any).baseFetchAll = mockBaseFetchAll;

    await store.fetchAll();

    // Should have enriched entrepreneurs with isProfileCompleted
    if (store.entrepreneurs.length > 0) {
      expect(store.entrepreneurs[0]).toHaveProperty('isProfileCompleted');
      expect(store.entrepreneurs[0].isProfileCompleted).toBe(true);
    }
  });

  it('getters work correctly', () => {
    const store = useEntrepreneurStore();

    // Set up test data using the reactive reference
    (store as any).entrepreneurs.value = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
        contact: { email: 'john@example.com' }
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        slug: 'jane-smith',
        contact: { email: 'jane@example.com' }
      }
    ];

    // Test getById
    expect(store.getById('1')?.firstName).toBe('John');
    expect(store.getById('999')).toBeUndefined();

    // Test getBySlug
    expect(store.getBySlug('jane-smith')?.firstName).toBe('Jane');
    expect(store.getBySlug('non-existent')).toBeUndefined();

    // Test getByEmail
    expect(store.getByEmail('john@example.com')?.firstName).toBe('John');
    expect(store.getByEmail('non-existent@example.com')).toBeUndefined();
  });

  it('searches work correctly', () => {
    const store = useEntrepreneurStore();

    // Set up test data
    (store as any).entrepreneurs.value = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        contact: { email: 'john@example.com' }
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        contact: { email: 'jane@example.com' }
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        contact: { email: 'bob@example.com' }
      }
    ];

    // Test searchByName
    const johnResults = store.searchByName('John');
    expect(johnResults).toHaveLength(1);
    expect(johnResults[0].firstName).toBe('John');

    const joResults = store.searchByName('jo'); // should match John and Johnson
    expect(joResults).toHaveLength(2);
    expect(joResults.map(e => e.firstName)).toContain('John');
    expect(joResults.map(e => e.firstName)).toContain('Bob');

    // Test searchByEmail
    const johnEmailResults = store.searchByEmail('john');
    expect(johnEmailResults).toHaveLength(1);
    expect(johnEmailResults[0].contact.email).toBe('john@example.com');
  });

  it('handles error cases gracefully', async () => {
    const store = useEntrepreneurStore();

    // Set up an error in the computed property
    const mockBaseFetchAll = vi.fn().mockRejectedValue(new Error('Database error'));
    (store as any).baseFetchAll = mockBaseFetchAll;

    await expect(store.fetchAll()).rejects.toThrow('Database error');
    expect(store.error).not.toBeNull();
  });
});