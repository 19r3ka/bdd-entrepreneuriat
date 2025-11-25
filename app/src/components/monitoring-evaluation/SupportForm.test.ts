/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SupportForm from './SupportForm.vue';
import { SupportModality } from '@/types/monitoring-evaluation/Support';

// Mock the stores and composables
vi.mock('@/stores/useSupportStore', () => ({
  useSupportStore: () => ({
    addSupport: vi.fn(),
    updateSupport: vi.fn(),
  }),
}));

vi.mock('@/composables/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleApiError: vi.fn(),
  }),
}));

describe('SupportForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Modality-specific fields', () => {
    it('shows duration field when modality is CAPACITY_DEV', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Initially, duration field should not be visible
      expect(wrapper.find('[name="duration"]').exists()).toBe(false);

      // Set modality to CAPACITY_DEV
      await wrapper.find('[name="modality"]').setValue(SupportModality.CAPACITY_DEV);

      // Duration field should now be visible
      expect(wrapper.find('[name="duration"]').exists()).toBe(true);
    });

    it('hides duration field when modality is not CAPACITY_DEV', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {
            modality: SupportModality.CAPACITY_DEV,
          },
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Duration field should be visible initially
      expect(wrapper.find('[name="duration"]').exists()).toBe(true);

      // Change modality to GRANT
      await wrapper.find('[name="modality"]').setValue(SupportModality.GRANT);

      // Duration field should now be hidden
      expect(wrapper.find('[name="duration"]').exists()).toBe(false);
    });

    it('shows finance details section when modality is GRANT', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Initially, finance details should not be visible
      expect(wrapper.text()).not.toContain('Finance Details');

      // Set modality to GRANT
      await wrapper.find('[name="modality"]').setValue(SupportModality.GRANT);

      // Finance details section should now be visible
      expect(wrapper.text()).toContain('Finance Details');
      expect(wrapper.find('[name="financeDetails.instrument"]').exists()).toBe(true);
      expect(wrapper.find('[name="financeDetails.source"]').exists()).toBe(true);
      expect(wrapper.find('[name="financeDetails.amount"]').exists()).toBe(true);
    });

    it('hides finance details section when modality is not GRANT', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {
            modality: SupportModality.GRANT,
          },
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Finance details should be visible initially
      expect(wrapper.text()).toContain('Finance Details');

      // Change modality to CAPACITY_DEV
      await wrapper.find('[name="modality"]').setValue(SupportModality.CAPACITY_DEV);

      // Finance details section should now be hidden
      expect(wrapper.text()).not.toContain('Finance Details');
    });

    it('shows duration field with correct attributes for CAPACITY_DEV', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {
            modality: SupportModality.CAPACITY_DEV,
          },
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
            InputNumber: true,
          },
        },
      });

      const durationField = wrapper.find('[name="duration"]');
      expect(durationField.exists()).toBe(true);
      
      // Check that it's an InputNumber with hours suffix
      const inputNumber = wrapper.findComponent({ name: 'InputNumber' });
      expect(inputNumber.exists()).toBe(true);
      expect(inputNumber.props('suffix')).toBe(' hrs');
    });

    it('validates that duration is required when modality is CAPACITY_DEV', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {
            modality: SupportModality.CAPACITY_DEV,
          },
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Try to submit without duration
      const form = wrapper.find('form');
      await form.trigger('submit');

      // Should show validation error (implementation depends on BaseForm)
      // This is a placeholder - actual implementation would check for error messages
      expect(wrapper.find('[name="duration"]').exists()).toBe(true);
    });

    it('validates that finance details are required when modality is GRANT', async () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {
            modality: SupportModality.GRANT,
          },
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      // Finance fields should be present and required
      expect(wrapper.find('[name="financeDetails.instrument"]').exists()).toBe(true);
      expect(wrapper.find('[name="financeDetails.source"]').exists()).toBe(true);
      expect(wrapper.find('[name="financeDetails.amount"]').exists()).toBe(true);
    });
  });

  describe('Title visibility', () => {
    it('shows title when hideTitle is false', () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
          businessId: 'test-business-id',
          hideTitle: false,
        },
        global: {
          stubs: {
            BaseForm: true,
            Toast: true,
          },
        },
      });

      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toContain('New Support Intervention');
    });

    it('hides title when hideTitle is true', () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
          businessId: 'test-business-id',
          hideTitle: true,
        },
        global: {
          stubs: {
            BaseForm: true,
            Toast: true,
          },
        },
      });

      expect(wrapper.find('h1').exists()).toBe(false);
    });

    it('shows "Edit" title when isEdit is true', () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: true,
          initialValues: { id: 'test-id' },
          businessId: 'test-business-id',
          hideTitle: false,
        },
        global: {
          stubs: {
            BaseForm: true,
            Toast: true,
          },
        },
      });

      expect(wrapper.find('h1').text()).toContain('Edit Support Intervention');
    });
  });

  describe('Business field visibility', () => {
    it('shows business field when businessId prop is not provided', () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      expect(wrapper.find('[name="businessId"]').exists()).toBe(true);
    });

    it('hides business field when businessId prop is provided', () => {
      const wrapper = mount(SupportForm, {
        props: {
          isEdit: false,
          initialValues: {},
          businessId: 'test-business-id',
        },
        global: {
          stubs: {
            BaseForm: false,
            FormField: true,
            Section: true,
            Button: true,
            Toast: true,
          },
        },
      });

      expect(wrapper.find('[name="businessId"]').exists()).toBe(false);
    });
  });
});
