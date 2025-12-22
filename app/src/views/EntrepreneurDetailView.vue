<template>
  <DetailLayout :hero-image="typeof heroImage === 'string' ? heroImage : undefined">
    <!-- Hero overlay: keep empty or add breadcrumbs/actions if needed -->
    <template #hero>
      <!-- Identity header card, overlapping hero -->
      <div class="relative surface-card border-round shadow-2 p-4 -mt-6 md:-mt-8 z-2">
        <div class="flex flex-column sm:flex-row align-items-end gap-4">
          <AvatarDisplay
            :src="avatarSrc"
            :label="fullName"
            shape="circle"
            size="xlarge"
            custom-class="w-8rem h-8rem border-circle border-3 border-white shadow-4 -mt-8 sm:mb-0"
            :style="{ 'font-size': '2.5rem' }"
          />
          <div class="flex-1 w-full">
            <div
              class="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-3"
            >
              <div>
                <h1 class="text-3xl font-bold m-0 text-900">
                  {{ fullName }}
                </h1>
                <p class="text-500 m-0 mt-1">{{ entrepreneur?.slug }}</p>
              </div>
              <div class="flex gap-2">
                <Button
                  :label="$t('pages.entrepreneurs.addBusiness')"
                  icon="pi pi-plus-circle"
                  severity="secondary"
                  outlined
                  @click="onAddBusiness"
                />
                <Button :label="$t('common.edit')" icon="pi pi-pencil" @click="onEditProfile" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Main column -->
    <template #main>
      <div class="flex flex-column gap-4">
        <!-- Bio -->
        <Card class="shadow-2">
          <template #title>{{ $t('common.bio') }}</template>
          <template #content>
            <p class="line-height-3 text-700 m-0">
              {{ entrepreneur?.bio || $t('common.notAvailable') }}
            </p>
          </template>
        </Card>

        <!-- Personal Details Card -->
        <Card class="shadow-2">
          <template #title>{{ $t('common.personalDetails') }}</template>
          <template #content>
            <div class="grid">
              <div v-if="entrepreneur?.gender" class="col-12 md:col-6 mb-3">
                <span class="block text-500 font-medium text-sm">{{ $t('common.gender') }}</span>
                <span class="block text-900 text-lg mt-1">{{
                  getGenderLabel(entrepreneur.gender)
                }}</span>
              </div>
              <div v-if="calculatedAge !== null" class="col-12 md:col-6 mb-3">
                <span class="block text-500 font-medium text-sm">{{ $t('common.age') }}</span>
                <span class="block text-900 text-lg mt-1"
                  >{{ calculatedAge }} {{ $t('common.years') }}</span
                >
              </div>
            </div>
          </template>
        </Card>

        <!-- Location Map -->
        <Card v-if="entrepreneur?.address?.coordinates?.latitude" class="shadow-2">
          <template #title>{{ $t('common.mapPreview') }}</template>
          <template #content>
            <InteractiveMap :locations="addressLocation" :is-editable="false" />
          </template>
        </Card>

        <!-- Associated businesses -->
        <Card class="shadow-2">
          <template #title>{{ $t('pages.entrepreneurs.associatedBusinesses') }}</template>
          <template #content>
            <div v-if="businesses.length" class="grid formgrid">
              <div v-for="biz in businesses" :key="biz.id" class="col-12 md:col-6">
                <div
                  class="border-1 surface-border border-round p-3 hover:shadow-3 transition-all cursor-pointer h-full"
                  @click="biz.id && goBusiness(biz.id)"
                >
                  <div class="flex align-items-center gap-3 mb-3">
                    <AvatarDisplay
                      :src="typeof biz.avatar === 'string' ? biz.avatar : undefined"
                      :label="biz.name || ''"
                      size="large"
                      shape="circle"
                    />
                    <div>
                      <div class="font-bold text-900">{{ biz.name }}</div>
                      <div class="text-sm text-500">
                        {{
                          biz.primaryBusinessArea
                            ? $t(`businessAreas.${biz.primaryBusinessArea}`)
                            : $t('common.notAvailable')
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="text-600 text-sm">
                    {{
                      biz.secondaryBusinessArea
                        ? $t(`businessAreas.${biz.secondaryBusinessArea}`)
                        : ''
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-500">
              {{ $t('pages.entrepreneurs.noAssociatedBusinesses') }}
            </div>
          </template>
        </Card>
      </div>
    </template>

    <!-- Sidebar column -->
    <template #sidebar>
      <div class="flex flex-column gap-4">
        <ContactInfos
          :title="$t('common.contactInformation')"
          :email="entrepreneur?.contact?.email"
          :telephone="entrepreneur?.contact?.telephone"
          :address="displayAddress"
          :website="entrepreneur?.socialMedia?.website"
        />
        <SocialMediaCard :title="$t('common.socialMedia.title')" :socials="socials" />
      </div>
    </template>
  </DetailLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import AvatarDisplay from '@/components/common/AvatarDisplay.vue';

import DetailLayout from '@/components/common/DetailLayout.vue';
import ContactInfos from '@/components/common/ContactDetailsCard.vue';
import SocialMediaCard from '@/components/common/SocialMediaCard.vue';
import InteractiveMap from '@/components/InteractiveMap.vue';

import { type Entrepreneur } from '@/schemas/entrepreneur'; // Use schema for type inference
import { type Business } from '@/schemas/business'; // Use schema for type inference
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { calculateAge } from '@/utils/date.helpers'; // Import calculateAge
import { useGenderOptions } from '@/composables/useGenderOptions';

const route = useRoute();
const router = useRouter();
const { getGenderLabel } = useGenderOptions();

const entrepreneurStore = useEntrepreneurStore();
const businessStore = useBusinessStore();

const entrepreneur = ref<Entrepreneur | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  await entrepreneurStore.fetchAll();
  entrepreneur.value = entrepreneurStore.getById(id) || null;
  if (entrepreneur.value) {
    await businessStore.fetchAll();
  }
});

const fullName = computed(() =>
  entrepreneur.value ? `${entrepreneur.value.firstName} ${entrepreneur.value.lastName}` : ''
);

const avatarSrc = computed(() => entrepreneur.value?.avatar || '');
const heroImage = computed(() => entrepreneur.value?.avatar || '');

const businesses = computed<Business[]>(() => {
  if (!entrepreneur.value) return [];
  return businessStore.businesses.filter(b => b.entrepreneurId === entrepreneur.value!.id);
});

const addressLocation = computed(() => {
  if (
    entrepreneur.value?.address?.coordinates?.latitude &&
    entrepreneur.value?.address?.coordinates?.longitude
  ) {
    return [
      {
        lat: entrepreneur.value.address.coordinates.latitude,
        lng: entrepreneur.value.address.coordinates.longitude,
        name: displayAddress.value || 'Entrepreneur Address', // Use formatted address as name
      },
    ];
  }
  return [];
});

const displayAddress = computed(() => {
  const addr = entrepreneur.value?.address;
  if (!addr) return undefined;
  const parts = [];
  if (addr.street) parts.push(addr.street);
  if (addr.city) parts.push(addr.city);
  if (addr.country) parts.push(addr.country);
  return parts.join(', ');
});

const calculatedAge = computed(() => {
  if (entrepreneur.value?.dateOfBirth) {
    return calculateAge(entrepreneur.value.dateOfBirth);
  }
  return null;
});

// Map entrepreneur.socialMedia schema to SocialMediaCard format
const socials = computed(() => {
  const sm = entrepreneur.value?.socialMedia;
  if (!sm) return [];
  const map: { name: string; url: string; icon: string; username?: string }[] = [];
  if (sm.linkedin) map.push({ name: 'LinkedIn', url: sm.linkedin, icon: 'pi-linkedin' });
  if (sm.twitter) map.push({ name: 'Twitter', url: sm.twitter, icon: 'pi-twitter' });
  if (sm.facebook) map.push({ name: 'Facebook', url: sm.facebook, icon: 'pi-facebook' });
  if (sm.instagram) map.push({ name: 'Instagram', url: sm.instagram, icon: 'pi-instagram' });
  if (sm.github) map.push({ name: 'GitHub', url: sm.github, icon: 'pi-globe' }); // Changed to globe, as pi-github is not standard in PrimeIcons
  if (sm.tiktok) map.push({ name: 'TikTok', url: sm.tiktok, icon: 'pi-globe' }); // fallback icon
  return map;
});

/**
 *
 */
function onAddBusiness() {
  if (!entrepreneur.value) return;
  router.push(`/businesses/new?entrepreneurId=${entrepreneur.value.id}`);
}

/**
 *
 */
function onEditProfile() {
  if (!entrepreneur.value) return;
  router.push(`/entrepreneurs/${entrepreneur.value.id}/edit`);
}

/**
 *
 */
function goBusiness(id: string) {
  router.push(`/businesses/${id}`);
}
</script>
