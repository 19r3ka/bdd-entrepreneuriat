import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/local-db';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import { v4 as uuidv4 } from 'uuid';
import { serializeForDb, deserializeFromDb } from '@/utils/db-serialization';

export const useMomentumMetricStore = defineStore('momentumMetric', () => {
  const metrics = ref<MomentumMetric[]>([]);

  /**
   *
   */
  async function addMetric(
    metric: Omit<MomentumMetric, 'momentumMetricId' | 'createdAt' | 'updatedAt'>
  ) {
    const newMetric: MomentumMetric = {
      ...metric,
      momentumMetricId: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Serialize dates before saving to IndexedDB
    const serialized = serializeForDb(newMetric);
    await db.momentumMetrics.add(serialized);
    metrics.value.push(newMetric);
    return newMetric;
  }

  /**
   *
   */
  async function updateMetric(id: string, updates: Partial<MomentumMetric>) {
    const updated = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Serialize dates before saving to IndexedDB
    const serialized = serializeForDb(updated);
    await db.momentumMetrics.update(id, serialized);

    const updatedMetric = await db.momentumMetrics.get(id);
    if (updatedMetric) {
      const deserialized = deserializeFromDb(updatedMetric);
      const index = metrics.value.findIndex(m => m.momentumMetricId === id);
      if (index !== -1) {
        metrics.value[index] = deserialized;
      }
      return deserialized;
    }
  }

  /**
   *
   */
  async function deleteMetric(id: string) {
    await db.momentumMetrics.delete(id);
    metrics.value = metrics.value.filter(m => m.momentumMetricId !== id);
  }

  /**
   *
   */
  async function getMetricById(id: string) {
    const metric = await db.momentumMetrics.get(id);
    return metric ? deserializeFromDb(metric) : undefined;
  }

  /**
   *
   */
  async function getMetricsByBusinessId(businessId: string) {
    const result = await db.momentumMetrics
      .where('businessId')
      .equals(businessId)
      .reverse()
      .sortBy('createdAt');
    return result.map(m => deserializeFromDb(m));
  }

  /**
   *
   */
  async function getMetricsByQuickWinId(quickWinId: string) {
    const result = await db.momentumMetrics
      .where('quickWinId')
      .equals(quickWinId)
      .reverse()
      .sortBy('createdAt');
    return result.map(m => deserializeFromDb(m));
  }

  /**
   *
   */
  async function fetchAll() {
    const result = await db.momentumMetrics.toArray();
    metrics.value = result.map(m => deserializeFromDb(m));
    return metrics.value;
  }

  return {
    metrics,
    addMetric,
    updateMetric,
    deleteMetric,
    getMetricById,
    getMetricsByBusinessId,
    getMetricsByQuickWinId,
    fetchAll,
  };
});
