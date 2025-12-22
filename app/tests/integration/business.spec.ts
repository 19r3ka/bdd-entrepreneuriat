import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import BusinessForm from '../../src/components/BusinessForm.vue';
import { db } from '../../src/services/local-db';
import BusinessListView from '../../src/views/BusinessListView.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
  })),
}));

describe('Business CRUD Integration', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    await db.businesses.clear();
  });

  it('should create a new business and display it in the list', async () => {
    const router = useRouter();
    const listViewWrapper = mount(BusinessListView);
    expect(listViewWrapper.text()).toContain('Add Business');

    // Simulate adding a new business
    useRoute.mockImplementation(() => ({ params: {} }));
    const formWrapper = mount(BusinessForm);
    await formWrapper.find('#name').setValue('Integration Business');
    await formWrapper.find('#entrepreneurId').setValue('some-entrepreneur-id');
    await formWrapper.find('#primaryBusinessArea').setValue('IT');
    await formWrapper.find('#registrationNumber').setValue('12345');
    await formWrapper.find('button[type="submit"]').trigger('submit');

    expect(router.push).toHaveBeenCalledWith('/businesses');

    // Re-mount the list view to reflect changes
    await listViewWrapper.vm.$nextTick();
    expect(listViewWrapper.text()).toContain('Integration Business');
  });

  // Add more integration tests for update, delete, and detail view
});
