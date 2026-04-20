# GoHire CI/CD & Testing Pipeline

This document outlines the Continuous Integration (CI) and Testing flows for the GoHire project. The architecture uses GitHub Actions to automate testing and validation across the isolated micro-services (Admin, Applicant, Recruiter) and their respective frontend/backend applications.

## 1. Overview
The CI pipeline is highly modular. Instead of a single monolithic workflow, GitHub Actions are split by service and layer to optimize build times and prevent unrelated runs when code changes.

**Workflows include:**
- Admin: `admin-frontend.yml`, `admin-backend.yml`, `admin-backend-test.yml`
- Applicant: `applicant-frontend.yml`, `applicant-backend.yml`, `applicant-backend-test.yml`
- Recruiter: `recruiter-frontend.yml`, `recruiter-backend.yml`, `recruiter-backend-test.yml`

## 2. Triggering the Pipeline
Workflows are triggered automatically based on specific GitHub events:
- **Events:** `push` and `pull_request`.
- **Target Branches:** `main`, `master`, and `dev`.
- **Path Filtering:** Each workflow only triggers when files in its respective directory change (e.g., changes to `goHire/admin/backend/**` will only trigger the Admin Backend workflow, ignoring frontend or other service pipelines).

## 3. GitHub Actions Execution Flow

### Backend Pipeline (Node.js + MongoDB)
When an API/Backend workflow runs, the following environment is provisioned:

1. **Environment Initialization:** Runs on `ubuntu-latest`.
2. **Matrix Testing:** Tests are run against multiple Node.js versions (e.g., `18.x`, `20.x`, `22.x`) to ensure runtime compatibility.
3. **Database Provisioning:** Uses action `supercharge/mongodb-github-action` to spin up ephemeral MongoDB instances locally on the runner (e.g. `mongodb-version: '6.0'`).
4. **Dependency Installation:** Executes `npm ci` or `npm install`.
5. **Execution:** Runs `npm test` while injecting transient testing environment variables:
   ```env
   NODE_ENV: test
   MONGO_URI: mongodb://127.0.0.1:27017/db_test
   JWT_SECRET: test_secret_key
   SESSION_SECRET: test_session_secret
   ```

### Frontend Pipeline (React)
When a Frontend workflow runs:

1. **Environment Initialization:** Runs on `ubuntu-latest` with standard Node.js environments.
2. **Dependency Installation:** Installs frontend packages (Vite, React, Tailwind).
3. **Linting & Build:** Executes codebase linting/formatting checks, followed by build scripts (`npm run build`) to catch compilation and strict mode errors.

## 4. Local Testing & Aggregation Scripts

For local development or holistic QA checks, a custom Node script compiles and executes tests across the entire monorepo simultaneously.

### Running Tests Locally
Run the following from the root directory:
```bash
npm run test:reports
```

**What this does:**
- Triggers the custom `goHire/scripts/generate-test-reports.js` script.
- Iterates through `admin-backend`, `applicant-backend`, and `recruiter-backend`.
- Runs `npm test -- --coverage --json` for each project.
- Siloes individual coverage (`lcov` and `text-summary`) and stores results into the global `/test-reports` directory.

### Reviewing Artifacts
After execution, a unified repository view is available:
- `test-reports/summary.md` - A Markdown summary overview of pass/fail tests natively.
- `test-reports/summary.json` - Raw programmatic output for integrations inside `test-reports/<project>/results.json`.
