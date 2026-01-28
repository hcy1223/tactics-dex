# AGENTS.md

This document outlines the guidelines and commands for agentic coding agents operating within this repository. Adhering to these guidelines ensures consistency, maintainability, and efficient collaboration.

## 1. Project Overview

*   **Framework:** Nuxt.js (Vue 3, Vite, TypeScript)
*   **Language:** JavaScript, TypeScript, Vue.js Single File Components (SFCs)
*   **Package Manager:** bun (exclusive - must use bun for all operations)

## 2. Build, Lint, and Test Commands

Agents must use `bun` for running scripts.

### 2.1. Installation

To install dependencies:

```bash
bun install
```

### 2.2. Development Server

To start the development server:

```bash
bun run dev
```

### 2.3. Building and Previewing

To build the application for production:

```bash
bun run build
```

To locally preview the production build:

```bash
bun run preview
```

To generate static sites (if applicable for Nuxt):

```bash
bun run generate
```

### 2.4. Testing

This project uses `vitest` for testing.

*   **Run all tests:**
    ```bash
    bun test
    ```

*   **Run tests in watch mode:**
    ```bash
    bun run test:watch
    ```

*   **Run tests with coverage:**
    ```bash
    bun run test:coverage
    ```

*   **Run unit tests (specific project configuration):**
    ```bash
    bun run test:unit
    ```

*   **Run Nuxt-specific tests (specific project configuration):**
    ```bash
    bun run test:nuxt
    ```

*   **Running a single test file:**
    To run a specific test file, pass the file path to `vitest`:
    ```bash
    bun vitest path/to/your/test.spec.ts
    ```

### 2.5. Linting

The project uses `@nuxt/eslint` for linting. Agents should ensure code adheres to the configured ESLint rules. Linting is typically integrated into the build/development process. If an explicit lint script is required, check `package.json` or run `bunx eslint .` for ad-hoc checks.

## 3. Code Style Guidelines

Adherence to existing code style is crucial. Agents should analyze surrounding code to maintain consistency.

### 3.1. General Principles

*   **Consistency:** Always match the style of the surrounding code.
*   **Readability:** Prioritize clear and easily understandable code.
*   **Simplicity:** Prefer straightforward solutions over overly complex ones.

### 3.2. Imports

*   **Ordering:** Follow existing import order (e.g., standard library, third-party, local modules).
*   **Aliasing:** Use aliases consistently if configured (e.g., `@/components`).
*   **Destructuring:** Use object destructuring for imports where appropriate.

### 3.3. Formatting

*   **Indentation:** Use 2 spaces for indentation (common in JavaScript/Vue projects).
*   **Quotes:** Prefer single quotes for strings, unless double quotes are necessary (e.g., for JSX attributes or strings containing single quotes).
*   **Semicolons:** Follow existing patterns for semicolons; if present, use them consistently; if absent, avoid them.
*   **Trailing Commas:** Use trailing commas for multi-line arrays, objects, and function parameters.

### 3.4. Types

*   **TypeScript:** Utilize TypeScript for type safety in `.ts` and `.vue` files (using `<script setup lang="ts">` or `<script lang="ts">`).
*   **Explicit Types:** Declare types explicitly for function arguments, return values, and complex variables where clarity is improved.
*   **Interfaces/Types:** Use `interface` or `type` consistently for object shapes.

### 3.5. Naming Conventions

*   **Variables:** `camelCase` for variables and function names.
*   **Components:** `PascalCase` for Vue components.
*   **Files:** `kebab-case` for component file names (e.g., `my-component.vue`).
*   **Constants:** `SCREAMING_SNAKE_CASE` for global constants.

### 3.6. Error Handling

*   **Robustness:** Implement appropriate error handling for asynchronous operations and potential failure points (e.g., API calls, form submissions).
*   **Logging:** Use `console.error` or a more sophisticated logging mechanism for significant errors.
*   **User Feedback:** Provide clear and helpful feedback to the user in case of errors.

## 4. Cursor/Copilot Rules

No specific Cursor or Copilot rules were found in the repository. Agents should rely on the general code style guidelines provided above.
