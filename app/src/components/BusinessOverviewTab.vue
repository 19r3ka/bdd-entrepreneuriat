<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import ContactInfos from '@/components/common/ContactDetailsCard.vue';
import SocialMediaCard from '@/components/common/SocialMediaCard.vue';
import InteractiveMap from '@/components/InteractiveMap.vue';
import { type Business } from '@/schemas/business'; // Use BusinessSchema for type inference
import { businessAreaOptions as BUSINESS_AREA_MAP } from '@/constants/businessAreas';

// STRICT CONTRACT
interface Props {
  business: Business;
  socials: Array<{ name: string; url: string; icon: string }>;
}

const props = defineProps<Props>();
const { t, d } = useI18n();

// Helper functions internal to this display component
/**
 *
 */
function getBusinessAreaName(code?: string) {
  if (!code) return t('common.notAvailable');
  const area = BUSINESS_AREA_MAP.find(a => a.code === code);
  return area ? area.name : code;
}

/**
 *
 */
function formatDate(date: string | Date | null | undefined): string {
  if (!date) return t('common.notAvailable');
  // DateStringSchema ensures ISO string, which Date constructor handles
  return d(new Date(date), 'long');
}

const mapLocations = computed(() => {
  if (
    props.business?.location?.coordinates?.latitude &&
    props.business?.location?.coordinates?.longitude
  ) {
    return [
      {
        lat: props.business.location.coordinates.latitude,
        lng: props.business.location.coordinates.longitude,
        name: props.business.name || t('common.businessLocation'),
      },
    ];
  }
  return [];
});

const displayAddress = computed(() => {
  const loc = props.business?.location;
  if (!loc) return undefined;
  const parts = [];
  if (loc.street) parts.push(loc.street);
  if (loc.city) parts.push(loc.city);
  if (loc.country) parts.push(loc.country);
  return parts.join(', ');
});
</script>

<template>
  <div class="grid nested-grid">
    <div class="col-12 lg:col-8 flex flex-column gap-4">
      <Card class="shadow-2">
        <template #title>
          <span class="text-xl font-bold">{{ $t('common.businessDetails') }}</span>
        </template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6 mb-3">
              <span class="block text-500 font-medium text-sm">{{
                $t('common.primaryBusinessArea')
              }}</span>
              <span class="block text-900 text-lg mt-1">
                {{ getBusinessAreaName(business.primaryBusinessArea) }}
              </span>
            </div>

            <div v-if="business.secondaryBusinessArea" class="col-12 md:col-6 mb-3">
              <span class="block text-500 font-medium text-sm">{{
                $t('common.secondaryBusinessArea')
              }}</span>
              <span class="block text-900 text-lg mt-1">
                {{ getBusinessAreaName(business.secondaryBusinessArea) }}
              </span>
            </div>

            <div v-if="business.registrationNumber" class="col-12 md:col-6 mb-3">
              <span class="block text-500 font-medium text-sm">{{
                $t('common.registrationNumber')
              }}</span>
              <span class="block text-900 text-lg mt-1">{{ business.registrationNumber }}</span>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <span class="block text-500 font-medium text-sm">{{
                $t('common.registrationDate')
              }}</span>
              <span class="block text-900 text-lg mt-1">{{
                formatDate(business.registrationDate)
              }}</span>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <span class="block text-500 font-medium text-sm">{{
                $t('common.supportStartDate')
              }}</span>
              <span class="block text-900 text-lg mt-1">{{
                formatDate(business.supportStartDate)
              }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="business.location?.coordinates?.latitude" class="shadow-2">
        <template #title>
          <span class="text-xl font-bold">{{ $t('common.location') }}</span>
        </template>
        <template #content>
          <InteractiveMap
            :locations="mapLocations"
            :is-editable="false"
            style="height: 300px; width: 100%; border-radius: 8px"
          />
        </template>
      </Card>

      <SocialMediaCard :title="$t('common.socialMedia.title')" :socials="socials" />
    </div>

    <div class="col-12 lg:col-4">
      <div class="sticky top-0 pt-2">
        <ContactInfos
          :title="$t('common.contactInformation')"
          :email="business.contact?.email"
          :telephone="business.contact?.telephone"
          :address="displayAddress"
          :website="business.socialMedia?.website"
        />
      </div>
    </div>
  </div>
</template>
