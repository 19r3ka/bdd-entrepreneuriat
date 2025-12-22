import { describe, it, expect, vi } from 'vitest';
import { useConfirmation } from './useConfirmation';

// Mock PrimeVue composables
const mockRequire = vi.fn();
const mockAdd = vi.fn();

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({
    add: mockAdd,
  })),
}));

vi.mock('primevue/useconfirm', () => ({
  useConfirm: vi.fn(() => ({
    require: mockRequire,
  })),
}));

describe('useConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('showConfirmation calls confirm.require with correct message/header/icon', () => {
    const { showConfirmation } = useConfirmation();

    const message = 'Test message';
    const header = 'Test header';
    const acceptCallback = vi.fn();
    const rejectCallback = vi.fn();

    showConfirmation(message, header, acceptCallback, rejectCallback);

    expect(mockRequire).toHaveBeenCalledWith({
      message,
      header,
      icon: 'pi pi-exclamation-triangle',
      accept: expect.any(Function),
      reject: expect.any(Function),
    });
  });

  it('confirmDelete triggers accept callback and success toast', async () => {
    const { confirmDelete } = useConfirmation();

    const entityName = 'Business';
    const acceptCallback = vi.fn().mockResolvedValue(undefined);

    confirmDelete(entityName, acceptCallback);

    // Check that the require was called with correct parameters
    expect(mockRequire).toHaveBeenCalledWith({
      message: `Are you sure you want to delete this ${entityName}?`,
      header: `Delete ${entityName}`,
      icon: 'pi pi-exclamation-triangle',
      accept: expect.any(Function),
      reject: expect.any(Function),
    });

    // Simulate the accept callback being called
    const callArgs = mockRequire.mock.calls[0]![0];
    await callArgs.accept();

    expect(acceptCallback).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith({
      severity: 'success',
      summary: `${entityName} deleted`,
      life: 3000,
    });
  });

  it('confirmDeleteSelected triggers accept callback and success toast with count', async () => {
    const { confirmDeleteSelected } = useConfirmation();

    const entityName = 'Business';
    const count = 5;
    const acceptCallback = vi.fn().mockResolvedValue(undefined);

    confirmDeleteSelected(entityName, count, acceptCallback);

    // Check that the require was called with correct parameters
    expect(mockRequire).toHaveBeenCalledWith({
      message: `Are you sure you want to delete ${count} ${entityName}(s)?`,
      header: `Delete ${entityName}(s)`,
      icon: 'pi pi-exclamation-triangle',
      accept: expect.any(Function),
      reject: expect.any(Function),
    });

    // Simulate the accept callback being called
    const callArgs = mockRequire.mock.calls[0]![0];
    await callArgs.accept();

    expect(acceptCallback).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith({
      severity: 'success',
      summary: `${count} ${entityName}(s) deleted`,
      life: 3000,
    });
  });
});
