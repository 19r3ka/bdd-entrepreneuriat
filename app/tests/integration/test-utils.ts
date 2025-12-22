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
        dashboard: {
          quickAddEntrepreneur: 'Quick Add Entrepreneur',
        },
        entrepreneurs: {
          title: 'Entrepreneurs',
          new: 'New Entrepreneur',
          edit: 'Edit Entrepreneur',
          add: 'Add Entrepreneur',
          quickAddSuccess: 'Quick add success',
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
  options?: MountingOptions<
    InstanceType<T> extends Component ? InstanceType<T>['_props'] : Record<string, unknown>
  >
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
        }),
      ],
      components: {
        // PrimeVue components that might be used across components
        Button: {
          template: '<button :class="$props.class" v-bind="$attrs"><slot />{{ label }}</button>',
          props: ['icon', 'class', 'label', 'severity', 'outlined', 'text', 'size'],
        },
        Avatar: {
          template:
            '<div class="p-avatar"><slot />{{ label }}<img v-if="image" :src="image" /></div>',
          props: ['icon', 'size', 'shape', 'image', 'label'],
        },
        InputText: {
          template:
            '<input type="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        Textarea: {
          template:
            '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        InputNumber: {
          template:
            '<input type="number" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        Select: {
          template:
            '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs"><slot /></select>',
          props: ['modelValue', 'options', 'optionLabel', 'optionValue'],
          emits: ['update:modelValue'],
        },
        Calendar: {
          template:
            '<input type="date" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" v-bind="$attrs" />',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        DataTable: {
          template:
            '<div class="p-datatable"><slot name="header" /><div v-for="item in value"><slot :data="item" /></div><slot name="footer" /><slot name="empty" v-if="!value || value.length === 0" /></div>',
          props: ['value', 'dataKey', 'filters'],
        },
        Column: {
          template:
            '<div class="p-column"><slot name="header" /><slot name="body" :data="{}" /><slot name="filter" :filterModel="{value: null}" :filterCallback="() => {}" /></div>',
          props: ['field', 'header', 'selectionMode'],
        },
        Card: {
          template:
            '<div class="card"><div class="p-card-title" v-if="$slots.title"><slot name="title" /></div><div class="p-card-content"><slot name="content" /><slot /></div></div>',
        },
        Toolbar: {
          template:
            '<div class="toolbar"><slot name="start" /><slot name="center" /><slot name="end" /></div>',
        },
        Dialog: {
          template:
            '<div v-if="visible" class="p-dialog"><slot name="header" /><slot /><slot name="footer" /></div>',
          props: ['visible'],
        },
        ConfirmDialog: {
          template: '<div class="p-confirm-dialog"></div>',
        },
        Toast: {
          template: '<div class="p-toast"></div>',
        },
        IconField: {
          template: '<div class="p-icon-field"><slot /></div>',
        },
        InputIcon: {
          template: '<i class="p-input-icon"><slot /></i>',
        },
        FileUpload: {
          template: '<div class="p-fileupload"><slot /></div>',
          props: ['mode', 'name', 'chooseLabel', 'customUpload', 'auto'],
        },
        AutoComplete: {
          template: '<div class="p-autocomplete"><input type="text" /><slot /></div>',
          props: ['modelValue', 'suggestions'],
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
