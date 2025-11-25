import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCrudStore } from './useCrudStore';
import { EntrepreneurSchema } from '../schemas/entrepreneur';

// Mock the useStorage composable
vi.mock('@/composables/useStorage', () => ({
  useStorage: vi.fn(() => ({
    uploadFile: vi.fn(),
    updateFile: vi.fn(),
    deleteFile: vi.fn(),
    getFileUrl: vi.fn(),
  })),
}));

// Create a mock DB object with the necessary methods
const createMockDb = () => {
  const mockData: Record<string, any> = {};
  return {
    entrepreneurs: {
      add: vi.fn(async (item: any) => {
        const id = item.id || crypto.randomUUID();
        mockData[id] = { ...item, id };
        return id;
      }),
      get: vi.fn(async (id: string) => mockData[id]),
      put: vi.fn(async (item: any) => {
        mockData[item.id] = item;
        return item.id;
      }),
      delete: vi.fn(async (id: string) => {
        delete mockData[id];
        return true;
      }),
      bulkGet: vi.fn(async (ids: string[]) => ids.map(id => mockData[id])),
      bulkDelete: vi.fn(async (ids: string[]) => {
        ids.forEach(id => delete mockData[id]);
        return ids.length;
      }),
      toArray: vi.fn(async () => Object.values(mockData)),
    },
    avatars: {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    }
  };
};

describe('useCrudStore', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = createMockDb();
    vi.clearAllMocks();
  });

  it('validates data against schema during add', async () => {
    const { add } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Valid data should pass schema validation
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    await expect(add(validData)).resolves.not.toThrow();

    // Invalid data should fail schema validation
    const invalidData = {
      firstName: 'John', // missing required lastName, slug, and contact
    };

    await expect(add(invalidData)).rejects.toThrow();
  });

  it('validates data against schema during update', async () => {
    const { update } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Valid data with id should pass schema validation
    const validData = {
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    await expect(update(validData)).resolves.not.toThrow();

    // Invalid data should fail schema validation
    const invalidData = {
      id: 'test-id',
      firstName: 'John', // missing required lastName, slug, and contact
    };

    await expect(update(invalidData)).rejects.toThrow();
  });

  it('handles avatar upload during add/update', async () => {
    const mockFile = new File([], 'avatar.jpg');
    const mockUploadFile = vi.fn().mockResolvedValue('dexie://avatars/test-avatar.jpg');
    const mockUpdateFile = vi.fn().mockResolvedValue('dexie://avatars/test-avatar.jpg');
    const mockDeleteFile = vi.fn().mockResolvedValue(undefined);

    vi.mocked(() => ({
      uploadFile: mockUploadFile,
      updateFile: mockUpdateFile,
      deleteFile: mockDeleteFile,
      getFileUrl: vi.fn(),
    }));

    const { add } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    const dataWithFileAvatar = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      avatar: mockFile
    };

    await add(dataWithFileAvatar);

    // Should have called uploadFile with the avatar file
    expect(mockUploadFile).toHaveBeenCalled();
  });

  it('properly cleans up avatar files during remove', async () => {
    const mockDeleteFile = vi.fn().mockResolvedValue(undefined);

    vi.mocked(() => ({
      uploadFile: vi.fn(),
      updateFile: vi.fn(),
      deleteFile: mockDeleteFile,
      getFileUrl: vi.fn(),
    }));

    const { add, remove } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Add an item with avatar
    const itemWithAvatar = {
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      avatar: 'dexie://avatars/test-avatar.jpg'
    };

    // Mock the DB get method to return the item when fetching
    mockDb.entrepreneurs.get.mockResolvedValue(itemWithAvatar);

    await remove('test-id');

    // Should have tried to delete the avatar file
    expect(mockDeleteFile).toHaveBeenCalledWith('dexie://avatars/test-avatar.jpg');
  });

  it('reverts optimistic updates on error', async () => {
    const { items, add, update, remove } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Test add revert on failure
    mockDb.entrepreneurs.add.mockRejectedValue(new Error('DB Error'));
    
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    await expect(add(validData)).rejects.toThrow('DB Error');
    expect(items.value).toHaveLength(0); // Should revert to empty

    // Test update revert on failure
    const item = {
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };
    
    items.value.push(item);
    mockDb.entrepreneurs.put.mockRejectedValue(new Error('Update Error'));
    
    await expect(update({ ...item, firstName: 'Jane' })).rejects.toThrow('Update Error');
    expect(items.value[0].firstName).toBe('John'); // Should revert to original
  });

  it('handles bulk operations with avatar cleanup', async () => {
    const mockDeleteFile = vi.fn().mockResolvedValue(undefined);

    vi.mocked(() => ({
      uploadFile: vi.fn(),
      updateFile: vi.fn(),
      deleteFile: mockDeleteFile,
      getFileUrl: vi.fn(),
    }));

    const { removeMany } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Add items with avatars
    const item1 = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' },
      avatar: 'dexie://avatars/avatar1.jpg'
    };

    const item2 = {
      id: 'test-id-2',
      firstName: 'Jane',
      lastName: 'Smith',
      slug: 'jane-smith',
      contact: { email: 'jane@example.com' },
      avatar: 'dexie://avatars/avatar2.jpg'
    };

    // Mock the bulkGet to return these items
    mockDb.entrepreneurs.bulkGet.mockResolvedValue([item1, item2]);

    await removeMany(['test-id-1', 'test-id-2']);

    // Should have tried to delete both avatar files
    expect(mockDeleteFile).toHaveBeenCalledWith('dexie://avatars/avatar1.jpg');
    expect(mockDeleteFile).toHaveBeenCalledWith('dexie://avatars/avatar2.jpg');
  });

  it('searches items correctly', () => {
    const { items, search } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    const item1 = {
      id: 'test-id-1',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    };

    const item2 = {
      id: 'test-id-2',
      firstName: 'Jane',
      lastName: 'Smith',
      slug: 'jane-smith',
      contact: { email: 'jane@example.com' }
    };

    items.value = [item1, item2];

    const results = search('john', ['firstName'], items);
    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe('John');
  });

  it('handles errors consistently', async () => {
    const { add, update, remove, fetchAll, fetchOne } = useCrudStore({
      schema: EntrepreneurSchema,
      tableName: 'entrepreneurs',
      db: mockDb,
    });

    // Mock DB operations to throw errors
    mockDb.entrepreneurs.add.mockRejectedValue(new Error('Add Error'));
    mockDb.entrepreneurs.put.mockRejectedValue(new Error('Update Error'));
    mockDb.entrepreneurs.delete.mockRejectedValue(new Error('Delete Error'));
    mockDb.entrepreneurs.toArray.mockRejectedValue(new Error('Fetch Error'));
    mockDb.entrepreneurs.get.mockRejectedValue(new Error('Get Error'));

    await expect(add({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    })).rejects.toThrow('Add Error');

    await expect(update({
      id: 'test-id',
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
      contact: { email: 'john@example.com' }
    })).rejects.toThrow('Update Error');

    await expect(remove('test-id')).rejects.toThrow('Delete Error');

    await expect(fetchAll()).rejects.toThrow('Fetch Error');

    await expect(fetchOne('test-id')).rejects.toThrow('Get Error');
  });
});