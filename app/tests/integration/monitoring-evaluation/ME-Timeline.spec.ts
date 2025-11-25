/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import METimeline from '@/components/monitoring-evaluation/ME-Timeline.vue';
import PrimeVue from 'primevue/config';
import { useSupportStore } from '@/stores/useSupportStore';
import { useIndicatorStore } from '@/stores/useIndicatorStore';

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const t = (key: string) => key;

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => '123e4567-e89b-12d3-a456-426614174000',
  },
});

describe('ME-Timeline.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const wrapper = mount(METimeline, {
      props: {
        businessId: 'bus-1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          PrimeVue,
        ],
        mocks: {
          $t: t,
        },
      },
    });

    expect(wrapper.find('.pi-spinner').exists()).toBe(true);
  });

  it.skip('renders events when data is present', async () => {
    const wrapper = mount(METimeline, {
      props: {
        businessId: 'bus-1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: true,
          }),
          PrimeVue,
        ],
        mocks: {
          $t: t,
        },
      },
    });
    
    const supportStore = useSupportStore();
    const indicatorStore = useIndicatorStore();

    // Override stubs with mocks that return data
    supportStore.getSupportsByBusinessId = vi.fn().mockResolvedValue([
      { id: 's1', date: new Date(), modality: 'Training', description: 'Desc', genderMarker: 'GEN1' }
    ]);
    indicatorStore.getIndicatorsByBusinessId = vi.fn().mockResolvedValue([]);
    indicatorStore.getMeasurementsByIndicatorId = vi.fn().mockResolvedValue([]);

    // Re-mount to trigger onMounted with mocked stores
    // Note: In a real scenario, we would just wait for the first mount to finish if we mocked it before mount.
    // But here we mocked it after mount (which triggers onMounted immediately).
    // So we unmount and remount.
    
    wrapper.unmount();
    
    // Remount
    const wrapper2 = mount(METimeline, {
      props: {
        businessId: 'bus-1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: true,
          }),
          PrimeVue,
        ],
        mocks: {
          $t: t,
        },
      },
    });

    const supportStore2 = useSupportStore();
    supportStore2.getSupportsByBusinessId = vi.fn().mockResolvedValue([
      { id: 's1', date: new Date('2023-01-01'), modality: 'Training', description: 'Desc', genderMarker: 'GEN1' }
    ]);
    const indicatorStore2 = useIndicatorStore();
    indicatorStore2.getIndicatorsByBusinessId = vi.fn().mockResolvedValue([]);
    indicatorStore2.getMeasurementsByIndicatorId = vi.fn().mockResolvedValue([]);

    await new Promise(resolve => setTimeout(resolve, 10));
    await wrapper2.vm.$nextTick();
    
    expect(wrapper2.find('.customized-timeline').exists()).toBe(true);
  });
});
