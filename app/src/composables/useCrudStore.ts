import { ref, type Ref } from 'vue';
import { z } from 'zod';
import type Dexie from 'dexie';
import type { Table } from 'dexie';
import { useAsync } from './useAsync';
import { useAvatar } from './useAvatar';

interface CrudStoreOptions<T> {
  schema: z.ZodSchema<T>;
  tableName: string;
  db: Dexie;
}

/**
 * Generic CRUD store composable backed by Dexie.js and Zod validation.
 * @param param0 - The options for the store
 * @returns The store
 */
export function useCrudStore<T extends { id?: string }>({
  schema,
  tableName,
  db,
}: CrudStoreOptions<T>) {
  // StoredItem must have an id. We intersect T with { id: string } to guarantee it.
  type StoredItem = T & { id: string };

  const items = ref<StoredItem[]>([]) as Ref<StoredItem[]>;
  const table: Table<StoredItem, string> = db.table(tableName);
  const { loading, error, withAsync } = useAsync();
  const { processAvatar, getAvatarRef, deleteAvatar } = useAvatar(table);

  const fetchAll = () =>
    withAsync(async () => {
      items.value = await table.toArray();
    });
  const fetchOne = (id: string) => withAsync(() => table.get(id));

  const add = (itemData: T) =>
    withAsync(async () => {
      // Generate ID if not present
      const id = itemData.id || crypto.randomUUID();

      // Process avatar with the ID
      const dataWithAvatar = await processAvatar({ ...itemData, id } as StoredItem);

      // Validate: parse will return T (which might have optional id)
      // We cast the result to ensure TS knows we have the id
      const parsed = schema.parse(dataWithAvatar);
      const newItem = { ...parsed, id } as StoredItem;

      items.value.push(newItem);
      try {
        await table.add(newItem);
        return newItem;
      } catch (err) {
        items.value = items.value.filter(i => i.id !== id);
        throw err;
      }
    });

  const update = (itemData: StoredItem) =>
    withAsync(async () => {
      const originalItems = [...items.value];
      try {
        const oldRef = await getAvatarRef(itemData.id);
        const validatedData = schema.parse(await processAvatar(itemData, oldRef));
        // Ensure id is preserved from input
        const finalData = { ...validatedData, id: itemData.id } as StoredItem;

        const index = items.value.findIndex(i => i.id === finalData.id);
        if (index !== -1) items.value[index] = finalData;

        await table.put(finalData);
        return finalData;
      } catch (err) {
        items.value = originalItems;
        throw err;
      }
    });

  const remove = (id: string) =>
    withAsync(async () => {
      const originalItems = [...items.value];
      try {
        await deleteAvatar(id);
        items.value = items.value.filter(i => i.id !== id);
        await table.delete(id);
      } catch (err) {
        items.value = originalItems;
        throw err;
      }
    });

  const removeMany = (ids: string[]) =>
    withAsync(async () => {
      const originalItems = [...items.value];
      try {
        await Promise.all(ids.map(deleteAvatar));
        items.value = items.value.filter(i => !ids.includes(i.id));
        await table.bulkDelete(ids);
      } catch (err) {
        items.value = originalItems;
        throw err;
      }
    });

  const getById = (id: string) => items.value.find(i => i.id === id);

  const search = (
    query: string,
    fields: (keyof StoredItem)[],
    itemsRef: Ref<StoredItem[]> = items
  ) => {
    const q = query.toLowerCase();
    return itemsRef.value.filter(item =>
      fields.some(field =>
        String(item[field] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  };

  return {
    items,
    loading,
    error,
    fetchAll,
    fetchOne,
    add,
    update,
    remove,
    removeMany,
    getById,
    search,
  };
}
