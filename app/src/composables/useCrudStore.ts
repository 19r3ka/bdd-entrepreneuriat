import { ref, type Ref } from 'vue'
import { z } from 'zod'
import { useStorage } from './useStorage'

const FILE_BUCKET = 'avatars'

interface CrudStoreOptions<T> {
  schema: z.ZodSchema<T>
  tableName: string
  db: any // Dexie db instance
}

/**
 *
 */
export function useCrudStore<T extends Record<string, any>>({
  schema,
  tableName,
  db
}: CrudStoreOptions<T>) {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Storage abstraction for this table
  const { uploadFile, updateFile, deleteFile } = useStorage(FILE_BUCKET)

  /** Handle avatar upload/update */
  async function handleAvatar(itemData: T, oldRef?: string) {
    const avatarValue = (itemData as any).avatar
    if (avatarValue && avatarValue instanceof File) {
      const file = avatarValue
      const path = `${(itemData as any).id || crypto.randomUUID()}/${file.name}`

      // If oldRef exists, replace; otherwise upload new
      const ref = oldRef ? await updateFile(file, path, oldRef) : await uploadFile(file, path)

      if (ref) {
        ;(itemData as any).avatar = ref // replace File with reference string
      } else {
        throw new Error('Failed to upload avatar')
      }
    }
    return itemData
  }

  /** Fetch all items */
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      items.value = await db[tableName].toArray()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Fetch one item */
  async function fetchOne(id: string) {
    loading.value = true
    error.value = null
    try {
      return await db[tableName].get(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Add new item */
  async function add(itemData: Omit<T, 'id'>) {
    loading.value = true
    error.value = null
    const tempId = crypto.randomUUID()
    let newItem: T | undefined

    try {
      const dataWithAvatar = await handleAvatar({ ...itemData, id: tempId } as unknown as T)
      const schemaWithoutId = (schema as any).omit?.({ id: true }) ?? schema
      const validatedData = schemaWithoutId.parse(dataWithAvatar)
      newItem = { ...validatedData, id: tempId } as T

      ;(items.value as T[]).push(newItem) // optimistic update
      await db[tableName].add(newItem) // persist

      return newItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      if (newItem) {
        items.value = (items.value as unknown as T[]).filter((i: T) => i.id !== (newItem as T).id) as typeof items.value
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Update existing item */
  async function update(itemData: T) {
    loading.value = true
    error.value = null
    const originalItems = [...items.value]

    try {
      const oldItem = await db[tableName].get(itemData.id)
      const oldRef = oldItem?.avatar as string | undefined

      const dataWithAvatar = await handleAvatar(itemData, oldRef)
      const validatedData = schema.parse(dataWithAvatar)

      const index = (items.value as unknown as T[]).findIndex((i: T) => i.id === (validatedData as T).id)
      if (index !== -1) (items.value as unknown as T[])[index] = validatedData as T

      await db[tableName].put(validatedData) // persist
      return validatedData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      items.value = originalItems // revert
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Remove one item (with avatar cleanup) */
  async function remove(id: string) {
    loading.value = true
    error.value = null
    const originalItems = [...items.value]

    try {
      const item = await db[tableName].get(id)
      if (item?.avatar && typeof item.avatar === 'string') {
        await deleteFile(item.avatar)
      }

      items.value = items.value.filter((i) => i.id !== id)
      await db[tableName].delete(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      items.value = originalItems
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Remove many items (with avatar cleanup) */
  async function removeMany(ids: string[]) {
    loading.value = true
    error.value = null
    const originalItems = [...items.value]

    try {
      const toDelete = await db[tableName].bulkGet(ids)
      for (const item of toDelete) {
        if (item?.avatar && typeof item.avatar === 'string') {
          await deleteFile(item.avatar)
        }
      }

      items.value = items.value.filter((i) => !ids.includes(i.id))
      await db[tableName].bulkDelete(ids)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      items.value = originalItems
      throw err
    } finally {
      loading.value = false
    }
  }

  const getById = (id: string) => items.value.find((i) => i.id === id)

  /**
   *
   */
  function search<T extends Record<string, any>>(
    query: string,
    fields: (keyof T)[] = ['name' as keyof T],
    items: Ref<T[]>
  ) {
    const q = query.toLowerCase()
    return items.value.filter((item) =>
      fields.some((field) => String(item[field]).toLowerCase().includes(q))
    )
  }

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
    search
  }
}
