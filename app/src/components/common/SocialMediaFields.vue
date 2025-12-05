<template>
  <div class="formgrid grid">
    <FormField
      v-if="showPersonalWebsite"
      name="personalWebsite"
      :label="$t('common.personalWebsite')"
      v-bind="defineField('personalWebsite')"
      field-class="col-12 md:col-6"
    />
    <FormField
      name="socialMedia.linkedin"
      :label="$t('common.socialMedia.linkedin')"
      v-bind="defineField('socialMedia.linkedin')"
      field-class="col-12 md:col-6"
    />
    <FormField
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
  </div>
</template>

<script setup lang="ts">
  import FormField from '@/components/common/FormField.vue'

  defineProps<{
    defineField: (name: string, ...args: any[]) => any
    showPersonalWebsite?: boolean
    showFacebook?: boolean
    showInstagram?: boolean
  }>()
</script>
