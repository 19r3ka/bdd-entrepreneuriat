# Quickstart: Bilingual Support

## Adding New Translations

1.  **Locate Files**: Open `app/src/locales/en.json` and `app/src/locales/fr.json`.
2.  **Add Key (English)**: Add your new key to `en.json`. Group it logically (e.g., under `features.myNewFeature`).
3.  **Add Key (French)**: Add the **same key** structure to `fr.json`.
    *   *Tip*: If the text is identical (e.g., a proper noun), you must still add the key, or use a Linked Message `@:path.to.key`.
4.  **Usage in Template**:
    ```html
    <template>
      <!-- Simple -->
      <p>{{ $t('features.myNewFeature.title') }}</p>
      
      <!-- With Count (Plural) -->
      <p>{{ $t('common.items', { count: 5 }) }}</p>
    </template>
    ```

## Switching Languages in Dev

Use the drop-down selector in the main AppHeader.

Alternatively, you can manually modify Local Storage:
1.  Open DevTools -> Application -> Local Storage.
2.  Set `app-locale-preference` to `fr`.
3.  Reload page.

## Best Practices
-   **Avoid Hardcoding**: Never write text directly in `<template>`.
-   **Gender**: If a word changes based on gender, use explicit keys like `role_male` and `role_female` and select the key programmatically.
-   **Linked Messages**: Use `@:common.cancel` instead of typing "Cancel" again.
