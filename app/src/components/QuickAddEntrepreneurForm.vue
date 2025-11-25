<template>
  <div class="card">
    <h2>{{ $t('pages.dashboard.quickAddEntrepreneur') }}</h2>
    <form @submit.prevent="submit">
      <div class="field">
        <label for="firstName">{{ $t('common.firstName') }}</label>
        <InputText id="firstName" v-model="form.firstName" required />
      </div>

      <div class="field">
        <label for="lastName">{{ $t('common.lastName') }}</label>
        <InputText id="lastName" v-model="form.lastName" required />
      </div>

      <div class="field">
        <label for="email">{{ $t('common.email') }}</label>
        <InputText id="email" v-model="form.contact.email" type="email" required />
      </div>

      <Button type="submit" :label="$t('pages.entrepreneurs.add')" class="mt-3" :loading="isSubmitting" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';
import { useSlugLogic } from '@/composables/useSlugLogic';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const store = useEntrepreneurStore();
const toast = useToast();
const { t } = useI18n();

const isSubmitting = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  contact: { email: '' },
  // keep other optional fields empty; store.add should fill defaults
});

// Helper: create a unique slug from name using store.getBySlug
function makeUniqueSlug(baseSlug: string) {
  let candidate = baseSlug;
  let i = 1;
  while (store.getBySlug(candidate)) {
    candidate = `${baseSlug}-${i++}`;
  }
  return candidate;
}

async function submit() {
  if (!form.firstName || !form.lastName || !form.contact.email) return;

  isSubmitting.value = true;
  try {
    // generate slug from name via useSlugLogic (if available) or fallback simple slug
    const { generateSlug } = useSlugLogic(form as any);
    const base = (generateSlug ? generateSlug() : `${form.firstName}-${form.lastName}`).toLowerCase().replace(/\s+/g, '-');
    const uniqueSlug = makeUniqueSlug(base);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      slug: uniqueSlug,
      contact: { email: form.contact.email },
    };

    await store.add(payload);
    toast.add({ severity: 'success', summary: t('pages.entrepreneurs.quickAddSuccess'), life: 3000 });

    // reset
    form.firstName = '';
    form.lastName = '';
    form.contact.email = '';
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : t('errors.unknownError');
    toast.add({ severity: 'error', summary: msg, life: 4000 });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.field { margin-bottom: 1rem; }
</style>
