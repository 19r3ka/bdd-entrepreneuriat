# Business Tracker Application

This is a web application to track businesses and entrepreneurs, built with Vue 3, Vite, PrimeVue, Pinia, and IndexedDB/Supabase for data storage.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd entrepreneurs_app/app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Supabase:**
    Create a `.env` file in the `app/` directory with your Supabase project URL and anon key:
    ```
    VITE_SUPABASE_URL=https://your-project-url.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```
    Ensure you have `entrepreneurs` and `businesses` tables created in your Supabase project as per `specs/001-business-tracker-app/data-model.md`.

## Running the Application

```bash
npm run dev
```

This will start the development server. Open your browser to the address indicated in the console (usually `http://localhost:5173`).

## Architecture

This application follows a modular and composable architecture, leveraging Vue 3's reactivity system and modern JavaScript features.

### Data Models & Validation
Data models for `Entrepreneur` and `Business` entities are defined using [Zod schemas](https://zod.dev/). These schemas provide robust type inference and runtime validation, ensuring data integrity across the application. All validation messages are externalized for internationalization.

### State Management
Global state is managed using [Pinia](https://pinia.vuejs.org/). Dedicated stores (`entrepreneur.ts`, `business.ts`) abstract data fetching, manipulation, and caching logic. A generic `useCrudStore` composable provides a standardized interface for CRUD operations with optimistic updates.

### Form Handling
Forms are built using reusable components (`BaseForm.vue`, `FormField.vue`) and a `useForm` composable. This approach centralizes form state management, validation, and submission logic, reducing boilerplate and ensuring consistency.

### Internationalization (i18n)
All user-facing strings, including form labels, validation messages, and UI text, are externalized into locale files (`app/src/locales/*.json`) and managed using `vue-i18n`.

### Performance Enhancements
To improve performance, detail views now utilize a `fetchOne` function to retrieve individual records, avoiding unnecessary fetching of all data. CRUD operations incorporate optimistic updates, providing immediate UI feedback to the user while data is being synchronized with the backend.

### Monitoring & Evaluation (M&E) Module
The application includes a comprehensive M&E module designed to transform it into a Results-Based Management (RBM) tool. Key features include:
- **Support Interventions**: Logging of support provided to businesses (e.g., Grants, Training) with detailed tracking of funds and modalities.
- **Maturity Radar**: A visual tool to track business growth across 5 axes (Formalization, Financial Access, Digital Maturity, Market Access, Environmental Sustainability).
- **Goal Tracking**: Definition of specific goals with baseline and target values, and logging of measurements over time with evidence (file uploads).
- **Progress Reporting**: A timeline view of support vs. outcomes and CSV export capabilities for reporting.

Data for this module is stored locally using IndexedDB (via Dexie.js) to support offline capabilities and data privacy.

## Testing

To run unit and integration tests:

```bash
npm test
```

## Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The configuration is defined in `biome.json` at the project root. To check and apply fixes:

```bash
npx @biomejs/biome check --write
```