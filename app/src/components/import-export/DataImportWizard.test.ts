import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DataImportWizard from './DataImportWizard.vue';
import { createTestingPinia } from '@pinia/testing';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Mock dependencies
const mockImportResult = {
  valid: [{ name: 'Valid Biz', owner: 'Owner' }],
  conflicts: [],
  partial: [],
  rejected: [],
};

vi.mock('@/composables/useImportExport', () => ({
  useImportExport: () => ({
    importFromFile: vi.fn().mockResolvedValue(mockImportResult),
    importing: false,
    error: null,
  }),
}));

describe('DataImportWizard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   *
   */
  function mountComponent() {
    return mount(DataImportWizard, {
      props: {
        visible: true,
      },
      global: {
        plugins: [
          PrimeVue,
          ToastService,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {},
            stubActions: false,
          }),
        ],
        stubs: {
          Dialog: { template: '<div><slot /><slot name="footer" /></div>' }, // Stub Dialog to render content
          FileUpload: true, // Stub complex UI components
          ProgressBar: true,
          DataTable: { template: '<div><slot /></div>' },
          Column: true,
          Message: { template: '<div><slot /></div>' },
          Stepper: { template: '<div><slot /></div>' },
          StepList: { template: '<div><slot /></div>' },
          StepPanels: { template: '<div><slot /></div>' },
          Step: { template: '<div><slot /></div>' },
          StepPanel: { template: '<div><slot /></div>' },
        },
        provide: {
          // Mock PrimeVue services if needed, ToastService covers most
        },
      },
    });
  }

  it('renders upload state initially', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Upload Your CSV File');
    expect(wrapper.findComponent({ name: 'FileUpload' }).exists()).toBe(true);
  });

  it('transitions to review state after file selection', async () => {
    const wrapper = mountComponent();
    const fileUpload = wrapper.findComponent({ name: 'FileUpload' });

    fileUpload.vm.$emit('select', { files: [new File([''], 'test.csv')] });

    await flushPromises();

    // Check for Preview UI
    expect(wrapper.text()).toContain('Valid Records');
    expect(wrapper.text()).toContain('1'); // Success count from mockImportResult
    expect(wrapper.findComponent({ name: 'DataTable' }).exists()).toBe(true);
  });
});
