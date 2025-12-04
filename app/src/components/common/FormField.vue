<template>
  <div class="field" :class="fieldClass">
    <label :for="name" class="block text-900 font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">{{ $t('common.requiredMarker') }}</span>
    </label>

    <slot
      name="input"
      :modelValue="normalizedValue"
      :updateModelValue="updateModelValue"
      :onBlur="handleBlur"
      :hasError="hasError"
      :errorText="errorText"
      :inputClass="['w-full', { 'p-invalid': hasError }]"
    >
      <!-- Default rendering if no slot provided -->
      <component
        :is="componentType"
        :id="name"
        :model-value="normalizedValue"
        v-bind="componentProps"
        :class="['w-full', { 'p-invalid': hasError }]"
        @update:model-value="updateModelValue"
        @blur="handleBlur"
      />
    </slot>

    <small v-if="errorText" class="p-error">{{ errorText }}</small>
    <small v-else-if="helpText" class="text-500">{{ helpText }}</small>
  </div>
</template>

<script setup lang="ts">
  import DatePicker from 'primevue/datepicker'
  import InputText from 'primevue/inputtext'
  import SelectButton from 'primevue/selectbutton'
  import Textarea from 'primevue/textarea'
  import { computed, isRef } from 'vue'

  interface ErrorObj {
    _errors: string[]
  }

  interface Props {
    name: string
    label: string
    modelValue: any // value or Ref
    error?: ErrorObj | null | undefined | any
    onBlur?: (event?: FocusEvent) => void
    type?:
      | 'text'
      | 'email'
      | 'number'
      | 'password'
      | 'textarea'
      | 'select'
      | 'date'
      | 'selectbutton'
    options?: Array<{ label: string; value: any }>
    helpText?: string
    required?: boolean
    fieldClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    fieldClass: ''
  })

  const emit = defineEmits(['update:modelValue'])

  const normalizedValue = computed(() =>
    isRef(props.modelValue) ? props.modelValue.value : props.modelValue
  )

  function updateModelValue(newValue: any) {
    emit('update:modelValue', newValue)
  }

  function handleBlur(event?: FocusEvent) {
    if (props.onBlur) props.onBlur(event)
  }

  const componentType = computed(() => {
    switch (props.type) {
      case 'textarea':
        return Textarea
      case 'date':
        return DatePicker
      case 'selectbutton':
        return SelectButton
      default:
        return InputText
    }
  })

  const componentProps = computed(() => {
    const base: Record<string, any> = {}
    if (!['textarea', 'date', 'selectbutton'].includes(props.type)) base.type = props.type
    if (props.type === 'date') base.showIcon = true
    return base
  })

  const normalizedError = computed<ErrorObj | null>(() => {
    const e = isRef(props.error) ? props.error.value : props.error
    return e && Array.isArray(e._errors) ? e : null
  })

  const hasError = computed(
    () => !!normalizedError.value && normalizedError.value._errors.length > 0
  )
  const errorText = computed(() => (hasError.value ? normalizedError.value!._errors[0] : ''))
</script>
