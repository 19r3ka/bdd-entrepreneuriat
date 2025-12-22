<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'primevue/chart';
import { MaturityDimensions } from '@/constants/maturityCatalog';
import type { TooltipItem } from 'chart.js';

const props = defineProps<{
  averages: Record<string, number>;
}>();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  const primaryColor = documentStyle.getPropertyValue('--p-primary-500');
  const primaryColorTransparent = primaryColor + '33';

  chartData.value = {
    labels: MaturityDimensions.map(d => {
      if (d === 'Digital') return 'D';
      if (d === 'Finance') return 'Fin.';
      if (d === 'Market') return 'M';
      if (d === 'Green') return 'G';
      if (d === 'Formalization') return 'Form.';
      return d;
    }),
    datasets: [
      {
        label: 'Portfolio Average',
        borderColor: primaryColor,
        backgroundColor: primaryColorTransparent,
        pointBackgroundColor: primaryColor,
        pointBorderColor: textColor,
        pointHoverBackgroundColor: textColor,
        pointHoverBorderColor: primaryColor,
        data: MaturityDimensions.map(d => props.averages[d] || 0),
      },
    ],
  };

  chartOptions.value = {
    plugins: {
      legend: { display: false },
      tooltip: {
        titleColor: textColor,
        bodyColor: textColorSecondary,
        callbacks: {
          title: (context: TooltipItem<'radar'>[]) => {
            const index = context[0]?.dataIndex;
            return index !== undefined ? MaturityDimensions[index] : '';
          },
          label: (context: TooltipItem<'radar'>) => `Avg: ${context.raw}`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 4, // Levels are 1-4 usually, or 0-4
        ticks: {
          stepSize: 1,
          display: false, // Hide unneeded labels
        },
        grid: {
          color: surfaceBorder,
          circular: true,
        },
        angleLines: {
          color: surfaceBorder,
        },
        pointLabels: {
          font: { size: 11 },
          color: textColorSecondary,
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };
};

onMounted(() => {
  setChartData();
});

watch(() => props.averages, setChartData, { deep: true });
</script>

<template>
  <div class="w-full h-full min-h-[300px] flex items-center justify-center">
    <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full h-full" />
  </div>
</template>
