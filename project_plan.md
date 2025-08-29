# Project Plan: Ticketi

This document outlines a plan for improving the Ticketi application, focusing on code quality, future-proofing, and a phased development roadmap with clear MVPs.

## Part 1: Code Quality and Improvement Suggestions

This section details areas of the codebase that can be improved to enhance security, maintainability, and scalability.

### Backend Improvements

#### 1. Configuration Management

*   **Issue:** The `JWT_SECRET_KEY` has a hardcoded default value, which is a significant security risk. The database credentials, while now using an environment variable, are still visible in `docker-compose.yml`.
*   **Suggestion:**
    *   Remove the default value for `JWT_SECRET_KEY` in `server/app.py` and rely solely on the environment variable. The application should fail to start if the variable is not set.
    *   For production, use a more secure method for managing secrets, such as Docker secrets, HashiCorp Vault, or AWS Secrets Manager, instead of passing them directly in the `docker-compose.yml` file.

#### 2. Error Handling and Logging

*   **Issue:** The current error handling is too generic (using `except Exception as e:`), which can hide bugs. There is also a lack of structured logging.
*   **Suggestion:**
    *   Replace generic `except` blocks with specific exception types (e.g., `SQLAlchemyError`, `IntegrityError`).
    *   Integrate a proper logging library (like Python's built-in `logging` module) to log errors with different levels (e.g., INFO, WARNING, ERROR) to a file or a centralized logging service. This is crucial for debugging in a production environment.

#### 3. Code Structure and Business Logic

*   **Issue:** Much of the business logic is currently located directly within the route handlers, making them complex and difficult to test.
*   **Suggestion:**
    *   Refactor the business logic out of the route handlers and into separate "service" layers or classes. For example, create a `TicketService` that handles the logic for purchasing and reselling tickets. This will make the code more modular, reusable, and easier to test.

#### 4. Database Performance

*   **Issue:** Some database queries are inefficient and will not scale well.
*   **Suggestion:**
    *   **Fix N+1 Queries:** In the `get_my_tickets` endpoint, use SQLAlchemy's `joinedload` or `selectinload` to eager load the associated event data with a single query, avoiding a separate query for each ticket.
    *   **Implement Pagination:** For endpoints that return lists of data (e.g., `get_events`, `get_my_tickets`), implement pagination to return the results in manageable chunks. This will improve performance and reduce memory consumption.

#### 5. Security Enhancements

*   **Issue:** The application is missing some common security best practices.
*   **Suggestion:**
    *   **Enforce Password Complexity:** In the user registration process, enforce stronger password complexity rules (e.g., requiring a mix of uppercase letters, lowercase letters, numbers, and special characters).
    *   **Implement Rate Limiting:** Protect sensitive endpoints like login and registration from brute-force attacks by implementing rate limiting.

#### 6. Testing

*   **Issue:** There are no automated tests for the backend. This makes it risky to add new features or refactor existing code.
*   **Suggestion:**
    *   Create a comprehensive test suite with both unit tests (for individual functions and services) and integration tests (for API endpoints). This will ensure that the application is working as expected and prevent regressions.

### Frontend Improvements

#### 1. API Layer and Configuration

*   **Issue:** The backend URL (`http://localhost:5000`) is hardcoded in multiple places. This makes it difficult to switch to a different backend environment (e.g., a staging or production server).
*   **Suggestion:** Create a dedicated API client or a configuration file that exports a configured `axios` or `fetch` instance. Use environment variables (like `VITE_API_URL`) to store the API endpoint for different environments.

#### 2. State Management and Data Fetching

*   **Issue:** Data fetching logic is scattered across multiple components, leading to code duplication and difficulty in managing state.
*   **Suggestion:**
    *   **Centralize Data Fetching:** Use a library like `React Query` or `SWR` to manage server state, including caching, refetching, and error handling.
    *   **Consolidate Client State:** For complex client-side state, consider a state management library like `Redux Toolkit` or `Zustand` for more predictable state management.

#### 3. Component Design and UI

*   **Issue:** The application uses a mix of inline styles and a CSS file, which can lead to an inconsistent UI.
*   **Suggestion:**
    *   **Adopt a UI Framework:** Use a component library like `Material-UI`, `Chakra UI`, or a CSS-in-JS library like `styled-components` to build a more consistent and maintainable design system.

#### 4. User Experience (UX)

*   **Issue:** Loading and error states are inconsistent across the application.
*   **Suggestion:** Implement consistent loading (skeletons, spinners) and error states for all data-fetching operations to create a smoother user experience.

#### 5. Testing

*   **Issue:** There are no automated tests for the frontend.
*   **Suggestion:** Add unit tests for components and hooks using `React Testing Library` and consider end-to-end testing with `Cypress` or `Playwright`.

---

## Part 2: Phased Development Roadmap

This roadmap breaks down the project into three phases, each with a clear set of MVPs. This structure is designed to be easily transferable to a project management tool like Trello.

### Phase 1: Foundation and Refactoring (MVP 1)

**Goal:** Address critical technical debt and establish a solid foundation for future development.

*   **Backend:**
    *   **Task:** Secure Configuration: Move `JWT_SECRET_KEY` and database credentials to a `.env` file and load them using a library like `python-dotenv`. Update `.gitignore` to include `.env`.
    *   **Task:** Implement Backend Logging: Integrate the `logging` module to log errors to a file.
    *   **Task:** Refactor Business Logic: Create a `services` directory in `server` and move the business logic from the `tickets` and `events` blueprints into service functions.
    *   **Task:** Add Backend Tests: Set up a testing framework (like `pytest`) and write initial unit tests for the new service functions.
*   **Frontend:**
    *   **Task:** Centralize API Configuration: Create an API client (e.g., `src/api/api.js`) that centralizes `fetch` or `axios` calls and uses environment variables for the base URL.
    *   **Task:** Implement a UI Library: Choose and integrate a component library like `Material-UI` or `Chakra UI` to start building a consistent design system.

### Phase 2: Core Feature Expansion (MVP 2)

**Goal:** Enhance the core user experience by adding new, high-value features.

*   **Backend:**
    *   **Task:** Implement Pagination: Add pagination to the `get_events` and `get_my_tickets` endpoints.
    *   **Task:** Implement Advanced Search: Enhance the event search functionality with more filters (e.g., by date range, category).
    *   **Task:** User Profile Pictures: Add the ability for users to upload profile pictures.
*   **Frontend:**
    *   **Task:** Implement Frontend Pagination: Add UI controls to navigate through the paginated event and ticket lists.
    *   **Task:** Build out User Profiles: Enhance the user profile page to display more information (e.g., events created, tickets purchased).
    *   **Task:** Implement Event Categories: Add a category filter to the event list page.

### Phase 3: Scaling, Performance, and Polish (MVP 3)

**Goal:** Optimize the application for performance and scalability, and polish the user interface.

*   **Backend:**
    *   **Task:** Optimize Database Queries: Use `joinedload` or `selectinload` to fix N+1 query issues.
    *   **Task:** Implement Caching: Use a caching library (like `Flask-Caching`) to cache expensive database queries.
    *   **Task:** Implement Rate Limiting: Add rate limiting to sensitive endpoints to prevent abuse.
*   **Frontend:**
    *   **Task:** Implement a Data Fetching Library: Refactor the data fetching logic to use `React Query` or `SWR` for better caching and state management.
    *   **Task:** Improve UX with Loading/Error States: Implement consistent loading skeletons and error messages across the application.
    *   **Task:** End-to-End Testing: Write end-to-end tests with `Cypress` or `Playwright` to cover critical user flows.
