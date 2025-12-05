<template>
  <div class="grid">
    <Toast />
    <div class="col-12">
      <div class="card">
        <h1 class="m-0">{{ isEdit ? $t('pages.businesses.edit') : $t('pages.businesses.new') }}</h1>

        <BaseForm
          v-slot="{
            defineField,
            canSubmit,
            isSubmitting,
            rawErrors,
            setFieldValue
          }"
          :schema="schema"
          :initial-values="initialValues"
          :on-submit="handleSubmit"
          :unique-checks="uniqueChecks"
          validate-on-blur
        >
          <Message
            v-if="Array.isArray(rawErrors.value) && rawErrors.value.length > 0"
            severity="error"
            class="mb-3"
            :closable="false"
          >
            <template #icon>
              <i class="pi pi-exclamation-triangle"></i>
            </template>
            <strong>{{ $t('common.validationIssues') }}:</strong>
            <ul class="mt-2 ml-3">
              <li
                v-for="issue in rawErrors.value.filter(
                  (e): e is import('zod').ZodIssue =>
                    typeof e === 'object' && e !== null && 'path' in e
                )"
                :key="issue.path.join('.')"
              >
                <span class="font-bold">{{ issue.path.join('.') }}</span> — {{ issue.message }}
              </li>
            </ul>
          </Message>

          <!-- General Information -->
          <Section :title="$t('common.generalInformation')">
            <div class="formgrid grid">
              <FormField
                name="name"
                :label="$t('common.name')"
                v-bind="defineField('name')"
                required
                field-class="col-12 md:col-6"
              />

              <FormField
                name="entrepreneurId"
                :label="$t('common.entrepreneurId')"
                v-bind="defineField('entrepreneurId')"
                required
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <EntrepreneurAutoComplete
                    :model-value="modelValue"
                    :placeholder="$t('placeholders.search')"
                    :class="{ 'p-invalid': hasError }"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>

              <FormField
                name="primaryBusinessArea"
                :label="$t('common.primaryBusinessArea')"
                v-bind="defineField('primaryBusinessArea')"
                required
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <Select
                    :model-value="modelValue"
                    :options="businessAreaOptions"
                    option-label="name"
                    option-value="name"
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>

              <FormField
                name="secondaryBusinessArea"
                :label="$t('common.secondaryBusinessArea')"
                v-bind="defineField('secondaryBusinessArea')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, onBlur, hasError }">
                  <Select
                    :model-value="modelValue"
                    :options="businessAreaOptions"
                    option-label="name"
                    option-value="name"
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="updateModelValue"
                    @blur="onBlur && onBlur()"
                  />
                </template>
              </FormField>

              <FormField
                name="avatar"
                :label="$t('common.logo')"
                v-bind="defineField('avatar')"
                field-class="col-12 md:col-6"
              >
                <template #input="{ modelValue, updateModelValue, hasError, errorText }">
                  <AvatarUpload
                    :model-value="modelValue"
                    :label="$t('common.logo')"
                    alt-text="Logo"
                    :has-error="hasError"
                    :error-message="errorText"
                    @update:model-value="updateModelValue"
                  />
                </template>
              </FormField>
            </div>
          </Section>

          <!-- Geolocation -->
          <Section :title="$t('common.location')">
            <InteractiveMap
              :locations="mapLocations"
              :is-editable="true"
              height="350px"
              @update:location="
                (newCoords) => {
                  setFieldValue('location.latitude', newCoords.lat)
                  setFieldValue('location.longitude', newCoords.lng)
                }
              "
              @update:address="
                (address) => {
                  setFieldValue('location.address', address)
                }
              "
            />
          </Section>

          <!-- Business Information -->
          <Section :title="$t('common.businessInformation')">
            <div class="formgrid grid">
              <FormField
                name="registrationNumber"
                :label="$t('common.registrationNumber')"
                v-bind="defineField('registrationNumber')"
                field-class="col-12 md:col-6"
              />
              <FormField
                name="registrationDate"
                :label="$t('common.registrationDate')"
                v-bind="defineField('registrationDate')"
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
              <FormField
                name="activityStartDate"
                :label="$t('common.activityStartDate')"
                v-bind="defineField('activityStartDate')"
                required
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
              <FormField
                name="supportStartDate"
                :label="$t('common.supportStartDate')"
                v-bind="defineField('supportStartDate')"
                required
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
          </Section>

          <!-- Contact Information -->
          <Section :title="$t('common.contactInformation')">
            <ContactInfoFields :define-field="defineField" />
          </Section>

          <!-- Online Presence -->
          <Section :title="$t('common.onlinePresenceAndSocialMedia')">
            <div class="formgrid grid">
              <!-- Website / Online presence -->
              <FormField
                name="onlinePresence"
                :label="$t('common.onlinePresence')"
                v-bind="defineField('onlinePresence')"
                field-class="col-12 md:col-6"
              />
            </div>
            <SocialMediaFields
              :define-field="defineField"
              show-facebook
              show-instagram
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
  import DatePicker from 'primevue/datepicker'
  import Message from 'primevue/message'
  import Select from 'primevue/select'
  import Toast from 'primevue/toast'
  import { useToast } from 'primevue/usetoast'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import type { ZodSchema } from 'zod'
  import { computed } from 'vue'

  const { t } = useI18n()

  import AvatarUpload from '@/components/common/AvatarUpload.vue'
  import BaseForm from '@/components/common/BaseForm.vue'
  import EntrepreneurAutoComplete from '@/components/common/EntrepreneurAutoComplete.vue'
  import FormField from '@/components/common/FormField.vue'
  import Section from '@/components/common/FormSection.vue'
  import { useErrorHandler, type AppError } from '@/composables/useErrorHandler'
  import type { UniqueChecks } from '@/composables/useValidationForm'
  import { businessAreaOptions } from '@/constants/businessAreas'
  import { useBusinessStore } from '@/stores/useBusinessStore'
  import type { Business } from '@/types/business'
  import InteractiveMap from '@/components/InteractiveMap.vue'
  import ContactInfoFields from '@/components/common/ContactInfoFields.vue'
  import SocialMediaFields from '@/components/common/SocialMediaFields.vue'

  const props = defineProps<{
    isEdit: boolean
    initialValues: Business
    schema: ZodSchema
    uniqueChecks?: UniqueChecks
  }>()

  const router = useRouter()
  const businessStore = useBusinessStore()
  const toast = useToast()
  const { handleApiError } = useErrorHandler()

  const maxDate = new Date()

  const mapLocations = computed(() => {
    if (props.initialValues.location?.latitude && props.initialValues.location?.longitude) {
      return [
        {
          lat: props.initialValues.location.latitude,
          lng: props.initialValues.location.longitude,
          name: props.initialValues.name || t('common.businessLocation')
        }
      ]
    }
    return []
  })

  /**
   *
   */
  async function handleSubmit(data: any) {
    if (!data.socialMedia.linkedin) {
      data.socialMedia.linkedin = null
    }
    try {
      if (props.isEdit) {
        await businessStore.update(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Business updated successfully',
          life: 3000
        })
      } else {
        await businessStore.add(data)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Business created successfully',
          life: 3000
        })
      }
      router.push('/businesses')
    } catch (error) {
      handleApiError(error as AppError, `Failed to ${props.isEdit ? 'update' : 'create'} business`)
    }
  }
</script>

<style scoped>
  /* Ensure DatePicker fills available width */
  .p-datepicker {
    width: 100% !important;
  }
  .p-datepicker .p-inputtext {
    width: 100% !important;
  }
</style>
