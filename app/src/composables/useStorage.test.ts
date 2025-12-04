import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStorage } from './useStorage'
import { db } from '@/services/local-db'

// Mock the entire local-db service
vi.mock('@/services/local-db', () => ({
  db: {
    avatars: {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('useStorage', () => {
  const bucket = 'avatars'
  const mockDb = db as any // Use 'any' for easier mock access

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('uploads a file to Dexie and returns a dexie reference', async () => {
    const { uploadFile, loading, error } = useStorage(bucket)
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' })
    const path = 'test/foo.txt'

    // Simulate FileReader
    const readerResult = 'data:text/plain;base64,Zm9v'
    const fileReaderSpy = vi.spyOn(window, 'FileReader').mockImplementation(() => {
      const fr = new EventTarget() as any
      fr.readAsDataURL = () => {
        fr.result = readerResult
        fr.dispatchEvent(new Event('load'))
      }
      return fr
    })

    mockDb.avatars.put.mockResolvedValue(path)

    const result = await uploadFile(file, path)

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(mockDb.avatars.put).toHaveBeenCalledWith({ id: path, data: readerResult })
    expect(result).toBe(`dexie://${bucket}/${path}`)

    fileReaderSpy.mockRestore()
  })

  it('handles upload failure', async () => {
    const { uploadFile, loading, error } = useStorage(bucket)
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' })
    const path = 'test/foo.txt'

    vi.spyOn(window, 'FileReader').mockImplementation(() => {
      const fr = new EventTarget() as any
      fr.readAsDataURL = () => fr.dispatchEvent(new Event('error'))
      return fr
    })

    const result = await uploadFile(file, path)

    expect(loading.value).toBe(false)
    expect(error.value).not.toBeNull()
    expect(result).toBeNull()
  })

  it('deletes a file from Dexie', async () => {
    const { deleteFile } = useStorage(bucket)
    const ref = `dexie://${bucket}/test/foo.txt`
    mockDb.avatars.delete.mockResolvedValue(1)

    await deleteFile(ref)
    expect(mockDb.avatars.delete).toHaveBeenCalledWith('test/foo.txt')
  })

  it('handles deletion failure gracefully', async () => {
    const { deleteFile } = useStorage(bucket)
    const ref = `dexie://${bucket}/test/foo.txt`
    mockDb.avatars.delete.mockRejectedValue(new Error('DB error'))

    await deleteFile(ref)
    expect(console.warn).toHaveBeenCalled()
  })

  it('updates a file by deleting old and uploading new', async () => {
    const { updateFile } = useStorage(bucket)
    const oldRef = `dexie://${bucket}/old.txt`
    const newFile = new File(['bar'], 'new.txt', { type: 'text/plain' })
    const newPath = 'new.txt'

    // Mock delete and upload sequence
    mockDb.avatars.delete.mockResolvedValue(1)
    const readerResult = 'data:text/plain;base64,YmFy'
    vi.spyOn(window, 'FileReader').mockImplementation(() => {
      const fr = new EventTarget() as any
      fr.readAsDataURL = () => {
        fr.result = readerResult
        fr.dispatchEvent(new Event('load'))
      }
      return fr
    })
    mockDb.avatars.put.mockResolvedValue(newPath)

    const result = await updateFile(newFile, newPath, oldRef)

    expect(mockDb.avatars.delete).toHaveBeenCalledWith('old.txt')
    expect(mockDb.avatars.put).toHaveBeenCalledWith({ id: newPath, data: readerResult })
    expect(result).toBe(`dexie://${bucket}/${newPath}`)
  })

  it('gets a blob URL for a dexie reference', async () => {
    const { getFileUrl } = useStorage(bucket)
    const ref = `dexie://${bucket}/foo.txt`
    const base64Data = 'data:text/plain;base64,Zm9v'
    mockDb.avatars.get.mockResolvedValue({ id: 'foo.txt', data: base64Data })

    const mockBlob = new Blob(['foo'])
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      blob: () => Promise.resolve(mockBlob)
    } as any)
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')

    const url = await getFileUrl(ref)

    expect(mockDb.avatars.get).toHaveBeenCalledWith('foo.txt')
    expect(fetchSpy).toHaveBeenCalledWith(base64Data)
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob)
    expect(url).toBe('blob:mock-url')
  })

  it('returns http(s) URLs directly', async () => {
    const { getFileUrl } = useStorage(bucket)
    const url = 'https://example.com/image.png'
    const result = await getFileUrl(url)
    expect(result).toBe(url)
  })

  it('returns null for empty, null, or invalid references', async () => {
    const { getFileUrl } = useStorage(bucket)
    expect(await getFileUrl('')).toBeNull()
    expect(await getFileUrl(null as any)).toBeNull()
    expect(await getFileUrl('invalid-ref')).toBeNull()
  })
})