# ParaBank Playwright — Project Conventions

## App Under Test
- URL: https://parabank.parasoft.com
- Type: Banking web app + REST API
- Auth: Form-based login (username/password)

## Test Structure
- Pattern: Arrange → Act → Assert → Cleanup
- Naming: `Feature > Section > Action` (e.g. `Auth > Login > Valid credentials`)
- Every test needs a unique annotation ID (e.g. `AUTH-001`)

## Folder Structure
- `tests/api/` → API-only tests (no browser)
- `tests/ui/` → Full browser tests
- `fixtures/` → BasePage, BaseAPI, index.ts
- `functions/` → Helpers por dominio (auth.ts, accounts.ts)

## Rules
- Never hardcode test data — use unique generated values
- Always cleanup created data (afterEach or afterAll)
- No waitForTimeout() in committed code
- No test.only() in committed code
- Selectors: getByRole > getByTestId > getByLabel