<script setup lang="ts">
import { toRefs } from 'vue';
import type { Business } from '@/types/business';
import type { Entrepreneur } from '@/types/entrepreneur';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { ActivityLog } from '@/types/ActivityLog';
import { useActivityFeed } from '@/composables/useActivityFeed';
import { useRouter } from 'vue-router';

import Card from 'primevue/card';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Button from 'primevue/button';

const props = defineProps<{
  businesses: Business[];
  entrepreneurs: Entrepreneur[];
  supports: Support[];
  quickWins: QuickWin[];
  metrics: MomentumMetric[];
  logs: ActivityLog[];
}>();

const router = useRouter();

// Convert props to refs for the composable
const { businesses, entrepreneurs, supports, quickWins, metrics, logs } = toRefs(props);

// Use the composable
const { activities, alerts } = useActivityFeed(
    businesses, 
    entrepreneurs, 
    supports as any, 
    quickWins as any, 
    metrics as any,
    logs as any
);

const getSeverity = (status: string): "success" | "info" | "danger" | "secondary" | "warn" | "contrast" | undefined => {
    switch (status) {
        case 'Verified':
        case 'Achieved':
        case 'Completed':
            return 'success';
        case 'Registered':
        case 'Reported':
            return 'info';
        case 'Pending':
            return 'warn';
        case 'Rejected':
            return 'danger';
        default:
            return 'secondary';
    }
};

const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};
</script>

<template>
    <Card class="h-full border-1 border-surface-200 dark:border-surface-700 shadow-sm flex flex-col">
        <template #title>
            <h2 class="text-900 dark:text-white text-lg font-bold m-0">Activity & Alerts</h2>
        </template>
        <template #content>
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Recent Activity</Tab>
                    <Tab value="1">
                        Alerts 
                        <Badge :value="alerts.length" severity="warn" class="ml-2" v-if="alerts.length > 0" />
                    </Tab>
                </TabList>
                <TabPanels>
                    <!-- Recent Activity Tab -->
                    <TabPanel value="0">
                        <DataTable :value="activities" :rows="5" paginator class="p-datatable-sm" empty-message="No recent activity">
                            <Column field="entity" header="ENTITY">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <Avatar :label="slotProps.data.entityInitials" shape="circle" size="normal" class="bg-surface-200 dark:bg-surface-700 text-700 dark:text-200" />
                                        <div class="flex flex-column">
                                            <span class="font-bold text-sm text-900 dark:text-white">{{ slotProps.data.entityName }}</span>
                                            <span class="text-xs text-500 dark:text-400">{{ slotProps.data.entityType }}</span>
                                        </div>
                                    </div>
                                </template>
                            </Column>
                            <Column field="description" header="ACTIVITY">
                                <template #body="slotProps">
                                    <div class="flex flex-column">
                                        <span class="text-sm text-900 dark:text-white font-medium">{{ slotProps.data.description }}</span>
                                        <span v-if="slotProps.data.meta" class="text-xs text-500">{{ slotProps.data.meta }}</span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="status" header="STATUS">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" class="text-xs" />
                                </template>
                            </Column>
                            <Column field="date" header="WHEN">
                                <template #body="slotProps">
                                    <span class="text-sm text-500 dark:text-400">{{ formatRelativeTime(slotProps.data.date) }}</span>
                                </template>
                            </Column>
                            <Column header="Action" style="width: 10%">
                                <template #body="slotProps">
                                    <Button icon="pi pi-arrow-right" text rounded aria-label="View" @click="router.push(slotProps.data.link)" />
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>

                    <!-- Alerts Tab -->
                    <TabPanel value="1">
                        <DataTable :value="alerts" :rows="5" paginator class="p-datatable-sm" empty-message="No active alerts">
                            <Column field="entity" header="ENTITY">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <Avatar :label="slotProps.data.entityInitials" shape="circle" size="normal" class="bg-surface-200 dark:bg-surface-700 text-700 dark:text-200" />
                                        <div class="flex flex-column">
                                            <span class="font-bold text-sm text-900 dark:text-white">{{ slotProps.data.entityName }}</span>
                                        </div>
                                    </div>
                                </template>
                            </Column>
                            <Column field="title" header="ISSUE">
                                <template #body="slotProps">
                                    <div class="flex flex-column gap-1">
                                        <Tag :value="slotProps.data.title" :severity="slotProps.data.type" class="w-fit" />
                                        <span class="text-xs text-700 dark:text-300">{{ slotProps.data.message }}</span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="time" header="TIME">
                                <template #body="slotProps">
                                    <span class="text-sm font-bold" :class="{'text-red-500': slotProps.data.type === 'danger', 'text-orange-500': slotProps.data.type === 'warning'}">{{ slotProps.data.time }}</span>
                                </template>
                            </Column>
                            <Column header="Action" style="width: 10%">
                                <template #body="slotProps">
                                    <Button :label="slotProps.data.actionLabel" size="small" :severity="slotProps.data.type === 'danger' ? 'danger' : 'warning'" text @click="router.push(slotProps.data.link)" />
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </Card>
</template>
