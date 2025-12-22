import { defineStore } from 'pinia';
import { db } from '@/services/local-db';
import type { Support } from '@/types/monitoring-evaluation/Support';
import { v4 as uuidv4 } from 'uuid';

interface SupportState {
  supports: Support[];
}

export const useSupportStore = defineStore('support', {
  state: (): SupportState => ({
    supports: [],
  }),
  actions: {
    async addSupport(support: Support): Promise<Support> {
      // Ensure ID exists
      if (!support.id) {
        support.id = uuidv4();
      }
      // Ensure timestamps
      const now = new Date();
      if (!support.createdAt) support.createdAt = now;
      if (!support.updatedAt) support.updatedAt = now;

      await db.supports.add(support);
      this.supports.push(support);
      return support;
    },

    async getSupportById(id: string): Promise<Support | undefined> {
      return await db.supports.get(id);
    },

    async fetchAll(): Promise<Support[]> {
      this.supports = await db.supports.toArray();
      return this.supports;
    },

    async getSupportsByBusinessId(businessId: string): Promise<Support[]> {
      return await db.supports.where({ businessId }).toArray();
    },

    async updateSupport(id: string, updates: Partial<Support>): Promise<void> {
      const now = new Date();
      const finalUpdates = { ...updates, updatedAt: now };

      await db.supports.update(id, finalUpdates);

      const index = this.supports.findIndex(s => s.id === id);
      if (index !== -1) {
        // Merge updates into local state
        this.supports[index] = { ...this.supports[index], ...finalUpdates } as Support;
      }
    },

    async deleteSupport(id: string): Promise<void> {
      await db.supports.delete(id);
      this.supports = this.supports.filter(s => s.id !== id);
    },
  },
});
