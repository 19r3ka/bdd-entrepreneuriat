import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MeasurementForm from '@/components/monitoring-evaluation/MeasurementForm.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Mock i18n
const t = (key: string) => key;

describe('MeasurementForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in create mode', () => {
    const wrapper = mount(MeasurementForm, {
      props: {
        isEdit: false,
        initialValues: {},
        indicatorId: 'ind-1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          PrimeVue,
          ToastService,
        ],
        mocks: {
          $t: t,
        },
      },
    });

    expect(wrapper.find('h1').text()).toBe('measurementForm.new');
    expect(wrapper.find('button[type="submit"]').text()).toBe('common.submit');
  });

  it('renders correctly in edit mode', () => {
    const initialValues = {
      id: 'meas-1',
      indicatorId: 'ind-1',
      currentValue: 150,
      dateRecorded: new Date(),
      evidenceSource: 'file-1',
      contributionNarrative: 'Narrative',
    };

    const wrapper = mount(MeasurementForm, {
      props: {
        isEdit: true,
        initialValues,
        indicatorId: 'ind-1',
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
          PrimeVue,
          ToastService,
        ],
        mocks: {
          $t: t,
        },
      },
    });

    expect(wrapper.find('h1').text()).toBe('measurementForm.edit');
    expect(wrapper.find('button[type="submit"]').text()).toBe('common.update');
  });
});
