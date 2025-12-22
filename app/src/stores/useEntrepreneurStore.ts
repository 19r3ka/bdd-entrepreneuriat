import { defineStore } from 'pinia';
import { computed } from 'vue';
import { z } from 'zod';
import { useCrudStore } from '@/composables/useCrudStore';
import { EntrepreneurSchema } from '@/schemas/entrepreneur';
import type { Entrepreneur } from '@/schemas/entrepreneur';
import { db } from '@/services/local-db';
import { useActivityLogStore } from './useActivityLogStore';
import { v4 as uuidv4 } from 'uuid';
import { enrichEntrepreneur, type EnrichedEntrepreneur } from '@/utils/entrepreneurHelpers';

export const useEntrepreneurStore = defineStore('entrepreneur', () => {
  const EntrepreneurSchemaWithId = EntrepreneurSchema.extend({
    id: z.string().uuid(),
  });

  type EntrepreneurWithId = z.infer<typeof EntrepreneurSchemaWithId>;

  const crudStore = useCrudStore<EntrepreneurWithId>({
    schema: EntrepreneurSchemaWithId,
    tableName: 'entrepreneurs',
    db,
  });

  const activityLogStore = useActivityLogStore();

  const {
    items: rawEntrepreneurRecords,
    loading,
    error,
    fetchAll: baseFetchAll,
    fetchOne: baseFetchOne,
    add: addRaw,
    update: updateRaw,
    remove: baseRemove,
    removeMany,
  } = crudStore;

  const parsedEntrepreneurs = computed<Entrepreneur[]>(() => {
    return rawEntrepreneurRecords.value
      .map((rawRecord: Entrepreneur & { id: string }) => {
        try {
          return EntrepreneurSchema.parse(rawRecord);
        } catch (err) {
          console.error('Entrepreneur validation failed for record:', rawRecord, err);
          return null;
        }
      })
      .filter((e: Entrepreneur | null): e is Entrepreneur => e !== null);
  });

  const fetchAll = async () => {
    await baseFetchAll();
  };

  const fetchOne = async (id: string) => {
    const rawRecord = await baseFetchOne(id);
    if (!rawRecord) return null;
    const entrepreneur = EntrepreneurSchema.parse(rawRecord);
    return enrichEntrepreneur(entrepreneur);
  };

  const add = async (entrepreneur: Entrepreneur) => {
    const entrepreneurToPersist = {
      ...entrepreneur,
      id: entrepreneur.id || uuidv4(),
    } as EntrepreneurWithId;
    await addRaw(entrepreneurToPersist);
    await activityLogStore.logAction(
      'create',
      'entrepreneur',
      entrepreneurToPersist.id,
      `${entrepreneurToPersist.firstName} ${entrepreneurToPersist.lastName}`
    );
  };

  const update = async (entrepreneur: Entrepreneur) => {
    if (!entrepreneur.id) throw new Error('Cannot update entrepreneur without an ID.');
    await updateRaw(entrepreneur as EntrepreneurWithId);
    await activityLogStore.logAction(
      'update',
      'entrepreneur',
      entrepreneur.id,
      `${entrepreneur.firstName} ${entrepreneur.lastName}`
    );
  };

  const remove = async (id: string) => {
    const entrepreneur = getById(id);
    const name = entrepreneur
      ? `${entrepreneur.firstName} ${entrepreneur.lastName}`
      : 'Unknown Entrepreneur';
    await baseRemove(id);
    await activityLogStore.logAction('delete', 'entrepreneur', id, name);
  };

  const enrichedEntrepreneurs = computed<EnrichedEntrepreneur[]>(() =>
    parsedEntrepreneurs.value.map(enrichEntrepreneur)
  );

  const getById = (id: string): EnrichedEntrepreneur | undefined =>
    enrichedEntrepreneurs.value.find(e => e.id === id);
  const getBySlug = (slug: string): EnrichedEntrepreneur | undefined =>
    enrichedEntrepreneurs.value.find(e => e.slug === slug);
  const getByEmail = (email: string): EnrichedEntrepreneur | undefined =>
    enrichedEntrepreneurs.value.find(e => e.contact?.email === email);

  const searchByName = (query: string) =>
    computed<EnrichedEntrepreneur[]>(() =>
      enrichedEntrepreneurs.value.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase())
      )
    );

  const searchByEmail = (query: string) =>
    computed<EnrichedEntrepreneur[]>(() =>
      enrichedEntrepreneurs.value.filter(e =>
        (e.contact?.email || '').toLowerCase().includes(query.toLowerCase())
      )
    );

  return {
    entrepreneurs: enrichedEntrepreneurs,
    loading,
    error,
    fetchAll,
    fetchOne,
    add,
    update,
    remove,
    removeMany,
    getById,
    getBySlug,
    getByEmail,
    searchByName,
    searchByEmail,
  };
});
