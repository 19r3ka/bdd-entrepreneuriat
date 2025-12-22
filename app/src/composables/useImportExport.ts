import { ref } from 'vue';
import { BusinessSchema } from '@/schemas/business';
import type { Business } from '@/schemas/business';
import type { PartialRecord } from '@/types/partialRecord';
import { parseFile, exportToFile, type ParseError } from '@/services/importParser';

export interface ImportResult {
  valid: Business[];
  partial: PartialRecord[];
  rejected: RejectedRecord[];
  conflicts: ConflictRecord[];
}

export interface RejectedRecord {
  row: Record<string, unknown>;
  reason: string;
}

export interface ConflictRecord {
  imported: Partial<Business>;
  existing: Business;
  rawData: Record<string, unknown>;
  resolution?: 'keep' | 'overwrite' | 'skip';
}

import { ref } from 'vue';
import { BusinessSchema } from '@/schemas/business';
import type { Business } from '@/schemas/business';
import { parseFile, exportToFile, type ParseError } from '@/services/importParser';
import { meetsMinimumViability, findExisting, mapRowToBusiness } from '@/utils/importHelpers';

export interface ImportResult {
  valid: Business[];
  partial: any[]; // Using any here to match existing partial records for now, or use PartialRecord type if available
  rejected: RejectedRecord[];
  conflicts: ConflictRecord[];
}

export interface RejectedRecord {
  row: Record<string, unknown>;
  reason: string;
}

export interface ConflictRecord {
  imported: Partial<Business>;
  existing: Business;
  rawData: Record<string, unknown>;
  resolution?: 'keep' | 'overwrite' | 'skip';
}

/**
 * Composable for import/export operations
 */
export function useImportExport() {
  const importing = ref(false);
  const exporting = ref(false);
  const error = ref<string | null>(null);

  /**
   * Process imported rows and split into valid, partial, rejected, and conflicts
   */
  async function processImport(
    rows: Record<string, unknown>[],
    importSource: string
  ): Promise<ImportResult> {
    const result: ImportResult = {
      valid: [],
      partial: [],
      rejected: [],
      conflicts: [],
    };

    for (const row of rows) {
      if (!meetsMinimumViability(row)) {
        result.rejected.push({
          row,
          reason: 'Missing required fields: Name and Entrepreneur ID',
        });
        continue;
      }

      const businessData = mapRowToBusiness(row);
      const existing = await findExisting(businessData);

      if (existing) {
        result.conflicts.push({
          imported: businessData,
          existing,
          rawData: row,
        });
        continue;
      }

      const validation = BusinessSchema.safeParse(businessData);

      if (validation.success) {
        result.valid.push(validation.data as Business);
      } else {
        const missingFields = validation.error.issues.map(e => e.path.join('.'));
        result.partial.push({
          id: crypto.randomUUID(),
          rawData: row,
          missingFields,
          status: 'pending',
          importSource,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return result;
  }

  /**
   * Export data to file
   */
  function exportData(
    data: Record<string, unknown>[],
    fileName: string,
    format: 'csv' | 'xlsx' = 'xlsx',
    selectedFields?: string[]
  ): void {
    exporting.value = true;
    error.value = null;

    try {
      let exportData = data;

      if (selectedFields && selectedFields.length > 0) {
        exportData = data.map(row => {
          const filtered: Record<string, unknown> = {};
          selectedFields.forEach(field => {
            filtered[field] = row[field];
          });
          return filtered;
        });
      }

      exportToFile(exportData, fileName, format);
    } catch (err) {
      error.value = 'Failed to export data';
      console.error('Export error:', err);
      throw err;
    } finally {
      exporting.value = false;
    }
  }

  /**
   * Import businesses from a file
   */
  async function importFromFile(file: File): Promise<ImportResult> {
    importing.value = true;
    error.value = null;

    try {
      const parseResult = await parseFile(file);
      return await processImport(parseResult.data, parseResult.fileName);
    } catch (err) {
      const parseError = err as ParseError;
      error.value = parseError.message || 'Failed to import file';
      throw err;
    } finally {
      importing.value = false;
    }
  }

  return {
    importing,
    exporting,
    error,
    importFromFile,
    exportData,
    processImport,
    mapRowToBusiness,
  };
}
