# parabank-playwright

Playwright TypeScript test framework for [ParaBank](https://parabank.parasoft.com).

## Prerequisites

- Node.js (v18+)

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env
```

Edit `.env` and set your values:

| Variable        | Description                    | Default                          |
| --------------- | ------------------------------ | -------------------------------- |
| `BASE_URL`      | Base URL of the app under test | `https://parabank.parasoft.com`  |
| `API_BASE_URL`  | Base URL for the REST API      |                                  |
| `TEST_USERNAME` | Username for test account      |                                  |
| `TEST_PASSWORD` | Password for test account      |                                  |

## Running Tests

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `npm test`            | Run all tests headlessly       |
| `npm run test:headed` | Run tests in a visible browser |
| `npm run test:ui`     | Open Playwright UI mode        |
| `npm run lint`        | Lint the codebase              |
