<template>
  <div class="formgrid grid">
    <FormField
      name="contact.email"
      :label="$t('common.email')"
      v-bind="defineField('contact.email')"
      :required="required"
      type="email"
      field-class="col-12 md:col-6"
    />
    <FormField
      name="contact.telephone"
      :label="$t('common.telephone')"
      v-bind="defineField('contact.telephone')"
      field-class="col-12 md:col-6"
    />
  </div>
</template>

<script setup lang="ts">
  import FormField from '@/components/common/FormField.vue'

  withDefaults(
    defineProps<{
      defineField: (name: string, ...args: any[]) => any
      required?: boolean
    }>(),
    {
      required: false
    }
  )
</script>
