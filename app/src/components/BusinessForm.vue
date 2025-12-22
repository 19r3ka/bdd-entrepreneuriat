<template>
  <div class="grid">
    <Toast />
    <div class="col-12">
      <div class="card">
        <h1 class="m-0">{{ isEdit ? $t('pages.businesses.edit') : $t('pages.businesses.new') }}</h1>

        <BaseForm
          ref="formRef"
          v-slot="{ defineField, canSubmit, isSubmitting, rawErrors, values, setFieldValue }"
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
                    :model-value="modelValue as string"
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
                    option-value="code"
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
                    option-value="code"
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
                    :model-value="modelValue as string | File | null | undefined"
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

          <!-- Location -->
          <LocationFormSection
            prefix="location"
            :values="values as Record<string, any>"
            :set-field-value="setFieldValue"
            :define-field="defineField"
          />

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
                    :model-value="
                      modelValue ? new Date(modelValue as string | number | Date) : null
                    "
                    :max-date="maxDate"
                    show-icon
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="
                      val => updateModelValue(val ? (val as Date).toISOString() : null)
                    "
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
                    :model-value="
                      modelValue ? new Date(modelValue as string | number | Date) : null
                    "
                    :max-date="maxDate"
                    show-icon
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="
                      val => updateModelValue(val ? (val as Date).toISOString() : null)
                    "
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
                    :model-value="
                      modelValue ? new Date(modelValue as string | number | Date) : null
                    "
                    :max-date="maxDate"
                    show-icon
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="
                      val => updateModelValue(val ? (val as Date).toISOString() : null)
                    "
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
            <SocialMediaFields
              :define-field="defineField"
              show-facebook
              show-instagram
              :show-website="true"
            />
          </Section>

          <!-- Submit -->
          <div class="flex justify-content-between align-items-center mt-4">
            <small class="text-500"
              >{{ $t('common.requiredMarker') }} {{ $t('common.required') }}</small
            >
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
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Message from 'primevue/message';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import type { ZodSchema } from 'zod';
import { computed, ref } from 'vue';

const formRef = ref();

import AvatarUpload from '@/components/common/AvatarUpload.vue';
import BaseForm from '@/components/common/BaseForm.vue';
import EntrepreneurAutoComplete from '@/components/common/EntrepreneurAutoComplete.vue';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import type { UniqueChecks } from '@/composables/useValidationForm';
import { useBusinessAreaOptions } from '@/composables/useBusinessAreaOptions';
import { useBusinessStore } from '@/stores/useBusinessStore';
import type { Business } from '@/types/business';
import ContactInfoFields from '@/components/common/ContactInfoFields.vue';
import SocialMediaFields from '@/components/common/SocialMediaFields.vue';
import LocationFormSection from '@/components/common/LocationFormSection.vue';

const props = defineProps<{
  isEdit: boolean;
  initialValues: Business;
  schema: ZodSchema;
  uniqueChecks?: UniqueChecks;
}>();

const router = useRouter();
const businessStore = useBusinessStore();
const toast = useToast();
const { handleApiError } = useErrorHandler();
const { getBusinessAreaOptions } = useBusinessAreaOptions();
const businessAreaOptions = computed(() => getBusinessAreaOptions());

const maxDate = new Date();

/**
 *
 */

/**
 *
 */
async function handleSubmit(formData: unknown) {
  const data = formData as Business;
  if (data.socialMedia && !data.socialMedia.linkedin) {
    data.socialMedia.linkedin = '';
  }
  try {
    if (props.isEdit) {
      await businessStore.update(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Business updated successfully',
        life: 3000,
      });
    } else {
      await businessStore.add(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Business created successfully',
        life: 3000,
      });
    }
    router.push('/businesses');
  } catch (error) {
    handleApiError(error as AppError, `Failed to ${props.isEdit ? 'update' : 'create'} business`);
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
