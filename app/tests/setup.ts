import { vi } from 'vitest';
import 'fake-indexeddb/auto';

// Global mocks
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}));

vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => ({
    require: vi.fn(),
    close: vi.fn(),
  }),
}));
