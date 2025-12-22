<template>
  <div class="activity-timeline">
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-medium m-0">{{ $t('activity.title', 'Activity History') }}</h3>
      <div class="flex gap-2">
        <Button
          :label="$t('pages.support.add', 'Log Support')"
          icon="pi pi-plus"
          size="small"
          class="p-button-outlined"
          @click="$emit('add-support')"
        />
        <Button
          :label="$t('quickWin.add', 'Add Quick Win')"
          icon="pi pi-check-circle"
          size="small"
          @click="$emit('add-quick-win')"
        />
      </div>
    </div>

    <Tabs value="0">
      <TabList>
        <Tab value="0">{{ $t('activity.all', 'All Activity') }}</Tab>
        <Tab value="1">{{ $t('activity.supports', 'Supports') }}</Tab>
        <Tab value="2">{{ $t('activity.quickWins', 'Quick Wins') }}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <Timeline :value="allActivity" align="alternate" class="customized-timeline">
            <template #marker="slotProps">
              <span
                class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                :style="{ backgroundColor: getItemColor(slotProps.item) }"
              >
                <i :class="getItemIcon(slotProps.item)"></i>
              </span>
            </template>
            <template #content="slotProps">
              <ActivityCard
                :activity="slotProps.item"
                @view="handleView(slotProps.item)"
                @edit="handleEdit(slotProps.item)"
              />
            </template>
          </Timeline>
          <div v-if="allActivity.length === 0" class="text-center p-4 text-500">
            {{ $t('activity.noActivity', 'No activity recorded yet.') }}
          </div>
        </TabPanel>

        <TabPanel value="1">
          <Timeline :value="formattedSupports" align="alternate" class="customized-timeline">
            <template #marker>
              <span
                class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style="background-color: #9c27b0"
              >
                <i class="pi pi-heart"></i>
              </span>
            </template>
            <template #content="slotProps">
              <ActivityCard
                :activity="slotProps.item"
                @view="handleView(slotProps.item)"
                @edit="handleEdit(slotProps.item)"
              />
            </template>
          </Timeline>
          <div v-if="supports.length === 0" class="text-center p-4 text-500">
            {{ $t('activity.noSupports', 'No supports recorded yet.') }}
          </div>
        </TabPanel>

        <TabPanel value="2">
          <Timeline :value="formattedQuickWins" align="alternate" class="customized-timeline">
            <template #marker>
              <span
                class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style="background-color: #00bcd4"
              >
                <i class="pi pi-check-circle"></i>
              </span>
            </template>
            <template #content="slotProps">
              <ActivityCard
                :activity="slotProps.item"
                @view="handleView(slotProps.item)"
                @edit="handleEdit(slotProps.item)"
              />
            </template>
          </Timeline>
          <div v-if="quickWins.length === 0" class="text-center p-4 text-500">
            {{ $t('activity.noQuickWins', 'No quick wins recorded yet.') }}
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Timeline from 'primevue/timeline';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import ActivityCard from './ActivityCard.vue';
import type { Support } from '@/types/monitoring-evaluation/Support';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';

const props = defineProps<{
  supports: Support[];
  quickWins: QuickWin[];
}>();

const emit = defineEmits<{
  (e: 'add-support'): void;
  (e: 'add-quick-win'): void;
  (e: 'view-support', id: string): void;
  (e: 'view-quick-win', id: string): void;
  (e: 'edit-support', id: string): void;
  (e: 'edit-quick-win', id: string): void;
}>();

type ActivityItem = { type: 'support'; data: Support } | { type: 'quickWin'; data: QuickWin };

const formattedSupports = computed<ActivityItem[]>(() => {
  return [...props.supports]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .map(s => ({ type: 'support' as const, data: s, date: s.startDate }));
});

const formattedQuickWins = computed<ActivityItem[]>(() => {
  return [...props.quickWins]
    .sort((a, b) => new Date(b.achievedOn).getTime() - new Date(a.achievedOn).getTime())
    .map(q => ({ type: 'quickWin' as const, data: q, date: q.achievedOn }));
});

const allActivity = computed<ActivityItem[]>(() => {
  const supports = props.supports.map(s => ({
    type: 'support' as const,
    data: s,
    date: s.startDate,
  }));
  const quickWins = props.quickWins.map(q => ({
    type: 'quickWin' as const,
    data: q,
    date: q.achievedOn,
  }));

  return [...supports, ...quickWins].sort(
    // Sort by date property added in map above, casting for now to avoid type error
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

/**
 *
 */
function getItemColor(item: ActivityItem) {
  if (item.type === 'quickWin') return '#00BCD4'; // Cyan
  // Support colors based on type
  const type = item.data.boostType;
  if (type.includes('financial')) return '#9C27B0';
  if (type.includes('training') || type.includes('mentoring')) return '#673AB7';
  if (type.includes('equipment') || type.includes('workspace')) return '#FF9800';
  return '#607D8B';
}

/**
 *
 */
function getItemIcon(item: ActivityItem) {
  if (item.type === 'quickWin') return 'pi pi-check-circle';
  // Support icons
  const type = item.data.boostType;
  if (type.includes('financial')) return 'pi pi-dollar';
  if (type.includes('training')) return 'pi pi-book';
  if (type.includes('mentoring')) return 'pi pi-users';
  if (type.includes('equipment')) return 'pi pi-box';
  if (type.includes('digital')) return 'pi pi-desktop';
  return 'pi pi-heart';
}

/**
 *
 */
function handleView(item: ActivityItem) {
  if (item.type === 'support') {
    emit('view-support', item.data.id);
  } else {
    emit('view-quick-win', item.data.id);
  }
}

/**
 *
 */
function handleEdit(item: ActivityItem) {
  if (item.type === 'support') {
    emit('edit-support', item.data.id);
  } else {
    emit('edit-quick-win', item.data.id);
  }
}
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-opposite) {
  flex: 0;
  padding: 0;
}
.customized-timeline :deep(.p-timeline-event-content) {
  width: 100%;
}
</style>
