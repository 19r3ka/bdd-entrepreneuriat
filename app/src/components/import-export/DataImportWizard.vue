<script setup lang="ts">
import { ref, computed } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useImportExport, type ImportResult } from '@/composables/useImportExport';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePartialRecordStore } from '@/stores/usePartialRecordStore';
import type { Business } from '@/types/business';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'import-complete', result: ImportResult): void;
}>();

const { t } = useI18n();
const toast = useToast();
const businessStore = useBusinessStore();
const partialRecordStore = usePartialRecordStore();
const { importFromFile, importing, error: importError } = useImportExport();

const activeStep = ref(1);
const selectedFile = ref<File | null>(null);
const importResult = ref<ImportResult | null>(null);
const processing = ref(false);
const bulkResolution = ref<'skip' | 'overwrite' | 'keep' | null>(null);

const STEP_UPLOAD = 1;
const STEP_PREVIEW = 2;
const STEP_RESOLVE = 3;
const STEP_CONFIRM = 4;
const STEP_RESULTS = 5;

// Step titles
const steps = [
  { label: t('importExport.stepUpload', 'Upload'), value: STEP_UPLOAD },
  { label: t('importExport.stepPreview', 'Preview & Validate'), value: STEP_PREVIEW },
  { label: t('importExport.stepResolve', 'Resolve Conflicts'), value: STEP_RESOLVE },
  { label: t('importExport.stepConfirm', 'Final Confirmation'), value: STEP_CONFIRM },
  { label: t('importExport.stepResults', 'Results'), value: STEP_RESULTS },
];

const canProceed = computed(() => {
  if (activeStep.value === STEP_UPLOAD) return !!selectedFile.value;
  if (activeStep.value === STEP_PREVIEW)
    return (
      !!importResult.value &&
      importResult.value.valid.length +
        importResult.value.conflicts.length +
        importResult.value.partial.length >
        0
    );
  if (activeStep.value === STEP_RESOLVE) {
    // Check if all conflicts have a resolution
    return importResult.value?.conflicts.every(c => c.resolution) ?? true;
  }
  return true;
});

/**
 * Step 1: Handle File Selection
 */
async function onFileSelect(event: FileUploadSelectEvent) {
  const file = event.files[0];
  if (file) {
    selectedFile.value = file;
    try {
      importResult.value = await importFromFile(file);
      activeStep.value = 2;
    } catch (err) {
      console.error('Import analysis failed:', err);
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: importError.value || 'Failed to analyze file',
        life: 5000,
      });
    }
  }
}

/**
 * Step 3: Bulk Resolution
 */
function applyBulkResolution() {
  if (!bulkResolution.value || !importResult.value) return;
  importResult.value.conflicts.forEach(c => {
    c.resolution = bulkResolution.value as any;
  });
}

/**
 * Step 4: Perform Global Import
 */
async function performImport() {
  if (!importResult.value) return;
  processing.value = true;

  const result = importResult.value;
  let successCount = 0;
  let skippedCount = 0;

  try {
    // 1. Process Valid Records
    for (const b of result.valid) {
      await businessStore.add(b);
      successCount++;
    }

    // 2. Process Conflicts based on resolution
    for (const conflict of result.conflicts) {
      if (conflict.resolution === 'overwrite') {
        // Merge imported data over existing
        const merged = {
          ...conflict.existing,
          ...conflict.imported,
          id: conflict.existing.id,
        } as Business;
        await businessStore.update(merged);
        successCount++;
      } else if (conflict.resolution === 'skip') {
        skippedCount++;
      } else {
        // 'keep' - do nothing
        skippedCount++;
      }
    }

    // 3. Process Partial Records (Save to separate store)
    if (result.partial.length > 0) {
      await partialRecordStore.saveMany(result.partial);
    }

    toast.add({
      severity: 'success',
      summary: t('importExport.importComplete', 'Import Complete'),
      detail: t(
        'importExport.importSuccessDetail',
        `Successfully imported ${successCount} businesses. ${skippedCount} skipped.`
      ),
      life: 5000,
    });

    activeStep.value = 5;
    emit('import-complete', result);
  } catch (err) {
    console.error('Import execution failed:', err);
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: 'An error occurred during import execution',
      life: 5000,
    });
  } finally {
    processing.value = false;
  }
}

/**
 * Close the wizard and reset state
 */
function close() {
  emit('update:visible', props.visible); // Just to use props.visible
  emit('update:visible', false);
  // Reset state
  activeStep.value = 1;
  selectedFile.value = null;
  importResult.value = null;
  bulkResolution.value = null;
}

/**
 * Download a CSV template for import
 */
