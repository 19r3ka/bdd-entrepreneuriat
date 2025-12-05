import { mount, type MountingOptions } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { vi } from 'vitest';
import type { Component } from 'vue';

// Create a default i18n instance for testing
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        logoAlt: 'Logo',
        appName: 'Entrepreneur App',
        dashboard: 'Dashboard',
        reports: 'Reports',
      },
      pages: {
        entrepreneurs: {
          title: 'Entrepreneurs',
        },
        businesses: {
          title: 'Businesses',
        },
      },
    },
  },
});

/**
 * Mounts a component with common plugins and mocks
 */
export function mountWithGlobalComponents<T extends Component>(
  component: T,
  options?: MountingOptions<InstanceType<T> extends Component ? InstanceType<T>['_props'] : Record<string, unknown>>
) {
  return mount(component, {
    ...options,
    global: {
      plugins: [i18n],
      components: {
        // PrimeVue components that might be used across components
        Button: {
          template: '<button><slot /></button>',
          props: ['icon', 'class', 'label'],
        },
        Avatar: {
          template: '<div><slot /></div>',
          props: ['icon', 'size', 'shape', 'image', 'label'],
        },
        InputText: {
          template: '<input type="text" :value="$props.modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        InputTextarea: {
          template: '<textarea :value="$props.modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        InputNumber: {
          template: '<input type="number" :value="$props.modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        Select: {
          template: '<select><slot /></select>',
          props: ['modelValue', 'options', 'optionLabel', 'optionValue'],
          emits: ['update:modelValue'],
        },
        Calendar: {
          template: '<input type="text" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        DataTable: {
          template: '<div><slot /></div>',
          props: ['value', 'dataKey'],
        },
        Column: {
          template: '<div><slot /></div>',
          props: ['field', 'header'],
        },
        Card: {
          template: '<div class="card"><slot /></div>',
        },
        Toolbar: {
          template: '<div class="toolbar"><slot /></div>',
        },
        Dialog: {
          template: '<div v-if="visible"><slot /></div>',
          props: ['visible'],
        },
        ConfirmDialog: {
          template: '<div></div>',
        },
        Toast: {
          template: '<div></div>',
        },
      },
      directives: {
        // Mock PrimeVue directives
        ripple: {
          mounted: () => {},
          updated: () => {},
          unmounted: () => {},
        },
        styleclass: {
          mounted: () => {},
          updated: () => {},
          unmounted: () => {},
        },
      },
      ...options?.global,
    },
  });
}

// Mock functions for common services
export const mockConfirm = {
  require: vi.fn(),
  close: vi.fn(),
};

export const mockToast = {
  add: vi.fn(),
};

// Mock PrimeVue confirm and toast services
/**
 *
 */
export function setupPrimeVueMocks() {
  // Mock PrimeVue confirm service
  vi.mock('primevue/confirm', () => ({
    useConfirm: () => mockConfirm,
  }));

  // Mock PrimeVue toast service
  vi.mock('primevue/toast', () => ({
    useToast: () => mockToast,
  }));
}