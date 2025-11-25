import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useSupportStore } from './useSupportStore';
import { db } from '@/services/local-db';
import type { Support, SupportModality, FinanceInstrument, FinanceSource } from '@/types/monitoring-evaluation/Support';

// Mock the local-db Dexie instance
vi.mock('@/services/local-db', () => {
  const supports: Support[] = [];
  return {
    db: {
      supports: {
        add: vi.fn(async (support: Support) => {
          supports.push(support);
          return support.id;
        }),
        get: vi.fn(async (id: string) => supports.find(s => s.id === id)),
        toArray: vi.fn(async () => supports),
        where: vi.fn((criteria: { businessId?: string; indicatorId?: string }) => ({
          toArray: vi.fn(async () => supports.filter(s => s.businessId === criteria.businessId)),
        })),
        update: vi.fn(async (id: string, changes: Partial<Support>) => {
          const index = supports.findIndex(s => s.id === id);
          if (index !== -1) {
            Object.assign(supports[index], changes);
            return 1; // Number of updated items
          }
          return 0;
        }),
        delete: vi.fn(async (id: string) => {
          const index = supports.findIndex(s => s.id === id);
          if (index !== -1) {
            supports.splice(index, 1);
            return 1; // Number of deleted items
          }
          return 0;
        }),
      },
    },
  };
});

describe('useSupportStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Clear the mock database before each test
    db.supports.toArray = vi.fn(async () => []);
    db.supports.add = vi.fn(async (support: Support) => {
      const supports = await db.supports.toArray();
      supports.push(support);
      return support.id;
    });
    db.supports.get = vi.fn(async (id: string) => (await db.supports.toArray()).find(s => s.id === id));
    db.supports.where = vi.fn((criteria: { businessId?: string }) => ({
      toArray: vi.fn(async () => (await db.supports.toArray()).filter(s => s.businessId === criteria.businessId)),
    }));
    db.supports.update = vi.fn(async (id: string, changes: Partial<Support>) => {
      const supports = await db.supports.toArray();
      const index = supports.findIndex(s => s.id === id);
      if (index !== -1) {
        Object.assign(supports[index], changes);
        return 1;
      }
      return 0;
    });
    db.supports.delete = vi.fn(async (id: string) => {
      let supports = await db.supports.toArray();
      const initialLength = supports.length;
      supports = supports.filter(s => s.id !== id);
      db.supports.toArray = vi.fn(async () => supports); // Update the internal state of the mock
      return initialLength - supports.length;
    });
  });

  const mockSupport: Omit<Support, 'id' | 'createdAt' | 'updatedAt'> = {
    businessId: 'business-123',
    modality: SupportModality.POLICY,
    description: 'Policy advice on environmental regulations',
    theoryOfChange: 'Better understanding leads to compliance',
    sesRiskCategory: 'Low',
    genderMarker: 'GEN0',
  };

  it('should add a new support intervention', async () => {
    const store = useSupportStore();
    const addedSupport = await store.addSupport(mockSupport);

    expect(addedSupport).toHaveProperty('id');
    expect(addedSupport.businessId).toBe(mockSupport.businessId);
    expect(store.supports.length).toBe(1);
    expect(db.supports.add).toHaveBeenCalledWith(expect.objectContaining({
      businessId: 'business-123',
    }));
  });

  it('should retrieve a support intervention by ID', async () => {
    const store = useSupportStore();
    const addedSupport = await store.addSupport(mockSupport);
    const fetchedSupport = await store.getSupportById(addedSupport.id);

    expect(fetchedSupport).toEqual(addedSupport);
  });

  it('should return undefined for a non-existent support ID', async () => {
    const store = useSupportStore();
    const fetchedSupport = await store.getSupportById('non-existent-id');

    expect(fetchedSupport).toBeUndefined();
  });

  it('should retrieve all support interventions', async () => {
    const store = useSupportStore();
    await store.addSupport(mockSupport);
    await store.addSupport({ ...mockSupport, description: 'Another support' });

    await store.getAllSupports();
    expect(store.supports.length).toBe(2);
    expect(db.supports.toArray).toHaveBeenCalled();
  });

  it('should retrieve supports by business ID', async () => {
    const store = useSupportStore();
    await store.addSupport(mockSupport); // business-123
    await store.addSupport({ ...mockSupport, businessId: 'business-456', description: 'Another business support' });

    const businessSupports = await store.getSupportsByBusinessId('business-123');
    expect(businessSupports.length).toBe(1);
    expect(businessSupports[0].businessId).toBe('business-123');
    expect(db.supports.where).toHaveBeenCalledWith({ businessId: 'business-123' });
  });

  it('should update an existing support intervention', async () => {
    const store = useSupportStore();
    const addedSupport = await store.addSupport(mockSupport);

    const updates = { description: 'Updated policy advice', genderMarker: 'GEN1' as 'GEN1' };
    await store.updateSupport(addedSupport.id, updates);

    const updatedSupport = await store.getSupportById(addedSupport.id);
    expect(updatedSupport?.description).toBe(updates.description);
    expect(updatedSupport?.genderMarker).toBe(updates.genderMarker);
    expect(updatedSupport?.updatedAt).not.toEqual(addedSupport.createdAt); // updatedAt should be changed
    expect(db.supports.update).toHaveBeenCalledWith(addedSupport.id, expect.objectContaining(updates));
  });

  it('should delete a support intervention', async () => {
    const store = useSupportStore();
    const addedSupport = await store.addSupport(mockSupport);

    await store.deleteSupport(addedSupport.id);
    const fetchedSupport = await store.getSupportById(addedSupport.id);

    expect(fetchedSupport).toBeUndefined();
    expect(store.supports.length).toBe(0);
    expect(db.supports.delete).toHaveBeenCalledWith(addedSupport.id);
  });
});
