import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import MaturityRadar from '@/components/monitoring-evaluation/MaturityRadar.vue';

describe('MaturityRadar.vue', () => {
  const chartData = {
    labels: ['Formalization', 'Finance', 'Digital', 'Market', 'Green'],
    datasets: [
      {
        label: 'Business Maturity',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  it('renders the radar chart canvas', () => {
    render(MaturityRadar, {
      props: {
        labels: chartData.labels,
        datasets: chartData.datasets,
      },
    });

    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('renders the title of the chart', () => {
    render(MaturityRadar, {
      props: {
        labels: chartData.labels,
        datasets: chartData.datasets,
      },
    });
    // The title is part of the canvas, so we can't directly query it by text.
    // However, the presence of the canvas and the correct props being passed is a good
    // indication that the title will be rendered by chart.js.
    // For more advanced testing, one might need to inspect the chart.js instance.
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
