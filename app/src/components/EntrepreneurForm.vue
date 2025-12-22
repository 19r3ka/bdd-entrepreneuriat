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
          v-slot="{ defineField, canSubmit, isSubmitting, values, setFieldValue }"
          :schema="schema"
          :initial-values="initialValues"
          :on-submit="handleSubmit"
          :unique-checks="uniqueChecks"
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
                    :model-value="
                      modelValue && typeof modelValue === 'string' && modelValue !== '{}'
                        ? new Date(modelValue)
                        : null
                    "
                    :max-date="maxDate"
                    show-icon
                    :class="['w-full', { 'p-invalid': hasError }]"
                    @update:model-value="
                      val =>
                        updateModelValue(
                          val && typeof val === 'object' && val.constructor === Date
                            ? val.toISOString()
                            : null
                        )
                    "
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
                    :model-value="modelValue as string | File | null | undefined"
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

            <!-- Address Information -->
            <LocationFormSection
              prefix="address"
              :values="values"
              :set-field-value="setFieldValue"
              :define-field="defineField"
              :help-text="$t('forms.entrepreneur.locationHelp')"
            />
          </Section>

          <!-- Social Media -->
          <Section :title="$t('common.socialDigitalPresence')">
            <SocialMediaFields :define-field="defineField" :show-website="true" />
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
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AvatarUpload from '@/components/common/AvatarUpload.vue';
import Select from 'primevue/select'; // Import Select
import DatePicker from 'primevue/datepicker'; // Import DatePicker
import ContactInfoFields from '@/components/common/ContactInfoFields.vue';
import SocialMediaFields from '@/components/common/SocialMediaFields.vue';
import LocationFormSection from '@/components/common/LocationFormSection.vue';
import { useErrorHandler, type AppError } from '@/composables/useErrorHandler';
import { useGenderOptions } from '@/composables/useGenderOptions';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useSlugLogic } from '@/composables/useSlugLogic';
import BaseForm from '@/components/common/BaseForm.vue';
import FormField from '@/components/common/FormField.vue';
import Section from '@/components/common/FormSection.vue';

import type { UniqueChecks } from '@/composables/useValidationForm';
import { type Entrepreneur } from '@/types/entrepreneur'; // Import Entrepreneur type
import type { ZodSchema, z } from 'zod'; // Keep z as type for ZodSchema

const props = defineProps<{
  isEdit: boolean;
  initialValues: Entrepreneur;
  schema: ZodSchema<Entrepreneur>;
  uniqueChecks?: UniqueChecks;
}>();

const router = useRouter();
const store = useEntrepreneurStore();

const toast = useToast();
const { handleApiError } = useErrorHandler();

// Access exposed form for slug generation
const formRef = ref<{
  resetForm: () => void;
  setFieldValue: (field: string, value: unknown) => void;
  values: z.infer<typeof props.schema>;
} | null>(null);

const maxDate = new Date(); // For DatePicker max date

const { getGenderOptions } = useGenderOptions();
const genderOptions = computed(() => {
  return getGenderOptions();
});

// markSlugAsManual comes from slug logic (function), not a ref
const markSlugAsManual = () => {
  if (formRef.value?.values) {
    const { markSlugAsManual: markManual } = useSlugLogic(
      formRef.value.values as { firstName: string; lastName: string; slug: string }
    );
    markManual();
  }
};

/**
 * Handles form submission
 */
async function handleSubmit(data: z.infer<typeof props.schema>) {
  try {
    if (props.isEdit) {
      await store.update(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Entrepreneur updated successfully',
        life: 3000,
      });
    } else {
      await store.add(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Entrepreneur created successfully',
        life: 3000,
      });
    }
    formRef.value?.resetForm();
    router.push('/entrepreneurs');
  } catch (error) {
    handleApiError(
      error as AppError,
      `Failed to ${props.isEdit ? 'update' : 'create'} entrepreneur`
    );
  }
}
</script>
