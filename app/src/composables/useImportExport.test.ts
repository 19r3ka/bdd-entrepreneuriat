/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useImportExport } from './useImportExport';

// Mock dependencies
vi.mock('@/services/local-db', () => ({
  db: {
    businesses: {
      toArray: vi.fn(),
      filter: vi.fn().mockReturnThis(),
    },
  },
}));

vi.mock('@/services/importParser', () => ({
  parseFile: vi.fn(),
  exportToFile: vi.fn(),
}));

// Import mocked modules to control behavior
import { parseFile, exportToFile } from '@/services/importParser';
import { db } from '@/services/local-db';

describe('useImportExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => '00000000-0000-0000-0000-000000000000'),
    });
  });

  describe('processImport', () => {
    it('should categorize valid rows correctly', async () => {
      const { processImport } = useImportExport();

      const rows = [
        {
          name: 'Valid Business',
          owner: 'John Doe',
          entrepreneurId: '00000000-0000-0000-0000-000000000000', // Valid UUID
          registrationNumber: '123',
          email: 'test@example.com', // Required for contact
          primaryBusinessArea: 'G', // Required enum (valid code)
          activityStartDate: '2023-01-01',
          supportStartDate: '2023-01-01',
        },
      ];

      // Mock duplicate check to false
      (db.businesses.toArray as any).mockResolvedValue([]);

      const result = await processImport(rows, 'test.csv');

      expect(result.valid.length).toBe(1);
      expect(result.valid[0]!.name).toBe('Valid Business');
      expect(result.partial.length).toBe(0);
      expect(result.rejected.length).toBe(0);
    });

    it('should reject rows missing minimum viability fields (Name + Owner)', async () => {
      const { processImport } = useImportExport();

      const rows = [
        { name: 'No Owner' },
        { owner: 'No Business Name' },
        { someOtherField: 'Random Data' },
      ];

      const result = await processImport(rows, 'test.csv');

      expect(result.valid.length).toBe(0);
      expect(result.partial.length).toBe(0);
      expect(result.rejected.length).toBe(3);
      expect(result.rejected[0]!.reason).toContain('Missing required fields');
    });

    it('should identify duplicates', async () => {
      const { processImport } = useImportExport();

      const rows = [
        {
          name: 'Duplicate Business',
          owner: 'Jane Doe',
          entrepreneurId: '00000000-0000-0000-0000-000000000000',
        },
      ];

      // Mock duplicate found
      (db.businesses.toArray as any).mockResolvedValue([
        { id: 'existing', name: 'Duplicate Business' },
      ]);

      const result = await processImport(rows, 'test.csv');

      expect(result.valid.length).toBe(0);
      expect(result.conflicts.length).toBe(1);
      expect(result.conflicts[0]!.existing.name).toBe('Duplicate Business');
    });

    it('should map coordinates correctly', async () => {
      const { mapRowToBusiness } = useImportExport();

      const row = {
        name: 'Geo Biz',
        owner: 'Mapper',
        Latitude: '6.123',
        Longitude: '1.456',
      };

      const business = mapRowToBusiness(row);

      expect(business.location?.coordinates).toBeDefined();
      expect(business.location?.coordinates?.latitude).toBe(6.123);
      expect(business.location?.coordinates?.longitude).toBe(1.456);
    });

    it('should categorize invalid schema rows as partial', async () => {
      const { processImport } = useImportExport();

      // Reset mock to ensure no duplicate found
      (db.businesses.toArray as any).mockResolvedValue([]);

      // Row with invalid email and missing required fields
      const rows = [
        {
          name: 'Invalid Email Biz',
          owner: 'Jane Doe',
          entrepreneurId: '00000000-0000-0000-0000-000000000000',
          contact: { email: 'not-an-email' },
        },
      ];

      const result = await processImport(rows, 'test.csv');

      // Should not be valid
      expect(result.valid.length).toBe(0);
      expect(result.rejected.length).toBe(0); // Ensure it wasn't rejected
      expect(result.partial.length).toBe(1);
      expect(result.partial[0]!.rawData).toEqual(rows[0]);
    });
  });

  describe('importFromFile', () => {
    it('should call parseFile and then processImport', async () => {
      const { importFromFile } = useImportExport();
      const file = new File([''], 'test.csv', { type: 'text/csv' });

      // Mock parseFile response
      (parseFile as any).mockResolvedValue({
        fileName: 'test.csv',
        data: [
          {
            name: 'Test',
            owner: 'Owner',
            entrepreneurId: '00000000-0000-0000-0000-000000000000',
            email: 'test@example.com',
            primaryBusinessArea: 'G',
            activityStartDate: '2023-01-01',
            supportStartDate: '2023-01-01',
          },
        ],
      });

      // Mock db for processImport
      (db.businesses.toArray as any).mockResolvedValue([]);

      const result = await importFromFile(file);

      expect(parseFile).toHaveBeenCalledWith(file);
      expect(result.valid.length).toBe(1);
    });

    it('should handle parse errors', async () => {
      const { importFromFile, error } = useImportExport();
      const file = new File([''], 'bad.csv');

      (parseFile as any).mockRejectedValue(new Error('Parse failed'));

      await expect(importFromFile(file)).rejects.toThrow('Parse failed');
      expect(error.value).toBe('Parse failed');
    });
  });

  describe('exportData', () => {
    it('should call exportToFile with filtered data', () => {
      const { exportData } = useImportExport();

      const data = [
        { name: 'B1', secret: 'hidden' },
        { name: 'B2', secret: 'hidden' },
      ];

      const selectedFields = ['name'];

      exportData(data as any, 'export', 'csv', selectedFields);

      expect(exportToFile).toHaveBeenCalledWith([{ name: 'B1' }, { name: 'B2' }], 'export', 'csv');
    });

    it('should call exportToFile with all data if no fields selected', () => {
      const { exportData } = useImportExport();

      const data = [{ name: 'B1' }];

      exportData(data as any, 'export', 'xlsx');

      expect(exportToFile).toHaveBeenCalledWith(data, 'export', 'xlsx');
    });
  });
});
