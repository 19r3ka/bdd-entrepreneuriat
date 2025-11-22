# Data Model: Inclusive Data and Business Map

This document outlines the data model changes required for the "Inclusive Data and Pluggable Business Map" feature.

## Updated Entities

### Entrepreneur

The `Entrepreneur` entity will be updated to include fields for gender and date of birth to support inclusivity and demographic analysis.

| Field Name  | Type     | Description                                     | Validation Rules               |
|-------------|----------|-------------------------------------------------|--------------------------------|
| `id`        | `string` | Unique identifier (existing)                    |                                |
| `name`      | `string` | Entrepreneur's full name (existing)             |                                |
| `...`       | `...`    | (Other existing fields)                         |                                |
| `gender`    | `string` | **(New)** The entrepreneur's gender identity.   | Must be one of: 'Woman', 'Man', 'Non-binary', 'Prefer not to say'. |
| `dateOfBirth`| `Date`  | **(New)** The entrepreneur's date of birth.     | Must be a valid date in the past. |

### Business

The `Business` entity already contains the necessary `geolocation` data. No changes are required for this entity's structure. Its data will be consumed by the new map component.

| Field Name     | Type      | Description                                     |
|----------------|-----------|-------------------------------------------------|
| `id`           | `string`  | Unique identifier (existing)                    |
| `name`         | `string`  | Business name (existing)                        |
| `geolocation`  | `object`  | **(Used)** Geographic coordinates.              |
| `geolocation.lat` | `number` | Latitude.                                    |
| `geolocation.lng` | `number` | Longitude.                                   |
| `...`          | `...`     | (Other existing fields)                         |