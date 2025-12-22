<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Timeline from 'primevue/timeline';
import Tag from 'primevue/tag';

const { d } = useI18n();

interface Activity {
  type: 'quick_win' | 'metric' | 'support';
  date: Date;
  title: string;
  description: string;
  id: string;
  tags?: string[];
}

const props = defineProps<{
  activities: Activity[];
}>();

const timelineItems = computed(() => {
  return props.activities.map(a => {
    let colorBase = 'purple';
    let icon = 'pi pi-gift';

    if (a.type === 'quick_win') {
      colorBase = 'green';
      icon = 'pi pi-check-circle';
    } else if (a.type === 'metric') {
      colorBase = 'blue';
      icon = 'pi pi-chart-bar';
    }

    return {
      ...a,
      icon,
      color: `bg-${colorBase}-500`,
      borderClass: `border-${colorBase}-200`,
      dateStr: d(a.date, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
    };
  });
});

const items = ref([
  { label: 'All Activity', value: 'all' },
  { label: 'Supports', value: 'support' },
  { label: 'Quick Wins', value: 'quick_win' },
  { label: 'Measurements', value: 'metric' },
]);
</script>

<template>
  <div class="evidence-stream surface-card border-1 surface-border border-round pl-2">
    <Tabs value="all">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.value">{{ tab.label }}</Tab>
      </TabList>
      <TabPanels class="p-0">
        <TabPanel v-for="tab in items" :key="tab.value" :value="tab.value" class="p-0">
          <div style="max-height: 320px; overflow-y: auto" class="pt-3 px-0">
            <Timeline
              :value="
                tab.value === 'all'
                  ? timelineItems
                  : timelineItems.filter(i => i.type === tab.value)
              "
              align="left"
              class="custom-timeline"
            >
              <template #marker="slotProps">
                <div :class="['timeline-marker', slotProps.item.color, 'text-white']">
                  <i :class="slotProps.item.icon"></i>
                </div>
              </template>
              <template #content="slotProps">
                <Card
                  :class="['timeline-card mb-2 shadow-none border-1', slotProps.item.borderClass]"
                >
                  <template #content>
                    <div
                      class="pl-2 border-left-3 py-1"
                      :class="`border-${slotProps.item.color.replace('bg-', '')}`"
                    >
                      <div>
                        <p class="text-sm font-semibold text-color m-0">
                          {{ slotProps.item.title }}
                        </p>
                        <p class="text-xs text-color-secondary my-1">
                          {{ slotProps.item.dateStr }}
                        </p>
                      </div>
                      <p
                        class="text-xs text-color-secondary mt-1 mb-1 line-clamp-2"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 2;
                          line-clamp: 2;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                        "
                      >
                        {{ slotProps.item.description }}
                      </p>
                      <div v-if="slotProps.item.tags" class="flex flex-wrap gap-1">
                        <Tag
                          v-for="tag in slotProps.item.tags"
                          :key="tag"
                          :value="tag"
                          severity="secondary"
                          class="text-xs px-2 py-1"
                        />
                      </div>
                    </div>
                  </template>
                </Card>
              </template>
            </Timeline>
            <div
              v-if="
                (tab.value === 'all'
                  ? timelineItems
                  : timelineItems.filter(i => i.type === tab.value)
                ).length === 0
              "
              class="text-center text-500 py-4"
            >
              No activity found.
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.timeline-marker {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 0.75rem;
}

:deep(.p-timeline-event-connector) {
  background-color: var(--surface-300) !important;
}

:deep(.custom-timeline .p-timeline-event-opposite) {
  display: none !important;
}

:deep(.custom-timeline .p-timeline-event-content) {
  padding-left: 0.5rem !important;
}

:deep(.p-tabview-nav) {
  border-bottom: 1px solid var(--surface-border);
}
</style>
