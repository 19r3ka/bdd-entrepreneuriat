<template>
  <div class="formgrid grid">
    <FormField
      v-if="showWebsite"
      name="socialMedia.website"
      :label="websiteLabel || $t('common.socialMedia.website')"
      v-bind="defineField('socialMedia.website')"
      field-class="col-12 md:col-6"
    />
    <FormField
      v-if="showLinkedin"
      name="socialMedia.linkedin"
      :label="$t('common.socialMedia.linkedin')"
      v-bind="defineField('socialMedia.linkedin')"
      field-class="col-12 md:col-6"
    />
    <FormField
      v-if="showTwitter"
      name="socialMedia.twitter"
      :label="$t('common.socialMedia.twitter')"
      v-bind="defineField('socialMedia.twitter')"
      field-class="col-12 md:col-6"
    />
    <FormField
      v-if="showFacebook"
      name="socialMedia.facebook"
      :label="$t('common.socialMedia.facebook')"
      v-bind="defineField('socialMedia.facebook')"
      field-class="col-12 md:col-6"
    />
    <FormField
      v-if="showInstagram"
      name="socialMedia.instagram"
      :label="$t('common.socialMedia.instagram')"
      v-bind="defineField('socialMedia.instagram')"
      field-class="col-12 md:col-6"
    />
    <FormField
      v-if="showTiktok"
      name="socialMedia.tiktok"
      :label="$t('common.socialMedia.tiktok')"
      v-bind="defineField('socialMedia.tiktok')"
      field-class="col-12 md:col-6"
    />
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/common/FormField.vue';
import type { DefineFieldReturn } from '@/composables/useValidationForm';

withDefaults(
  defineProps<{
    defineField: (name: string, ...args: unknown[]) => DefineFieldReturn<unknown>;
    websiteLabel?: string;
    showWebsite?: boolean;
    showLinkedin?: boolean;
    showTwitter?: boolean;
    showFacebook?: boolean;
    showInstagram?: boolean;
    showTiktok?: boolean;
  }>(),
  {
    websiteLabel: '',
    showWebsite: true,
    showLinkedin: true,
    showTwitter: true,
    showFacebook: true,
    showInstagram: true,
    showTiktok: true,
  }
);
</script>
