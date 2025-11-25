import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import GoalForm from '@/components/monitoring-evaluation/GoalForm.vue';
import { IndicatorTypeEnum } from '@/schemas/monitoring-evaluation/Indicator';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Mock i18n
const t = (key: string) => key;

describe('GoalForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in create mode', () => {
    const wrapper = mount(GoalForm, {
      props: {
        isEdit: false,
        initialValues: {},
        businessId: 'bus-1',
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

    expect(wrapper.find('h1').text()).toBe('goalForm.new');
    expect(wrapper.find('button[type="submit"]').text()).toBe('common.submit');
  });

  it('renders correctly in edit mode', () => {
    const initialValues = {
      id: 'ind-1',
      type: IndicatorTypeEnum.enum.Economic,
      name: 'Test Goal',
      baselineValue: 100,
      baselineDate: new Date(),
      targetValue: 200,
      targetDate: new Date(),
    };

    const wrapper = mount(GoalForm, {
      props: {
        isEdit: true,
        initialValues,
        businessId: 'bus-1',
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

    expect(wrapper.find('h1').text()).toBe('goalForm.edit');
    expect(wrapper.find('button[type="submit"]').text()).toBe('common.update');
  });
});
