import { computed, type Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ZodSchema, z } from 'zod';

// ------------------ Constants ------------------
export const VALIDATION_DUPLICATE = 'validation.duplicate';

export const DUPLICATE_VALIDATION_KEYS: Record<string, string> = {
  slug: 'validation.duplicateSlug',
  'contact.email': 'validation.duplicateEmail',
};

// ------------------ Types ------------------
export type UniqueChecks = Record<string, (value: string) => { id?: string } | undefined>;

export interface UseValidationFormOptions<T extends ZodSchema> {
  initialValues: z.infer<T>;
  validationSchema: T;
  onSubmit?: (values: z.infer<T>) => Promise<void> | void;

  validateOnBlur?: boolean;
  validateOnChange?: boolean;

  translateErrors?: (errors: z.core.$ZodIssue[]) => z.core.$ZodIssue[];
  uniqueChecks?: UniqueChecks;

  // Optional translator override (usually from vue-i18n)
  translate?: (key: string) => string;
}

interface FieldError {
  _errors: string[];
}

export type FormErrors = Partial<Record<string, FieldError>>;

export type DefineFieldReturn<FieldType = unknown> = {
  modelValue: import('vue').ComputedRef<FieldType>;
  'onUpdate:modelValue': (newValue: unknown) => void;
  onBlur: () => void;
  error: import('vue').ComputedRef<{ _errors: string[] } | undefined>;
  touched: import('vue').ComputedRef<boolean>;
};

import { computed, type Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ZodSchema, z } from 'zod';
import { getNestedValue, setNestedValue, safeClone } from '@/utils/formHelpers';
import { mapIssuesToErrors, type FormErrors } from '@/utils/validationHelpers';
import { checkUniqueness } from '@/utils/formUniqueness';

// ------------------ Constants ------------------
export { VALIDATION_DUPLICATE, DUPLICATE_VALIDATION_KEYS } from '@/utils/validationHelpers';

// ------------------ Types ------------------
export type UniqueChecks = Record<string, (value: string) => { id?: string } | undefined>;

export interface UseValidationFormOptions<T extends ZodSchema> {
  initialValues: z.infer<T>;
  validationSchema: T;
  onSubmit?: (values: z.infer<T>) => Promise<void> | void;

  validateOnBlur?: boolean;
  validateOnChange?: boolean;

  translateErrors?: (errors: z.core.$ZodIssue[]) => z.core.$ZodIssue[];
  uniqueChecks?: UniqueChecks;

  // Optional translator override (usually from vue-i18n)
  translate?: (key: string) => string;
}

export type { FormErrors };

export type DefineFieldReturn<FieldType = unknown> = {
  modelValue: import('vue').ComputedRef<FieldType>;
  'onUpdate:modelValue': (newValue: unknown) => void;
  onBlur: () => void;
  error: import('vue').ComputedRef<{ _errors: string[] } | undefined>;
  touched: import('vue').ComputedRef<boolean>;
};

export interface UseValidationFormReturn<T extends ZodSchema> {
  values: Ref<z.infer<T>>;
  errors: Ref<FormErrors>;
  rawErrors: Ref<z.core.$ZodIssue[]>;
  touchedFields: Ref<Set<string>>;
  isSubmitting: Ref<boolean>;
  isDirty: Ref<boolean>;
  isValid: Ref<boolean>;
  isTouched: Ref<boolean>;
  canSubmit: Ref<boolean>;
  hasErrors: Ref<boolean>;
  validateField: (fieldPath: string) => boolean;
  validateForm: () => boolean;
  handleFieldChange: (fieldPath: string, value: unknown) => void;
  handleFieldBlur: (fieldPath: string) => void;
  defineField: <FieldType = unknown>(
    fieldPath: keyof z.infer<T> | string
  ) => DefineFieldReturn<FieldType>;
  setFieldValue: (fieldPath: string, value: unknown) => void;
  resetForm: () => void;
  handleSubmit: (
    customOnSubmit?: ((values: z.infer<T>) => Promise<void> | void) | undefined
  ) => Promise<void>;
}

// ------------------ Main Composable ------------------
/**
 *
 */
