<script setup lang="ts">
  import { ref } from 'vue'
  import PortfolioHeader from '@/components/common/PortfolioViewHeader.vue'
  import MetricCard from '@/components/common/MetricCard.vue'
  import RecentActivityWidget from '@/components/common/RecentActivityWidget.vue'
  import SectorBreakdownWidget from '@/components/common/PerformanceBusinessAreaBreakdownWidget.vue'
  import type { PortfolioMetric, RecentActivity, SectorData } from '@/types/portfolio'

  // --- Mock Data (Replace with Pinia Stores) ---

  const metrics = ref<PortfolioMetric[]>([
    {
      id: '1',
      label: 'Total Entrepreneurs',
      value: 142,
      subtext: '128 Active Businesses',
      icon: 'groups',
      iconColorClass: 'text-primary'
    },
    {
      id: '2',
      label: 'Profile Completeness',
      value: '88%',
      subtext: '14 Needs Attention',
      icon: 'error',
      iconColorClass: 'text-orange-500'
    },
    {
      id: '3',
      label: 'Total Jobs Supported',
      value: 340,
      subtext: '45% Women / 30% Youth',
      icon: 'work',
      iconColorClass: 'text-green-500'
    },
    {
      id: '4',
      label: 'Finance Unlocked',
      value: '$45,000',
      subtext: 'Across 22 Grants/Loans',
      icon: 'account_balance_wallet',
      iconColorClass: 'text-primary'
    }
  ])

  const activities = ref<RecentActivity[]>([
    {
      id: '1',
      name: 'Ama Koffi',
      type: 'Entrepreneur',
      date: 'Added 2 days ago',
      status: 'VERIFIED',
      statusLabel: 'Verified',
      avatarUrl: '/avatars/ama.jpg'
    },
    {
      id: '2',
      name: 'Bio Moussa',
      type: 'Agri-Business',
      date: 'Updated 5 days ago',
      status: 'MISSING_INFO',
      statusLabel: 'Missing Tax ID',
      avatarUrl: '/avatars/bio.jpg'
    },
    {
      id: '3',
      name: 'Chantal Akou',
      type: 'Tech Startup',
      date: 'Added 1 week ago',
      status: 'VERIFIED',
      statusLabel: 'Verified',
      avatarUrl: '/avatars/chantal.jpg'
    }
  ])

  const sectors = ref<SectorData[]>([
    { label: 'Agri-Business', value: 45, color: '#3c8939' },
    { label: 'Tech', value: 25, color: '#187db3' },
    { label: 'Services', value: 15, color: '#f36d24' },
    { label: 'Retail', value: 10, color: '#f99e23' },
    { label: 'Other', value: 5, color: '#cccccc' }
  ])

  const incompleteCount = 14 // Derived from store in real app

  // --- Handlers ---
  const handleExport = () => console.log('Exporting...')
  const handleAdd = () => console.log('Open Add Dialog')
</script>

<template>
  <div
    class="flex flex-column min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-6 lg:p-8"
  >
    <div class="max-w-7xl w-full mx-auto flex-grow-1 flex flex-column">
      <PortfolioHeader
        region-name="Maritime, Togo"
        @export="handleExport"
        @add-entrepreneur="handleAdd"
      />

      <div class="grid mb-6">
        <div v-for="metric in metrics" :key="metric.id" class="col-12 sm:col-6 lg:col-3">
          <MetricCard :data="metric" />
        </div>
      </div>

      <div
        class="mb-6 border-round-xl overflow-hidden shadow-1 border-1 border-200 dark:border-700 bg-white"
      >
        <div class="p-4 border-bottom-1 border-200 dark:border-700">
          <h2 class="text-lg font-bold m-0">Regional Distribution</h2>
        </div>
        <div class="h-20rem w-full relative">
          <div class="absolute inset-0 bg-gray-100 flex align-items-center justify-content-center">
            <span class="text-gray-500">Leaflet Map Component would render here</span>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <RecentActivityWidget :activities="activities" :incomplete-count="incompleteCount" />
        </div>

        <div class="col-12 lg:col-4">
          <SectorBreakdownWidget :sectors="sectors" />
        </div>
      </div>
    </div>
  </div>
</template>
