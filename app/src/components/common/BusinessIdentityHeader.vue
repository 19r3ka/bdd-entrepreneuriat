<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import SplitButton from 'primevue/splitbutton';
import Tag from 'primevue/tag';
import AvatarDisplay from '@/components/common/AvatarDisplay.vue';
import type { Business } from '@/types/business';
import type { Entrepreneur } from '@/types/entrepreneur';

import { BUSINESS_ACTIONS, type BusinessAction } from '@/constants/actions';

// STRICT CONTRACT
interface Props {
  business: Business;
  entrepreneur?: Entrepreneur | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'action', actionType: BusinessAction): void;
}>();

const router = useRouter();
const { t } = useI18n();

// Actions Menu
const actionItems = [
  {
    label: t('common.edit'),
    icon: 'pi pi-pencil',
    command: () => emit('action', BUSINESS_ACTIONS.EDIT),
  },
  { separator: true },
  {
    label: t('common.delete') + ' ' + t('business.label'),
    icon: 'pi pi-trash',
    class: 'text-red-500',
    command: () => emit('action', BUSINESS_ACTIONS.DELETE),
  },
];

// Computed Helpers
const statusSeverity = computed(() => {
  // Assuming you might have a status field, defaulting to success/active for now
  return 'success';
});

const goToOwner = () => {
  if (props.entrepreneur?.id) {
    router.push(`/entrepreneurs/${props.entrepreneur.id}`);
  }
};
</script>

<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 p-4 md:p-6 border-round-xl shadow-1 mb-4 border-1 border-200 dark:border-700"
  >
    <div
      class="flex flex-column lg:flex-row align-items-start lg:align-items-center justify-content-between gap-4"
    >
      <div class="flex align-items-start gap-4">
        <div class="relative">
          <AvatarDisplay
            :src="business.avatar || undefined"
            :label="business.name"
            shape="square"
            class="w-5rem h-5rem md:w-7rem md:h-7rem border-round-xl object-cover border-1 border-200 shadow-1 text-3xl"
          />
          <div class="absolute -bottom-2 -right-2 z-1">
            <Tag :severity="statusSeverity" :value="t('common.active')" class="text-xs" />
          </div>
        </div>

        <div class="flex flex-column gap-2">
          <h1 class="text-2xl md:text-3xl font-bold m-0 text-900">{{ business.name }}</h1>

          <div class="flex flex-wrap align-items-center gap-3 text-sm text-600">
            <Tag
              :value="$t(`businessAreas.${business.primaryBusinessArea}`)"
              class="bg-primary-50 text-primary-700 px-2 py-1 border-round-md text-xs font-medium border-none"
            />
            <!-- Address removed as it is not in the schema -->
          </div>

          <div
            v-if="entrepreneur"
            class="flex align-items-center gap-2 mt-1 pt-2 border-top-1 border-200 cursor-pointer hover:surface-100 transition-colors p-1 border-round"
            @click="goToOwner"
          >
            <span class="text-xs text-500 uppercase font-medium">{{ t('common.owner') }}:</span>
            <div class="flex align-items-center gap-2">
              <AvatarDisplay
                :src="entrepreneur.avatar || undefined"
                :label="entrepreneur.firstName + ' ' + entrepreneur.lastName"
                shape="circle"
                size="normal"
              />
              <span class="text-sm font-bold text-800"
                >{{ entrepreneur.firstName }} {{ entrepreneur.lastName }}</span
              >
              <i class="pi pi-external-link text-xs text-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2 align-self-end lg:align-self-center">
        <SplitButton
          :label="t('common.logIntervention')"
          icon="pi pi-plus"
          :model="actionItems"
          severity="primary"
          @click="emit('action', BUSINESS_ACTIONS.LOG_INTERVENTION)"
        />
      </div>
    </div>
  </div>
</template>
