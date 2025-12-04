import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/services/local-db'
import type { LocalDB } from '@/services/local-db'

export function useStorage(bucket: string) {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const typedDb = db as LocalDB // Cast to our LocalDB type

  /** Upload a new file and return its reference string */
  async function uploadFile(file: File, path: string): Promise<string | null> {
    loading.value = true
    error.value = null

    try {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const base64 = e.target?.result as string
            // Access the correct table based on the bucket name
            await (typedDb as any)[bucket].put({ id: path, data: base64 })
            resolve(`dexie://${bucket}/${path}`)
          } catch (err) {
            reject(err)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } catch (e: any) {
      error.value = e
      return null
    } finally {
      loading.value = false
    }
  }

  /** Update an existing file: delete old reference, upload new one */
  async function updateFile(
    newFile: File,
    newPath: string,
    oldRef?: string
  ): Promise<string | null> {
    // Clean up old file if present
    if (oldRef) {
      await deleteFile(oldRef)
    }
    // Upload new file
    return await uploadFile(newFile, newPath)
  }

  /** Delete a file by its reference string */
  async function deleteFile(ref: string): Promise<void> {
    try {
      if (ref.startsWith('dexie://')) {
        const key = ref.replace(`dexie://${bucket}/`, '')
        // Access the correct table based on the bucket name
        await (typedDb as any)[bucket].delete(key)
      }
    } catch (e: any) {
      console.warn('Failed to delete file:', e)
    }
  }

  /** Resolve a reference string into a usable URL for <img> */
  async function getFileUrl(ref: string): Promise<string | null> {
    if (!ref) return null
    if (ref.startsWith('http')) return ref
    if (ref.startsWith('dexie://')) {
      const key = ref.replace(`dexie://${bucket}/`, '')
      // Access the correct table based on the bucket name
      const record = await (typedDb as any)[bucket].get(key)
      if (record?.data) {
        const blob = await (await fetch(record.data)).blob()
        return URL.createObjectURL(blob)
      }
    }
    return null
  }

  return { loading, error, uploadFile, updateFile, deleteFile, getFileUrl }
}
