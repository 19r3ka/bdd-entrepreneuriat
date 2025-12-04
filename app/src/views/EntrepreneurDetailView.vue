<template>
  <DetailLayout :heroImage="typeof heroImage === 'string' ? heroImage : undefined">
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
            customClass="w-8rem h-8rem border-circle border-3 border-white shadow-4 -mt-8 sm:mb-0"
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
              <div class="col-12 md:col-6 mb-3" v-if="entrepreneur?.gender">
                <span class="block text-500 font-medium text-sm">{{ $t('common.gender') }}</span>
                <span class="block text-900 text-lg mt-1">{{ entrepreneur.gender }}</span>
              </div>
              <div class="col-12 md:col-6 mb-3" v-if="calculatedAge !== null">
                <span class="block text-500 font-medium text-sm">{{ $t('common.age') }}</span>
                <span class="block text-900 text-lg mt-1"
                  >{{ calculatedAge }} {{ $t('common.years') }}</span
                >
              </div>
            </div>
          </template>
        </Card>

        <!-- Location Map -->
        <Card class="shadow-2" v-if="entrepreneur?.address">
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
              <div class="col-12 md:col-6" v-for="biz in businesses" :key="biz.id">
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
                        {{ biz.primaryBusinessArea || $t('common.notAvailable') }}
                      </div>
                    </div>
                  </div>
                  <div class="text-600 text-sm">
                    {{ biz.secondaryBusinessArea || '' }}
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
          :address="entrepreneur?.address"
          :website="entrepreneur?.personalWebsite"
        />
        <SocialMediaCard :title="$t('common.socialMedia.title')" :socials="socials" />
      </div>
    </template>
  </DetailLayout>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import Card from 'primevue/card'
  import Button from 'primevue/button'
  import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

  import DetailLayout from '@/components/common/DetailLayout.vue'
  import ContactInfos from '@/components/common/ContactDetailsCard.vue'
  import SocialMediaCard from '@/components/common/SocialMediaCard.vue'
  import InteractiveMap from '@/components/InteractiveMap.vue'

  import type { Entrepreneur } from '@/types/entrepreneur'
  import type { Business } from '@/types/business'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import { calculateAge } from '@/utils/date.helpers' // Import calculateAge

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const entrepreneurStore = useEntrepreneurStore()
  const businessStore = useBusinessStore()

  const entrepreneur = ref<Entrepreneur | null>(null)

  onMounted(async () => {
    const id = route.params.id as string
    await entrepreneurStore.fetchAll()
    entrepreneur.value = entrepreneurStore.getById(id) || null
    if (entrepreneur.value) {
      await businessStore.fetchAll()
    }
  })

  const fullName = computed(() =>
    entrepreneur.value ? `${entrepreneur.value.firstName} ${entrepreneur.value.lastName}` : ''
  )

  const avatarSrc = computed(() => entrepreneur.value?.avatar || '')
  const heroImage = computed(() => entrepreneur.value?.avatar || '')

  const businesses = computed<Business[]>(() => {
    if (!entrepreneur.value) return []
    return businessStore.businesses.filter((b) => b.entrepreneurId === entrepreneur.value!.id)
  })

  const addressLocation = computed(() => {
    if (entrepreneur.value?.address) {
      // For now, just show the address as text
      // We'll need to geocode it to get coordinates for the map
      // For this implementation, we'll temporarily return an empty array
      // since we don't have the coordinates yet, but it will be geocoded in the MapComponent
      return [
        {
          lat: 47.41322, // Default coordinates as fallback
          lng: -1.219482,
          name: entrepreneur.value.address || 'Entrepreneur Address'
        }
      ]
    }
    return []
  })

  const calculatedAge = computed(() => {
    if (entrepreneur.value?.dateOfBirth) {
      return calculateAge(entrepreneur.value.dateOfBirth)
    }
    return null
  })

  // Map entrepreneur.socialMedia schema to SocialMediaCard format
  const socials = computed(() => {
    const sm = entrepreneur.value?.socialMedia
    if (!sm) return []
    const map: { name: string; url: string; icon: string; username?: string }[] = []
    if (sm.linkedin) map.push({ name: 'LinkedIn', url: sm.linkedin, icon: 'pi-linkedin' })
    if (sm.twitter) map.push({ name: 'Twitter', url: sm.twitter, icon: 'pi-twitter' })
    if (sm.facebook) map.push({ name: 'Facebook', url: sm.facebook, icon: 'pi-facebook' })
    if (sm.instagram) map.push({ name: 'Instagram', url: sm.instagram, icon: 'pi-instagram' })
    if ((sm as any).github) map.push({ name: 'GitHub', url: (sm as any).github, icon: 'pi-github' })
    if (sm.tiktok) map.push({ name: 'TikTok', url: sm.tiktok, icon: 'pi-globe' }) // fallback icon
    return map
  })

  function onAddBusiness() {
    if (!entrepreneur.value) return
    router.push(`/businesses/new?entrepreneurId=${entrepreneur.value.id}`)
  }

  function onEditProfile() {
    if (!entrepreneur.value) return
    router.push(`/entrepreneurs/${entrepreneur.value.id}/edit`)
  }

  function goBusiness(id: string) {
    router.push(`/businesses/${id}`)
  }
</script>
