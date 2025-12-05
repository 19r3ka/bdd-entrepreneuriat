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
        <span
          class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
          :class="slotProps.item.color"
        >
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
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Timeline from 'primevue/timeline'
  import Card from 'primevue/card'
  import { useSupportStore } from '@/stores/useSupportStore'
  import { useIndicatorStore } from '@/stores/useIndicatorStore'
  import type { Support } from '@/types/monitoring-evaluation/Support'
  import type { IndicatorDefinition, Measurement } from '@/types/monitoring-evaluation/Indicator'

  const props = defineProps<{
    businessId: string
  }>()

  const { t, d } = useI18n()
  const supportStore = useSupportStore()
  const indicatorStore = useIndicatorStore()

  const loading = ref(true)

  interface TimelineEvent {
    id: string
    date: string // Formatted date string
    rawDate: Date // For sorting
    title: string // Main title for the event (e.g., support title, indicator name)
    typeLabel: string // Label for the type of event (e.g., "Support", "Measurement")
    description: string // Main description for the event (e.g., support notes, measurement narrative)
    details?: string // Optional additional details (e.g., current value for measurement)
    icon: string
    color: string
  }

  const events = ref<TimelineEvent[]>([])

  onMounted(async () => {
    loading.value = true
    try {
      const supports: Support[] = await supportStore.getSupportsByBusinessId(props.businessId)
      const indicators: IndicatorDefinition[] = await indicatorStore.getIndicatorsByBusinessId(
        props.businessId
      )

      const timelineEvents: TimelineEvent[] = []

      // Process Supports
      supports.forEach((s: Support) => {
        timelineEvents.push({
          id: s.id,
          date: d(new Date(s.startDate), 'long'),
          rawDate: new Date(s.startDate),
          title: t(`supportBoost.boostType.${s.boostType}`), // Translate boostType for title
          typeLabel: t('meTimeline.support'),
          description: s.notes || s.title, // Use notes or title as description
          icon: 'pi pi-gift',
          color: 'bg-blue-500'
        })
      })

      // Process Measurements
      for (const ind of indicators) {
        const measurements: Measurement[] = await indicatorStore.getMeasurementsByIndicatorId(
          ind.id
        )
        measurements.forEach((m: Measurement) => {
          timelineEvents.push({
            id: m.id,
            date: d(new Date(m.dateRecorded), 'long'),
            rawDate: new Date(m.dateRecorded),
            title: ind.name,
            typeLabel: t('meTimeline.measurement'),
            description: m.contributionNarrative || '', // Use narrative or empty string
            details: `${t('measurementForm.currentValue')}: ${m.currentValue}`,
            icon: 'pi pi-chart-line',
            color: 'bg-green-500'
          })
        })
      }

      // Sort by date descending
      events.value = timelineEvents.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
  .customized-timeline :deep(.p-timeline-event-opposite) {
    flex: 0.2;
  }
  .customized-timeline :deep(.p-timeline-event-content) {
    flex: 0.8;
  }
</style>