<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <DataTable
          v-model:filters="filters as any"
          v-model:selection="selectedItems"
          :value="data"
          paginator
          :rows="10"
          :filter-display="filterMode === 'advanced' ? 'menu' : 'row'"
          :data-key="dataKey"
          :global-filter-fields="globalFilterFields"
          :row-hover="true"
          :resizable-columns="true"
        >
          <!-- Header -->
          <template #header>
            <div class="flex flex-column gap-3">
              <div class="flex justify-content-between align-items-center">
                <h1 class="m-0">{{ $t(`pages.${resourceName}.title`) }}</h1>
                <div class="flex gap-2">
                  <slot name="header-actions"></slot>
                </div>
              </div>

              <div class="flex justify-content-between align-items-center">
                <IconField
                  v-if="filters && filters.global"
                  icon-position="left"
                  class="w-full md:w-20rem"
                >
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="filters.global.value as any"
                    :placeholder="$t('placeholders.searchAll')"
                    class="w-full"
                  />
                </IconField>

                <div class="flex flex-wrap align-items-center gap-2">
                  <Button
                    v-if="!isMultiSelect"
                    :label="$t('common.multiSelect')"
                    icon="pi pi-check-square"
                    class="p-button-secondary"
                    @click="isMultiSelect = true"
                  />
                  <template v-else>
                    <Button
                      :label="$t('common.deleteSelected')"
                      icon="pi pi-trash"
                      class="p-button-danger"
                      :disabled="selectedIds.size === 0"
                      @click="confirmDeleteSelected"
                    />
                    <Button
                      :label="$t('common.cancel')"
                      icon="pi pi-times"
                      class="p-button-secondary"
                      @click="cancelMultiSelect"
                    />
                    <span class="ml-2 text-500">
                      {{ $t('common.selected', { count: selectedIds.size }) }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </template>

          <!-- Multi-select -->
          <Column v-if="isMultiSelect" selection-mode="multiple" header-style="width: 3rem" />

          <!-- Dynamic columns -->
          <Column
            v-for="col in columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :sortable="col.sortable"
            :show-filter-menu="Boolean(filters && filters[col.filterField || col.field])"
            :filter-field="col.filterField || col.field"
          >
            <template #body="slotProps">
              <slot :name="`col-${col.field}`" :data="slotProps.data">
                <template v-if="col.dataType === 'date'">
                  {{
                    resolveFieldData(slotProps.data, col.field)
                      ? d(new Date(resolveFieldData(slotProps.data, col.field) as string), 'medium')
                      : '-'
                  }}
                </template>
                <template v-else-if="col.dataType === 'boolean'">
                  <i
                    v-if="resolveFieldData(slotProps.data, col.field)"
                    class="pi pi-check text-green-500"
                  ></i>
                  <i v-else class="pi pi-times text-red-500"></i>
                </template>
                <template v-else>
                  {{ resolveFieldData(slotProps.data, col.field) }}
                </template>
              </slot>
            </template>

            <!-- Default filter input, overridable -->
            <template v-if="filterMode === 'basic'" #filter="{ filterModel, filterCallback }">
              <slot
                :name="`filter-${col.filterField || col.field}`"
                :filter-model="filterModel"
                :filter-callback="filterCallback"
              >
                <!-- Prefer select options when provided -->
                <SelectFilter
                  v-if="col.selectOptions && col.selectOptions.length > 0"
                  v-model="filterModel.value"
                  :options="col.selectOptions as any"
                  @change="filterCallback()"
                />

                <TextFilter
                  v-else-if="col.dataType === 'text' || !col.dataType"
                  v-model="filterModel.value"
                  :placeholder="$t('placeholders.searchAll')"
                  @update:model-value="filterCallback()"
                />

                <BooleanFilter
                  v-else-if="col.dataType === 'boolean'"
                  v-model="filterModel.value"
                  :indeterminate="filterModel.value === null"
                  :label="col.header"
                  @change="filterCallback()"
                />

                <Calendar
                  v-else-if="col.dataType === 'date'"
                  v-model="filterModel.value as any"
                  date-format="mm/dd/yy"
                  placeholder="mm/dd/yyyy"
                  @date-select="filterCallback()"
                  @input="filterCallback()"
                />

                <InputNumber
                  v-else-if="col.dataType === 'numeric'"
                  v-model="filterModel.value"
                  mode="decimal"
                  @input="filterCallback()"
                />
              </slot>
            </template>
          </Column>

          <!-- Actions column -->
          <Column :header="$t('common.actions')" style="width: 8rem" :exportable="false">
            <template #body="{ data: rowData }">
              <slot name="actions" :data="rowData">
                <slot name="prepend-actions" :data="rowData"></slot>
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text"
                  @click="emit('view', (rowData as Record<string, unknown>)[dataKey] as string)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-secondary"
                  @click="emit('edit', (rowData as Record<string, unknown>)[dataKey] as string)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="emit('delete', (rowData as Record<string, unknown>)[dataKey] as string)"
                />
                <slot name="append-actions" :data="rowData"></slot>
              </slot>
            </template>
          </Column>

          <template #empty>
            <div class="py-4 text-500">{{ $t('common.noData') }}</div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Calendar from 'primevue/calendar'; // Corrected import
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BooleanFilter from '@/components/common/BooleanFilter.vue';
import SelectFilter from '@/components/common/SelectFilter.vue';
import TextFilter from '@/components/common/TextFilter.vue';
import { useConfirmation } from '@/composables/useConfirmation';
import { resolveField } from '@/utils/resolveField';

interface SelectOption {
  label: string;
  value: unknown;
}

interface ColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  filterField?: string;
  dataType?: 'text' | 'date' | 'boolean' | 'numeric';
  selectOptions?: SelectOption[]; // optional default select options for basic mode
}

interface FilterValue {
  value: string | number | boolean | Date | null;
  matchMode?: string;
}

interface FilterState {
  global?: FilterValue;
  [key: string]: FilterValue | undefined; // For dynamic filter fields
}

const props = defineProps({
  data: { type: Array as () => unknown[], required: true },
  columns: { type: Array as () => ColumnDefinition[], required: true },
  dataKey: { type: String, required: true },
  resourceName: { type: String, required: true },
  globalFilterFields: { type: Array as () => string[], default: () => [] },
  filterMode: { type: String as () => 'basic' | 'advanced', default: 'basic' },
});

const filters = defineModel<FilterState>('filters');
const emit = defineEmits(['add', 'view', 'edit', 'delete', 'delete-selected', 'export-csv']);
const { showConfirmation } = useConfirmation();
const { t, d } = useI18n();

/* Selection and actions */
const isMultiSelect = ref(false);
const selectedItems = ref<unknown[]>([]);
const selectedIds = computed(() => {
  const ids = selectedItems.value
    .map(item => (item as Record<string, unknown>)[props.dataKey] as string | undefined)
    .filter((id): id is string => typeof id === 'string');
  return new Set(ids);
});

const resolveFieldData = (data: unknown, field: string): unknown =>
  resolveField(data as Record<string, unknown>, field);

const confirmDeleteSelected = () => {
  showConfirmation(
    t(`pages.${props.resourceName}.deleteSelectedConfirmation`, {
      count: selectedIds.value.size,
    }),
    t(`pages.${props.resourceName}.deleteTitle`),
    () => {
      emit('delete-selected', [...selectedIds.value]);
      cancelMultiSelect();
    }
  );
};

const cancelMultiSelect = () => {
  isMultiSelect.value = false;
  selectedItems.value = [];
};

// Expose selected items to parent components
defineExpose({
  selectedItems,
  selectedIds,
  isMultiSelect,
});
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>
