import { mount, type MountingOptions } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { vi } from 'vitest';
import type { Component } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { createTestingPinia } from '@pinia/testing';

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
        generalInformation: 'General Information',
        location: 'Location',
        businessInformation: 'Business Information',
        contactInformation: 'Contact Information',
        onlinePresenceAndSocialMedia: 'Online Presence and Social Media',
        required: 'Required',
        requiredMarker: '*',
        submit: 'Submit',
        update: 'Update',
        name: 'Name',
        entrepreneurId: 'Entrepreneur ID',
        primaryBusinessArea: 'Primary Business Area',
        secondaryBusinessArea: 'Secondary Business Area',
        logo: 'Logo',
        registrationNumber: 'Registration Number',
        registrationDate: 'Registration Date',
        activityStartDate: 'Activity Start Date',
        supportStartDate: 'Support Start Date',
        email: 'Email',
        telephone: 'Telephone',
        onlinePresence: 'Online Presence',
        personalWebsite: 'Personal Website',
        personalInformation: 'Personal Information',
        socialDigitalPresence: 'Social & Digital Presence',
        firstName: 'First Name',
        lastName: 'Last Name',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth',
        avatar: 'Avatar',
        slug: 'Slug',
        bio: 'Bio',
        socialMedia: {
          linkedin: 'LinkedIn',
          twitter: 'Twitter',
          facebook: 'Facebook',
          instagram: 'Instagram',
        },
      },
      forms: {
        entrepreneur: {
          title: 'Entrepreneur Form',
          locationHelp: 'Location Help',
        },
      },
      pages: {
        entrepreneurs: {
          title: 'Entrepreneurs',
          new: 'New Entrepreneur',
          edit: 'Edit Entrepreneur',
        },
        businesses: {
          title: 'Businesses',
          new: 'New Business',
          edit: 'Edit Business',
        },
      },
      placeholders: {
        search: 'Search',
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
      plugins: [
        i18n, 
        PrimeVue, 
        ToastService, 
        ConfirmationService,
        createTestingPinia({
          createSpy: vi.fn,
        })
      ],
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