import { describe, it, expect, vi } from 'vitest';
import { mountWithGlobalComponents } from './test-utils';
import ResourceDataTable from '@/components/common/ResourceDataTable.vue';

const { mockShowConfirmation } = vi.hoisted(() => ({
  mockShowConfirmation: vi.fn(),
}));

vi.mock('@/composables/useConfirmation', () => ({
  useConfirmation: vi.fn(() => ({
    showConfirmation: mockShowConfirmation,
  })),
}));

describe('ResourceDataTable.vue', () => {
  it('renders the data table with correct title', () => {
    const mockData = [{ id: '1', name: 'Test Item' }];
    const mockColumns = [{ field: 'name', header: 'Name' }];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check for the table title
    expect(wrapper.text()).toContain('Entrepreneurs');
  });

  it('renders add button with correct label', () => {
    const mockData = [{ id: '1', name: 'Test Item' }];
    const mockColumns = [{ field: 'name', header: 'Name' }];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check for the add button
    expect(wrapper.find('button').text()).toContain('Add');
  });

  it('emits add event when add button is clicked', async () => {
    const mockData = [{ id: '1', name: 'Test Item' }];
    const mockColumns = [{ field: 'name', header: 'Name' }];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Click the add button
    await wrapper.find('button[label*="Add"]').trigger('click');

    // Check that the add event was emitted
    expect(wrapper.emitted('add')).toBeTruthy();
  });

  it('renders data rows correctly', () => {
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check that data is rendered in the table
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('jane@example.com');
  });

  it('shows "No Data" message when data array is empty', () => {
    const mockData: any[] = [];
    const mockColumns = [{ field: 'name', header: 'Name' }];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check for the empty state message
    expect(wrapper.text()).toContain('No Data');
  });

  it('enters multi-select mode when multi-select button is clicked', async () => {
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Click the multi-select button
    await wrapper.find('button[label*="Multi-Select"]').trigger('click');

    // Check that multi-select controls are now visible
    expect(wrapper.text()).toContain('Delete Selected');
    expect(wrapper.text()).toContain('Export CSV');
    expect(wrapper.text()).toContain('Cancel');
  });

  it('selects items in multi-select mode', async () => {
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Enter multi-select mode
    await wrapper.find('button[label*="Multi-Select"]').trigger('click');

    // Check that selection controls are available
    expect(wrapper.find('.p-checkbox').exists()).toBe(true);
  });

  it('emits delete event when delete button is clicked in row', async () => {
    const mockData = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Click the delete button in the row
    await wrapper.find('button[icon="pi pi-trash"]').trigger('click');

    // Check that the delete event was emitted with the correct ID
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')![0]).toEqual(['1']);
  });

  it('emits edit event when edit button is clicked in row', async () => {
    const mockData = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Click the edit button in the row
    await wrapper.find('button[icon="pi pi-pencil"]').trigger('click');

    // Check that the edit event was emitted with the correct ID
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')![0]).toEqual(['1']);
  });

  it('emits view event when view button is clicked in row', async () => {
    const mockData = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Click the view button in the row
    await wrapper.find('button[icon="pi pi-eye"]').trigger('click');

    // Check that the view event was emitted with the correct ID
    expect(wrapper.emitted('view')).toBeTruthy();
    expect(wrapper.emitted('view')![0]).toEqual(['1']);
  });

  it('renders with correct CSS structure', () => {
    const mockData = [{ id: '1', name: 'Test Item' }];
    const mockColumns = [{ field: 'name', header: 'Name' }];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check for grid structure
    expect(wrapper.classes()).toContain('grid');

    // Check for card wrapper
    expect(wrapper.find('.card').exists()).toBe(true);

    // Check for data table
    expect(wrapper.find('.p-datatable').exists()).toBe(true);
  });

  it('allows filtering when filters are provided', async () => {
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const mockColumns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ];

    const wrapper = mountWithGlobalComponents(ResourceDataTable, {
      props: {
        data: mockData,
        columns: mockColumns,
        dataKey: 'id',
        resourceName: 'entrepreneurs',
        title: 'Entrepreneurs',
      },
    });

    // Check for filter input
    expect(wrapper.find('input[placeholder*="Search"]').exists()).toBe(true);
  });
});
