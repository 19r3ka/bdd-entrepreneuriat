import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePartialRecords } from './usePartialRecords';
import type { PartialRecord } from '@/types/partialRecord';

const { mockPartialRecordStore, mockBusinessStore, mockDb } = vi.hoisted(() => ({
  mockPartialRecordStore: {
    remove: vi.fn(),
    update: vi.fn(),
  },
  mockBusinessStore: {
    add: vi.fn(),
  },
  mockDb: {
    businesses: {
      filter: vi.fn().mockReturnThis(),
      first: vi.fn(),
    },
  },
}));

vi.mock('@/stores/usePartialRecordStore', () => ({
  usePartialRecordStore: () => mockPartialRecordStore,
}));

vi.mock('@/stores/useBusinessStore', () => ({
  useBusinessStore: () => mockBusinessStore,
}));

vi.mock('@/services/local-db', () => ({
  db: mockDb,
}));

describe('usePartialRecords', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const samplePartialRecord: PartialRecord = {
    id: 'partial-1',
    rawData: {
      'Company Name': 'Test Corp',
      Email: 'test@test.com',
    },
    missingFields: [],
    status: 'pending',
    importSource: 'test.csv',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('promoteToFull', () => {
    it('should promote successfully when data is valid and no duplicate', async () => {
      const { promoteToFull } = usePartialRecords();

      const updatedData = {
        name: 'Test Corp',
        contact: { email: 'test@test.com', telephone: '123456789' },
        primaryBusinessArea: 'A', // Agriculture
        location: { latitude: 0, longitude: 0 },
        registrationNumber: 'REG123',
      };

      // Mock duplicate check to return null (no duplicate)
      mockDb.businesses.first.mockResolvedValue(undefined);

      const result = await promoteToFull(samplePartialRecord, updatedData);

      expect(result.success).toBe(true);
      expect(mockBusinessStore.add).toHaveBeenCalled();
      expect(mockPartialRecordStore.remove).toHaveBeenCalledWith('partial-1');
    });

    it('should fail validation if required fields are missing', async () => {
      const { promoteToFull } = usePartialRecords();

      const updatedData = {
        name: '', // Invalid name
      };

      const result = await promoteToFull(samplePartialRecord, updatedData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(mockPartialRecordStore.update).toHaveBeenCalledWith(
        'partial-1',
        expect.objectContaining({
          missingFields: expect.any(Array),
        })
      );
      expect(mockBusinessStore.add).not.toHaveBeenCalled();
    });

    it('should fail if duplicate business exists', async () => {
      const { promoteToFull } = usePartialRecords();

      const updatedData = {
        name: 'Existing Corp',
        contact: { email: 'test@test.com', telephone: '123456789' },
        primaryBusinessArea: 'A',
        location: { latitude: 0, longitude: 0 },
        registrationNumber: 'REG123',
      };

      // Mock duplicate found
      mockDb.businesses.first.mockResolvedValue({ id: 'existing-1', name: 'Existing Corp' });

      const result = await promoteToFull(samplePartialRecord, updatedData);

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toContain('Duplicate business detected');
      expect(mockBusinessStore.add).not.toHaveBeenCalled();
    });
  });

  describe('ignoreRecord', () => {
    it('should mark record as ignored', async () => {
      const { ignoreRecord } = usePartialRecords();

      await ignoreRecord('partial-1');

      expect(mockPartialRecordStore.update).toHaveBeenCalledWith(
        'partial-1',
        expect.objectContaining({
          status: 'ignored',
        })
      );
    });
  });

  describe('deleteRecord', () => {
    it('should remove record from store', async () => {
      const { deleteRecord } = usePartialRecords();

      await deleteRecord('partial-1');

      expect(mockPartialRecordStore.remove).toHaveBeenCalledWith('partial-1');
    });
  });

  describe('restoreRecord', () => {
    it('should restore record to pending', async () => {
      const { restoreRecord } = usePartialRecords();

      await restoreRecord('partial-1');

      expect(mockPartialRecordStore.update).toHaveBeenCalledWith(
        'partial-1',
        expect.objectContaining({
          status: 'pending',
        })
      );
    });
  });
});
