<template>
  <div class="support-interventions-list">
    <Card>
      <template #title>
        <span class="text-xl font-bold">{{ $t('pages.supports.title') }}</span>
      </template>
      <template #content>
        <DataTable :value="supports" responsive-layout="scroll">
          <Column field="modality" :header="$t('support.modality')"></Column>
          <Column field="description" :header="$t('common.description')"></Column>
          <Column field="createdAt" :header="$t('common.createdAt')">
            <template #body="slotProps">
              {{ d(new Date(slotProps.data.createdAt), 'long') }}
            </template>
          </Column>
          <Column :header="$t('common.actions')">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="editSupport(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                @click="deleteSupport(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import Card from 'primevue/card'
  import { useI18n } from 'vue-i18n'
  import type { Support } from '@/types/monitoring-evaluation/Support'

  const { d } = useI18n()

  defineProps<{
    supports: Support[]
  }>()

  const emit = defineEmits(['edit-support', 'delete-support'])

  const editSupport = (support: Support) => {
    emit('edit-support', support)
  }

  const deleteSupport = (support: Support) => {
    emit('delete-support', support)
  }
</script>
