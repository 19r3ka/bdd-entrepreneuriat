<template>
  <div class="surface-card p-4 border-round-lg border-1 border-200 relative mb-3">
    <Button
      icon="pi pi-trash"
      text
      rounded
      severity="danger"
      class="absolute top-0 right-0 m-2"
      @click="$emit('remove')"
    />

    <div class="grid formgrid p-fluid">
      <!-- Header / Name -->
      <div class="col-12 mb-2">
        <label class="font-medium text-sm mb-2 block">{{
          $t('momentumMetric.indicatorName', 'Name')
        }}</label>
        <InputText
          :model-value="indicator.name"
          class="w-full font-semibold"
          placeholder="Indicator Name"
          @update:model-value="val => updateField('name', val)"
        />
      </div>

      <!-- Configuration Row -->
      <div class="col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{
          $t('momentumMetric.unit', 'Unit')
        }}</label>
        <Select
          :model-value="indicator.unit"
          :options="unitOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="val => updateField('unit', val)"
        />
      </div>

      <div class="col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{
          $t('momentumMetric.baseline', 'Baseline')
        }}</label>
        <InputNumber
          :model-value="indicator.baseline"
          class="w-full"
          input-class="w-full"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          @update:model-value="val => updateField('baseline', val)"
        />
      </div>

      <div class="col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{
          $t('momentumMetric.target', 'Target')
        }}</label>
        <InputNumber
          :model-value="indicator.target"
          class="w-full"
          input-class="w-full"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          @update:model-value="val => updateField('target', val)"
        />
      </div>

      <!-- Readings Section -->
      <div class="col-12 mt-3">
        <label class="font-bold text-sm mb-2 block text-700">{{
          $t('momentumMetric.readings', 'Progress Readings')
        }}</label>

        <div
          v-if="!indicator.readings || indicator.readings.length === 0"
          class="text-sm text-500 mb-2 font-italic"
        >
          No readings recorded yet.
        </div>

        <div
          v-for="(reading, rIndex) in indicator.readings"
          :key="rIndex"
          class="flex gap-2 align-items-center mb-2 p-2 surface-ground border-round"
        >
          <div v-if="indicator.unit === 'boolean'" class="flex-grow-1">
            <Select
              :model-value="reading.value"
              :options="[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]"
              option-label="label"
              option-value="value"
              class="w-full"
              placeholder="Select"
              @update:model-value="val => updateReading(rIndex, 'value', val)"
            />
          </div>
          <div v-else class="flex-grow-1">
            <InputNumber
              :model-value="reading.value as number"
              placeholder="Value"
              class="w-full"
              input-class="w-full"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              @update:model-value="val => updateReading(rIndex, 'value', val)"
            />
          </div>
          <div class="w-10rem">
            <DatePicker
              :model-value="reading.asOf"
              placeholder="Date"
              class="w-full"
              date-format="yy-mm-dd"
              @update:model-value="
                val =>
                  updateReading(
                    rIndex,
                    'asOf',
                    Array.isArray(val) ? (val[0] as Date | null) : (val as Date | null)
                  )
              "
            />
          </div>
          <Button
            icon="pi pi-times"
            text
            rounded
            severity="danger"
            size="small"
            @click="removeReading(rIndex)"
          />
        </div>

        <Button
          :label="$t('momentumMetric.addReading', 'Add Reading')"
          icon="pi pi-plus"
          text
          size="small"
          class="mt-1"
          @click="addReading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';

const props = defineProps<{
  indicator: {
    name: string;
    unit: string;
    baseline?: number;
    target?: number;
    readings: {
      value: number | boolean | string | undefined | null;
      asOf: Date;
    }[];
  };
  unitOptions: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: 'update', indicator: typeof props.indicator): void;
  (e: 'remove'): void;
}>();

const updateField = (field: string, value: string | number | null | undefined) => {
  emit('update', { ...props.indicator, [field]: value });
};

const updateReading = (
  index: number,
  field: string,
  value: number | boolean | string | Date | null
) => {
  const newReadings = [...props.indicator.readings];
  newReadings[index!] = { ...newReadings[index!]!, [field]: value };
  emit('update', { ...props.indicator, readings: newReadings });
};

const addReading = () => {
  const newReadings: Array<{ value: number | boolean | string | null | undefined; asOf: Date }> = [
    ...(props.indicator.readings || []),
    { value: undefined, asOf: new Date() },
  ];
  emit('update', { ...props.indicator, readings: newReadings });
};

const removeReading = (index: number) => {
  const newReadings = [...props.indicator.readings];
  newReadings.splice(index, 1);
  emit('update', { ...props.indicator, readings: newReadings });
};
</script>
