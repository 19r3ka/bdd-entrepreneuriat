// src/stores/useBusinessStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { z } from 'zod';
import { useCrudStore } from '@/composables/useCrudStore';
import { BusinessSchema } from '@/schemas/business';
import type { Business } from '@/schemas/business';
import { db } from '@/services/local-db';
import { useEntrepreneurStore } from './useEntrepreneurStore';
import { useActivityLogStore } from './useActivityLogStore';
import { v4 as uuidv4 } from 'uuid';
import { enrichBusiness, mapToBusinessInput } from '@/utils/businessHelpers';

// Schema-derived types
type BusinessBase = z.output<typeof BusinessSchema>;

export const useBusinessStore = defineStore('business', () => {
  const BusinessSchemaWithId = BusinessSchema.extend({
    id: z.string().uuid(),
  });

  type BusinessWithId = z.infer<typeof BusinessSchemaWithId>;

  const crudStore = useCrudStore<BusinessWithId>({
    schema: BusinessSchemaWithId,
    tableName: 'businesses',
    db,
  });

  const validationError = ref<string | null>(null);

  const {
    items: rawBusinessRecords,
    loading,
    error,
    fetchAll: fetchAllRaw,
    fetchOne: fetchOneRaw,
    add: addRaw,
    update: updateRaw,
    remove,
    removeMany,
  } = crudStore;

  const entrepreneurStore = useEntrepreneurStore();
  const activityLogStore = useActivityLogStore();

  const parsedBusinesses = computed<BusinessBase[]>(() => {
    validationError.value = null;
    return rawBusinessRecords.value
      .map((rawRecord: any) => {
        try {
          return BusinessSchema.parse(rawRecord);
        } catch (err) {
          console.error('Business validation failed for record:', rawRecord, err);
          if (!validationError.value) {
            validationError.value = `Validation failed: ${err instanceof Error ? err.message : String(err)}`;
          }
          return null;
        }
      })
      .filter((b: BusinessBase | null): b is BusinessBase => b !== null);
  });

  // Define the enriched business type
  type EnrichedBusiness = ReturnType<typeof enrichBusiness>;

  const businesses = computed<EnrichedBusiness[]>(() =>
    parsedBusinesses.value.map(parsedBusiness => {
      const entrepreneur =
        entrepreneurStore.entrepreneurs.find(e => e.id === parsedBusiness.entrepreneurId) ?? null;
      return enrichBusiness(parsedBusiness, entrepreneur);
    })
  );

  const fetchAll = async (): Promise<void> => {
    await entrepreneurStore.fetchAll();
    await fetchAllRaw();
  };

  const fetchOne = async (id: string): Promise<EnrichedBusiness | null> => {
    await entrepreneurStore.fetchAll();
    const rawRecord = await fetchOneRaw(id);
    if (!rawRecord) return null;

    const parsedBusiness = BusinessSchema.parse(rawRecord);
    const entrepreneur =
      entrepreneurStore.entrepreneurs.find(e => e.id === parsedBusiness.entrepreneurId) ?? null;
    return enrichBusiness(parsedBusiness, entrepreneur);
  };

  const add = async (business: Business | EnrichedBusiness): Promise<void> => {
    const id = business.id || uuidv4();
    const businessToPersist = { ...mapToBusinessInput(business), id };
    await addRaw(businessToPersist as BusinessWithId);
    await activityLogStore.logAction('create', 'business', id, businessToPersist.name);
  };

  const update = async (business: Business | EnrichedBusiness): Promise<void> => {
    if (!business.id) throw new Error('Cannot update business without ID');
    const businessToPersist = { ...mapToBusinessInput(business), id: business.id };
    await updateRaw(businessToPersist as BusinessWithId);
    await activityLogStore.logAction('update', 'business', business.id, business.name);
  };

  const removeWithLog = async (id: string): Promise<void> => {
    const business = getById(id);
    const name = business?.name || 'Unknown Business';
    await remove(id);
    await activityLogStore.logAction('delete', 'business', id, name);
  };

  const getById = (id: string): EnrichedBusiness | undefined =>
    businesses.value.find(b => b.id === id);

  const getByRegistrationNumber = (registrationNumber: string): EnrichedBusiness | undefined =>
    businesses.value.find(b => b.registrationNumber === registrationNumber);

  const getByEmail = (email: string): EnrichedBusiness | undefined =>
    businesses.value.find(b => b.contact?.email === email);

  const searchByName = (query: string) =>
    computed(() =>
      businesses.value.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    );

  return {
    businesses,
    loading,
    error,
    fetchAll,
    fetchOne,
    add,
    update,
    remove: removeWithLog,
    removeMany,
    getById,
    getByRegistrationNumber,
    getByEmail,
    searchByName,
    validationError,
  };
});
