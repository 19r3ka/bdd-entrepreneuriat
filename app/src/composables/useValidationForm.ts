import { computed, type Ref, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ZodSchema, z } from 'zod'

// ------------------ Constants ------------------
export const VALIDATION_DUPLICATE = 'validation.duplicate'

export const DUPLICATE_VALIDATION_KEYS: Record<string, string> = {
  slug: 'validation.duplicateSlug',
  'contact.email': 'validation.duplicateEmail'
}

// ------------------ Types ------------------
export type UniqueChecks = Record<string, (value: string) => { id?: string } | undefined>

export interface UseValidationFormOptions<T extends ZodSchema> {
  initialValues: z.infer<T>
  validationSchema: T
  onSubmit?: (values: z.infer<T>) => Promise<void> | void

  validateOnBlur?: boolean
  validateOnChange?: boolean

  translateErrors?: (errors: z.core.$ZodIssue[]) => z.core.$ZodIssue[]
  uniqueChecks?: UniqueChecks

  // Optional translator override (usually from vue-i18n)
  translate?: (key: string) => string
}

interface FieldError {
  _errors: string[]
}

type FormErrors<T> = Partial<Record<string, FieldError>>

// ------------------ Helpers ------------------
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

function mapIssuesToErrors<T>(issues: z.core.$ZodIssue[]): FormErrors<T> {
  const newErrors: FormErrors<T> = {}
  issues.forEach((issue) => {
    const fieldPath = issue.path.join('.')
    if (!newErrors[fieldPath]) newErrors[fieldPath] = { _errors: [] }
    newErrors[fieldPath]!._errors.push(issue.message)
  })
  return newErrors
}

function getDuplicateMessageKey(fieldPath: string, fallbackKey?: string): string {
  if (fallbackKey) return fallbackKey
  if (DUPLICATE_VALIDATION_KEYS[fieldPath]) return DUPLICATE_VALIDATION_KEYS[fieldPath]
  const match = Object.entries(DUPLICATE_VALIDATION_KEYS).find(([key]) =>
    new RegExp(`${key}$`).test(fieldPath)
  )
  if (match) return match[1]
  return VALIDATION_DUPLICATE
}

// safeClone: accepts reactive proxies or plain objects and returns a plain deep clone
function safeClone<T>(value: T): T {
  try {
    const raw = toRaw(value as unknown as Record<string, unknown>) as T
    return structuredClone(raw)
  } catch {
    // custom fallback: deep clone with Date preservation
    return deepCloneWithDates(toRaw(value)) as T
  }
}

function deepCloneWithDates(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (Array.isArray(obj)) return obj.map(deepCloneWithDates)
  const cloned: any = {}
  for (const key in obj) {
    cloned[key] = deepCloneWithDates(obj[key])
  }
  return cloned
}

// ------------------ Uniqueness Check ------------------
function checkUniqueness(
  fieldPath: string,
  values: any,
  uniqueChecks?: UniqueChecks,
  t?: (key: string) => string
): string | null {
  if (!uniqueChecks) return null

  const checker = uniqueChecks[fieldPath]
  if (!checker) return null

  const currentValue = getNestedValue(values, fieldPath)
  if (!currentValue) return null

  const duplicate = checker(String(currentValue))
  if (duplicate && duplicate.id !== values.id) {
    const messageKey = getDuplicateMessageKey(fieldPath)
    return t ? t(messageKey) : messageKey
  }
  return null
}