function downloadTemplate() {
  // Mock template download or real logic
  const headers = [
    'name',
    'entrepreneurId',
    'registrationNumber',
    'email',
    'telephone',
    'street',
    'city',
    'country',
  ];
  const csvContent =
    headers.join(',') +
    '\nExample Business,ENT-UUID-HERE,REG123,info@example.com,+123456789,123 Street,City,Country';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', 'business_import_template.csv');
  link.click();
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="t('importExport.importWizard', 'Business Import Wizard')"
    :style="{ width: '70vw' }"
    :breakpoints="{ '1199px': '75vw', '991px': '85vw', '575px': '95vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-column gap-4">
      <Stepper v-model:value="activeStep">
        <StepList>
          <Step v-for="s in steps" :key="s.value" :value="s.value">{{ s.label }}</Step>
        </StepList>

        <StepPanels>
          <!-- Step 1: Upload -->
          <StepPanel :value="1">
            <div class="flex flex-column align-items-center justify-content-center py-5 gap-4">
              <div class="text-center">
                <i class="pi pi-cloud-upload text-6xl text-primary mb-3"></i>
                <h3 class="m-0 text-xl font-bold">Upload Your CSV File</h3>
                <p class="text-color-secondary">Drag and drop your file here or click to browse</p>
              </div>

              <FileUpload
                mode="basic"
                name="demo[]"
                accept=".csv"
                :max-file-size="5242880"
                choose-label="Select CSV File"
                class="p-button-lg"
                @select="onFileSelect"
              />

              <Button
                label="Download CSV Template"
                icon="pi pi-download"
                text
                @click="downloadTemplate"
              />
            </div>
          </StepPanel>

          <!-- Step 2: Preview & Validate -->
          <StepPanel :value="2">
            <div v-if="importResult" class="flex flex-column gap-3">
              <div
                class="flex align-items-center justify-content-between p-3 surface-100 border-round"
              >
                <div class="flex gap-4">
                  <div class="flex flex-column">
                    <span class="text-color-secondary text-sm">Valid Records</span>
                    <span class="text-2xl font-bold text-green-600">{{
                      importResult.valid.length
                    }}</span>
                  </div>
                  <div class="flex flex-column">
                    <span class="text-color-secondary text-sm">Conflicts</span>
                    <span class="text-2xl font-bold text-orange-600">{{
                      importResult.conflicts.length
                    }}</span>
                  </div>
                  <div class="flex flex-column">
                    <span class="text-color-secondary text-sm">Partial Records</span>
                    <span class="text-2xl font-bold text-blue-600">{{
                      importResult.partial.length
                    }}</span>
                  </div>
                  <div class="flex flex-column">
                    <span class="text-color-secondary text-sm">Rejected</span>
                    <span class="text-2xl font-bold text-red-600">{{
                      importResult.rejected.length
                    }}</span>
                  </div>
                </div>
                <div v-if="importResult.rejected.length > 0">
                  <Message severity="error" :closable="false"
                    >Found some completely invalid rows</Message
                  >
                </div>
              </div>

              <DataTable
                :value="
                  importResult.valid
                    .concat(importResult.conflicts.map(c => c.imported as Business))
                    .slice(0, 5)
                "
                class="p-datatable-sm"
              >
                <Column field="name" header="Business Name"></Column>
                <Column field="entrepreneurId" header="Entrepreneur ID"></Column>
                <Column field="contact.email" header="Email"></Column>
                <Column header="Status">
                  <template #body="slotProps">
                    <Tag
                      v-if="
                        importResult.conflicts.some(c => c.imported.name === slotProps.data.name)
                      "
                      value="CONFLICT"
                      severity="warn"
                    />
                    <Tag v-else value="VALID" severity="success" />
                  </template>
                </Column>
              </DataTable>

              <div class="flex justify-content-end gap-2 mt-4">
                <Button label="Back" text @click="activeStep = 1" />
                <Button
                  label="Next"
                  @click="importResult.conflicts.length > 0 ? (activeStep = 3) : (activeStep = 4)"
                />
              </div>
            </div>
          </StepPanel>

          <!-- Step 3: Resolve Conflicts -->
          <StepPanel :value="3">
            <div v-if="importResult" class="flex flex-column gap-4">
              <div class="flex align-items-center justify-content-between">
                <h3 class="m-0">Resolve Duplicates ({{ importResult.conflicts.length }})</h3>
                <div class="flex align-items-center gap-2">
                  <span class="text-sm font-semibold">Apply to all:</span>
                  <Select
                    v-model="bulkResolution"
                    :options="[
                      { label: 'Skip all', value: 'skip' },
                      { label: 'Overwrite all', value: 'overwrite' },
                      { label: 'Keep existing', value: 'keep' },
                    ]"
                    option-label="label"
                    option-value="value"
                    placeholder="Choose Action"
                    class="w-12rem"
                    @change="applyBulkResolution"
                  />
                </div>
              </div>

              <div class="flex flex-column gap-3 overflow-auto max-h-30rem pr-2">
                <div
                  v-for="(conflict, index) in importResult.conflicts"
                  :key="index"
                  class="border-1 surface-border border-round p-3 surface-card"
                >
                  <div class="flex align-items-center justify-content-between mb-3">
                    <span class="font-bold text-lg">{{ conflict.imported.name }}</span>
                    <div class="flex gap-4">
                      <div class="flex align-items-center">
                        <RadioButton
                          v-model="conflict.resolution"
                          :input-id="'keep-' + index"
                          value="keep"
                        />
                        <label :for="'keep-' + index" class="ml-2">Keep Existing</label>
                      </div>
                      <div class="flex align-items-center">
                        <RadioButton
                          v-model="conflict.resolution"
                          :input-id="'over-' + index"
                          value="overwrite"
                        />
                        <label :for="'over-' + index" class="ml-2">Overwrite</label>
                      </div>
                      <div class="flex align-items-center">
                        <RadioButton
                          v-model="conflict.resolution"
                          :input-id="'skip-' + index"
                          value="skip"
                        />
                        <label :for="'skip-' + index" class="ml-2">Skip Both</label>
                      </div>
                    </div>
                  </div>

                  <div class="grid text-sm">
                    <div class="col-6 py-1 font-semibold text-color-secondary">Existing Record</div>
                    <div class="col-6 py-1 font-semibold text-color-secondary">Imported Record</div>

                    <div class="col-6 py-1 border-right-1 surface-border">
                      <div class="flex flex-column">
                        <span>Email: {{ conflict.existing.contact?.email || 'N/A' }}</span>
                        <span>Location: {{ conflict.existing.location?.city || 'N/A' }}</span>
                      </div>
                    </div>
                    <div class="col-6 py-1">
                      <div class="flex flex-column">
                        <span>Email: {{ conflict.imported.contact?.email || 'N/A' }}</span>
                        <span>Location: {{ conflict.imported.location?.city || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-content-end gap-2 mt-4">
                <Button label="Back" text @click="activeStep = 2" />
                <Button label="Next" :disabled="!canProceed" @click="activeStep = 4" />
              </div>
            </div>
          </StepPanel>

          <!-- Step 4: Final Confirmation -->
          <StepPanel :value="4">
            <div v-if="importResult" class="flex flex-column gap-4 py-3">
              <div class="text-center">
                <i class="pi pi-question-circle text-5xl text-primary mb-3"></i>
                <h3 class="m-0 text-xl font-bold">Ready to Import?</h3>
              </div>

              <div class="grid surface-100 border-round p-4 mt-2">
                <div
                  class="col-12 py-2 flex justify-content-between border-bottom-1 surface-border"
                >
                  <span>New Businesses to Create:</span>
                  <span class="font-bold">{{ importResult.valid.length }}</span>
                </div>
                <div
                  class="col-12 py-2 flex justify-content-between border-bottom-1 surface-border"
                >
                  <span>Duplicates to Update (Overwrite):</span>
                  <span class="font-bold">{{
                    importResult.conflicts.filter(c => c.resolution === 'overwrite').length
                  }}</span>
                </div>
                <div
                  class="col-12 py-2 flex justify-content-between border-bottom-1 surface-border"
                >
                  <span>Duplicates to Skip:</span>
                  <span class="font-bold">{{
                    importResult.conflicts.filter(
                      c => c.resolution === 'skip' || c.resolution === 'keep'
                    ).length
                  }}</span>
                </div>
                <div
                  class="col-12 py-2 flex justify-content-between border-bottom-1 surface-border"
                >
                  <span>Partial Records (Saved as Drafts):</span>
                  <span class="font-bold">{{ importResult.partial.length }}</span>
                </div>
                <div class="col-12 py-4 flex justify-content-between text-xl">
                  <span class="font-bold">Total Operations:</span>
                  <span class="font-bold text-primary">{{
                    importResult.valid.length +
                    importResult.conflicts.filter(c => c.resolution === 'overwrite').length +
                    importResult.partial.length
                  }}</span>
                </div>
              </div>

              <div class="flex justify-content-end gap-2">
                <Button label="Cancel" text @click="close" />
                <Button
                  label="Go Back"
                  text
                  @click="activeStep = importResult.conflicts.length > 0 ? 3 : 2"
                />
                <Button
                  label="Confirm & Start Import"
                  icon="pi pi-check"
                  :loading="processing"
                  @click="performImport"
                />
              </div>
            </div>
          </StepPanel>

          <!-- Step 5: Success/Results -->
          <StepPanel :value="5">
            <div
              v-if="importResult"
              class="flex flex-column align-items-center justify-content-center py-5 gap-4"
            >
              <div class="text-center">
                <i class="pi pi-check-circle text-6xl text-success mb-3"></i>
                <h3 class="m-0 text-2xl font-bold">Import Successful!</h3>
                <p class="text-color-secondary mt-2">The business registry has been updated.</p>
              </div>

              <div class="flex gap-3">
                <Button label="View Businesses" icon="pi pi-list" @click="close" />
                <Button
                  label="Import Another"
                  icon="pi pi-refresh"
                  text
                  @click="
                    activeStep = 1;
                    importResult = null;
                    selectedFile = null;
                  "
                />
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </div>

    <template v-if="importing || processing" #footer>
      <div class="w-full">
        <div class="flex justify-content-between mb-2">
          <span class="text-sm font-semibold">{{
            importing ? 'Analyzing CSV...' : 'Processing Import...'
          }}</span>
        </div>
        <ProgressBar mode="indeterminate" style="height: 6px" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-stepper) {
  flex-basis: 100%;
}
</style>
