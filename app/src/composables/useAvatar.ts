import { useStorage } from './useStorage';
import type { Table } from 'dexie';

const DEFAULT_BUCKET = 'avatars';

interface WithAvatar {
  avatar?: string | File;
}

/**
 * Generic avatar handling composable
 * @param table - The table to use for avatar storage
 * @param bucket - The bucket to use for avatar storage
 * @returns
 */
export function useAvatar<T extends { id: string }>(
  table: Table<T, string>,
  bucket: string = DEFAULT_BUCKET
) {
  const { uploadFile, updateFile, deleteFile } = useStorage(bucket);

  const getAvatarRef = async (id: string): Promise<string | undefined> => {
    const item = await table.get(id);
    const avatar = (item as unknown as WithAvatar | undefined)?.avatar;
    return typeof avatar === 'string' ? avatar : undefined;
  };

  const processAvatar = async (itemData: T, oldRef?: string): Promise<T> => {
    const avatarValue = (itemData as unknown as WithAvatar).avatar;

    if (!(avatarValue instanceof File)) return itemData;

    const path = `${itemData.id}/${avatarValue.name}`;
    const ref = oldRef
      ? await updateFile(avatarValue, path, oldRef)
      : await uploadFile(avatarValue, path);

    if (!ref) throw new Error('Failed to upload avatar');

    return { ...itemData, avatar: ref };
  };

  const deleteAvatar = async (id: string): Promise<void> => {
    const avatarRef = await getAvatarRef(id);
    if (avatarRef) await deleteFile(avatarRef);
  };

  return {
    processAvatar,
    getAvatarRef,
    deleteAvatar,
  };
}
