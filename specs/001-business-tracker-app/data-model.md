# Data Model: Business Tracker Application

## Entrepreneur

| Field | Type | Description | Required |
|---|---|---|---|
| id | UUID | Unique identifier | Yes |
| firstName | String | First name | Yes |
| lastName | String | Last name | Yes |
| email | String | Email address | No |
| telephone | String | Telephone number | No |
| slug | String | Unique slug for the entrepreneur | Yes |
| address | String | Physical address | No |
| personalWebsite | String | Personal website URL | No |
| socialMedia | Object | Social media profile URLs | No |
| - linkedin | String | LinkedIn profile URL | No |
| - twitter | String | Twitter profile URL | No |

## Business

| Field | Type | Description | Required |
|---|---|---|---|
| id | UUID | Unique identifier | Yes |
| entrepreneurId | UUID | Foreign key to the Entrepreneur table | Yes |
| name | String | Business name | Yes |
| location | Object | Geo-data for the business location | No |
| - latitude | Number | Latitude | No |
| - longitude | Number | Longitude | No |
| onlinePresence | String | Business website URL | No |
| contact | Object | Contact information (email, telephone) | No |
| primaryBusinessArea | String | Primary business area | No |
| secondaryBusinessArea | String | Secondary business area | No |
| socialMedia | Object | Business social media profile URLs | No |
| - linkedin | String | LinkedIn profile URL | No |
| - twitter | String | Twitter profile URL | No |
| registrationNumber | String | Business registration number | No |
| registrationDate | Date | Date of business registration | No |
| activityStartDate | Date | Date when business activities started | No |
| supportStartDate | Date | Date when support for the business started | No |
