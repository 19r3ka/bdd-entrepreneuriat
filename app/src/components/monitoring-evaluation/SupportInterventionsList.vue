<template>
  <div class="support-interventions-list">
    <Card>
      <template #title>
        <span class="text-xl font-bold">Support Interventions</span>
      </template>
      <template #content>
        <DataTable :value="supports" responsiveLayout="scroll">
          <Column field="modality" header="Modality"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="createdAt" header="Date">
            <template #body="slotProps">
              {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
            </template>
          </Column>
          <Column header="Actions">
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
  import type { Support } from '@/types/monitoring-evaluation/Support'

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
