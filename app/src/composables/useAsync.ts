import { ref } from 'vue';

/**
 * Generic composable for managing async state (loading, error)
 */
export function useAsync() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Wrapper for async functions to handle loading and error states
   */
  const withAsync = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    withAsync,
  };
}
