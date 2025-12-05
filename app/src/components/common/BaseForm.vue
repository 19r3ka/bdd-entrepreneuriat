<template>
  <form @submit.prevent="form.handleSubmit(onSubmit)">
    <slot
      :values="form.values.value"
      :errors="form.errors.value"
      :raw-errors="form.rawErrors"
      :touched-fields="form.touchedFields"
      :is-submitting="form.isSubmitting.value"
      :is-dirty="form.isDirty.value"
      :is-valid="form.isValid.value"
      :has-errors="form.hasErrors.value"
      :is-touched="form.isTouched.value"
      :can-submit="form.canSubmit.value"
      :define-field="form.defineField"
      :set-field-value="form.setFieldValue"
      :handle-field-change="form.handleFieldChange"
      :handle-field-blur="form.handleFieldBlur"
      :validate-field="form.validateField"
      :validate-form="form.validateForm"
      :reset-form="form.resetForm"
      :handle-submit="form.handleSubmit"
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
