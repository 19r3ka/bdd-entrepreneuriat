import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/services/local-db';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { OutputIndicator } from '@/types/monitoring-evaluation/OutputIndicator';
import { v4 as uuidv4 } from 'uuid';
import { useOutputIndicatorStore } from './useOutputIndicatorStore';

export const useQuickWinStore = defineStore('quickWin', () => {
    const quickWins = ref<QuickWin[]>([]);

    /**
     * Create a new quick win
     */
    async function createQuickWin(quickWin: Omit<QuickWin, 'id' | 'createdAt' | 'updatedAt'>) {
        // Deep clone to remove Vue proxies which cause DataCloneError in IndexedDB
        const rawQuickWin = JSON.parse(JSON.stringify(quickWin));

        const newQuickWin: QuickWin = {
            ...rawQuickWin,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await db.quickWins.add(newQuickWin);
        quickWins.value.push(newQuickWin);

        // Increment usage count for all used indicators
        const indicatorStore = useOutputIndicatorStore();
        for (const indicatorValue of newQuickWin.indicatorValues) {
            await indicatorStore.incrementUsageCount(indicatorValue.indicatorId);
        }

        return newQuickWin;
    }

    /**
     * Get quick win by ID with populated indicator details
     */
    async function getQuickWinById(id: string): Promise<QuickWin | undefined> {
        const quickWin = await db.quickWins.get(id);
        if (quickWin) {
            return await populateIndicators(quickWin);
        }
        return undefined;
    }

    /**
     * Get all quick wins
     */
    async function fetchAll(): Promise<QuickWin[]> {
        const allQuickWins = await db.quickWins.toArray();
        quickWins.value = allQuickWins;
        return allQuickWins;
    }

    /**
     * Get quick wins by business ID
     */
    async function getQuickWinsByBusinessId(businessId: string): Promise<QuickWin[]> {
        return await db.quickWins.where('businessId').equals(businessId).toArray();
    }

    /**
     * Get quick wins by support ID
     */
    async function getQuickWinsBySupportId(supportId: string): Promise<QuickWin[]> {
        return await db.quickWins.where('supportBoostId').equals(supportId).toArray();
    }

    /**
     * Update a quick win
     */
    async function updateQuickWin(id: string, updates: Partial<QuickWin>): Promise<void> {
        await db.quickWins.update(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });

        // Update local state
        const index = quickWins.value.findIndex((qw) => qw.id === id);
        if (index !== -1) {
            quickWins.value[index] = { ...quickWins.value[index], ...updates, id };
        }
    }

    /**
     * Delete a quick win
     */
    async function deleteQuickWin(id: string): Promise<void> {
        await db.quickWins.delete(id);
        quickWins.value = quickWins.value.filter((qw) => qw.id !== id);
    }

    /**
     * Helper: Populate indicator details for display
     * This fetches full OutputIndicator objects for each indicatorValue
     */
    async function populateIndicators(quickWin: QuickWin): Promise<QuickWin & { _populatedIndicators?: OutputIndicator[] }> {
        const indicatorStore = useOutputIndicatorStore();
        const populatedIndicators: OutputIndicator[] = [];

        for (const indicatorValue of quickWin.indicatorValues) {
            const indicator = await indicatorStore.getIndicatorById(indicatorValue.indicatorId);
            if (indicator) {
                populatedIndicators.push(indicator);
            }
        }

        return {
            ...quickWin,
            _populatedIndicators: populatedIndicators,
        };
    }

    return {
        quickWins,
        createQuickWin,
        getQuickWinById,
        fetchAll,
        getQuickWinsByBusinessId,
        getQuickWinsBySupportId,
        updateQuickWin,
        deleteQuickWin,
        populateIndicators,
    };
});
