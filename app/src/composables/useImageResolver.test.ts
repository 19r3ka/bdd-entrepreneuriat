import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useImageResolver } from './useImageResolver';

// Mock useStorage composable
const mockGetFileUrl = vi.fn();

vi.mock('@/composables/useStorage', () => ({
  useStorage: vi.fn(() => ({
    getFileUrl: mockGetFileUrl,
  })),
}));

describe('useImageResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves File to blob URL and revokes old blob', () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;

    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-file-url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const srcRef = ref<File | null>(null);
    const { resolvedSrc } = useImageResolver(srcRef);

    // Create a mock file
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Set the file in the ref to trigger the watcher
    srcRef.value = mockFile;

    // Wait for the watcher to run
    vi.runAllTimers();

    // Should create object URL for the file
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockFile);
    expect(resolvedSrc.value).toBe('blob:mock-file-url');

    // Update the ref again to test blob revocation
    const newMockFile = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
    srcRef.value = newMockFile;

    vi.runAllTimers();

    // Should revoke the old blob URL
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-file-url');

    // Restore original methods
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('returns http string as-is', () => {
    const srcRef = ref<string | null>(null);
    const { resolvedSrc } = useImageResolver(srcRef);

    srcRef.value = 'https://example.com/image.jpg';

    // Wait for the watcher to run
    vi.runAllTimers();

    expect(resolvedSrc.value).toBe('https://example.com/image.jpg');
  });

  it('calls getFileUrl for dexie:// references', async () => {
    mockGetFileUrl.mockResolvedValue('resolved-blob-url');

    const srcRef = ref<string | null>(null);
    const { resolvedSrc } = useImageResolver(srcRef);

    srcRef.value = 'dexie://avatars/test.jpg';

    // Wait for the async operation
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockGetFileUrl).toHaveBeenCalledWith('dexie://avatars/test.jpg');
    expect(resolvedSrc.value).toBe('resolved-blob-url');
  });

  it('sets resolvedSrc to null for null/undefined values', () => {
    const srcRef = ref<any>(null);
    const { resolvedSrc } = useImageResolver(srcRef);

    // Test with null
    srcRef.value = null;
    vi.runAllTimers();
    expect(resolvedSrc.value).toBeNull();

    // Test with undefined
    srcRef.value = undefined;
    vi.runAllTimers();
    expect(resolvedSrc.value).toBeNull();
  });

  it('handles unexpected types by setting resolvedSrc to null', () => {
    const srcRef = ref<any>(null);
    const { resolvedSrc } = useImageResolver(srcRef);

    // Test with number
    srcRef.value = 123;
    vi.runAllTimers();
    expect(resolvedSrc.value).toBeNull();

    // Test with boolean
    srcRef.value = true;
    vi.runAllTimers();
    expect(resolvedSrc.value).toBeNull();
  });
});
