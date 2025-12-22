<script setup lang="ts">
import MetricCard from '@/components/common/MetricCard.vue';
import MaturityNexus from '@/components/MaturityNexus.vue';
import EvidenceStream from '@/components/MaturityEvidenceStream.vue';
import type { KPI, MaturityScore, TimelineEvent, Milestone } from '@/types/maturity';

// STRICT CONTRACT: Pure Presentation Component
// It receives data from the parent view (which gets it from Pinia)
defineProps<{
  kpis: KPI[];
  maturityScores: MaturityScore[];
  milestones: Record<string, Milestone[]>;
  timelineEvents: TimelineEvent[];
}>();
</script>

<template>
  <div class="grid grid-cols-12 gap-6 animate-fadein">
    <div class="col-span-12 xl:col-span-8 flex flex-col gap-6">
      <MaturityNexus :scores="maturityScores" :milestones="milestones" class="h-full" />

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard v-for="kpi in kpis" :key="kpi.id" :data="kpi" />
      </div>
    </div>

    <div class="col-span-12 xl:col-span-4">
      <div class="sticky top-4">
        <EvidenceStream :events="timelineEvents" class="min-h-[600px] max-h-[calc(100vh-300px)]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadein {
  animation: fadein 0.4s ease-out forwards;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
