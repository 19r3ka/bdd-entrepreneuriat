# Entrepreneur Registry App - Workspace

This repository contains the source code and specifications for the Entrepreneur Impact Tracker (VentureTrack).

## Repository Structure

-   **`app/`**: The main Vue 3 application.
    -   Framework: Vue 3 (Script Setup)
    -   Tooling: Vite, ESLint, Prettier, Husky
    -   State: Pinia + Dexie (IndexedDB)
    -   See [app/README.md](app/README.md) for application-specific details.
-   **`specs/`**: Technical specifications, research, and documentation for features.
    -   Organized by feature ID (e.g., `007-schema-refactor`).
    -   Contains data models, plans, and task lists.
-   **`.specify/`**: Internal tooling and templates for managing project state and specifications.
-   **`.github/`**: CI/CD workflows for automated deployment.

## Technical Highlights

-   **Strict Typing**: End-to-end type safety using Zod schemas and TypeScript.
-   **Offline-First**: Fully functional offline mode with local-first persistence.
-   **Automated Workflow**: Integrated git hooks and CI/CD gates for code quality.

## Getting Started

To work on the application:

```bash
cd app
npm install
npm run dev
```

For detailed documentation, refer to the individual directories.
