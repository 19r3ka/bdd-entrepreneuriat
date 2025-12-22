import { db } from '@/services/local-db';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { BusinessSchema } from '@/schemas/business';
import { usePartialRecordStore } from '@/stores/usePartialRecordStore';
import type { Business } from '@/types/business';
import type { PartialRecord } from '@/types/partialRecord';

/**
 * Composable for managing partial record remediation
 */
export function usePartialRecords() {
  const partialRecordStore = usePartialRecordStore();
  const businessStore = useBusinessStore();

  /**
   * Check if a business already exists (duplicate detection)
   * Exact match on name or registration number
   */
  async function isDuplicate(businessData: Partial<Business>): Promise<boolean> {
    if (!businessData.name && !businessData.registrationNumber) {
      return false;
    }

    const existing = await db.businesses
      .filter(
        b =>
          Boolean(businessData.name && b.name === businessData.name) ||
          Boolean(
            businessData.registrationNumber &&
            b.registrationNumber === businessData.registrationNumber
          )
      )
      .first();

    return Boolean(existing);
  }

  /**
   * Attempt to promote a partial record to a full Business
   * @param partialRecord - The partial record to promote
   * @param updatedData - Updated/completed data from the user
   * @returns true if promotion succeeded, false if validation still fails
   */
  async function promoteToFull(
    partialRecord: PartialRecord,
    updatedData: Record<string, unknown>
  ): Promise<{ success: boolean; errors?: string[] }> {
    // Merge raw data with updates
    const mergedData = { ...partialRecord.rawData, ...updatedData };

    // Validate against Business schema
    const validation = BusinessSchema.safeParse(mergedData);

    if (validation.success) {
      const businessData = validation.data as Business;

      // Check for duplicates (FR-009: strict exact match on Business Name or Registration ID)
      if (await isDuplicate(businessData)) {
        return {
          success: false,
          errors: [
            'Duplicate business detected: A business with the same name or registration number already exists.',
          ],
        };
      }

      try {
        // Save as a full Business
        await businessStore.add(businessData);

        // Remove from partial records
        await partialRecordStore.remove(partialRecord.id);

        return { success: true };
      } catch (error) {
        console.error('Failed to promote partial record:', error);
        // If business storage fails, return specific error
        return {
          success: false,
          errors: [
            `Failed to save business: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
        };
      }
    } else {
      // Still has validation errors
      const errors = validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`);

      // Update the partial record with new data and missing fields
      const missingFields = validation.error.issues.map(e => e.path.join('.'));
      await partialRecordStore.update(partialRecord.id, {
        rawData: mergedData,
        missingFields,
        updatedAt: new Date().toISOString(),
      });

      return { success: false, errors };
    }
  }

  /**
   * Mark a partial record as ignored
   */
  async function ignoreRecord(partialRecordId: string): Promise<void> {
    try {
      await partialRecordStore.update(partialRecordId, {
        status: 'ignored',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to ignore partial record:', error);
      throw error;
    }
  }

  /**
   * Delete a partial record permanently
   */
  async function deleteRecord(partialRecordId: string): Promise<void> {
    try {
      await partialRecordStore.remove(partialRecordId);
    } catch (error) {
      console.error('Failed to delete partial record:', error);
      throw error;
    }
  }

  /**
   * Restore an ignored record back to pending
   */
  async function restoreRecord(partialRecordId: string): Promise<void> {
    try {
      await partialRecordStore.update(partialRecordId, {
        status: 'pending',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to restore partial record:', error);
      throw error;
    }
  }

  return {
    promoteToFull,
    ignoreRecord,
    deleteRecord,
    restoreRecord,
  };
}
