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

### MVP 1.5: UI Foundation

**Goal:** Create a visually appealing, consistent, and maintainable design system that provides a top-notch user experience.

*   **Task 1: Create a Global Theme:** - **DONE**
    *   **Why:** To ensure a consistent look and feel across the entire application, we will create a global theme file. This will define our color palette, typography, and other design tokens.
    *   **How:** We will create a `src/theme.js` file and use Material-UI's `createTheme` function to define our custom theme. We will then pass this theme to a `ThemeProvider` component in `src/main.jsx`.

*   **Task 2: Refactor Core Components:**
    *   **Why:** To ensure that all our core components are using the new design system, we will refactor them to use Material-UI components.
    *   **How:** We will go through each of our existing components (`Header.jsx`, `EventCard.jsx`, `Button.jsx`, etc.) and replace the existing HTML with the appropriate Material-UI components.

*   **Task 3: Create a Layout Component:**
    *   **Why:** To create a consistent page layout across the entire application, we will create a dedicated `Layout.jsx` component.
    *   **How:** This component will use Material-UI's layout components (like `Container`, `Grid`, and `Box`) to create a responsive and visually appealing page structure. It will include a header, a main content area, and a footer.

*   **Task 4: Implement Responsive Design:**
    *   **Why:** To ensure that our application looks great on all screen sizes, from mobile phones to large desktop monitors, we will implement a responsive design.
    *   **How:** We will use Material-UI's responsive design features (like the `sx` prop and the `useMediaQuery` hook) to create a layout that adapts to different screen sizes.

### Phase 2: Core Feature Expansion (MVP 2)

**Goal:** Enhance the core user experience by adding new, high-value features.

*   **Backend:**
    *   **Task:** Implement Pagination
    *   **Status:** Done
    *   **Goal:** Modify our API endpoints to support pagination, allowing the frontend to request data in smaller chunks.
    *   **Steps:**
        1.  **Update the `get_events` endpoint:** We will modify the `get_events` endpoint in `server/events.py` to accept two new query parameters: `page` and `per_page`.
        2.  **Use Flask-SQLAlchemy's `paginate()` method:** Instead of using `.all()`, we will use the built-in `.paginate()` method from Flask-SQLAlchemy.
        3.  **Update the JSON response:** We will update the JSON response to include pagination information (total pages, next page, etc.).
    *   **Task:** Implement Advanced Search: Enhance the event search functionality with more filters (e.g., by date range, category).
    *   **Task:** User Profile Pictures: Add the ability for users to upload profile pictures.
*   **Frontend:**
    *   **Task:** Implement Frontend Pagination: Add UI controls to navigate through the paginated event and ticket lists. - **DONE**
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

---

## Part 3: Best Practices Learned

This section will keep track of the best practices we discuss throughout the project.

*   **Aliasing Imports (`as`):** Use `as` to alias imports to avoid name collisions, to abbreviate long names, and to follow community conventions (e.g., `import pandas as pd`). Avoid using aliases unnecessarily or with confusing names.
*   **Automated Testing:** Automated testing is the practice of writing code to test your application code. It provides a safety net that allows you to make changes with confidence, serves as living documentation, and encourages better code design.
    *   **Regressions:** A regression is a bug that appears in a feature that used to work correctly. Automated tests are essential for catching regressions before they reach users.
    *   **The Testing Pyramid:** A scalable testing strategy uses a mix of different types of tests:
        *   **Unit Tests:** Test the smallest units of code in isolation. They are fast and form the base of the pyramid.
        *   **Integration Tests:** Test how different parts of the application work together. They are slower than unit tests but catch a wider range of bugs.
        *   **End-to-End (E2E) Tests:** Test the entire application from the user's perspective. They are the slowest and should be used sparingly for critical user flows.
