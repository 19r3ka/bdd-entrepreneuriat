<template>
  <div class="card">
    <h2 class="mb-4">{{ $t('meTimeline.title') }}</h2>
    
    <div v-if="loading" class="flex justify-content-center p-4">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else-if="events.length === 0" class="text-center p-4 text-500">
      {{ $t('meTimeline.noEvents') }}
    </div>

    <Timeline v-else :value="events" align="alternate" class="customized-timeline">
      <template #marker="slotProps">
        <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" :class="slotProps.item.color">
          <i :class="slotProps.item.icon"></i>
        </span>
      </template>
      <template #content="slotProps">
        <Card class="mb-3">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span class="text-lg font-bold">{{ slotProps.item.title }}</span>
              <small class="text-500">{{ slotProps.item.date }}</small>
            </div>
          </template>
          <template #subtitle>
            <span class="text-primary">{{ slotProps.item.typeLabel }}</span>
          </template>
          <template #content>
            <p class="m-0">{{ slotProps.item.description }}</p>
            <div v-if="slotProps.item.details" class="mt-2 text-sm text-600">
              {{ slotProps.item.details }}
            </div>
          </template>
        </Card>
      </template>
    </Timeline>
  </div>
</template>

<script setup lang="ts">
/**
 * ME-Timeline Component
 * 
 * Displays a chronological timeline of Support Interventions and Outcome Measurements
 * for a specific business.
 * 
 * @component
 * @example
 * <METimeline :business-id="businessId" />
 */
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Timeline from 'primevue/timeline';
import Card from 'primevue/card';
import { useSupportStore } from '@/stores/useSupportStore';
import { useIndicatorStore } from '@/stores/useIndicatorStore';

const props = defineProps<{
  businessId: string;
}>();

const { t } = useI18n();
const supportStore = useSupportStore();
const indicatorStore = useIndicatorStore();

const loading = ref(true);

interface TimelineEvent {
  id: string;
  date: string;
  rawDate: Date;
  title: string;
  typeLabel: string;
  description: string;
  details?: string;
  icon: string;
  color: string;
}

const events = ref<TimelineEvent[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const supports = await supportStore.getSupportsByBusinessId(props.businessId);
    const indicators = await indicatorStore.getIndicatorsByBusinessId(props.businessId);
    
    const timelineEvents: TimelineEvent[] = [];

    // Process Supports
    supports.forEach(s => {
      timelineEvents.push({
        id: s.id,
        date: new Date(s.date).toLocaleDateString(),
        rawDate: new Date(s.date),
        title: s.modality, // e.g., Training, Grant
        typeLabel: t('meTimeline.support'),
        description: s.description,
        icon: 'pi pi-gift',
        color: 'bg-blue-500'
      });
    });

    // Process Measurements
    for (const ind of indicators) {
      const measurements = await indicatorStore.getMeasurementsByIndicatorId(ind.id);
      measurements.forEach(m => {
        timelineEvents.push({
          id: m.id,
          date: new Date(m.dateRecorded).toLocaleDateString(),
          rawDate: new Date(m.dateRecorded),
          title: ind.name,
          typeLabel: t('meTimeline.measurement'),
          description: m.contributionNarrative,
          details: `${t('measurementForm.currentValue')}: ${m.currentValue}`,
          icon: 'pi pi-chart-line',
          color: 'bg-green-500'
        });
      });
    }

    // Sort by date descending
    events.value = timelineEvents.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-opposite) {
  flex: 0.2;
}
.customized-timeline :deep(.p-timeline-event-content) {
  flex: 0.8;
}
</style>
