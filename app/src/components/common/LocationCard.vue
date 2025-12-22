<template>
  <Card class="shadow-2 mb-4" :aria-label="computedTitle">
    <template #title>
      <div class="flex align-items-center gap-2">
        <span class="text-xl font-bold text-900">{{ computedTitle }}</span>
      </div>
    </template>

    <template #content>
      <div class="grid mt-2">
        <!-- Address -->
        <div class="col-12 md:col-6 flex flex-column justify-content-center">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-map-marker text-xl text-500" aria-hidden="true"></i>
            <span class="font-bold text-500">{{ $t('common.address') }}</span>
          </div>
          <p class="m-0 text-lg text-900 line-height-3">
            {{ address || $t('common.notAvailable') }}
          </p>
        </div>

        <!-- Map preview -->
        <div class="col-12 md:col-6">
          <div
            class="w-full h-10rem border-round bg-cover bg-center"
            :style="{ backgroundImage: `url(${mapImage || defaultMap})` }"
            role="img"
            :aria-label="$t('common.mapPreview')"
          ></div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';

const props = withDefaults(
  defineProps<{
    title?: string;
    address?: string;
    mapImage?: string;
  }>(),
  {
    title: undefined,
    address: undefined,
    mapImage: undefined,
  }
);

const { t } = useI18n();

const defaultMap = 'https://via.placeholder.com/400x200?text=Map+Preview';

const computedTitle = computed(() => props.title ?? t('common.location'));
</script>
