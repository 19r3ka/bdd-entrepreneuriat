# Feature Specification: Inclusive Data and Pluggable Business Map

**Feature Branch**: `003-add-map-and-demographics`
**Created**: 2025-11-20
**Status**: Draft
**Input**: User description: "after review by the stakeholders, they suggest to make the app more inclusive by adding references to gender and age to entrepreneurs' data and to add a real map feature so that we can see on a map where the businesses that are supported are located. That would make the geolocation data we have more useful. The developer is complaining about the use of biome because it does not understand sfc. He wishes for this project to enforce eslint + prettier since this combo has proven to be efficient for vue 3 apps."
**Revision**: "The map view is a good idea but there should be a pluggable map component that would help get longitude and latitude, or that would, given a specific business highlighted would display it on the map. Such a component could be used when adding or updating a business, when displaying a business (view-only in this case). it could also be displayed on the dashboard view on the home page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All Businesses on Dashboard Map (Priority: P1)

As a user, when I visit the dashboard, I want to see an interactive map showing the locations of all supported businesses, so I can get a quick geographical overview.

**Why this priority**: This is a primary new feature requested by stakeholders and provides a significant new way for users to interact with the business data at a high level.

**Independent Test**: The dashboard can be loaded, and it will display a map with business locations. This can be tested independently of other map usages.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they navigate to the dashboard, **Then** they see a map with pins representing each business location.
2. **Given** the dashboard map is displayed, **When** the user clicks on a business pin, **Then** an infowindow appears showing basic business info (name, category) and a link to the business's full detail page.
3. **Given** many businesses are located in a small area, **Then** pin clustering is used; pins in dense areas are grouped into a single cluster icon showing the number of businesses. Clicking a cluster zooms into that area.

---

### User Story 2 - Set Business Location using Map in Form (Priority: P1)

As an administrator, when I create or edit a business, I want to use an interactive map to search for an address and visually confirm or adjust the business's location pin, so that I can ensure geolocation data is accurate.

**Why this priority**: Accurate data is critical for the map feature to be useful. This provides the primary input method for that data.

**Independent Test**: An administrator can open the business form, use the map component to set a location, and save the business. The resulting geolocation data can be verified.

**Acceptance Scenarios**:

1. **Given** an admin is on the "Add/Edit Business" form, **When** they type an address into a search field within the map component, **Then** the map centers on the address and places a pin there.
2. **Given** a pin is placed on the map in the form, **When** the admin drags the pin to a new location, **Then** the latitude and longitude fields are updated automatically.
3. **Given** the admin saves the business form, **Then** the latitude and longitude from the map component are saved with the business record.

---

### User Story 3 - View Single Business Location on Detail Page (Priority: P2)

As a user, when I view the details of a specific business, I want to see a small, view-only map showing its location, so I can easily understand where it is situated.

**Why this priority**: This enhances the business detail view and provides immediate geographical context for a single business.

**Independent Test**: A user can navigate to any business detail page, and a map showing that business's location will be displayed.

**Acceptance Scenarios**:

1. **Given** a user is on a business detail page, **When** the page loads, **Then** a map is displayed showing a single pin at the business's location.
2. **Given** the detail page map is displayed, **When** the user interacts with it (e.g., zoom, pan), **Then** the map responds accordingly.

---

### User Story 4 - Add Inclusive Data to Entrepreneur Profiles (Priority: P2)

As an administrator, I want to be able to add and update gender and age information for each entrepreneur to ensure our data is inclusive and better represents the community.

**Why this priority**: This fulfills a direct stakeholder request for inclusivity and enhances the richness of the data model.

**Independent Test**: An administrator can open the entrepreneur edit form, fill in the new 'gender' and 'age' fields, and save the data.

**Acceptance Scenarios**:

1. **Given** an administrator is editing an entrepreneur's profile, **When** they access the personal information section, **Then** they see new fields for 'Gender' and 'Date of Birth'.
2. **Given** an administrator fills in the 'Gender' and 'Date of Birth' fields with valid data, **When** they save the form, **Then** the information is saved successfully.
3. **Given** an admin views the entrepreneur's detail page, **Then** the gender and calculated age are displayed.

---

### Edge Cases

- What happens if a business has an invalid or missing geolocation? (It should be omitted from maps and flagged for admin review).
- How does the address search handle ambiguous addresses in the business form? (It should present a list of possible matches for the user to select from).
- How are partially filled demographic data handled (e.g., age without gender)? (The system should accept and store any provided data without requiring all fields to be filled).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A reusable, pluggable map component MUST be created.
- **FR-002**: The map component MUST be capable of displaying one or more business locations as pins.
- **FR-003**: The map component in an "edit" mode MUST provide address search functionality to find and set coordinates.
- **FR-004**: The map component in "edit" mode MUST allow a pin to be dragged to fine-tune a location.
- **FR-005**: The dashboard page MUST integrate the map component to show all businesses.
- **FR-006**: The business detail page MUST integrate the map component in a "view-only" mode.
- **FR-007**: The business create/edit form MUST integrate the map component in an "edit" mode.
- **FR-008**: The data model for an Entrepreneur MUST be extended to include 'gender' and 'date of birth'.
- **FR-009**: The UI for creating/editing an entrepreneur MUST include fields for 'gender' and 'date of birth', using a pre-defined list: 'Woman', 'Man', 'Non-binary', 'Prefer not to say'.
- **FR-010**: The system MUST display the saved gender and calculated age on the entrepreneur's detail page.

### Key Entities *(include if feature involves data)*

- **Entrepreneur**: Represents an individual entrepreneur.
  - New Attributes: `gender`, `dateOfBirth`.
- **Business**: Represents a business entity.
  - Used Attribute: `geolocation` (latitude, longitude) for map plotting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of businesses with valid geolocation data are accurately plotted on all relevant maps.
- **SC-002**: An admin can successfully set or update a business's location using the map component in under 30 seconds.
- **SC-003**: The dashboard map, with all business pins, loads in under 3 seconds.
- **SC-004**: Stakeholder satisfaction survey shows a positive response (>= 80%) to the new map and inclusivity features.
- **SC-005**: The map component is successfully reused in at least 3 different parts of the application (Dashboard, Business Form, Business Details).

## Assumptions

- The existing `Business` entity has a data structure that can store reliable `geolocation` (latitude, longitude) data.
- An external geocoding service will be needed for address lookups; the choice of provider is an implementation detail.
- The linter/tooling changes mentioned are developer-facing concerns and will be handled outside of this spec, but may be implemented on the same branch.

## Clarifications

### Session 2025-11-20

- Q: What should happen when a user clicks on a business pin in the main dashboard map? → A: Open a small pop-up (infowindow) with basic business info (e.g., name, category) and a link to the business's full detail page.
- Q: How should the map display a large number of businesses in a concentrated area to avoid visual clutter? → A: Use pin clustering. Pins in dense areas are grouped into a single cluster icon showing the number of businesses. Clicking a cluster zooms into that area.
- Q: To ensure inclusivity, what options should be provided for the gender field? → A: A pre-defined list: 'Woman', 'Man', 'Non-binary', 'Prefer not to say'.