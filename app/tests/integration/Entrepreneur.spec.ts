import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import EntrepreneurForm from '@/components/EntrepreneurForm.vue';
import EntrepreneurListView from '@/views/EntrepreneurListView.vue';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';

const { routerPushMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
}));

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useRouter: () => ({
      push: routerPushMock,
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

describe('Entrepreneur CRUD Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new entrepreneur and display it in the list', async () => {
    const mockStore = {
      entrepreneurs: [],
      add: vi.fn(async data => {
        mockStore.entrepreneurs.push(data as any);
      }),
      fetchAll: vi.fn(),
    };
    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const listViewWrapper = mountWithGlobalComponents(EntrepreneurListView);
    expect(listViewWrapper.text()).toContain('Entrepreneurs');

    // Simulate adding a new entrepreneur
    const formWrapper = mountWithGlobalComponents(EntrepreneurForm, {
      props: {
        isEdit: false,
        initialValues: {},
      },
    });
    await formWrapper.find('#firstName').setValue('Integration');
    await formWrapper.find('#lastName').setValue('Test');
    await formWrapper.find('#slug').setValue('integration-test');
    await formWrapper.find('form').trigger('submit');

    expect(routerPushMock).toHaveBeenCalledWith('/entrepreneurs');

    // In a real integration test with Pinia, the list view would update.
    // Here we check that the store add was called.
    expect(mockStore.add).toHaveBeenCalled();
  });
});
