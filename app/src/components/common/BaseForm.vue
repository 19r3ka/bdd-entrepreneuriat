<template>
  <form @submit.prevent="form.handleSubmit(onSubmit)">
    <slot
      :values="form.values.value"
      :errors="form.errors.value"
      :rawErrors="form.rawErrors"
      :touchedFields="form.touchedFields"
      :isSubmitting="form.isSubmitting.value"
      :isDirty="form.isDirty.value"
      :isValid="form.isValid.value"
      :hasErrors="form.hasErrors.value"
      :isTouched="form.isTouched.value"
      :canSubmit="form.canSubmit.value"
      :defineField="form.defineField"
      :setFieldValue="form.setFieldValue"
      :handleFieldChange="form.handleFieldChange"
      :handleFieldBlur="form.handleFieldBlur"
      :validateField="form.validateField"
      :validateForm="form.validateForm"
      :resetForm="form.resetForm"
      :handleSubmit="form.handleSubmit"
    />
  </form>
</template>

<script setup lang="ts">
  import type { ZodSchema, z } from 'zod'
  import { type UniqueChecks, useValidationForm } from '@/composables/useValidationForm'

  interface Props<T extends ZodSchema> {
    schema: T
    initialValues: z.infer<T>
    onSubmit: (values: z.infer<T>) => Promise<void> | void
    validateOnBlur?: boolean
    validateOnChange?: boolean
    uniqueChecks?: UniqueChecks
  }

  const props = withDefaults(defineProps<Props<any>>(), {
    validateOnBlur: true,
    validateOnChange: false,
    uniqueChecks: undefined
  })

  const form = useValidationForm({
    initialValues: props.initialValues,
    validationSchema: props.schema,
    onSubmit: props.onSubmit,
    validateOnBlur: props.validateOnBlur,
    validateOnChange: props.validateOnChange,
    uniqueChecks: props.uniqueChecks
  })

  // Expose full form state for parent components
  defineExpose(form)
</script>
