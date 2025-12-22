import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db } from '@/services/local-db';
import type { PartialRecord } from '@/types/partialRecord';

export const usePartialRecordStore = defineStore('partialRecords', () => {
  const partialRecords = ref<PartialRecord[]>([]);
  const loading = ref(false);

  // Computed: count of pending records
  const pendingCount = computed(
    () => partialRecords.value.filter(r => r.status === 'pending').length
  );

  /**
   * Load all partial records from IndexedDB
   * @returns Promise<void>
   */
  async function loadAll() {
    loading.value = true;
    try {
      partialRecords.value = await db.partialRecords.toArray();
    } catch (error) {
      console.error('Failed to load partial records:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Save a new partial record
   * @param record - PartialRecord to save
   * @returns Promise<void>
   */
  async function save(record: PartialRecord) {
    try {
      await db.partialRecords.add(record);
      partialRecords.value.push(record);
    } catch (error) {
      console.error('Failed to save partial record:', error);
      throw error;
    }
  }

  /**
   * Save multiple partial records (batch import)
   * @param records - Array of PartialRecord to save
   * @returns Promise<void>
   */
  async function saveMany(records: PartialRecord[]) {
    try {
      await db.partialRecords.bulkAdd(records);
      partialRecords.value.push(...records);
    } catch (error) {
      console.error('Failed to save partial records:', error);
      throw error;
    }
  }

  /**
   * Update an existing partial record
   * @param id - ID of the partial record to update
   * @param updates - PartialRecord updates
   * @returns Promise<void>
   */
  async function update(id: string, updates: Partial<PartialRecord>) {
    try {
      await db.partialRecords.update(id, updates);
      const index = partialRecords.value.findIndex(r => r.id === id);
      if (index !== -1) {
        partialRecords.value[index] = {
          ...partialRecords.value[index],
          ...updates,
        } as PartialRecord;
      }
    } catch (error) {
      console.error('Failed to update partial record:', error);
      throw error;
    }
  }

  /**
   * Delete a partial record
   * @param id - ID of the partial record to delete
   * @returns Promise<void>
   */
  async function remove(id: string) {
    try {
      await db.partialRecords.delete(id);
      partialRecords.value = partialRecords.value.filter(r => r.id !== id);
    } catch (error) {
      console.error('Failed to delete partial record:', error);
      throw error;
    }
  }

  /**
   * Get a single partial record by ID
   * @param id - ID of the partial record to get
   * @returns PartialRecord | undefined
   */
  function getById(id: string): PartialRecord | undefined {
    return partialRecords.value.find(r => r.id === id);
  }

  return {
    partialRecords,
    loading,
    pendingCount,
    loadAll,
    save,
    saveMany,
    update,
    remove,
    getById,
  };
});
