<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h3 class="text-xl font-medium m-0">Support History</h3>
      <Button label="Log Support" icon="pi pi-plus" size="small" @click="$emit('add')" />
    </div>

    <Timeline :value="sortedSupports" align="alternate" class="customized-timeline">
      <template #marker="slotProps">
        <span
          class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
          :style="{ backgroundColor: getColor(slotProps.item.boostType) }"
        >
          <i :class="getIcon(slotProps.item.boostType)"></i>
        </span>
      </template>
      <template #content="slotProps">
        <Card
          class="mb-3 cursor-pointer hover:surface-hover"
          @click="$emit('view', slotProps.item.id)"
        >
          <template #title>
            {{ slotProps.item.title }}
          </template>
          <template #subtitle>
            {{ formatDate(slotProps.item.startDate) }}
          </template>
          <template #content>
            <p v-if="slotProps.item.notes" class="m-0 mb-2">{{ slotProps.item.notes }}</p>
            <div class="flex align-items-center gap-2">
              <Tag :value="formatType(slotProps.item.boostType)" severity="info" />
              <Tag
                v-if="slotProps.item.quantity?.value"
                :value="formatQuantity(slotProps.item.quantity)"
                severity="success"
              />
            </div>
            <div class="flex justify-content-end mt-2">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                @click.stop="$emit('edit', slotProps.item.id)"
              />
            </div>
          </template>
        </Card>
      </template>
    </Timeline>

    <div v-if="supports.length === 0" class="text-center p-4 text-500">
      No support history recorded yet.
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Timeline from 'primevue/timeline'
  import Card from 'primevue/card'
  import Button from 'primevue/button'
  import Tag from 'primevue/tag'
  import type { Support } from '@/types/monitoring-evaluation/Support'

  const { d } = useI18n()

  const props = defineProps<{
    supports: Support[]
  }>()

  defineEmits<{
    (e: 'add'): void
    (e: 'view', id: string): void
    (e: 'edit', id: string): void
  }>()

  const sortedSupports = computed(() => {
    return [...props.supports].sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  })

  /**
   *
   */
  function formatDate(dateStr: string) {
    if (!dateStr) return ''
    return d(new Date(dateStr), 'long')
  }

  /**
   *
   */
  function formatType(type: string) {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   *
   */
  function formatQuantity(quantity: any) {
    if (!quantity || !quantity.value) return ''
    const unit = quantity.unit === 'currency' ? quantity.currency : quantity.unit
    return `${quantity.value} ${unit || ''}`
  }

  /**
   *
   */
  function getColor(type: string) {
    // Simple color mapping based on type
    if (type.includes('financial')) return '#9C27B0'
    if (type.includes('training') || type.includes('mentoring')) return '#673AB7'
    if (type.includes('equipment') || type.includes('workspace')) return '#FF9800'
    return '#607D8B'
  }

  /**
   *
   */
  function getIcon(type: string) {
    if (type.includes('financial')) return 'pi pi-dollar'
    if (type.includes('training')) return 'pi pi-book'
    if (type.includes('mentoring')) return 'pi pi-users'
    if (type.includes('equipment')) return 'pi pi-box'
    if (type.includes('digital')) return 'pi pi-desktop'
    return 'pi pi-check'
  }
</script>

<style scoped>
  .customized-timeline :deep(.p-timeline-event-opposite) {
    flex: 0;
    padding: 0;
  }
  .customized-timeline :deep(.p-timeline-event-content) {
    width: 100%;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
