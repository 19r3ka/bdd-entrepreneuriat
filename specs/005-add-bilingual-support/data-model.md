# Data Model: Bilingual Support

## Entities

### LocalePreference

User's saved configuration for language.

```typescript
type Locale = 'en' | 'fr';

// Persisted as a simple string in localStorage
type LocalePreference = Locale;
```

## Translation File Structure

The translation files (`en.json`, `fr.json`) MUST adhere to the following schema structure to ensure consistency and grouping.

### Schema Definition

```json
{
  "common": {
    "actions": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit"
    },
    "messages": {
      "loading": "Loading...",
      "success": "Operation successful",
      "error": "An error occurred"
    },
    "labels": {
      "name": "Name",
      "description": "Description"
    }
  },
  "nav": {
    "home": "Home",
    "settings": "Settings"
  },
  "domain": {
    "business": {
      "title": "Business",
      "title_plural": "Businesses",
      "status": {
        "active": "Active",
        "inactive": "Inactive"
      }
    },
    "entrepreneur": {
      "role_male": "Entrepreneur",
      "role_female": "Entrepreneur"
    }
  }
}
```

### Rules
1.  **grouping**: Top-level keys represent features or domains (e.g., `auth`, `dashboard`, `common`).
2.  **casing**: Keys are `camelCase`.
3.  **linked**: Use `@:path.to.key` for repetitions.
