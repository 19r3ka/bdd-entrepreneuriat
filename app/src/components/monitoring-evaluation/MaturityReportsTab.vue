<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMaturityStore } from '@/stores/useMaturityStore';
import { useMomentumMetricStore } from '@/stores/useMomentumMetricStore';
import { useQuickWinStore } from '@/stores/useQuickWinStore';
import { useSupportStore } from '@/stores/useSupportStore';
import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric';
import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin';
import type { Support } from '@/schemas/monitoring-evaluation/Support';
import { MaturityDimensions } from '@/constants/maturityCatalog';

import MaturityNexus from './MaturityNexus.vue';
import KeyStrategicIndicators from './KeyStrategicIndicators.vue';
import EvidenceStream from './EvidenceStream.vue';

const props = defineProps<{
  businessId: string;
}>();

const maturityStore = useMaturityStore();
const momentumStore = useMomentumMetricStore();
const quickWinStore = useQuickWinStore();
const supportStore = useSupportStore();

const recentMetrics = ref<MomentumMetric[]>([]);
const recentQuickWins = ref<QuickWin[]>([]);
const businessSupports = ref<Support[]>([]);

// Fetch data
onMounted(async () => {
  recentMetrics.value = await momentumStore.getMetricsByBusinessId(props.businessId);
  recentQuickWins.value = await quickWinStore.getQuickWinsByBusinessId(props.businessId);
  businessSupports.value = await supportStore.getSupportsByBusinessId(props.businessId);
});

// Computed props for child components
const maturityLevels = computed(() => maturityStore.getMaturityLevels(recentQuickWins.value));
const nextMilestones = computed(() => maturityStore.getNextMilestones(recentQuickWins.value));

const dimensionStats = computed(() => {
  const stats: Record<string, { hasSupport: boolean; hasOutcome: boolean }> = {};

  MaturityDimensions.forEach(dim => {
    const hasSupport = businessSupports.value.some(s => s.dimension === dim);
    const hasQuickWin = recentQuickWins.value.some(qw => qw.dimension === dim);
    const hasMetric = recentMetrics.value.some(m => m.dimension === dim);

    stats[dim] = {
      hasSupport,
      hasOutcome: hasQuickWin || hasMetric,
    };
  });

  return stats;
});

const activities = computed(() => {
  const all = [
    ...recentQuickWins.value.map(qw => ({
      type: 'quick_win' as const,
      date: new Date(qw.achievedOn),
      title: qw.title,
      description: qw.resultSummary,
      id: qw.id,
      tags: qw.dimension ? [qw.dimension] : [],
    })),
    ...recentMetrics.value.flatMap(
      m =>
        m.indicators?.flatMap(
          i =>
            i.readings?.map(r => ({
              type: 'metric' as const,
              date: new Date(r.asOf),
              title: `${m.title}: ${i.name}`,
              description: `Value: ${r.value} ${i.unit || ''}`,
              id: m.momentumMetricId,
              tags: m.sdgTargets?.map(t => (t.startsWith('SDG') ? t : `SDG ${t}`)),
            })) || []
        ) || []
    ),
  ];
  return all.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Main Content Area -->
    <div class="grid">
      <!-- Top Row: Maturity Nexus + Evidence Stream -->
      <div class="col-8">
        <MaturityNexus
          :levels="maturityLevels"
          :next-milestones="nextMilestones"
          :dimension-stats="dimensionStats"
        />
      </div>
      <div class="col-4">
        <EvidenceStream :activities="activities" />
      </div>

      <!-- Bottom Row: Key Strategic Indicators -->
      <div class="col-12">
        <KeyStrategicIndicators :metrics="recentMetrics" :quick-wins="recentQuickWins" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 0.5rem;
  width: 100%;
}
</style>
