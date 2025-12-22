import { describe, it, expect } from 'vitest';
import { reactive, nextTick } from 'vue';
import { useSlugLogic } from './useSlugLogic';

describe('useSlugLogic', () => {
  it('should generate a slug automatically from firstName and lastName', async () => {
    const formValues = reactive({
      firstName: 'John',
      lastName: 'Doe',
      slug: '',
    });

    useSlugLogic(formValues);

    await nextTick();
    expect(formValues.slug).toBe('john-doe');
  });

  it('should update the slug when name fields change', async () => {
    const formValues = reactive({
      firstName: 'John',
      lastName: 'Doe',
      slug: '',
    });
    useSlugLogic(formValues);

    await nextTick();
    expect(formValues.slug).toBe('john-doe');

    formValues.firstName = 'Jane';
    await nextTick();
    expect(formValues.slug).toBe('jane-doe');
  });

  it('should sanitize the slug', async () => {
    const formValues = reactive({
      firstName: 'John!',
      lastName: 'Doe@#$',
      slug: '',
    });
    useSlugLogic(formValues);

    await nextTick();
    expect(formValues.slug).toBe('john-doe');
  });

  it('should not update slug if it has been manually edited', async () => {
    const formValues = reactive({
      firstName: 'John',
      lastName: 'Doe',
      slug: '',
    });
    const { markSlugAsManual } = useSlugLogic(formValues);

    await nextTick();
    expect(formValues.slug).toBe('john-doe');

    // Manually edit slug and mark it as such
    formValues.slug = 'custom-slug';
    markSlugAsManual();

    // Change name, slug should not update
    formValues.firstName = 'Jane';
    await nextTick();
    expect(formValues.slug).toBe('custom-slug');
  });

  it('should resume auto-updating after reset', async () => {
    const formValues = reactive({
      firstName: 'John',
      lastName: 'Doe',
      slug: 'custom-slug',
    });
    const { markSlugAsManual, resetSlugManualEdit } = useSlugLogic(formValues);

    markSlugAsManual();
    formValues.firstName = 'Jane';
    await nextTick();
    expect(formValues.slug).toBe('custom-slug'); // Still manual

    resetSlugManualEdit();

    // Now it should auto-update based on the current name
    formValues.firstName = 'Bob';
    await nextTick();
    expect(formValues.slug).toBe('bob-doe');
  });

  it('should handle single names', async () => {
    const formValues = reactive({
      firstName: 'Cher',
      lastName: '',
      slug: '',
    });
    useSlugLogic(formValues);
    await nextTick();
    expect(formValues.slug).toBe('cher');
  });
});
