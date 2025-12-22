# Feature Specification: Data Import and Export

**Feature Branch**: `006-data-import-export`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "as a user I want to quickly and easily export any data from the app for further data analysis with the plateform of my choice, probably, mainly ms excel or powerbi. Likewise, i need to be able to import business data into the app. The thing is that the available data for each business might not be thourough or even close to the minimal schema requirements for validation. The app should be able to record these partial records somewhere and regularly prompt the user to search and document the missing data so the business could be properly added to the official registry and be tracked. If possible, the app should make it possible to access remote file lockers like MS OneDrive, or G Drive. If that would be too complicated then exporting would mean to choose the fields we want from the datamodels to export and download the data."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export Business Data (Priority: P1)

As a user, I want to export business data from the application into standard formats (CSV, Excel) so that I can perform further analysis in tools like Microsoft Excel or PowerBI.

**Why this priority**: Critical for the user's goal of external data analysis.

**Independent Test**: Can be tested by creating a business, exporting the list, and verifying the file opens correctly in Excel.

**Acceptance Scenarios**:

1. **Given** a list of businesses exists in the system, **When** I select "Export Data", **Then** I can choose a format (CSV or Excel) and download the file.
2. **Given** I have downloaded the export file, **When** I open it in Excel/PowerBI, **Then** the data is formatted correctly (headers, columns aligned) and readable.

---

### User Story 2 - Import Partial Data (Priority: P1)

As a user, I want to import business data from external files even if the data is incomplete or does not meet strict validation rules, so that I can bring in all available information without data loss.

**Why this priority**: Essential for initializing the database from existing, potentially messy records.

**Independent Test**: Create a CSV with missing mandatory fields, upload it, and verify records are saved but marked as "Partial".

**Acceptance Scenarios**:

1. **Given** a CSV file with valid business records, **When** I upload it, **Then** the system creates valid Business entities.
2. **Given** a CSV file with missing mandatory fields (e.g., missing contact info), **When** I upload it, **Then** the system saves these as "Partial Records" and does not reject them.
3. **Given** an import is finished, **Then** the system provides a summary of successful imports vs. partial/incomplete records.

---

### User Story 3 - Remediation of Partial Records (Priority: P2)

As a user, I want to be notified about partial records and easily access them to fill in missing information, ensuring they can eventually be added to the official registry.

**Why this priority**: Ensures data quality improves over time and "Partial" records don't become a graveyard of useless data.

**Independent Test**: Have "Partial" records in the system, verify a prompt appears, click it, update a record, and verify it becomes a standard "Business".

**Acceptance Scenarios**:

1. **Given** partial records exist, **When** I view the dashboard, **Then** I see a prompt/widget indicating the number of records needing attention.
2. **Given** I am viewing a Partial Record, **When** I fill in the missing mandatory data and save, **Then** the record is promoted to a valid Business entity and removed from the "Partial" list.

---

### User Story 4 - Flexible Data Access (Priority: P3)

As a user, I want to either connect to cloud storage or have granular control over exports to fit my workflow.

**Why this priority**: Enhances usability and integration but core export/import (P1) works without it.

**Independent Test**: Verify the chosen method (Cloud Auth OR Field Selection) functions as expected.

**Acceptance Scenarios**:

1. **Given** the export interface, **When** I configure the export options, **Then** I can select which specific fields/columns to include in the generated export file.

### Edge Cases

- What happens when an imported file has a corrupted format or wrong encoding? (System should reject the file with a clear error).
- What happens when an imported record is a duplicate of an existing business? (System should identify duplicates by exact match on Business Name or official Registration ID and flag them for user action or rejection).
- How does the system handle extremely large import files? (System will reject files exceeding FR-008's row limit).

## Clarifications

### Session 2025-12-06

- Q: What is the duplicate detection strategy during import? → A: Strict Exact Match (by Business Name or Registration ID).
- Q: How should users be notified about partial records? → A: Dashboard Widget only (a visible counter leading to the partial records list).

- Q: How much data should be stored for partial records? → A: All Fields (Superset) in a JSON blob.
- Q: What is the maximum allowed size for import files? → A: Strict Row Limit (e.g., 5,000 rows).
- Q: What is the minimum required information for a Partial Record? → A: At least a business name and owner's name (formatted as "last name, first names").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to export Business and Entrepreneur data to CSV and Excel (.xlsx) formats. (Note: .xls legacy format is NOT supported).
- **FR-002**: System MUST allow users to upload CSV/Excel files to import Business data.
- **FR-003**: System MUST validate imported records against the Business schema.
- **FR-004**: System MUST persist records that fail validation as "Partial Records" separate from the main Business registry.
- **FR-005**: System MUST display a persistent dashboard widget showing the count of pending Partial Records, which navigates to the resolution list when clicked.
- **FR-006**: System MUST provide an interface to edit Partial Records and attempt validation again to promote them to full status.
- **FR-007**: System MUST allow users to customize exports by selecting specific fields to include in the output file. (Note: Direct cloud storage integration is out of scope; users rely on OS file dialogs).
- **FR-008**: System MUST reject import files exceeding a maximum of 5,000 rows.
- **FR-009**: System MUST reject any imported record that does not contain both a business name and the owner's name (formatted as "last name, first names"), preventing it from being saved even as a Partial Record.

### Key Entities *(include if feature involves data)*

- **PartialRecord**: A temporary or staging entity holding data that failed strict validation. Attributes: `rawData` (JSON blob containing all fields from the source row, including unmapped or extra columns), `missingFields` (List), `importSource` (File reference), `status` (Draft/Pending). Records must meet the minimum viability criteria of FR-009.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully import a file with 50% incomplete records and have 100% of data persisted (split between Business and PartialRecord).
- **SC-002**: Exported files open in Excel/PowerBI without requiring manual formatting fixes (e.g., correct date formats, encoding).
- **SC-003**: "Partial" records can be converted to "Full" records via the UI in under 3 clicks (excluding data entry time).