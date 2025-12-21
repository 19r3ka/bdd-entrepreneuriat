# VentureTrack: Entrepreneur Impact Tracker

A comprehensive Results-Based Management (RBM) tool for tracking entrepreneur growth, support interventions, and impact metrics. Built with Vue 3, Vite, PrimeVue, and IndexedDB for a robust offline-first experience.

## Core Features

-   **Business & Entrepreneur Registry**: Centralized management of MSMEs and their founders.
-   **Monitoring & Evaluation (M&E) Module**:
    -   **Support Interventions**: Log and track support boosts (Grants, Training, Mentoring) with financial tracking.
    -   **Quick Wins & Outputs**: Document immediate results from UNDP support.
    -   **Maturity Radar**: Visual growth tracking across 5 axes (Formalization, Finance, Digital, Market, Green).
    -   **Performance Metrics**: Long-term impact tracking with polymorphic indicators.
-   **Data Import/Export**: Multi-step wizard for CSV/Excel data import with conflict resolution.
-   **Offline-First**: Reliable data persistence using IndexedDB (via Dexie.js).

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/19r3ka/bdd-entrepreneuriat.git
    cd entrepreneurs_app/app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

## Architecture & Development Standards

### Data Modeling & Validation
The project uses **Zod** for strict runtime validation and TypeScript type inference.
-   **Atomic Schemas**: Reusable blocks like `Address`, `ContactInfo`, and `Money` (located in `src/schemas/common`).
-   **Centralized Enums**: Single source of truth for all domain enums in `src/schemas/enums`.
-   **Polymorphic Indicators**: Unified M&E indicators using Zod discriminated unions.

### State Management
Managed via **Pinia**, with logic abstracted into specialized stores and composables. Complex business logic is extracted into pure utility helpers (`src/utils/*.helpers.ts`) to maintain low cyclomatic complexity.

### Git Workflow Automation
The repository includes an automated quality gate system:
-   **Husky Hooks**: 
    -   `pre-commit`: Runs `lint-staged` (ESLint + Prettier) on changed files.
    -   `pre-push`: Executes full `type-check` and unit tests.
-   **Automated Versioning**: Uses `standard-version` for semantic versioning and automatic `CHANGELOG.md` generation.
-   **CI/CD**: GitHub Actions workflow automatically deploys to GitHub Pages upon tag creation (`v*`).

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check and fix linting issues |
| `npm run format` | Format codebase with Prettier |
| `npm run test` | Run unit/integration tests with Vitest |
| `npm run type-check` | Run TypeScript validation |
| `npm run release` | Cut a new version (Bump version + Changelog + Tag) |

## Code Quality Governance

The project adheres to strict ESLint rules:
-   **Zero 'any' policy**: `@typescript-eslint/no-explicit-any` is enforced.
-   **Complexity Limits**: Max cyclomatic complexity of 15 per function.
-   **Function Length**: Warns on functions exceeding 100 lines.
-   **Architectural Boundaries**: Strict enforcement of import rules (e.g., Utils cannot import app logic).

---
*Maintained by the DevOps & MCP Team*