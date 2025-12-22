# Data Model: Data Import and Export

## Entities

### PartialRecord
Represents a row from an imported file that failed strict validation against the `Business` schema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier (Primary Key). |
| `raw_data` | JSONB | Yes | The complete row data from the source file (keys = column headers). |
| `missing_fields` | String[] | Yes | List of field names that failed validation or were missing. |
| `status` | Enum | Yes | `pending` (default) \| `ignored`. |
| `import_source` | String | Yes | Name of the file or batch ID this record came from. |
| `created_at` | ISO8601 | Yes | Timestamp of import. |
| `updated_at` | ISO8601 | Yes | Timestamp of last edit. |

### Relationships

- **No direct relationship** to `Business` table (it promotes TO a Business).
- **Potential User link**: `created_by` (UUID) -> `auth.users.id` (if multi-user).

## Validation Rules (Zod)

### PartialRecordSchema
- `raw_data`: Must be a valid object.
- `status`: Must be 'pending' or 'ignored'.
- `import_source`: Non-empty string.

### Business Import Validation (Transformation)
Logic to attempt converting `PartialRecord` -> `Business`:
1. **Map** `raw_data` keys to `Business` fields (e.g., "Company Name" -> `name`).
2. **Validate** against `BusinessSchema`.
3. **If Valid**: Insert into `businesses`, delete from `partial_records`.
4. **If Invalid**: Update `partial_records` with new `missing_fields`.

## State Transitions

1. **Created**: Imported from CSV/Excel -> Validation Fails -> Saved to DB.
2. **Updated**: User edits fields in UI -> `raw_data` updated.
3. **Promoted**: User saves -> Validation Passes -> Record deleted, new Business created.
4. **Ignored**: User marks as irrelevant -> `status` set to `ignored` (soft delete).
