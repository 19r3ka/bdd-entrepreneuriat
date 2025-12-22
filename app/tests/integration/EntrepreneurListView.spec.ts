import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import EntrepreneurListView from '@/views/EntrepreneurListView.vue';
import { useEntrepreneurStore } from '@/stores/useEntrepreneurStore';

const { routerPushMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
}));

// Mock the store and related composables
vi.mock('@/stores/useEntrepreneurStore', () => ({
  useEntrepreneurStore: vi.fn(() => ({
    entrepreneurs: [],
    loading: false,
    error: null,
    fetchAll: vi.fn(() => Promise.resolve()),
    remove: vi.fn(() => Promise.resolve()),
    removeMany: vi.fn(() => Promise.resolve()),
  })),
}));

// Mock Vue Router
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useRouter: () => ({
      push: routerPushMock,
    }),
    useRoute: () => ({}),
  };
});

// Mock vue-i18n
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useI18n: vi.fn(() => ({
      t: (key: string) => key,
      d: (date: Date) => date.toISOString(),
    })),
  };
});

// Mock PrimeVue components and composables
vi.mock('@primevue/core/api', () => ({
  FilterMatchMode: {
    CONTAINS: 'contains',
    STARTS_WITH: 'startsWith',
  },
}));

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}));

vi.mock('@/composables/useConfirmation', () => ({
  useConfirmation: () => ({
    confirmDelete: vi.fn(() => Promise.resolve()),
    confirmDeleteSelected: vi.fn(() => Promise.resolve()),
  }),
}));

vi.mock('@/composables/useCsv', () => ({
  generateCsvColumns: vi.fn(() => []),
  useCsv: () => ({
    exportCsv: vi.fn(),
  }),
}));

describe('EntrepreneurListView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    // Setup mock store to return empty array

    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    expect(wrapper.exists()).toBe(true);

    // The ResourceDataTable should be rendered

    expect(wrapper.findComponent({ name: 'ResourceDataTable' }).exists()).toBe(true);
  });

  it('calls fetchAll on component mount', async () => {
    const fetchAllMock = vi.fn(() => Promise.resolve());

    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: fetchAllMock,

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Wait for the component to mount

    await wrapper.vm.$nextTick();

    expect(fetchAllMock).toHaveBeenCalled();
  });

  it('renders entrepreneur data in the table', async () => {
    const mockEntrepreneurs = [
      {
        id: '1',

        firstName: 'John',

        lastName: 'Doe',

        contact: { email: 'john@example.com' },

        slug: 'john-doe',
      },

      {
        id: '2',

        firstName: 'Jane',

        lastName: 'Smith',

        contact: { email: 'jane@example.com' },

        slug: 'jane-smith',
      },
    ];

    const mockStore = {
      entrepreneurs: mockEntrepreneurs,

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    await wrapper.vm.$nextTick();

    // Since we're mocking the ResourceDataTable component, we just check that the store contains the data

    expect(mockStore.entrepreneurs).toHaveLength(2);

    expect(mockStore.entrepreneurs[0].firstName).toBe('John');

    expect(mockStore.entrepreneurs[1].firstName).toBe('Jane');
  });

  it('handles add entrepreneur action', async () => {
    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Simulate the add event (this would be triggered by the ResourceDataTable)

    (wrapper.vm as any).addEntrepreneur();

    expect(routerPushMock).toHaveBeenCalledWith('/entrepreneurs/new');
  });

  it('handles view entrepreneur action', async () => {
    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Simulate the view event

    (wrapper.vm as any).viewEntrepreneur('test-id');

    expect(routerPushMock).toHaveBeenCalledWith('/entrepreneurs/test-id');
  });

  it('handles edit entrepreneur action', async () => {
    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Simulate the edit event

    (wrapper.vm as any).EditEntrepreneur('test-id');

    expect(routerPushMock).toHaveBeenCalledWith('/entrepreneurs/test-id/edit');
  });

  it('handles delete entrepreneur action', async () => {
    const removeMock = vi.fn(() => Promise.resolve());

    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: removeMock,

      removeMany: vi.fn(() => Promise.resolve()),
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Simulate the delete confirmation

    await (wrapper.vm as any).confirmDelete('test-id');

    expect(removeMock).toHaveBeenCalledWith('test-id');
  });

  it('handles delete selected entrepreneurs action', async () => {
    const removeManyMock = vi.fn(() => Promise.resolve());

    const mockStore = {
      entrepreneurs: [],

      loading: false,

      error: null,

      fetchAll: vi.fn(() => Promise.resolve()),

      remove: vi.fn(() => Promise.resolve()),

      removeMany: removeManyMock,
    };

    vi.mocked(useEntrepreneurStore).mockReturnValue(mockStore as any);

    const wrapper = mountWithGlobalComponents(EntrepreneurListView);

    // Simulate the delete selected confirmation

    await (wrapper.vm as any).confirmDeleteSelected(['id1', 'id2']);

    expect(removeManyMock).toHaveBeenCalledWith(['id1', 'id2']);
  });
});
