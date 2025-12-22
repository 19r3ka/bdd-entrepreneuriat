<template>
  <div>
    <h5 class="mt-5 mb-3">{{ $t('common.socialMedia.title') }}</h5>
    <div class="grid formgrid">
      <div v-if="socialMedia?.linkedin" class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.socialMedia.linkedin')
        }}</label>
        <p>{{ socialMedia.linkedin }}</p>
      </div>
      <div v-if="socialMedia?.twitter" class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.socialMedia.twitter')
        }}</label>
        <p>{{ socialMedia.twitter }}</p>
      </div>
      <div v-if="socialMedia?.facebook" class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.socialMedia.facebook')
        }}</label>
        <p>{{ socialMedia.facebook }}</p>
      </div>
      <div v-if="socialMedia?.instagram" class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{
          $t('common.socialMedia.instagram')
        }}</label>
        <p>{{ socialMedia.instagram }}</p>
      </div>
      <div v-if="socialMedia?.tiktok" class="col-12 md:col-6 field">
        <label class="block text-900 font-medium mb-2">{{ $t('common.socialMedia.tiktok') }}</label>
        <p>{{ socialMedia.tiktok }}</p>
      </div>
      <div v-if="!hasSocialMedia" class="col-12">
        <p>{{ $t('common.notAvailable') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SocialMedia } from '@/types/socialMedia';

const props = defineProps<{
  socialMedia: SocialMedia | undefined | null;
}>();

const hasSocialMedia = computed(() => {
  if (!props.socialMedia) return false;
  return Object.values(props.socialMedia).some(value => !!value);
});
</script>

<style scoped>
.field p {
  margin-top: 0.5rem;
  margin-bottom: 0;
}
</style>
