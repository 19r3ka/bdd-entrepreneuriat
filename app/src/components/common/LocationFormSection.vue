<template>
  <Section :title="$t('common.location')" class="mt-4">
    <div class="formgrid grid">
      <FormField
        :name="`${prefix}.street`"
        :label="$t('common.address')"
        v-bind="defineField(`${prefix}.street`)"
        field-class="col-12 md:col-6"
      />
      <FormField
        :name="`${prefix}.city`"
        :label="$t('common.city')"
        v-bind="defineField(`${prefix}.city`)"
        field-class="col-12 md:col-6"
      />
      <FormField
        :name="`${prefix}.state`"
        :label="$t('common.state')"
        v-bind="defineField(`${prefix}.state`)"
        field-class="col-12 md:col-6"
      />
      <FormField
        :name="`${prefix}.postalCode`"
        :label="$t('common.postalCode')"
        v-bind="defineField(`${prefix}.postalCode`)"
        field-class="col-12 md:col-6"
      />
      <FormField
        :name="`${prefix}.country`"
        :label="$t('common.country')"
        v-bind="defineField(`${prefix}.country`)"
        field-class="col-12 md:col-6"
      />
    </div>

    <!-- Interactive Map for Coordinates -->
    <div class="mt-4">
      <p v-if="helpText" class="text-sm text-600 mb-3">{{ helpText }}</p>
      <InteractiveMap
        :locations="getMapLocations(values)"
        :is-editable="isEditable"
        height="350px"
        @update:location="handleLocationUpdate"
        @update:address="handleAddressUpdate"
        @update:structured-address="handleStructuredAddressUpdate"
      />
    </div>
  </Section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';
import InteractiveMap from '@/components/InteractiveMap.vue';
import { useLocationSync } from '@/composables/useLocationSync';
import type { DefineFieldReturn } from '@/composables/useValidationForm';

const props = withDefaults(
  defineProps<{
    prefix: string;
    values: Record<string, unknown>;
    setFieldValue: (field: string, value: unknown) => void;
    defineField: (field: string) => DefineFieldReturn;
    isEditable?: boolean;
    helpText?: string;
  }>(),
  {
    isEditable: true,
    helpText: '',
  }
);

const { t } = useI18n();

// Create a context object that mimics the formRef expected by useLocationSync
const formContext = computed(() => ({
  setFieldValue: props.setFieldValue,
  values: props.values as Record<string, any>, // Still needs any internally due to useLocationSync signature
}));

const {
  handleLocationUpdate,
  handleAddressUpdate,
  handleStructuredAddressUpdate,
  setupAddressWatcher,
} = useLocationSync(formContext, props.prefix);

setupAddressWatcher();

interface LocationGroup {
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
}

const getMapLocations = (values: Record<string, unknown>) => {
  const group = values[props.prefix] as LocationGroup | undefined;
  if (group?.coordinates?.latitude && group?.coordinates?.longitude) {
    return [
      {
        lat: group.coordinates.latitude,
        lng: group.coordinates.longitude,
        name:
          (values.name as string) ||
          (values.firstName ? `${values.firstName} ${values.lastName}` : t('common.location')),
      },
    ];
  }
  return [];
};
</script>
