import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/local-db';
import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator';
import { v4 as uuidv4 } from 'uuid';

export const useOutputIndicatorStore = defineStore('outputIndicator', () => {
  const indicators = ref<OutputIndicator[]>([]);

  /**
   * Create a new output indicator
   */
  async function createIndicator(
    indicator: Omit<OutputIndicator, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const newIndicator: OutputIndicator = {
      ...indicator,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.outputIndicators.add(newIndicator);
    indicators.value.push(newIndicator);
    return newIndicator;
  }

  /**
   * Get indicator by ID
   */
  async function getIndicatorById(id: string): Promise<OutputIndicator | undefined> {
    return await db.outputIndicators.get(id);
  }

  /**
   * Find indicator by name
   */
  async function findIndicatorByName(name: string): Promise<OutputIndicator | undefined> {
    return await db.outputIndicators.where('name').equals(name).first();
  }

  /**
   * Add a new output indicator (alias for createIndicator, or for specific use cases)
   */
  async function addIndicator(indicator: Omit<OutputIndicator, 'id' | 'createdAt' | 'updatedAt'>) {
    const newIndicator: OutputIndicator = {
      ...indicator,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.outputIndicators.add(newIndicator);
    indicators.value.push(newIndicator);
    return newIndicator;
  }

  /**
   * Get all indicators
   */
  async function getAllIndicators(): Promise<OutputIndicator[]> {
    const allIndicators = await db.outputIndicators.toArray();
    indicators.value = allIndicators;
    return allIndicators;
  }

  /**
   * Get standard (pre-seeded) indicators
   */
  async function getStandardIndicators(): Promise<OutputIndicator[]> {
    return await db.outputIndicators.where('isStandard').equals(1).toArray();
  }

  /**
   * Get indicators by category
   */
  async function getIndicatorsByCategory(category: string): Promise<OutputIndicator[]> {
    return await db.outputIndicators.where('category').equals(category).toArray();
  }

  /**
   * Search indicators by name or description
   */
  async function searchIndicators(query: string): Promise<OutputIndicator[]> {
    const lowerQuery = query.toLowerCase();
    const allIndicators = await db.outputIndicators.toArray();
    return allIndicators.filter(
      indicator =>
        indicator.name.toLowerCase().includes(lowerQuery) ||
        indicator.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Increment usage count for an indicator
   */
  async function incrementUsageCount(id: string): Promise<void> {
    const indicator = await db.outputIndicators.get(id);
    if (indicator) {
      await db.outputIndicators.update(id, {
        usageCount: indicator.usageCount + 1,
        updatedAt: new Date(),
      });

      // Update local state
      const index = indicators.value.findIndex(i => i.id === id);
      if (index !== -1 && indicators.value[index]) {
        indicators.value[index].usageCount++;
      }
    }
  }

  /**
   * Update an indicator
   */
  async function updateIndicator(id: string, updates: Partial<OutputIndicator>): Promise<void> {
    await db.outputIndicators.update(id, {
      ...updates,
      updatedAt: new Date(),
    });

    // Update local state
    const index = indicators.value.findIndex(i => i.id === id);
    if (index !== -1) {
      indicators.value[index] = { ...indicators.value[index], ...updates } as OutputIndicator;
    }
  }

  /**
   * Delete an indicator
   */
  async function deleteIndicator(id: string): Promise<void> {
    await db.outputIndicators.delete(id);
    indicators.value = indicators.value.filter(i => i.id !== id);
  }

  return {
    indicators,
    createIndicator,
    getIndicatorById,
    getAllIndicators,
    getStandardIndicators,
    getIndicatorsByCategory,
    searchIndicators,
    incrementUsageCount,
    updateIndicator,
    deleteIndicator,
    findIndicatorByName,
    addIndicator,
  };
});
