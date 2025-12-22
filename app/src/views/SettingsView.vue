<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataImportWizard from '@/components/import-export/DataImportWizard.vue';

const showImportWizard = ref(false);
</script>

<template>
  <div class="settings-view p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold m-0">{{ $t('pages.settings.title', 'Settings') }}</h1>
      <p class="text-color-secondary mt-1">
        {{ $t('pages.settings.subtitle', 'Manage application data and preferences') }}
      </p>
    </div>

    <div class="grid">
      <div class="col-12 md:col-6 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-upload text-primary text-xl"></i>
              <span>{{ $t('importExport.importData', 'Import Data') }}</span>
            </div>
          </template>
          <template #subtitle>
            {{
              $t(
                'importExport.importSubtitle',
                'Import businesses from a CSV file using a multi-step wizard.'
              )
            }}
          </template>
          <template #content>
            <p class="m-0 mb-4 pb-2 border-bottom-1 surface-border">
              {{
                $t(
                  'importExport.importDescription',
                  'Upload your CSV file, preview matching records, resolve any duplicates, and confirm the import.'
                )
              }}
            </p>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-start gap-3 p-3 surface-100 border-round">
                <i class="pi pi-info-circle text-info mt-1"></i>
                <div>
                  <div class="font-bold mb-1">
                    {{ $t('importExport.requirementsTitle', 'Import Requirements') }}
                  </div>
                  <ul class="m-0 pl-3 text-sm flex flex-column gap-1">
                    <li>{{ $t('importExport.reqFormat', 'Only .csv files are supported') }}</li>
                    <li>{{ $t('importExport.reqSize', 'Maximum file size: 5MB') }}</li>
                    <li>
                      {{
                        $t(
                          'importExport.reqDuplicates',
                          'Duplicates are detected by business name (case-insensitive)'
                        )
                      }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-content-end">
              <Button
                :label="$t('importExport.startImport', 'Start Import Wizard')"
                icon="pi pi-magic"
                @click="showImportWizard = true"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <DataImportWizard v-model:visible="showImportWizard" />
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
