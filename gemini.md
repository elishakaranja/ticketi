# 🎟️ Ticketi Technical Blueprint (gemini.md)

This document serves as the technical foundation and guide for the Ticketi project. It outlines the architecture, infrastructure, coding standards, and development workflow to ensure a scalable, maintainable, and high-quality application.

---
## Important , remind me to turn on checkpointing 
remind me to turn on checkpointing or turn it on yourself 
gemini --checkpointing

## 1. Project Overview

Ticketi is a full-stack event ticketing system that empowers users to explore, create, and attend events with ease. Built with a React frontend and Flask backend, Ticketi enables event organizers to publish events and manage ticket pricing, while offering users a smooth experience to browse, purchase, and even resell tickets.

---

## 2. Architecture

### 2.1. Frontend (React)

*   **Framework:** React with Vite for a fast development experience.
*   **Routing:** React Router for declarative routing.
*   **State Management:** Zustand for lightweight and simple global state management. It's less boilerplate than Redux and a good fit for this project's scale.
*   **Component Structure:** Atomic Design principles will be used to structure components:
    *   `atoms`: Basic UI elements (Button, Input, etc.).
    *   `molecules`: Combinations of atoms (e.g., a search bar with a button).
    *   `organisms`: More complex UI components (e.g., the event card, navigation bar).
    *   `templates`: Page layouts.
    *   `pages`: The actual pages of the application.
*   **Styling:** Tailwind CSS for a utility-first CSS workflow.

### 2.2. Backend (Flask)

*   **Framework:** Flask with a focus on blueprints for modularity. Each major feature (auth, events, tickets) will have its own blueprint.
*   **API Layer:** Flask-RESTful for creating RESTful APIs with clear resource-based routing.
*   **ORM:** SQLAlchemy for interacting with the database.
*   **Database Migrations:** Alembic (with Flask-Migrate) for managing database schema changes.
*   **Authentication:** JWT-based authentication using Flask-JWT-Extended, including support for refresh tokens to maintain user sessions.

### 2.3. Database

*   **Production & Staging:** PostgreSQL will be used for its robustness and scalability.
*   **Development:** SQLite can be used for simplicity in local development, but all queries should be written to be compatible with PostgreSQL.

---

## 3. Infrastructure

### 3.1. Containerization

*   **Docker:** The entire application (frontend, backend, and database) will be containerized using Docker.
*   **Docker Compose:** A `docker-compose.yml` file will be created to orchestrate the services for local development, ensuring a consistent and easy-to-set-up environment.

### 3.2. Deployment

*   **Platform:** The project will be designed for easy deployment on platforms like Heroku or cloud providers (AWS, GCP, Azure).
*   **CI/CD:** A basic CI/CD pipeline will be set up using GitHub Actions to:
    *   Run linters and tests on every push and pull request.
    *   Automate deployment to a staging or production environment.

---

## 4. Coding Guidelines

### 4.1. General

*   **Version Control:** Git will be used for version control.
*   **Branching:** A simplified GitFlow will be used:
    *   `main`: Production-ready code.
    *   `develop`: The main development branch.
    *   `feature/...`: Feature branches.
    *   `fix/...`: Bugfix branches.
*   **Commit Messages:** Conventional Commits will be used for clear and consistent commit messages (e.g., `feat: add ticket resale functionality`).

### 4.2. Backend (Python)

*   **Style:** PEP 8 will be enforced using a linter like `flake8` or `ruff`.
*   **Formatting:** `black` will be used for consistent code formatting.
*   **Typing:** Type hints will be used throughout the codebase to improve code clarity and enable static analysis.
*   **Dependencies:** `pipenv` will be used to manage Python dependencies.

### 4.3. Frontend (JavaScript/React)

*   **Style & Formatting:** Prettier and ESLint will be used to enforce consistent code style and catch common errors.
*   **Naming Conventions:**
    *   Components: `PascalCase` (e.g., `EventCard.jsx`).
    *   Functions and variables: `camelCase`.
*   **Imports:** Absolute imports will be configured for cleaner import statements.

---

## 5. API Design

The API will follow RESTful principles:

*   **Endpoints:** Resource-oriented URLs (e.g., `/api/events`, `/api/events/<event_id>`).
*   **HTTP Methods:** Correct use of HTTP verbs (GET, POST, PUT, DELETE).
*   **JSON:** All API responses will be in JSON format.
*   **Error Handling:** Consistent error response format (e.g., `{"error": "message"}`).
*   **Versioning:** The API will be versioned from the start (e.g., `/api/v1/...`).

---

## 6. Testing

### 6.1. Backend

*   **Framework:** `pytest` will be used for writing and running tests.
*   **Types:**
    *   **Unit Tests:** To test individual functions and services.
    *   **Integration Tests:** To test the interaction between different parts of the application (e.g., API endpoints and the database).

### 6.2. Frontend

*   **Framework:** Jest and React Testing Library will be used for testing components.
*   **Types:**
    *   **Unit Tests:** To test individual components in isolation.
    *   **Integration Tests:** To test the interaction between multiple components.

---

## 7. Our Development Process & Your Gemini Mentor

This section defines how we'll collaborate. My role is to act as a Senior Software Engineer and Architect, guiding you through the development of Ticketi. My goal is to ensure the project is well-planned, the code is clean, and you understand the "why" behind every decision.

### Core Philosophy

*   **Clarity Over Cleverness:** We will always prioritize writing clear, understandable code.
*   **Plan, Then Execute:** We will break down features into small, manageable tasks before writing any code.
*   **Iterate and Refactor:** We will build features incrementally and continuously improve the codebase.

### My Responsibilities

1.  **Architecture and Design:**
    *   Ensure all new features align with the project's architecture.
    *   Identify opportunities for refactoring to improve code quality.
    *   Guide technical decisions and help you choose the right tools for the job.

2.  **Task Breakdown and Trello Integration:**
    *   I will help you break down high-level goals into clear, actionable tasks suitable for a Trello board.
    *   Each task will be a small, logical unit of work (e.g., "Create the User model," "Build the registration API endpoint," "Design the login form").
    *   I will suggest labels for tasks, such as `backend`, `frontend`, `database`, `testing`.

3.  **Knowledge Transfer:**
    *   I will act as your mentor, explaining the reasoning behind my suggestions.
    *   I will highlight best practices, design patterns, and potential pitfalls.
    *   I will encourage you to ask questions to ensure you have a deep understanding of the codebase.

4.  **Phase-Oriented Development:**
    *   We will work in logical phases to ensure a structured development process. For example:
        *   **Phase 1:** Foundational Setup (Docker, CI/CD, etc.)
        *   **Phase 2:** User Authentication (Models, API, Frontend)
        *   **Phase 3:** Event Management (CRUD operations)
        *   **Phase 4:** Ticket Purchasing
    *   We will focus on completing one phase at a time to avoid context switching and ensure a clean implementation.

5.  **Code Reviews and Quality Assurance:**
    *   I will help you review your code, enforcing the coding standards defined in this document.
    *   I will help you identify missing edge cases, validation, and error handling.

### Your Role

*   **Ask Questions:** Don't hesitate to ask for clarification or more details.
*   **Update Trello:** Keep the Trello board updated to reflect the status of your work.
*   **Drive the Project:** You are the project owner. I am here to support you and help you make informed decisions.

By following this process, we will ensure that Ticketi is built on a solid foundation and that you have a great learning experience along the way.