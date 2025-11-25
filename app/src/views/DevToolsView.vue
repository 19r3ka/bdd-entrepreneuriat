<template>
  <div class="surface-ground min-h-screen p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="card p-4">
        <h2 class="mb-4">Developer Tools</h2>
        
        <div class="mb-6">
          <h3>Database Seeder</h3>
          <p class="text-600 mb-4">Generate dummy data for testing. Control the exact number of each entity type.</p>
          
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-2">
              <label for="entrepreneurCount" class="font-semibold w-10rem">Entrepreneurs:</label>
              <InputNumber v-model="entrepreneurCount" inputId="entrepreneurCount" :min="0" :max="100" showButtons />
            </div>
            
            <div class="flex align-items-center gap-2">
              <label for="businessCount" class="font-semibold w-10rem">Businesses:</label>
              <InputNumber v-model="businessCount" inputId="businessCount" :min="0" :max="200" showButtons />
              <small class="text-500">(distributed among entrepreneurs)</small>
            </div>
            
            <div class="flex align-items-center gap-2">
              <label for="supportCount" class="font-semibold w-10rem">Supports:</label>
              <InputNumber v-model="supportCount" inputId="supportCount" :min="0" :max="200" showButtons />
              <small class="text-500">(distributed among businesses)</small>
            </div>
            
            <div class="flex align-items-center gap-2 mt-2">
              <Checkbox v-model="clearDb" binary inputId="clearDb" />
              <label for="clearDb">Clear existing database before seeding</label>
            </div>
            
            <div class="mt-2">
              <Button 
                label="Seed Database" 
                icon="pi pi-database" 
                @click="handleSeed" 
                :loading="seeding" 
                severity="help"
              />
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3>Database Info</h3>
          <p><strong>Database Name:</strong> BusinessTrackerDB</p>
          <p><strong>Version:</strong> 3</p>
          <p class="text-600 text-sm mt-2">
            <i class="pi pi-info-circle mr-1"></i>
            Businesses are randomly distributed among entrepreneurs (some may have 0, 1, or 2+).
            Supports are randomly distributed among businesses (not all businesses will be supported).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import { seedDatabase } from '@/services/seeder';

const toast = useToast();
const entrepreneurCount = ref(10);
const businessCount = ref(15);
const supportCount = ref(10);
const clearDb = ref(false);
const seeding = ref(false);

const handleSeed = async () => {
  try {
    seeding.value = true;
    const result = await seedDatabase({
      entrepreneurCount: entrepreneurCount.value,
      businessCount: businessCount.value,
      supportCount: supportCount.value,
      clear: clearDb.value,
    });
    
    let detail = `Generated ${result.entrepreneurs} entrepreneurs, ${result.businesses} businesses, and ${result.supports} support boosts.`;
    if (result.errors && result.errors.length > 0) {
      detail += ` (${result.errors.length} validation errors - check console)`;
      console.warn('Seeding validation errors:', result.errors);
    }
    
    toast.add({ 
      severity: result.errors ? 'warn' : 'success', 
      summary: result.errors ? 'Seeding Complete with Warnings' : 'Seeding Complete', 
      detail, 
      life: 5000 
    });
  } catch (error) {
    console.error(error);
    toast.add({ 
      severity: 'error', 
      summary: 'Seeding Failed', 
      detail: 'An error occurred while seeding the database.', 
      life: 5000 
    });
  } finally {
    seeding.value = false;
  }
};
</script>

