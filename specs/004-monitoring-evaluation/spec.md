# Feature Specification: Log Support Boosts

**Feature Branch**: `004-monitoring-evaluation`  
**Created**: 2025-11-25
**Status**: Draft  
**Input**: User description: "I want to log support boosts that businesses receive from undp. This logging should be compliant with the undp business support m&e guidelines without being overkill."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log a Support Boost (Priority: P1)

As a Program Manager, I want to log a support boost that a business has received so that we have an accurate record of the support provided.

**Why this priority**: This is the core functionality of the feature and the primary mechanism for data entry.

**Independent Test**: Can be tested by navigating to a business's profile or from the dashboard, adding a new support boost, and verifying it appears in the business's support history.

**Acceptance Scenarios**:

1. **Given** I am on the detail page for a registered business, **When** I click the "Add Support Boost" button, **Then** I am shown a form to enter the boost details.
2. **Given** I have filled out the support boost form with valid data, **When** I submit the form, **Then** the new support boost is visible in the business's activity stream or support history, and I see a confirmation message.

---

### User Story 2 - View Support History (Priority: P2)

As a Program Manager (initially), I want to view the complete history of support boosts for a specific business, so that I can understand the full picture of support provided over time.

**Why this priority**: Viewing data is essential for monitoring and reporting.

**Independent Test**: Can be tested by navigating to a business that has multiple logged boosts and verifying that all are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a business has received multiple support boosts, **When** I view the business's detail page, **Then** I see a list of all support boosts in reverse chronological order.

---

### Edge Cases

- The system MUST ensure that users can only log support boosts for existing business entities available within the application.
- For invalid form data (e.g., a date in the future), the system MUST display clear, inline validation messages.
- For network errors during form submission, the system MUST display non-blocking toast notifications (e.g., "Submission failed, please try again").

## Clarifications

### Session 2025-11-25
- Q: What is the specific name or type of this "single authorized user" role, and what are the initial expectations for future user roles? → A: "Program Manager" (current), with future roles including "M&E Officer" and "Administrator" (future).
- Q: Can a support boost be edited or deleted once it has been logged into the system? → A: Support boosts can be fully edited and deleted by an authorized user.
- Q: How is the `business_id` validated? Is there an existing external business registry system, or should the `SupportBoost` logging feature assume that business records are managed within this same application? → A: Business records are managed within this same application.
- Q: What is the expected user experience when invalid data is entered or network errors occur during form submission? → A: Clear, inline validation messages for invalid data; non-blocking toast notifications for network errors.
- Q: What are the expected number of businesses and support boosts (e.g., per day/month/year) that the system should be designed to handle? → A: Small scale: up to 100 businesses, 1-2 boosts/business/month.
- Q: How will user authentication and authorization be handled (e.g., existing system, new system, password policy, data encryption)? → A: Leverage existing application-level authentication and authorization mechanisms. None is required right now. The app lives solely on the user's device.
- Q: What formats are required for exporting support boost data for M&E reporting (e.g., CSV, Excel, PDF, API endpoint), and how will the export be initiated? → A: Export data as CSV files, initiated via a simple button click on the reporting view.
- Q: What are the uptime expectations and disaster recovery requirements for this feature (e.g., daily backups, Recovery Time Objective (RTO), Recovery Point Objective (RPO))? → A: Basic reliability: Daily local backups of data; no specific RTO/RPO defined for now.
- Q: Are there any specific accessibility (e.g., WCAG compliance) or localization (e.g., multi-language support) requirements for the user interface? → A: The app uses vuei18n for French and English.
- Q: What level of system observability (e.g., application logs for debugging, business metrics for usage, error alerting) is required for this feature? → A: Basic application logging for debugging and error alerting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow authorized users to log a support boost for a business.
- **FR-002**: The system MUST store support boost information according to the following schema to ensure compliance with UNDP M&E guidelines while remaining minimal:
    - `support_boost_id`: PK: UUID of this support boost
    - `business_id`: FK: UUID of the business receiving support
    - `title`: e.g., 'Digital Kickstart Grant'
    - `boostType`: Categorization of support (e.g., "financial_grant", "training", etc.)
    - `modality`: UNDP implementation modality (e.g., "DIM", "NIM", "hybrid")
    - `start_date`: ISO date string (YYYY-MM-DD)
    - `end_date`: Optional ISO date string
    - `provider`: Optional UNDP unit or partner org
    - `channel`: Optional (e.g., "in-person", "online", "hybrid")
    - `quantity`: Object with `value` (numeric), `unit` (e.g., "currency", "hours"), and optional `currency` (ISO-4217 code)
    - `rbm_level`: Optional (e.g., "input", "output", "outcome", "impact")
    - `cpd_output_code`: Optional string
    - `sp_outcome_code`: Optional string
    - `irrf_indicator_ids`: Optional array of strings
    - `sdg_targets`: Optional array of strings
    - `gender_marker`: (e.g., "GEN0", "GEN1", "GEN2", "GEN3")
    - `notes`: Optional free-form text (max 2000 chars)
    - `created_at`, `created_by`, `updated_at`, `updated_by`: Optional audit fields
- **FR-003**: The history of support boosts for a business MUST be displayed on its detail page.
- **FR-004**: The system MUST restrict the ability to log and view support boosts to a user with the "Program Manager" role. This restriction is handled by the local device's access to the application, as no formal authentication/authorization is required for now. A clear path for future expansion to roles like "M&E Officer" and "Administrator" should be maintained.
- **FR-005**: An authorized user MUST be able to edit all fields of a logged support boost.
- **FR-006**: An authorized user MUST be able to delete a logged support boost.
- **FR-007**: The system MUST assume that business records are managed internally within this application, and the `business_id` refers to an existing internal business entity.
- **FR-010**: The system MUST allow users to export support boost data as a CSV file, initiated by a button click within the reporting view.

### Non-Functional Requirements
- **FR-008**: The system MUST be designed to handle a small scale, specifically up to 100 businesses, with an average of 1-2 support boosts per business per month.
- **FR-009**: The system does NOT require formal authentication or authorization mechanisms, as the application is assumed to run on a user's local device, and access control is managed at the device level.
- **FR-011**: The system MUST implement basic reliability by performing daily local backups of data, with no specific RTO/RPO defined for now.
- **FR-012**: The system MUST support localization for French and English using `vuei18n`.
- **FR-013**: The system MUST provide basic application logging for debugging and error alerting.

### Key Entities

- **SupportBoost**: Represents a single instance of support given to a business, conforming to the schema detailed in FR-002.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An authorized user can log a new support boost in under 90 seconds.
- **SC-002**: 100% of support boost logs are associated with a valid, existing business.
- **SC-003**: Reports based on M&E data can be generated within 2 minutes.
- **SC-004**: The time required to find the full support history for any given business is less than 30 seconds.