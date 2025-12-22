<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="card p-4">
        <h2 class="mb-4">Developer Tools</h2>

        <div class="mb-6">
          <h3>Database Seeder</h3>
          <p class="text-600 mb-4">
            Generate dummy data for testing. Control the exact number of each entity type.
          </p>

          <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-2">
              <label for="entrepreneurCount" class="font-semibold w-10rem">{{
                $t('common.devTools.entrepreneursLabel')
              }}</label>
              <InputNumber
                v-model="entrepreneurCount"
                input-id="entrepreneurCount"
                :min="0"
                :max="100"
                show-buttons
              />
            </div>

            <div class="flex align-items-center gap-2">
              <label for="businessCount" class="font-semibold w-10rem">{{
                $t('common.devTools.businessesLabel')
              }}</label>
              <InputNumber
                v-model="businessCount"
                input-id="businessCount"
                :min="0"
                :max="200"
                show-buttons
              />
              <small class="text-500">(distributed among entrepreneurs)</small>
            </div>

            <div class="flex align-items-center gap-2">
              <label for="supportCount" class="font-semibold w-10rem">{{
                $t('common.devTools.supportsLabel')
              }}</label>
              <InputNumber
                v-model="supportCount"
                input-id="supportCount"
                :min="0"
                :max="200"
                show-buttons
              />
              <small class="text-500">(distributed among businesses)</small>
            </div>

            <div class="flex align-items-center gap-2">
              <label for="quickWinCount" class="font-semibold w-10rem">{{
                $t('common.devTools.quickWinsLabel')
              }}</label>
              <InputNumber
                v-model="quickWinCount"
                input-id="quickWinCount"
                :min="0"
                :max="200"
                show-buttons
              />
              <small class="text-500">(~1.5 per business)</small>
            </div>

            <div class="flex align-items-center gap-2">
              <label for="momentumMetricCount" class="font-semibold w-10rem">{{
                $t('common.devTools.momentumMetricsLabel')
              }}</label>
              <InputNumber
                v-model="momentumMetricCount"
                input-id="momentumMetricCount"
                :min="0"
                :max="200"
                show-buttons
              />
              <small class="text-500">(Outcomes)</small>
            </div>

            <div class="field mt-4 border-top-1 border-gray-200 pt-4">
              <h4 class="m-0 mb-3">Geodata Settings</h4>
              <div class="flex flex-column gap-3">
                <div class="flex align-items-center gap-2">
                  <label for="epicenterLat" class="font-semibold w-10rem">{{
                    $t('common.devTools.epicenterLatLabel')
                  }}</label>
                  <InputNumber
                    v-model="epicenterLat"
                    input-id="epicenterLat"
                    :min="-90"
                    :max="90"
                    :min-fraction-digits="4"
                    :max-fraction-digits="6"
                    mode="decimal"
                    show-buttons
                  />
                </div>
                <div class="flex align-items-center gap-2">
                  <label for="epicenterLng" class="font-semibold w-10rem">{{
                    $t('common.devTools.epicenterLngLabel')
                  }}</label>
                  <InputNumber
                    v-model="epicenterLng"
                    input-id="epicenterLng"
                    :min="-180"
                    :max="180"
                    :min-fraction-digits="4"
                    :max-fraction-digits="6"
                    mode="decimal"
                    show-buttons
                  />
                </div>
                <div class="flex align-items-center gap-2">
                  <label for="seedRadius" class="font-semibold w-10rem">{{
                    $t('common.devTools.radiusLabel')
                  }}</label>
                  <InputNumber
                    v-model="seedRadius"
                    input-id="seedRadius"
                    :min="1"
                    :max="500"
                    show-buttons
                  />
                </div>
              </div>
            </div>

            <div class="flex align-items-center gap-2 mt-2">
              <Checkbox v-model="clearDb" binary input-id="clearDb" />
              <label for="clearDb">{{ $t('common.devTools.clearDbLabel') }}</label>
            </div>

            <div class="mt-2">
              <Button
                label="Seed Database"
                icon="pi pi-database"
                :loading="seeding"
                severity="help"
                @click="handleSeed"
              />
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3>{{ $t('common.devTools.databaseInfoTitle') }}</h3>
          <p>
            <strong>{{ $t('common.devTools.databaseNameLabel') }}:</strong> BusinessTrackerDB
          </p>
          <p>
            <strong>{{ $t('common.devTools.versionLabel') }}:</strong> 4
          </p>
          <p class="text-600 text-sm mt-2">
            <i class="pi pi-info-circle mr-1"></i>
            Businesses are randomly distributed among entrepreneurs (some may have 0, 1, or 2+).
            Supports are randomly distributed among businesses (not all businesses will be
            supported). Quick Wins are generated with linked indicators and may be linked to
            supports. Momentum Metrics are generated for businesses, optionally linked to Quick
            Wins.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { seedDatabase } from '@/services/seeder';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';

const DEFAULT_EPICENTER_LAT = 6.1375;
const DEFAULT_EPICENTER_LNG = 1.2125;
const DEFAULT_BUSINESSES_COUNT = 50;
const DEFAULT_ENTREPRENEURS_COUNT = 25;
const DEFAULT_SUPPORTS_COUNT = 100;
const DEFAULT_QUICK_WINS_COUNT = 150;
const DEFAULT_MOMENTUM_METRICS_COUNT = 200;
const DEFAULT_RADIUS = 15;

const toast = useToast();
const entrepreneurCount = ref(DEFAULT_ENTREPRENEURS_COUNT);
const businessCount = ref(DEFAULT_BUSINESSES_COUNT);
const supportCount = ref(DEFAULT_SUPPORTS_COUNT);
const quickWinCount = ref(DEFAULT_QUICK_WINS_COUNT);
const momentumMetricCount = ref(DEFAULT_MOMENTUM_METRICS_COUNT);
const clearDb = ref(false);
const seeding = ref(false);

// Geodata defaults (Lomé)
const epicenterLat = ref(DEFAULT_EPICENTER_LAT);
const epicenterLng = ref(DEFAULT_EPICENTER_LNG);
const seedRadius = ref(DEFAULT_RADIUS);

const handleSeed = async () => {
  try {
    seeding.value = true;
    const result = await seedDatabase({
      entrepreneurCount: entrepreneurCount.value,
      businessCount: businessCount.value,
      supportCount: supportCount.value,
      quickWinCount: quickWinCount.value,
      momentumMetricCount: momentumMetricCount.value,
      clear: clearDb.value,
      epicenter: {
        latitude: epicenterLat.value,
        longitude: epicenterLng.value,
      },
      radius: seedRadius.value,
    });

    let detail = `Generated ${result.entrepreneurs.length} entrepreneurs, ${result.businesses.length} businesses, ${result.supports.length} supports, ${result.quickWins.length} quick wins, and ${result.momentumMetrics?.length || 0} momentum metrics.`;
    if (result.errors && result.errors.length > 0) {
      detail += ` (${result.errors.length} validation errors - check console)`;
      console.warn('Seeding validation errors:', result.errors);
    }

    toast.add({
      severity: result.errors ? 'warn' : 'success',
      summary: result.errors ? 'Seeding Complete with Warnings' : 'Seeding Complete',
      detail,
      life: 5000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Seeding Failed',
      detail: 'An error occurred while seeding the database.',
      life: 5000,
    });
  } finally {
    seeding.value = false;
  }
};
</script>