export function useValidationForm<T extends ZodSchema>(options: UseValidationFormOptions<T>) {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnBlur = true,
    validateOnChange = false,
    translateErrors,
    uniqueChecks,
    translate,
  } = options;

  type FormValues = z.infer<T>;

  // refs
  const values = ref<FormValues>(safeClone(initialValues)) as Ref<FormValues>;
  const errors = ref<FormErrors>({});
  const touchedFields = ref<Set<string>>(new Set());
  const isSubmitting = ref(false);
  const isDirty = ref(false);

  const { t: i18nT } = useI18n();
  const t = translate ?? i18nT;

  // canonical baseline for resets and for setInitialValues
  const initialSnapshot = ref<FormValues>(safeClone(initialValues) as FormValues);
  const rawErrors = ref<z.core.$ZodIssue[]>([]);

  // ------------------ Validation ------------------
  /**
   *
   */
  function validateField(fieldPath: string): boolean {
    const result = validationSchema.safeParse(values.value);

    if (result.success) {
      delete errors.value[fieldPath];
    } else {
      const fieldIssues = result.error.issues.filter(issue => issue.path.join('.') === fieldPath);
      if (fieldIssues.length > 0) {
        errors.value[fieldPath] = { _errors: fieldIssues.map(i => i.message) };
      } else {
        delete errors.value[fieldPath];
      }
    }

    const duplicateMessage = checkUniqueness(
      fieldPath,
      values.value as Record<string, unknown>,
      uniqueChecks,
      t
    );
    if (duplicateMessage) {
      errors.value[fieldPath] = { _errors: [duplicateMessage] };
    }

    return !errors.value[fieldPath];
  }

  /**
   *
   */
  function validateForm(): boolean {
    const result = validationSchema.safeParse(values.value);
    if (result.success) {
      errors.value = {};
    } else {
      const issues = translateErrors ? translateErrors(result.error.issues) : result.error.issues;
      errors.value = mapIssuesToErrors(issues);
    }

    if (uniqueChecks) {
      Object.keys(uniqueChecks).forEach(path => {
        const duplicateMessage = checkUniqueness(
          path,
          values.value as Record<string, unknown>,
          uniqueChecks,
          t
        );
        if (duplicateMessage) {
          errors.value[path] = { _errors: [duplicateMessage] };
        }
      });
    }

    return Object.keys(errors.value).length === 0;
  }

  // ------------------ Field Handlers ------------------
  /**
   *
   */
  function handleFieldChange(fieldPath: string, value: unknown): void {
    setNestedValue(values.value as Record<string, unknown>, fieldPath, value);
    isDirty.value = true;
    if (errors.value[fieldPath]) delete errors.value[fieldPath];
    if (validateOnChange) validateField(fieldPath);
  }

  /**
   *
   */
  function handleFieldBlur(fieldPath: string): void {
    touchedFields.value.add(fieldPath);
    if (validateOnBlur) validateField(fieldPath);
  }

  /**
   *
   */
  function defineField<FieldType = unknown>(fieldPath: keyof FormValues | string) {
    const path = String(fieldPath);
    return {
      modelValue: computed<FieldType>(
        () => getNestedValue(values.value as Record<string, unknown>, path) as FieldType
      ),
      'onUpdate:modelValue': (newValue: unknown) => handleFieldChange(path, newValue),
      onBlur: () => handleFieldBlur(path),
      error: computed(() => errors.value[path]),
      touched: computed(() => touchedFields.value.has(path)),
    } as const;
  }

  // ------------------ Programmatic Helpers ------------------
  /**
   *
   */
  function setInitialValues(newInitial: Partial<FormValues> | FormValues): void {
    const incoming = safeClone(newInitial);
    const base = safeClone(initialSnapshot.value) as FormValues;
    const merged = { ...(base as object), ...(incoming as object) } as FormValues;

    initialSnapshot.value = safeClone(merged) as FormValues;
    values.value = safeClone(merged) as FormValues;

    errors.value = {};
    touchedFields.value.clear();
    isDirty.value = false;
    isSubmitting.value = false;
  }

  /**
   *
   */
  function resetForm(): void {
    values.value = safeClone(initialSnapshot.value) as FormValues;
    errors.value = {};
    touchedFields.value.clear();
    isDirty.value = false;
    isSubmitting.value = false;
  }

  /**
   *
   */
  function setFieldValue(fieldPath: string, value: unknown): void {
    setNestedValue(values.value as Record<string, unknown>, fieldPath, value);
    isDirty.value = true;
  }

  /**
   *
   */
  function setFieldError(fieldPath: string, error: string): void {
    errors.value[fieldPath] = { _errors: [error] };
  }

  /**
   *
   */
  function clearFieldError(fieldPath: string): void {
    delete errors.value[fieldPath];
  }

  // ------------------ Submission ------------------
  /**
   *
   */
  async function handleSubmit(
    customOnSubmit?: (values: FormValues) => Promise<void> | void
  ): Promise<void> {
    const submitFn = customOnSubmit || onSubmit;
    if (!submitFn) return;

    Object.keys(values.value || {}).forEach(key => touchedFields.value.add(key));
    const valid = validateForm();
    if (!valid) return;

    isSubmitting.value = true;
    try {
      await submitFn(values.value);
    } finally {
      isSubmitting.value = false;
    }
  }

  // ------------------ Computed ------------------
  const isValid = computed(() => validationSchema.safeParse(values.value).success);
  const isTouched = computed(() => touchedFields.value.size > 0);
  const canSubmit = computed(
    () => (isTouched.value || isDirty.value) && isValid.value && !isSubmitting.value
  );
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  // ------------------ Live Validation ------------------
  watch(
    values,
    () => {
      const result = validationSchema.safeParse(values.value);
      rawErrors.value = result.success ? [] : result.error.issues;

      if (validateOnChange) validateForm();
    },
    { deep: true }
  );

  return {
    // state
    values,
    errors,
    rawErrors,
    touchedFields,
    isSubmitting,
    isDirty,
    isValid,
    isTouched,
    canSubmit,
    hasErrors,

    // validators & field helpers
    validateField,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    defineField,

    // programmatic API
    setFieldValue,
    setFieldError,
    setInitialValues,
    clearFieldError,
    resetForm,
    handleSubmit,

    // utility exports (if needed)
    getNestedValue,
    setNestedValue,
  };
}

// ------------------ Field Props Type ------------------
export type FormFieldProps<T = unknown> = {
  modelValue: T;
  'onUpdate:modelValue': (value: T) => void;
  onBlur: () => void;
  error?: { _errors: string[] };
  touched: boolean;
};

// ------------------ Field Props Type ------------------
export type FormFieldProps<T = unknown> = {
  modelValue: T;
  'onUpdate:modelValue': (value: T) => void;
  onBlur: () => void;
  error?: { _errors: string[] };
  touched: boolean;
};
