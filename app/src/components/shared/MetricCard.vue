<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
    title: string;
    icon: string;
    iconClass?: string;
}>();
</script>

<template>
    <Card class="h-full border-1 border-surface-200 dark:border-surface-700 shadow-sm min-w-0">
        <template #header>
            <div class="flex justify-content-between align-items-start px-4 pt-4 pb-2 gap-3">
                <div class="flex-1 min-w-0">
                    <p class="text-600 dark:text-400 text-xs font-semibold uppercase tracking-wider m-0 line-height-3">{{ title }}</p>
                    <div v-if="$slots.tag" class="mt-1">
                        <slot name="tag">
                            <!-- Optional tag/badge (e.g., IRRF code) -->
                        </slot>
                    </div>
                </div>
                <i :class="['text-xl flex-shrink-0', icon, iconClass || 'text-400']"></i>
            </div>
        </template>
        <template #content>
            <div class="px-4 py-2">
                <slot name="value">
                    <!-- Main metric value goes here -->
                </slot>
                
                <!-- Optional chart slot (e.g., sparkline) -->
                <div v-if="$slots.chart" class="mt-2">
                    <slot name="chart"></slot>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="px-4 pb-4 pt-0">
                <div class="flex justify-content-between align-items-center gap-2">
                    <slot name="subtext">
                        <!-- Subtext/description goes here -->
                    </slot>
                    <slot name="trend">
                        <!-- Optional trend indicator -->
                    </slot>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
/* Ensure proper spacing and remove default Card padding */
:deep(.p-card-header) {
    padding: 0;
}
:deep(.p-card-body) {
    padding: 0;
}
:deep(.p-card-content) {
    padding: 0;
}
:deep(.p-card-footer) {
    padding: 0;
    border-top: none;
}
</style>
