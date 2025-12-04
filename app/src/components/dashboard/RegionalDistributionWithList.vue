<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import type { Business } from '@/types/business'
  import InteractiveMap from '@/components/InteractiveMap.vue'
  import Card from 'primevue/card'
  import Button from 'primevue/button'
  import { useRouter } from 'vue-router'
  import { businessAreaOptions } from '@/constants/businessAreas'

  const props = defineProps<{
    businesses: Business[]
  }>()

  const router = useRouter()
  const mapRef = ref<any>(null)
  const visibleBusinesses = ref<Business[]>([])

  // Initial locations for the map
  const locations = computed(() => {
    return props.businesses
      .filter(
        (business) => business.location && business.location.latitude && business.location.longitude
      )
      .map((business) => ({
        lat: business.location!.latitude!,
        lng: business.location!.longitude!,
        name: business.name,
        address: business.location!.address,
        id: business.id // Add ID to link back
      }))
  })

  // Initialize visible businesses with all mapped businesses
  watch(
    () => props.businesses,
    (newBusinesses) => {
      visibleBusinesses.value = newBusinesses.filter(
        (business) => business.location && business.location.latitude && business.location.longitude
      )
    },
    { immediate: true }
  )

  const handleMapBounds = (bounds: any) => {
    if (!bounds) return

    visibleBusinesses.value = props.businesses.filter((business) => {
      if (!business.location || !business.location.latitude || !business.location.longitude)
        return false
      const latitude = business.location.latitude
      const longitude = business.location.longitude
      return bounds.contains([latitude, longitude])
    })
  }

  const handleBusinessClick = (businessId: string) => {
    router.push(`/businesses/${businessId}`)
  }

  const flyToBusiness = (business: Business) => {
    if (mapRef.value && business.location) {
      // mapRef.value.flyTo([business.location.latitude, business.location.longitude]);
    }
  }

  const getBusinessAreaName = (code: string | undefined) => {
    if (!code) return 'Unknown Sector'
    const areaOption = businessAreaOptions.find((option) => option.code === code)
    return areaOption ? areaOption.name : code
  }
</script>

<template>
  <div class="grid" style="height: 500px">
    <!-- Map Column (Left) -->
    <div class="col-12 lg:col-8 h-full">
      <Card
        class="h-full border-1 border-surface-100 dark:border-surface-500 shadow-sm p-0 overflow-hidden"
      >
        <template #content>
          <!-- Map Container -->
          <div class="w-full h-full relative">
            <InteractiveMap
              ref="mapRef"
              :locations="locations"
              :is-editable="false"
              height="100%"
              width="100%"
              @update:bounds="handleMapBounds"
            />
            <!-- Overlay Stats -->
            <div
              class="absolute top-0 right-0 m-3 z-1 bg-surface-0 dark:bg-surface-900 p-2 border-round shadow-2 opacity-90 flex align-items-center gap-2"
            >
              <i class="pi pi-eye text-primary"></i>
              <span class="font-bold text-900 dark:text-0">{{ visibleBusinesses.length }}</span>
              <span class="text-700 dark:text-200 text-sm font-medium">Visible</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- List Column (Right) -->
    <div class="col-12 lg:col-4 h-full">
      <Card
        class="h-full border-1 border-surface-100 dark:border-surface-500 shadow-sm flex flex-column"
      >
        <template #title>
          <div class="flex justify-content-between align-items-center p-2">
            <h3 class="text-lg font-bold m-0">Business Overview</h3>
            <span
              class="text-xs text-500 bg-surface-100 dark:bg-surface-800 px-2 py-1 border-round"
            >
              {{ visibleBusinesses.length }} shown
            </span>
          </div>
        </template>
        <template #content>
          <div class="overflow-y-auto h-full pl-2 pr-2 pb-1 flex-1">
            <div class="flex flex-column gap-2">
              <div
                v-for="business in visibleBusinesses"
                :key="business.id"
                class="flex flex-column gap-2 p-3 border-1 border-surface-200 dark:border-surface-700 border-round-xl cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 hover:shadow-md transition-all duration-200"
                @click="handleBusinessClick(business.id!)"
                @mouseenter="flyToBusiness(business)"
              >
                <!-- Header: Name & Status -->
                <div class="flex justify-content-between align-items-start gap-2">
                  <h4 class="m-0 text-base font-bold text-900 dark:text-white line-height-2">
                    {{ business.name }}
                  </h4>
                  <span
                    class="flex-shrink-0 text-xs font-medium px-2 py-1 border-round bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    Active
                  </span>
                </div>

                <!-- Address -->
                <div class="flex align-items-center gap-2 text-sm text-600 dark:text-400">
                  <i class="pi pi-map-marker text-primary text-xs"></i>
                  <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis">
                    {{ business.location?.address || 'Location pinned on map' }}
                  </span>
                </div>

                <!-- Footer: Sector & Action -->
                <div class="flex justify-content-between align-items-center mt-1">
                  <span
                    class="text-xs text-500 bg-surface-100 dark:bg-surface-700 px-2 py-1 border-round white-space-nowrap overflow-hidden text-overflow-ellipsis"
                    style="max-width: 60%"
                  >
                    {{ getBusinessAreaName(business.primaryBusinessArea) }}
                  </span>
                  <span
                    class="text-xs text-primary font-medium flex align-items-center gap-1 hover:underline flex-shrink-0"
                  >
                    View Details <i class="pi pi-arrow-right text-xs"></i>
                  </span>
                </div>
              </div>

              <div
                v-if="visibleBusinesses.length === 0"
                class="flex flex-column align-items-center justify-content-center py-6 text-center text-500"
              >
                <i class="pi pi-map text-4xl mb-3 text-300"></i>
                <span class="font-medium">No businesses found in this area</span>
                <span class="text-sm mt-1">Try panning the map to a different location</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
  :deep(.p-card-body) {
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  :deep(.p-card-content) {
    flex: 1;
    overflow: hidden;
    padding: 0;
  }
</style>
