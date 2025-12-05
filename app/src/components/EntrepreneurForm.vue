<template>
  <div class="grid">
    <Toast />
    <div class="col-12">
      <div class="card">
        <h1 class="m-0">
          {{ isEdit ? $t('pages.entrepreneurs.edit') : $t('pages.entrepreneurs.new') }}
        </h1>
        <p class="text-600 mb-4">{{ $t('forms.entrepreneur.title') }}</p>

        <BaseForm
          ref="formRef"
          v-slot="{ defineField, canSubmit, isSubmitting }"
          :schema="schema"
          :initial-values="initialValues"
          :on-submit="handleSubmit"
          :unique-checks="uniqueChecks as any"
        >
          <!-- Personal Information -->
          <Section :title="$t('common.personalInformation')">
            <div class="formgrid grid">
              <FormField
                name="firstName"
                :label="$t('common.firstName')"
                v-bind="defineField('firstName')"
                required
                field-class="col-12 md:col-6"
              />
              <FormField
                name="lastName"
                :label="$t('common.lastName')"
                v-bind="defineField('lastName')"
                required
                field-class="col-12 md:col-6"
              />

              <FormField
                name="gender"
                :label="$t('common.gender')"
                v-bind="defineField('gender')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <Select
                    :model-value="modelValue"
                    :options="genderOptions"
                    option-label="label"
                    option-value="value"
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>

              <FormField
                name="dateOfBirth"
                :label="$t('common.dateOfBirth')"
                v-bind="defineField('dateOfBirth')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <DatePicker
                    :model-value="modelValue"
                    :max-date="maxDate"
                    show-icon
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>
            </div>

            <div class="formgrid grid">
              <FormField
                name="avatar"
                :label="$t('common.avatar')"
                v-bind="defineField('avatar')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, hasError, errorText }">
                  <AvatarUpload
                    :model-value="modelValue"
                    :label="$t('common.avatar')"
                    :alt-text="`${defineField('firstName').modelValue.value} ${defineField('lastName').modelValue.value}`"
                    :has-error="hasError"
                    :error-message="errorText"
                    @update:model-value="updateModelValue"
                  />
                </template>
              </FormField>
              <FormField
                name="slug"
                :label="$t('common.slug')"
                v-bind="defineField('slug')"
                required
                field-class="col-12 md:col-6"
                @update:model-value="markSlugAsManual"
              />
            </div>

            <FormField
              name="bio"
              :label="$t('common.bio')"
              v-bind="defineField('bio')"
              type="textarea"
              :maxlength="120"
              field-class="col-12"
            />
          </Section>

          <!-- Contact Information -->
          <Section :title="$t('common.contactInformation')">
            <ContactInfoFields :define-field="defineField" required />

            <!-- Geolocation Map with Address -->
            <Section :title="$t('common.location')" class="mt-4">
              <p class="text-sm text-600 mb-3">{{ $t('forms.entrepreneur.locationHelp') }}</p>
              <InteractiveMap
                :locations="mapLocations"
                :is-editable="true"
                @update:location="handleLocationUpdate"
                @update:address="handleAddressUpdate"
              />
            </Section>
          </Section>

          <!-- Social Media -->
          <Section :title="$t('common.socialDigitalPresence')">
            <SocialMediaFields
              :define-field="defineField"
              show-personal-website
            />
          </Section>

          <!-- Submit -->
          <div class="flex justify-content-between align-items-center mt-4">
            <small class="text-500">{{ $t('common.required') }}</small>
            <Button
              type="submit"
              :label="isEdit ? $t('common.update') : $t('common.submit')"
              class="p-3"
              :disabled="!canSubmit"
              :loading="isSubmitting"
            />
          </div>
        </BaseForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from 'primevue/button'
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AvatarUpload from '@/components/common/AvatarUpload.vue'
  import BaseForm from '@/components/common/BaseForm.vue'
  import FormField from '@/components/common/FormField.vue'
  import Section from '@/components/common/FormSection.vue'
  import { useSlugLogic } from '@/composables/useSlugLogic'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore'
  import type { Entrepreneur } from '@/types/entrepreneur'
  import type { ZodSchema } from 'zod'
  import Select from 'primevue/select' // Import Select
  import DatePicker from 'primevue/datepicker' // Import DatePicker
  import InteractiveMap from '@/components/InteractiveMap.vue' // Import InteractiveMap
  import ContactInfoFields from '@/components/common/ContactInfoFields.vue'
  import SocialMediaFields from '@/components/common/SocialMediaFields.vue'


  const props = defineProps<{
    isEdit: boolean
    initialValues: Entrepreneur
    schema: ZodSchema
    uniqueChecks?: Record<string, (value: any) => Promise<boolean>>
  }>()

  const router = useRouter()
  const store = useEntrepreneurStore()
  const toast = useToast()
  const { handleApiError } = useErrorHandler()

  // Access exposed form for slug generation
  const formRef = ref<any>(null)

  const maxDate = new Date() // For DatePicker max date

  const mapLocations = computed(() => {
    if (props.initialValues.location?.latitude && props.initialValues.location?.longitude) {
      return [
        {
          lat: props.initialValues.location.latitude,
          lng: props.initialValues.location.longitude,
          name:
            (props.initialValues.firstName && props.initialValues.lastName)
              ? `${props.initialValues.firstName} ${props.initialValues.lastName}`
              : 'Entrepreneur Location'
        }
      ]
    }
    return []
  })

  const genderOptions = [
    { label: 'Woman', value: 'Woman' },
    { label: 'Man', value: 'Man' },
    { label: 'Non-binary', value: 'Non-binary' },
    { label: 'Prefer not to say', value: 'Prefer not to say' },
    { label: 'Not specified', value: '' } // Add an option for empty/not specified
  ]

  // markSlugAsManual comes from slug logic (function), not a ref
  const markSlugAsManual = () => {
    if (formRef.value?.values) {
      const { markSlugAsManual: markManual } = useSlugLogic(formRef.value.values)
      markManual()
    }
  }

  // Handle location update from map
  const handleLocationUpdate = (coords: { lat: number; lng: number }) => {
    if (formRef.value) {
      formRef.value.setFieldValue('location.latitude', coords.lat)
      formRef.value.setFieldValue('location.longitude', coords.lng)
    }
  }

  // Handle address update from map (reverse geocoding)
  const handleAddressUpdate = (address: string) => {
    if (formRef.value) {
      formRef.value.setFieldValue('address', address)
    }
  }

  /**
   *
   */
  async function handleSubmit(data: any) {
    try {
      if (props.isEdit) {
        await store.update(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Entrepreneur updated successfully',
          life: 3000
        })
      } else {
        await store.add(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Entrepreneur created successfully',
          life: 3000
        })
      }
      formRef.value?.resetForm()
      router.push('/entrepreneurs')
    } catch (error) {
      handleApiError(error as any, `Failed to ${props.isEdit ? 'update' : 'create'} entrepreneur`)
    }
  }
</script>
