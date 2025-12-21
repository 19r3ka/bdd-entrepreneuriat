<template>
  <div class="surface-card p-4 border-round-lg border-1 border-200 relative">
    <Button
      icon="pi pi-times"
      class="p-button-rounded p-button-text p-button-danger absolute"
      style="top: 0.5rem; right: 0.5rem"
      @click="$emit('remove')"
    />

    <div class="font-semibold text-lg mb-3 text-primary pr-8">
      {{ indicatorName }}
    </div>

    <!-- Boolean Indicator Layout -->
    <div v-if="isBoolean" class="formgrid grid">
      <div class="field col-12">
        <label class="font-medium text-sm mb-2 block">{{ $t('quickWin.currentValue') }}</label>
        <SelectButton
          :model-value="item.currentValue"
          :options="[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]"
          option-label="label"
          option-value="value"
          @change="e => $emit('update', 'currentValue', e.value)"
        />
      </div>
    </div>

    <!-- Numeric/Text Indicator Layout -->
    <div v-else class="formgrid grid">
      <div class="field col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{ $t('quickWin.baseline') }}</label>
        <InputNumber
          v-if="isNumeric"
          :model-value="item.baseline as number"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          class="w-full"
          @input="e => $emit('update', 'baseline', e.value)"
        />
        <InputText
          v-else
          :model-value="item.baseline as string"
          class="w-full"
          @input="e => $emit('update', 'baseline', (e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="field col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{ $t('quickWin.target') }}</label>
        <InputNumber
          v-if="isNumeric"
          :model-value="item.target as number"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          class="w-full"
          @input="e => $emit('update', 'target', e.value)"
        />
        <InputText
          v-else
          :model-value="item.target as string"
          class="w-full"
          @input="e => $emit('update', 'target', (e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="field col-12 md:col-4">
        <label class="font-medium text-sm mb-2 block">{{ $t('quickWin.currentValue') }}</label>
        <InputNumber
          v-if="isNumeric"
          :model-value="item.currentValue as number"
          :min-fraction-digits="0"
          :max-fraction-digits="2"
          class="w-full"
          @input="e => $emit('update', 'currentValue', e.value)"
        />
        <InputText
          v-else
          :model-value="item.currentValue as string"
          class="w-full"
          @input="e => $emit('update', 'currentValue', (e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="field col-12">
      <label class="font-medium text-sm mb-2 block">{{ $t('common.notes', 'Notes') }}</label>
      <InputText
        :model-value="item.notes"
        :placeholder="$t('quickWin.placeholders.indicatorNotes')"
        class="w-full"
        @input="e => $emit('update', 'notes', (e.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import type { QuickWinIndicatorValue } from '@/types/monitoring-evaluation/QuickWin';

defineProps<{
  item: QuickWinIndicatorValue;
  indicatorName: string;
  isBoolean: boolean;
  isNumeric: boolean;
}>();

defineEmits<{
  (e: 'remove'): void;
  (e: 'update', field: keyof QuickWinIndicatorValue, value: any): void;
}>();
</script>