// ------------------ Main Composable ------------------
export function useValidationForm<T extends ZodSchema>(options: UseValidationFormOptions<T>) {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnBlur = true,
    validateOnChange = false,
    translateErrors,
    uniqueChecks,
    translate
  } = options

  type FormValues = z.infer<T>

  // refs
  const values = ref<FormValues>(safeClone(initialValues)) as Ref<FormValues>
  const errors = ref<FormErrors<FormValues>>({})
  const touchedFields = ref<Set<string>>(new Set())
  const isSubmitting = ref(false)
  const isDirty = ref(false)

  const { t: i18nT } = useI18n()
  const t = translate ?? i18nT

  // canonical baseline for resets and for setInitialValues
  const initialSnapshot = ref<FormValues>(safeClone(initialValues) as FormValues)
  const rawErrors = ref<z.core.$ZodIssue[]>([])

  // ------------------ Validation ------------------
  function validateField(fieldPath: string): boolean {
    const result = validationSchema.safeParse(values.value)

    if (result.success) {
      delete errors.value[fieldPath]
    } else {
      const fieldIssues = result.error.issues.filter((issue) => issue.path.join('.') === fieldPath)
      if (fieldIssues.length > 0) {
        errors.value[fieldPath] = { _errors: fieldIssues.map((i) => i.message) }
      } else {
        delete errors.value[fieldPath]
      }
    }

    const duplicateMessage = checkUniqueness(fieldPath, values.value, uniqueChecks, t)
    if (duplicateMessage) {
      errors.value[fieldPath] = { _errors: [duplicateMessage] }
    }

    return !errors.value[fieldPath]
  }

  function validateForm(): boolean {
    const result = validationSchema.safeParse(values.value)
    if (result.success) {
      errors.value = {}
    } else {
      const issues = translateErrors ? translateErrors(result.error.issues) : result.error.issues
      errors.value = mapIssuesToErrors<FormValues>(issues)
    }

    if (uniqueChecks) {
      Object.keys(uniqueChecks).forEach((path) => {
        const duplicateMessage = checkUniqueness(path, values.value, uniqueChecks, t)
        if (duplicateMessage) {
          errors.value[path] = { _errors: [duplicateMessage] }
        }
      })
    }

    return Object.keys(errors.value).length === 0
  }

  // ------------------ Field Handlers ------------------
  function handleFieldChange(fieldPath: string, value: unknown): void {
    setNestedValue(values.value, fieldPath, value)
    isDirty.value = true
    if (errors.value[fieldPath]) delete errors.value[fieldPath]
    if (validateOnChange) validateField(fieldPath)
  }

  function handleFieldBlur(fieldPath: string): void {
    touchedFields.value.add(fieldPath)
    if (validateOnBlur) validateField(fieldPath)
  }

  function defineField(fieldPath: keyof FormValues | string) {
    const path = String(fieldPath)
    return {
      modelValue: computed(() => getNestedValue(values.value, path)),
      'onUpdate:modelValue': (newValue: unknown) => handleFieldChange(path, newValue),
      onBlur: () => handleFieldBlur(path),
      error: computed(() => errors.value[path]),
      touched: computed(() => touchedFields.value.has(path))
    } as const
  }

  // ------------------ Programmatic Helpers ------------------
  function setInitialValues(newInitial: Partial<FormValues> | FormValues): void {
    // normalize incoming (avoids structuredClone errors when caller passed a reactive/ref/component)
    const incoming = normalizeIncoming(newInitial)

    // base is a safe clone of the current canonical snapshot
    const base = safeClone(initialSnapshot.value) as FormValues

    // shallow merge — nested objects in incoming replace base values
    const merged = { ...(base as object), ...(incoming as object) } as FormValues

    // update canonical snapshot and live form values (use safeClone to ensure plain POJOs)
    initialSnapshot.value = safeClone(merged) as FormValues
    values.value = safeClone(merged) as FormValues

    // clear validation state
    errors.value = {}
    touchedFields.value.clear()
    isDirty.value = false
    isSubmitting.value = false
  }

  // small helper: ensure incoming is a plain serializable object
  function normalizeIncoming(incoming: Partial<FormValues> | FormValues): Partial<FormValues> {
    try {
      return safeClone(incoming) as Partial<FormValues>
    } catch {
      // last resort
      return JSON.parse(JSON.stringify(toRaw(incoming))) as Partial<FormValues>
    }
  }

  function resetForm(): void {
    values.value = safeClone(initialSnapshot.value) as FormValues
    errors.value = {}
    touchedFields.value.clear()
    isDirty.value = false
    isSubmitting.value = false
  }

  function setFieldValue(fieldPath: string, value: unknown): void {
    setNestedValue(values.value, fieldPath, value)
    isDirty.value = true
  }

  function setFieldError(fieldPath: string, error: string): void {
    errors.value[fieldPath] = { _errors: [error] }
  }

  function clearFieldError(fieldPath: string): void {
    delete errors.value[fieldPath]
  }

  // ------------------ Submission ------------------
  async function handleSubmit(
    customOnSubmit?: (values: FormValues) => Promise<void> | void
  ): Promise<void> {
    const submitFn = customOnSubmit || onSubmit
    if (!submitFn) return

    // touch all top-level keys before validate to reveal errors
    Object.keys(values.value || {}).forEach((key) => touchedFields.value.add(key))
    const valid = validateForm()
    if (!valid) return

    isSubmitting.value = true
    try {
      await submitFn(values.value)
    } finally {
      isSubmitting.value = false
    }
  }

  // ------------------ Computed ------------------
  const isValid = computed(() => validationSchema.safeParse(values.value).success)
  const isTouched = computed(() => touchedFields.value.size > 0)
  const canSubmit = computed(
    () => (isTouched.value || isDirty.value) && isValid.value && !isSubmitting.value
  )
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  // ------------------ Live Validation ------------------
  watch(
    values,
    () => {
      const result = validationSchema.safeParse(values.value)
      rawErrors.value = result.success ? [] : result.error.issues

      if (validateOnChange) validateForm()
    },
    { deep: true }
  )

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
    setNestedValue
  }
}

// ------------------ Field Props Type ------------------
export type FormFieldProps<T = any> = {
  modelValue: T
  'onUpdate:modelValue': (value: T) => void
  onBlur: () => void
  error?: { _errors: string[] }
  touched: boolean
}
