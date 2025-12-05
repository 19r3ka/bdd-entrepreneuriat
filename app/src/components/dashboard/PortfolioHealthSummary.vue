<script setup lang="ts">
  import { toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { Business } from '@/types/business'
  import type { MomentumMetric } from '@/types/monitoring-evaluation/MomentumMetric'
  import type { QuickWin } from '@/types/monitoring-evaluation/QuickWin'
  import { usePortfolioHealth } from '@/composables/usePortfolioHealth'
  import MetricCard from '@/components/shared/MetricCard.vue'

  const { n } = useI18n()

  const props = defineProps<{
    businesses: Business[]
    metrics: MomentumMetric[]
    quickWins: QuickWin[]
  }>()

  const {
    selectedJobsDisagg,
    totalBusinesses,
    activeBusinesses,
    inactiveBusinesses,
    profileCompleteness,
    needsAttentionCount,
    displayedJobsValue,
    financeUnlocked,
    avgMaturityScore
  } = usePortfolioHealth(
    toRef(props, 'businesses'),
    toRef(props, 'metrics'),
    toRef(props, 'quickWins')
  )
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
    <!-- Total Businesses -->
    <MetricCard title="TOTAL BUSINESSES" icon="pi pi-building">
      <template #value>
        <p class="text-900 dark:text-0 text-4xl font-bold m-0">{{ totalBusinesses }}</p>
      </template>
      <template #subtext>
        <p class="text-500 dark:text-400 text-sm m-0">
          {{ activeBusinesses }} Active / {{ inactiveBusinesses }} Inactive
        </p>
      </template>
    </MetricCard>

    <!-- Profile Completeness -->
    <MetricCard title="PROFILE COMPLETENESS" icon="pi pi-check-circle" icon-class="text-orange-500">
      <template #value>
        <p class="text-900 dark:text-0 text-4xl font-bold m-0">{{ profileCompleteness }}%</p>
      </template>
      <template #subtext>
        <a href="#" class="text-orange-500 font-semibold text-sm hover:underline no-underline"
          >{{ needsAttentionCount }} Needs Attention</a
        >
      </template>
    </MetricCard>

    <!-- Total Jobs Supported -->
    <MetricCard title="TOTAL JOBS SUPPORTED" icon="pi pi-briefcase" icon-class="text-green-500">
      <template #value>
        <p class="text-900 dark:text-0 text-4xl font-bold m-0">{{ displayedJobsValue }}</p>
      </template>
      <template #subtext>
        <div class="text-xs text-500 dark:text-400">
          <button
            @click="selectedJobsDisagg = 'total'"
            :class="
              selectedJobsDisagg === 'total'
                ? 'font-bold text-700 dark:text-200'
                : 'text-500 dark:text-400 hover:text-700'
            "
            class="bg-transparent border-none cursor-pointer p-0"
          >
            All
          </button>
          <span> / </span>
          <button
            @click="selectedJobsDisagg = 'women'"
            :class="
              selectedJobsDisagg === 'women'
                ? 'font-bold text-700 dark:text-200'
                : 'text-500 dark:text-400 hover:text-700'
            "
            class="bg-transparent border-none cursor-pointer p-0"
          >
            Women
          </button>
          <span> / </span>
          <button
            @click="selectedJobsDisagg = 'youth'"
            :class="
              selectedJobsDisagg === 'youth'
                ? 'font-bold text-700 dark:text-200'
                : 'text-500 dark:text-400 hover:text-700'
            "
            class="bg-transparent border-none cursor-pointer p-0"
          >
            Youth
          </button>
          <span> / </span>
          <button
            @click="selectedJobsDisagg = 'disability'"
            :class="
              selectedJobsDisagg === 'disability'
                ? 'font-bold text-700 dark:text-200'
                : 'text-500 dark:text-400 hover:text-700'
            "
            class="bg-transparent border-none cursor-pointer p-0"
          >
            Dis.
          </button>
        </div>
      </template>
    </MetricCard>

    <!-- Finance Unlocked -->
    <MetricCard :title="$t('dashboard.financeUnlockedTitle')" icon="pi pi-wallet">
      <template #value>
        <p class="text-900 dark:text-0 text-4xl font-bold m-0">
          ${{ n(financeUnlocked, 'currency') }}
        </p>
      </template>
      <template #subtext>
        <p class="text-500 dark:text-400 text-xs m-0">{{ $t('dashboard.pastYear') }}</p>
      </template>
    </MetricCard>

    <!-- Avg Maturity Score -->
    <MetricCard title="AVG. MATURITY SCORE" icon="pi pi-chart-line" icon-class="text-blue-500">
      <template #value>
        <p class="text-900 dark:text-0 text-4xl font-bold m-0">{{ avgMaturityScore }}/5</p>
      </template>
      <template #subtext>
        <p class="text-500 dark:text-400 text-sm m-0">Across all businesses</p>
      </template>
    </MetricCard>
  </div>
</template>
