import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useStorage } from './useStorage';

// Mock the local-db service
vi.mock('@/services/local-db', async () => {
  const actual = await vi.importActual('@/services/local-db');
  return {
    ...actual,
    db: {
      avatars: {
        put: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
      }
    }
  };
});

// Import the actual db after mocking
import { db } from '@/services/local-db';

describe('useStorage', () => {
  const bucket = 'avatars';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const { loading, error } = useStorage(bucket);

    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('uploads a file successfully to Dexie', async () => {
    // Mock FileReader
    const mockFileReader = {
      onload: null as Function | null,
      onerror: null as Function | null,
      readAsDataURL: vi.fn((file: File) => {
        // Simulate the load event with a base64 result
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({
              target: { result: 'data:image/jpeg;base64,testdata' }
            });
          }
        }, 0);
      }),
    };
    
    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'test-uuid')
    });

    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
    const path = 'avatar.jpg';

    // Mock the Dexie put operation
    db.avatars.put.mockResolvedValue(undefined);

    const { uploadFile } = useStorage(bucket);
    const result = await uploadFile(mockFile, path);

    expect(db.avatars.put).toHaveBeenCalledWith({
      id: path,
      data: 'data:image/jpeg;base64,testdata'
    });
    expect(result).toBe(`dexie://${bucket}/${path}`);
  });

  it('handles upload error gracefully', async () => {
    // Mock FileReader with error
    const mockFileReader = {
      onload: null as Function | null,
      onerror: vi.fn(),
      readAsDataURL: vi.fn((file: File) => {
        // Simulate the error event
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror(new Error('File read error'));
          }
        }, 0);
      }),
    };
    
    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
    const path = 'avatar.jpg';

    const { uploadFile, error } = useStorage(bucket);
    const result = await uploadFile(mockFile, path);

    expect(result).toBeNull();
    expect(error.value).toBeInstanceOf(Error);
  });

  it('updates a file by deleting old reference and uploading new one', async () => {
    // Mock FileReader
    const mockFileReader = {
      onload: null as Function | null,
      onerror: null as Function | null,
      readAsDataURL: vi.fn((file: File) => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({
              target: { result: 'data:image/jpeg;base64,newtestdata' }
            });
          }
        }, 0);
      }),
    };
    
    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

    const oldRef = `dexie://${bucket}/old-avatar.jpg`;
    const newPath = 'new-avatar.jpg';
    const newFile = new File(['test'], 'new-avatar.jpg', { type: 'image/jpeg' });

    // Mock the Dexie operations
    db.avatars.delete.mockResolvedValue(undefined);
    db.avatars.put.mockResolvedValue(undefined);

    const { updateFile } = useStorage(bucket);
    const result = await updateFile(newFile, newPath, oldRef);

    expect(db.avatars.delete).toHaveBeenCalledWith('old-avatar.jpg');
    expect(db.avatars.put).toHaveBeenCalledWith({
      id: newPath,
      data: 'data:image/jpeg;base64,newtestdata'
    });
    expect(result).toBe(`dexie://${bucket}/${newPath}`);
  });

  it('deletes a file from Dexie', async () => {
    const ref = `dexie://${bucket}/path/to/file.jpg`;

    db.avatars.delete.mockResolvedValue(undefined);

    const { deleteFile } = useStorage(bucket);
    await deleteFile(ref);

    expect(db.avatars.delete).toHaveBeenCalledWith('path/to/file.jpg');
  });

  it('handles deletion error gracefully', async () => {
    const ref = `dexie://${bucket}/path/to/file.jpg`;

    // Mock an error during deletion
    db.avatars.delete.mockRejectedValue(new Error('Deletion failed'));

    const { deleteFile } = useStorage(bucket);
    
    // Capture console.warn calls
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    await deleteFile(ref);

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(db.avatars.delete).toHaveBeenCalledWith('path/to/file.jpg');
    
    consoleWarnSpy.mockRestore();
  });

  it('gets file URL from Dexie', async () => {
    const ref = `dexie://${bucket}/path/to/file.jpg`;
    const mockBase64 = 'data:image/jpeg;base64,existingdata';
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

    db.avatars.get.mockResolvedValue({ id: 'path/to/file.jpg', data: mockBase64 });

    // Mock fetch and URL.createObjectURL
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      blob: () => Promise.resolve(mockBlob)
    })));

    const mockObjectUrl = 'blob:mock-url';
    const createObjectURLMock = vi.fn(() => mockObjectUrl);
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectURLMock,
      revokeObjectURL: vi.fn(),
    });

    const { getFileUrl } = useStorage(bucket);
    const result = await getFileUrl(ref);

    expect(db.avatars.get).toHaveBeenCalledWith('path/to/file.jpg');
    expect(fetch).toHaveBeenCalledWith(mockBase64);
    expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    expect(result).toBe(mockObjectUrl);
  });

  it('returns null for invalid references', async () => {
    const { getFileUrl } = useStorage(bucket);
    const result = await getFileUrl('');
    expect(result).toBeNull();
  });

  it('returns the same URL for HTTP references', async () => {
    const httpUrl = 'https://example.com/image.jpg';
    const { getFileUrl } = useStorage(bucket);
    const result = await getFileUrl(httpUrl);
    expect(result).toBe(httpUrl);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});