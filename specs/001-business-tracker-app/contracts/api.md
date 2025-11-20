# API Contracts: Business Tracker Application

## Entrepreneurs API

### `GET /api/entrepreneurs`

Returns a list of all entrepreneurs.

### `GET /api/entrepreneurs/:id`

Returns a single entrepreneur by ID.

### `POST /api/entrepreneurs`

Creates a new entrepreneur.

**Request Body**:

```json
{
  "firstName": "String",
  "lastName": "String",
  "email": "String",
  "telephone": "String",
  "slug": "String",
  "address": "String",
  "personalWebsite": "String",
  "socialMedia": {
    "linkedin": "String",
    "twitter": "String"
  }
}
```

### `PUT /api/entrepreneurs/:id`

Updates an existing entrepreneur.

**Request Body**:

```json
{
  "firstName": "String",
  "lastName": "String",
  "email": "String",
  "telephone": "String",
  "slug": "String",
  "address": "String",
  "personalWebsite": "String",
  "socialMedia": {
    "linkedin": "String",
    "twitter": "String"
  }
}
```

### `DELETE /api/entrepreneurs/:id`

Deletes an entrepreneur.

## Businesses API

### `GET /api/businesses`

Returns a list of all businesses.

### `GET /api/businesses/:id`

Returns a single business by ID.

### `POST /api/businesses`

Creates a new business.

**Request Body**:

```json
{
  "entrepreneurId": "UUID",
  "name": "String",
  "location": {
    "latitude": "Number",
    "longitude": "Number"
  },
  "onlinePresence": "String",
  "contact": {
    "email": "String",
    "telephone": "String"
  },
  "primaryBusinessArea": "String",
  "secondaryBusinessArea": "String",
  "socialMedia": {
    "linkedin": "String",
    "twitter": "String"
  },
  "registrationNumber": "String",
  "registrationDate": "Date",
  "activityStartDate": "Date",
  "supportStartDate": "Date"
}
```

### `PUT /api/businesses/:id`

Updates an existing business.

**Request Body**:

```json
{
  "entrepreneurId": "UUID",
  "name": "String",
  "location": {
    "latitude": "Number",
    "longitude": "Number"
  },
  "onlinePresence": "String",
  "contact": {
    "email": "String",
    "telephone": "String"
  },
  "primaryBusinessArea": "String",
  "secondaryBusinessArea": "String",
  "socialMedia": {
    "linkedin": "String",
    "twitter": "String"
  },
  "registrationNumber": "String",
  "registrationDate": "Date",
  "activityStartDate": "Date",
  "supportStartDate": "Date"
}
```

### `DELETE /api/businesses/:id`

Deletes a business.