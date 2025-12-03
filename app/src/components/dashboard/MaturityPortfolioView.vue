<script setup lang="ts">
import { computed, toRef, ref } from 'vue';
import { MaturityDimensions, type MaturityDimension } from '@/constants/maturityCatalog';
import type { Business } from '@/types/business';
import { useMaturityCalculations } from '@/composables/useMaturityCalculations';
import Card from 'primevue/card';
import MaturityRadarChart from '@/components/shared/MaturityRadarChart.vue';
import AdvisoryItem from '@/components/dashboard/AdvisoryItem.vue';
import BusinessListModal from '@/components/dashboard/BusinessListModal.vue';

const props = defineProps<{
  businesses: Business[];
}>();

// Use shared composable for maturity calculations
const { avgMaturityLevels, milestoneDistribution, nextMilestoneAdvisories } = useMaturityCalculations(toRef(props, 'businesses'));

// Modal state
const showModal = ref(false);
const selectedAdvisory = ref<{
    dimension: MaturityDimension;
    level: number;
    nextLevel: number;
    businesses: Business[];
} | null>(null);

// Advisory list from real calculations (limit to top 5 for UI)
const advisoryList = computed(() => {
    return nextMilestoneAdvisories.value.slice(0, 5);
});

const openBusinessModal = (advisory: typeof nextMilestoneAdvisories.value[0]) => {
    selectedAdvisory.value = advisory;
    showModal.value = true;
};


</script>

<template>
    <Card class="mb-6 border-1 border-surface-200 dark:border-surface-700 shadow-sm">
        <template #title>
            <h2 class="text-900 dark:text-0 text-lg font-bold m-0">Maturity Matrix Portfolio View</h2>
        </template>
        <template #content>
            <div class="flex flex-column lg:flex-row gap-4">
                <!-- Spider Chart -->
                <div class="flex-1 flex align-items-center justify-content-center" style="min-height: 300px; min-width: 300px;">
                    <MaturityRadarChart :averages="avgMaturityLevels" />
                </div>

                <!-- Milestone Progress & Advisory -->
                <div class="flex-1" style="min-width: 300px;">
                    <!-- Progress Table -->
                    <div class="mb-4">
                        <h3 class="font-bold text-800 dark:text-100 mb-2 text-base">Milestone Progress</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left border-collapse">
                                <thead class="text-xs text-500 dark:text-400 uppercase bg-surface-50 dark:bg-surface-800">
                                    <tr>
                                        <th class="px-4 py-2 font-semibold">Dimension</th>
                                        <th v-for="i in 4" :key="i" class="px-4 py-2 text-center font-semibold">Lvl {{ i }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="dim in MaturityDimensions" :key="dim" class="border-bottom-1 border-surface-200 dark:border-surface-700">
                                        <td class="px-4 py-2 font-medium">{{ dim }}</td>
                                        <td v-for="i in 4" :key="i" class="px-4 py-2 text-center text-600 dark:text-300">
                                            {{ milestoneDistribution[dim]?.[i] || '0%' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Advisory -->
                    <div>
                        <h3 class="font-bold text-800 dark:text-100 mb-2 text-base">"Next Milestone" Advisory</h3>
                        <div v-if="advisoryList.length > 0" class="flex flex-column gap-2">
                            <AdvisoryItem 
                                v-for="(alert, idx) in advisoryList" 
                                :key="idx"
                                :dimension="alert.dimension"
                                :level="`Lvl ${alert.level}`"
                                :count="alert.count"
                                :message="alert.message"
                                @click="openBusinessModal(alert)"
                            />
                        </div>
                        <div v-else class="text-500 text-sm">
                            No advisory items at this time. All businesses are at maximum maturity level!
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <!-- Business List Modal -->
    <BusinessListModal
        v-if="selectedAdvisory"
        v-model:visible="showModal"
        :businesses="selectedAdvisory.businesses"
        :dimension="selectedAdvisory.dimension"
        :current-level="selectedAdvisory.level"
        :next-level="selectedAdvisory.nextLevel"
    />
</template>

<style scoped>
/* PrimeFlex grid overrides or helpers if needed */
</style>
