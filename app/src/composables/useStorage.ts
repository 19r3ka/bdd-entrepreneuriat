import { ref } from 'vue';
// import { supabase } from '@/services/supabase';
import { db } from '@/services/local-db'; // Dexie instance

export function useStorage(bucket: string) {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /** Upload a new file and return its reference string */
  async function uploadFile(file: File, path: string): Promise<string | null> {
    loading.value = true;
    error.value = null;

    try {
      // if (supabase) {
      //   // Supabase upload
      //   const { data, error: uploadError } = await supabase.storage
      //     .from(bucket)
      //     .upload(path, file, { cacheControl: '3600', upsert: true });

      //   if (uploadError) throw uploadError;

      //   const { data: publicUrlData } = supabase.storage
      //     .from(bucket)
      //     .getPublicUrl(data.path);

      //   return publicUrlData.publicUrl; // ✅ store this in your model
      // } else {
        // Dexie fallback
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const base64 = e.target?.result as string;
              await db[bucket].put({ id: path, data: base64 });
              resolve(`dexie://${bucket}/${path}`); // ✅ store this key in your model
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      // }
    } catch (e: any) {
      error.value = e;
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** Update an existing file: delete old reference, upload new one */
  async function updateFile(newFile: File, newPath: string, oldRef?: string): Promise<string | null> {
    // Clean up old file if present
    if (oldRef) {
      await deleteFile(oldRef);
    }
    // Upload new file
    return await uploadFile(newFile, newPath);
  }

  /** Delete a file by its reference string */
  async function deleteFile(ref: string): Promise<void> {
    try {
      // if (ref.startsWith('http')) {
      //   // Supabase cleanup
      //   const path = ref.split('/').slice(-2).join('/'); // reconstruct path from URL
      //   await supabase.storage.from(bucket).remove([path]);
      // } else if (ref.startsWith('dexie://')) {
        // Dexie cleanup
        const key = ref.replace(`dexie://${bucket}/`, '');
        await db[bucket].delete(key);
      // }
    } catch (e: any) {
      console.warn('Failed to delete file:', e);
    }
  }

  /** Resolve a reference string into a usable URL for <img> */
  async function getFileUrl(ref: string): Promise<string | null> {
    if (!ref) return null;
    if (ref.startsWith('http')) return ref; // Supabase public URL
    if (ref.startsWith('dexie://')) {
      const key = ref.replace(`dexie://${bucket}/`, '');
      const record = await db[bucket].get(key);
      if (record?.data) {
        const blob = await (await fetch(record.data)).blob();
        return URL.createObjectURL(blob);
      }
    }
    return null;
  }

  return { loading, error, uploadFile, updateFile, deleteFile, getFileUrl };
}
