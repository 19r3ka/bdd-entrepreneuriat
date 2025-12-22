<template>
  <form @submit.prevent="form.handleSubmit(onSubmit)">
    <slot
      v-bind="{
        ...form,
        values: form.values.value,
        isSubmitting: form.isSubmitting.value,
        canSubmit: form.canSubmit.value,
        isValid: form.isValid.value,
        isDirty: form.isDirty.value,
        hasErrors: form.hasErrors.value,
        isTouched: form.isTouched.value,
      }"
    />
  </form>
</template>

<script setup lang="ts" generic="T extends ZodSchema">
import type { ZodSchema, z } from 'zod';
import {
  type UniqueChecks,
  useValidationForm,
  type UseValidationFormReturn,
} from '@/composables/useValidationForm';

interface Props {
  schema: T;
  initialValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void> | void;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  uniqueChecks?: UniqueChecks;
}

const props = withDefaults(defineProps<Props>(), {
  validateOnBlur: true,
  validateOnChange: false,
  uniqueChecks: undefined,
});

const form: UseValidationFormReturn<T> = useValidationForm({
  initialValues: props.initialValues,
  validationSchema: props.schema,
  onSubmit: props.onSubmit,
  validateOnBlur: props.validateOnBlur,
  validateOnChange: props.validateOnChange,
  uniqueChecks: props.uniqueChecks,
});

// Expose full form state for parent components
defineExpose(form);

defineSlots<{
  default(
    props: Omit<
      UseValidationFormReturn<T>,
      'values' | 'isSubmitting' | 'canSubmit' | 'isValid' | 'isDirty' | 'hasErrors' | 'isTouched'
    > & {
      values: z.infer<T>;
      isSubmitting: boolean;
      canSubmit: boolean;
      isValid: boolean;
      isDirty: boolean;
      hasErrors: boolean;
      isTouched: boolean;
    }
  ): void;
}>();
</script>
