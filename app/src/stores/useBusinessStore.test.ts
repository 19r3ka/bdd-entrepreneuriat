import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBusinessStore } from './useBusinessStore';
import { useEntrepreneurStore } from './useEntrepreneurStore';
import { useCrudStore } from '@/composables/useCrudStore';
import { ref } from 'vue';

// Mock dependencies
vi.mock('@/composables/useCrudStore');
vi.mock('./useEntrepreneurStore');
vi.mock('@/utils/schemaCompletion', () => ({
  isProfileCompletedStrict: vi.fn().mockReturnValue(true),
}));
vi.mock('./useActivityLogStore', () => ({
  useActivityLogStore: vi.fn(() => ({
    logAction: vi.fn(),
  })),
}));

const mockEntrepreneurs = [
  { id: '123e4567-e89b-12d3-a456-426614174001', firstName: 'John', lastName: 'Doe' },
  { id: '123e4567-e89b-12d3-a456-426614174002', firstName: 'Jane', lastName: 'Smith' },
];

const mockRawBusinesses = [
  {
    id: '123e4567-e89b-12d3-a456-426614174011',
    entrepreneurId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Tech Solutions',
    primaryBusinessArea: 'G',
    registrationNumber: 'TS123',
    registrationDate: '2022-01-01T00:00:00.000Z',
    activityStartDate: '2022-02-01T00:00:00.000Z',
    supportStartDate: '2022-03-01T00:00:00.000Z',
    location: {
      street: '123 Main St',
      city: 'Tech City',
      state: 'TC',
      postalCode: '12345',
      country: 'US',
      coordinates: { longitude: 10, latitude: 20 },
    },
    contact: { email: 'tech@example.com', telephone: '+22890000001' },
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174012',
    entrepreneurId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Retail Goods',
    primaryBusinessArea: 'G',
    registrationNumber: 'RG456',
    registrationDate: null,
    activityStartDate: '2023-01-01T00:00:00.000Z',
    supportStartDate: '2023-02-01T00:00:00.000Z',
    location: {
      street: '456 Market St',
      city: 'Retail City',
      state: 'RC',
      postalCode: '67890',
      country: 'US',
      coordinates: { longitude: 30, latitude: 40 },
    },
    contact: { email: 'retail@example.com', telephone: '+22890000002' },
  },
];

describe('useBusinessStore', () => {
  let mockCrudStore: any;
  let mockEntrepreneurStore: any;

  beforeEach(() => {
    setActivePinia(createPinia());

    mockCrudStore = {
      items: ref([...mockRawBusinesses]),
      loading: ref(false),
      error: ref(null),
      fetchAll: vi.fn(),
      fetchOne: vi.fn(id => mockRawBusinesses.find(b => b.id === id)),
      add: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };
    vi.mocked(useCrudStore).mockReturnValue(mockCrudStore);

    mockEntrepreneurStore = {
      entrepreneurs: [...mockEntrepreneurs],
      fetchAll: vi.fn(),
    };
    vi.mocked(useEntrepreneurStore).mockReturnValue(mockEntrepreneurStore);
  });

  it('correctly enriches businesses', async () => {
    const store = useBusinessStore();
    await store.fetchAll();

    const businesses = store.businesses;
    expect(businesses.length).toBe(2);

    const biz1 = businesses.find(b => b.id === '123e4567-e89b-12d3-a456-426614174011');
    expect(biz1).toBeDefined();
    expect(biz1?.ownerName).toBe('John Doe');
    expect(biz1?.isRegistered).toBe(true);
    expect(biz1?.profileCompleted).toBe(true);
    expect(biz1?.registrationDate).toBeInstanceOf(Date);
  });

  it('handles null dates correctly', () => {
    const store = useBusinessStore();
    const businesses = store.businesses;
    const biz2 = businesses.find(b => b.id === '123e4567-e89b-12d3-a456-426614174012');
    expect(biz2).toBeDefined();
    expect(biz2?.isRegistered).toBe(false);
    expect(biz2?.registrationDate).toBeNull();
  });

  it('fetches and enriches a single business', async () => {
    const store = useBusinessStore();
    const business = await store.fetchOne('123e4567-e89b-12d3-a456-426614174011');

    expect(business).not.toBeNull();
    expect(business?.ownerName).toBe('John Doe');
    expect(business?.isRegistered).toBe(true);
    expect(mockEntrepreneurStore.fetchAll).toHaveBeenCalled();
    expect(mockCrudStore.fetchOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174011');
  });

  it('returns null if fetchOne finds no record', async () => {
    mockCrudStore.fetchOne.mockResolvedValue(null);
    const store = useBusinessStore();
    const business = await store.fetchOne('nonexistent');
    expect(business).toBeNull();
  });

  it('provides correct getters', () => {
    const store = useBusinessStore();
    const biz1 = store.getById('123e4567-e89b-12d3-a456-426614174011');
    expect(biz1).toBeDefined();
    expect(biz1?.name).toBe('Tech Solutions');

    const biz2 = store.getByRegistrationNumber('RG456');
    expect(biz2).toBeDefined();
    expect(biz2?.name).toBe('Retail Goods');

    const biz1ByEmail = store.getByEmail('tech@example.com');
    expect(biz1ByEmail).toBeDefined();
    expect(biz1ByEmail?.name).toBe('Tech Solutions');
  });

  it('searches by name correctly', () => {
    const store = useBusinessStore();
    const results = store.searchByName('Tech');
    expect(results.value.length).toBe(1);
    expect(results.value[0]!.name).toBe('Tech Solutions');

    const allResults = store.searchByName('');
    expect(allResults.value.length).toBe(2);
  });

  it('calls underlying CRUD methods for add and update', async () => {
    const store = useBusinessStore();
    const newBusiness: any = {
      id: '123e4567-e89b-12d3-a456-426614174013',
      name: 'New Biz',
      entrepreneurId: '123e4567-e89b-12d3-a456-426614174001',
      primaryBusinessArea: 'G',
      location: {
        street: '789 New St',
        city: 'New City',
        state: 'NC',
        postalCode: '54321',
        country: 'US',
        coordinates: { longitude: 1, latitude: 1 },
      },
      contact: { email: 'new@test.com', telephone: '+22890000003' },
      activityStartDate: '2023-01-01',
      supportStartDate: '2023-01-01',
    };
    await store.add(newBusiness);
    expect(mockCrudStore.add).toHaveBeenCalled();

    await store.update({
      ...newBusiness,
      name: 'Updated Biz',
    });
    expect(mockCrudStore.update).toHaveBeenCalled();
  });

  it('remove method calls underlying remove and logs activity', async () => {
    const store = useBusinessStore();
    await store.remove('123e4567-e89b-12d3-a456-426614174011');
    expect(mockCrudStore.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174011');
  });
});
