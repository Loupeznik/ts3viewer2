# Frontend Modernization — shadcn/ui, TanStack Query, Playwright, Biome

## TL;DR

> **Quick Summary**: Comprehensive frontend upgrade of the TS3Viewer2 React app — replacing custom/Flowbite UI with shadcn/ui, adding TanStack Query for data fetching, Playwright for E2E testing, and Biome for linting/formatting. Includes full restyling and dependency cleanup.
> 
> **Deliverables**:
> - shadcn/ui design system with OKLCH theming (dark-only)
> - TanStack Query replacing all manual data fetching (useState/useEffect/setInterval)
> - Playwright E2E test suite covering all critical user flows
> - Biome linting + formatting with CI/CD integration
> - lucide-react icons replacing react-icons/fi
> - react-hook-form + zod for form validation
> - sonner replacing react-hot-toast
> - Unused dependency cleanup
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 5 waves
> **Critical Path**: Task 1 (path aliases) → Task 3 (shadcn init) → Task 8 (shadcn components) → Task 12-19 (page migrations) → Task 24-27 (final verification)

---

## Context

### Original Request
Analyze and plan upgrades to the frontend web application:
1. Switch from custom UI components to latest version of shadcn
2. Verify Tailwind CSS v4 status (confirmed: already on v4.2.0)
3. Implementation of Playwright tests
4. Restyling of the frontend using shadcn to a modern design system
5. Addition of TanStack Query to the project
6. Addition of Biome for linting/formatting/checks

### Interview Summary
**Key Discussions**:
- Icons: Switch to lucide-react (shadcn default, Feather fork)
- Dark mode: Keep dark-only, wire shadcn CSS variables (put dark values in :root)
- Forms: Add react-hook-form + zod
- Toasts: Switch to sonner (replace react-hot-toast)
- Deps: Clean up unused (@testing-library/*, @types/jest, axios, validator)
- CI/CD: Biome lint in Azure Pipelines, Playwright local only
- Biome: Double quotes, semicolons, 2-space indent

**Research Findings**:
- Tailwind CSS v4.2.0 already in use — no migration needed
- shadcn/ui fully supports TW v4 + React 19, uses OKLCH colors, "new-york" style
- Project needs @/ path alias in both tsconfig.json and vite.config.ts
- OpenAPI client uses CancelablePromise — needs wrapCancelable bridge for TQ
- Playwright v1.51.0 — E2E testing with storageState auth pattern
- Auto-generated src/api/ must be excluded from Biome

### Metis Review
**Identified Gaps** (addressed):
- CancelablePromise needs bridge utility for TQ AbortSignal integration
- shadcn init overwrites index.css — svg hack must be preserved temporarily
- staleTime should be ~90% of refetchInterval to prevent double-fetches
- Dark-only: put dark values directly in :root, remove .dark block entirely
- Global 401 handling via QueryCache.onError for auth errors
- @hookform/resolvers needs v3.9+ for React 19 compatibility
- tw-animate-css (not tailwindcss-animate) is the TW v4 package

---

## Work Objectives

### Core Objective
Modernize the TS3Viewer2 React frontend from a loosely styled, manually-fetched app with zero tooling into a well-structured application using shadcn/ui design system, TanStack Query for data management, Playwright for testing, and Biome for code quality.

### Concrete Deliverables
- All 16 custom components replaced with shadcn/ui equivalents
- All 7 data-fetching pages migrated to TanStack Query hooks
- Playwright E2E test suite with ≥8 test specs covering critical flows
- Biome config + lint script in CI/CD pipeline
- Zero Flowbite references remaining in codebase
- Zero react-icons references remaining
- Zero react-hot-toast references remaining
- Clean package.json with no unused dependencies

### Definition of Done
- [ ] `npm run build` succeeds with zero errors
- [ ] `npx biome ci src/ --skip-parse-diagnostics` passes
- [ ] `npx playwright test` passes all specs
- [ ] Zero imports from `flowbite` in any file
- [ ] Zero imports from `react-icons` in any file
- [ ] Zero imports from `react-hot-toast` in any file
- [ ] All pages render correctly in dark mode

### Must Have
- shadcn/ui components for all UI elements (buttons, inputs, dialogs, tables, cards)
- TanStack Query for all API data fetching with proper loading/error states
- Playwright E2E tests for: login flow, status page, admin CRUD, audio bot controls
- Biome linting and formatting enforced
- react-hook-form + zod for form validation
- lucide-react for all icons
- sonner for toast notifications
- Proper query key factory pattern

### Must NOT Have (Guardrails)
- Do NOT add a light mode or theme toggle — dark-only
- Do NOT change the backend API or OpenAPI schema
- Do NOT modify the auto-generated src/api/ code (except regenerating if needed)
- Do NOT add Redux, Zustand, or any state management library — TQ is the data layer
- Do NOT add tailwindcss-animate — use tw-animate-css (TW v4 package)
- Do NOT add unit tests (Jest/Vitest) — only Playwright E2E
- Do NOT add accessibility features (aria labels, screen reader support) beyond what shadcn provides by default
- Do NOT over-abstract — keep components simple, no unnecessary wrappers
- Do NOT add excessive comments or JSDoc — code should be self-explanatory
- Do NOT change the routing structure or URL paths
- Do NOT modify the PWA configuration
- Do NOT install @radix-ui/react-* individual packages — use unified `radix-ui`

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO — Playwright will be set up from scratch
- **Automated tests**: Playwright E2E (tests-after implementation)
- **Framework**: @playwright/test
- **No TDD**: Implementation first, then E2E tests verify the completed pages

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Config/Setup**: Use Bash — Run commands, verify output, check file existence
- **Build**: Use Bash — `npm run build`, verify zero errors

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — all independent, start immediately):
├── Task 1: TypeScript path aliases + Vite resolve config [quick]
├── Task 2: Biome setup + config + npm scripts [quick]
├── Task 3: shadcn/ui init + theme configuration [quick]
├── Task 4: Dependency cleanup (remove unused) [quick]
├── Task 5: TanStack Query provider + QueryClient setup [quick]
├── Task 6: Playwright scaffold + config + npm scripts [quick]
└── Task 7: Install react-hook-form + zod + sonner + lucide-react [quick]

Wave 2 (Core infrastructure — depends on Wave 1):
├── Task 8: Add shadcn base components (Button, Input, Label, Dialog, Table, Card, Badge, Select, Skeleton, Separator) [quick]
├── Task 9: TanStack Query key factory + wrapCancelable utility [quick]
├── Task 10: TanStack Query custom hooks for all 6 API services [unspecified-high]
└── Task 11: Migrate shared components (Navbar, AdminSideNav, NavLink, Loader, Login) [visual-engineering]

Wave 3 (Page migrations — MAX PARALLEL, depends on Wave 2):
├── Task 12: Migrate Main + Connect pages (static, no data) [quick]
├── Task 13: Migrate Status page (polling, channels+clients tree) [unspecified-high]
├── Task 14: Migrate AudioBot page (polling, controls, file list) [unspecified-high]
├── Task 15: Migrate Upload page (file upload form) [quick]
├── Task 16: Migrate Admin layout + Login form (auth flow) [unspecified-high]
├── Task 17: Migrate Users admin page (CRUD table + modal form) [unspecified-high]
├── Task 18: Migrate Clients admin page (list + actions + modals) [unspecified-high]
├── Task 19: Migrate Channels + Files + Server admin pages [unspecified-high]
└── Task 20: Remove Flowbite + react-icons + react-hot-toast completely [quick]

Wave 4 (Testing + polish — depends on Wave 3):
├── Task 21: Playwright E2E — auth + navigation tests [unspecified-high]
├── Task 22: Playwright E2E — status + audiobot pages [unspecified-high]
├── Task 23: Playwright E2E — admin CRUD operations [unspecified-high]
└── Task 24: Biome lint CI step in azure-pipelines.yml + fix all lint issues [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA via Playwright [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: Task 1 → Task 3 → Task 8 → Task 11 → Task 16 → Task 21 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 8 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 3, 5, 8 | 1 |
| 2 | — | 24 | 1 |
| 3 | 1 | 8, 11 | 1 |
| 4 | — | 7 | 1 |
| 5 | 1 | 9, 10 | 1 |
| 6 | — | 21, 22, 23 | 1 |
| 7 | 4 | 10, 11, 12-19 | 1 |
| 8 | 3 | 11, 12-19 | 2 |
| 9 | 5 | 10 | 2 |
| 10 | 5, 7, 9 | 13-19 | 2 |
| 11 | 3, 7, 8 | 12-19 | 2 |
| 12 | 8, 11 | 20 | 3 |
| 13 | 8, 10, 11 | 20, 22 | 3 |
| 14 | 8, 10, 11 | 20, 22 | 3 |
| 15 | 8, 10, 11 | 20 | 3 |
| 16 | 8, 10, 11 | 17-19, 21 | 3 |
| 17 | 8, 10, 11, 16 | 20, 23 | 3 |
| 18 | 8, 10, 11, 16 | 20, 23 | 3 |
| 19 | 8, 10, 11, 16 | 20, 23 | 3 |
| 20 | 12-19 | 21-24 | 3 |
| 21 | 6, 16, 20 | F1-F4 | 4 |
| 22 | 6, 13, 14, 20 | F1-F4 | 4 |
| 23 | 6, 17, 18, 19, 20 | F1-F4 | 4 |
| 24 | 2, 20 | F1-F4 | 4 |

### Agent Dispatch Summary

- **Wave 1**: 7 tasks — T1-T7 → `quick`
- **Wave 2**: 4 tasks — T8 → `quick`, T9 → `quick`, T10 → `unspecified-high`, T11 → `visual-engineering`
- **Wave 3**: 9 tasks — T12 → `quick`, T13-T14 → `unspecified-high`, T15 → `quick`, T16-T19 → `unspecified-high`, T20 → `quick`
- **Wave 4**: 4 tasks — T21-T23 → `unspecified-high`, T24 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

### Wave 1 — Foundation (all independent, start immediately)

- [x] 1. TypeScript Path Aliases + Vite Resolve Config

  **What to do**:
  - Add `baseUrl` and `paths` to `tsconfig.json` so `@/*` maps to `./src/*`
  - Add `resolve.alias` to `vite.config.ts` mapping `@` to `path.resolve(__dirname, "./src")`
  - Install `@types/node` as devDependency (needed for `path` import in vite config)
  - Verify the alias works by updating one import in App.tsx to use `@/` prefix

  **Must NOT do**:
  - Do NOT split tsconfig into tsconfig.json + tsconfig.app.json — keep the current single-file structure
  - Do NOT change any other imports besides the one test import

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 6, 7)
  - **Blocks**: Tasks 3, 5, 8
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/tsconfig.json` — Current TS config, add baseUrl + paths here
  - `src/DZarsky.TS3Viewer2.Web/vite.config.ts` — Add resolve.alias alongside existing plugins
  - shadcn/ui Vite installation guide requires `@/` alias: https://ui.shadcn.com/docs/installation/vite

  **Acceptance Criteria**:
  - [ ] `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`
  - [ ] `vite.config.ts` has `resolve: { alias: { "@": path.resolve(__dirname, "./src") } }`
  - [ ] `@types/node` is in devDependencies
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Build succeeds with path alias configured
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. Run `npm run build` in src/DZarsky.TS3Viewer2.Web/
      2. Check exit code is 0
      3. Verify build/ directory is created
    Expected Result: Build completes with zero errors
    Failure Indicators: TypeScript path resolution errors, "Cannot find module" errors
    Evidence: .sisyphus/evidence/task-1-build-alias.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add path aliases for shadcn compatibility`
  - Files: `tsconfig.json`, `vite.config.ts`, `package.json`
  - Pre-commit: `npm run build`

- [x] 2. Biome Setup + Config + NPM Scripts

  **What to do**:
  - Install `@biomejs/biome` as devDependency
  - Create `biome.json` in `src/DZarsky.TS3Viewer2.Web/` with:
    - Formatter: double quotes, semicolons, 2-space indent, line width 120
    - Linter: recommended rules enabled
    - Organizer: import sorting enabled
    - Exclude: `src/api/` (auto-generated), `build/`, `node_modules/`, `public/`
  - Add npm scripts: `"lint": "biome check src/"`, `"lint:fix": "biome check --fix src/"`, `"format": "biome format --write src/"`, `"format:check": "biome format src/"`
  - Do NOT run lint:fix yet — that happens in Task 24 after all migrations are done

  **Must NOT do**:
  - Do NOT run Biome fix/format on existing code yet (code will change heavily during migration)
  - Do NOT add ESLint or Prettier — Biome replaces both
  - Do NOT lint the auto-generated `src/api/` directory

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6, 7)
  - **Blocks**: Task 24
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/package.json` — Add biome to devDependencies + scripts
  - Biome official docs: https://biomejs.dev/guides/getting-started/
  - `src/DZarsky.TS3Viewer2.Web/src/api/` — This entire directory must be EXCLUDED from Biome

  **Acceptance Criteria**:
  - [ ] `@biomejs/biome` is in devDependencies
  - [ ] `biome.json` exists with correct formatter + linter + organizer config
  - [ ] `src/api/` is excluded in biome.json
  - [ ] `npm run lint` executes without crashing (lint errors are OK at this stage)
  - [ ] `npm run format:check` executes without crashing

  **QA Scenarios:**
  ```
  Scenario: Biome CLI runs successfully
    Tool: Bash
    Preconditions: npm install completed with @biomejs/biome
    Steps:
      1. Run `npm run lint` in src/DZarsky.TS3Viewer2.Web/
      2. Verify command executes (exit code 0 or 1 for lint errors, NOT crash)
      3. Run `npx biome check src/api/` and verify NO files are checked (excluded)
    Expected Result: Biome runs, reports findings, does not crash. src/api/ excluded.
    Failure Indicators: "command not found", crash, src/api/ files appearing in output
    Evidence: .sisyphus/evidence/task-2-biome-check.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add Biome linting and formatting configuration`
  - Files: `biome.json`, `package.json`
  - Pre-commit: `npx biome check src/ --skip-parse-diagnostics` (informational only)

- [x] 3. shadcn/ui Init + Dark-Only Theme Configuration

  **What to do**:
  - Run `npx shadcn@latest init` in `src/DZarsky.TS3Viewer2.Web/`
    - Style: new-york
    - Base color: Neutral
    - CSS variables: Yes
  - **CRITICAL**: The init command WILL overwrite `src/index.css`. After init:
    1. Keep the generated OKLCH theme variables and @import directives
    2. Replace the `:root` CSS variable values with the `.dark` values (dark-only mode)
    3. Remove the `.dark { }` block entirely — not needed for dark-only
    4. Remove `@custom-variant dark (&:where(.dark, .dark *))` — not needed
    5. Re-add `svg { display: inline !important; vertical-align: middle; }` at the end (needed until icons are migrated in Wave 3)
    6. Remove any `body { font-family: ... }` and `code { font-family: ... }` overrides (shadcn handles fonts)
  - Remove the `dark` class from the root div in `App.tsx` (no longer needed — :root IS dark)
  - Verify `components.json` was created with correct config (`"config": ""` for TW v4)
  - Verify `src/lib/utils.ts` was created with `cn()` helper

  **Must NOT do**:
  - Do NOT add a theme toggle or light mode
  - Do NOT keep the Flowbite `@source` directive in index.css
  - Do NOT install tailwindcss-animate — shadcn uses tw-animate-css for TW v4
  - Do NOT add individual @radix-ui/react-* packages — use unified `radix-ui`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (but should run AFTER Task 1 for path aliases)
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6, 7)
  - **Blocks**: Tasks 8, 11
  - **Blocked By**: Task 1 (needs @/ alias)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/index.css` — Will be overwritten by init, then manually adjusted
  - `src/DZarsky.TS3Viewer2.Web/src/App.tsx:19` — `<div className="dark h-screen bg-gray-800">` — remove `dark` class
  - shadcn/ui Vite install: https://ui.shadcn.com/docs/installation/vite
  - shadcn/ui Tailwind v4 guide: https://ui.shadcn.com/docs/tailwind-v4

  **Acceptance Criteria**:
  - [ ] `components.json` exists with `"style": "new-york"` and `"config": ""`
  - [ ] `src/lib/utils.ts` exists with `cn()` function
  - [ ] `src/index.css` has OKLCH theme variables in `:root` (dark values)
  - [ ] No `.dark {}` block in index.css
  - [ ] No `@custom-variant dark` in index.css
  - [ ] No `@source` flowbite directive in index.css
  - [ ] `svg { display: inline !important }` present in index.css
  - [ ] `App.tsx` root div no longer has `dark` class
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: shadcn init artifacts exist and build succeeds
    Tool: Bash
    Preconditions: Task 1 (path aliases) completed
    Steps:
      1. Verify `components.json` exists and contains `"new-york"`
      2. Verify `src/lib/utils.ts` exists and exports `cn`
      3. Verify `src/index.css` contains `--background:` CSS variable
      4. Verify `src/index.css` does NOT contain `@source.*flowbite`
      5. Run `npm run build`
    Expected Result: All files present, build succeeds
    Failure Indicators: Missing components.json, build errors, flowbite references
    Evidence: .sisyphus/evidence/task-3-shadcn-init.txt
  ```

  **Commit**: YES
  - Message: `feat(web): initialize shadcn/ui with dark-only OKLCH theme`
  - Files: `components.json`, `src/lib/utils.ts`, `src/index.css`, `src/App.tsx`, `package.json`
  - Pre-commit: `npm run build`

- [x] 4. Dependency Cleanup

  **What to do**:
  - Remove unused dependencies from package.json:
    - `@testing-library/jest-dom` — no test runner exists
    - `@testing-library/react` — no test runner exists
    - `@testing-library/user-event` — no test runner exists
    - `@types/jest` — no Jest in project
    - `axios` — OpenAPI client uses Fetch API, not Axios
    - `web-vitals` — not imported anywhere
  - Run `npm install` to update package-lock.json
  - Verify build still works

  **Must NOT do**:
  - Do NOT remove `validator` yet — it's used in AudioBot.tsx (will be replaced in Wave 3)
  - Do NOT remove `flowbite` yet — removed in Task 20 after all pages migrated
  - Do NOT remove `react-icons` yet — removed in Task 20
  - Do NOT remove `react-hot-toast` yet — removed in Task 20

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6, 7)
  - **Blocks**: Task 7
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/package.json` — Current deps to clean
  - `src/DZarsky.TS3Viewer2.Web/src/api/core/request.ts` — Confirms Fetch API (not Axios)

  **Acceptance Criteria**:
  - [ ] `@testing-library/*`, `@types/jest`, `axios`, `web-vitals` removed from package.json
  - [ ] `npm run build` succeeds
  - [ ] package-lock.json regenerated

  **QA Scenarios:**
  ```
  Scenario: Build succeeds after dependency removal
    Tool: Bash
    Preconditions: Dependencies removed from package.json
    Steps:
      1. Run `npm install` in src/DZarsky.TS3Viewer2.Web/
      2. Run `npm run build`
      3. Verify neither `axios` nor `@testing-library` appear in package.json dependencies
    Expected Result: Clean install and build with zero errors
    Failure Indicators: "Cannot find module" for removed deps, build failures
    Evidence: .sisyphus/evidence/task-4-dep-cleanup.txt
  ```

  **Commit**: YES
  - Message: `chore(web): remove unused dependencies`
  - Files: `package.json`, `package-lock.json`
  - Pre-commit: `npm run build`


- [x] 5. TanStack Query Provider + QueryClient Setup

  **What to do**:
  - Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
  - Create `src/lib/queryClient.ts` with QueryClient configuration:
    - Import `QueryClient`, `QueryCache` from `@tanstack/react-query`
    - Import `ApiError` from `@/api`
    - Import `revokeToken` from `@/helpers/TokenProvider`
    - Configure `QueryCache` with global `onError` handler: if `ApiError` with status 401, call `revokeToken()` and `window.location.href = '/admin'`
    - Set `defaultOptions.queries`: `retry: 1`, `refetchOnWindowFocus: false`
    - Export the `queryClient` instance
  - Wrap the app in `QueryClientProvider` in `src/index.tsx`:
    - Import `QueryClientProvider` from `@tanstack/react-query`
    - Import `ReactQueryDevtools` from `@tanstack/react-query-devtools`
    - Wrap `<BrowserRouter><App /></BrowserRouter>` with `<QueryClientProvider client={queryClient}>`
    - Add `<ReactQueryDevtools initialIsOpen={false} />` inside the provider (dev only)

  **Must NOT do**:
  - Do NOT add Redux, Zustand, or any other state management
  - Do NOT create custom hooks yet (Task 10)
  - Do NOT modify any page components yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6, 7)
  - **Blocks**: Tasks 9, 10
  - **Blocked By**: Task 1 (needs @/ alias)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/index.tsx` — Wrap app with QueryClientProvider here
  - `src/DZarsky.TS3Viewer2.Web/src/api/core/ApiError.ts` — Error class for 401 detection
  - `src/DZarsky.TS3Viewer2.Web/src/helpers/TokenProvider.ts` — revokeToken() for auth error handling
  - TanStack Query docs: https://tanstack.com/query/latest/docs/framework/react/overview

  **Acceptance Criteria**:
  - [ ] `@tanstack/react-query` and `@tanstack/react-query-devtools` in dependencies
  - [ ] `src/lib/queryClient.ts` exists with QueryClient + QueryCache + 401 handler
  - [ ] `src/index.tsx` wraps app with `QueryClientProvider`
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: App renders with QueryClientProvider
    Tool: Bash
    Preconditions: TanStack Query installed and provider configured
    Steps:
      1. Run `npm run build`
      2. Verify `src/lib/queryClient.ts` imports QueryClient and QueryCache
      3. Verify `src/index.tsx` imports QueryClientProvider
    Expected Result: Build succeeds, provider is wired up
    Failure Indicators: Build errors, missing imports
    Evidence: .sisyphus/evidence/task-5-tq-provider.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add TanStack Query provider and QueryClient`
  - Files: `src/lib/queryClient.ts`, `src/index.tsx`, `package.json`
  - Pre-commit: `npm run build`

- [x] 6. Playwright Scaffold + Config + NPM Scripts

  **What to do**:
  - Install `@playwright/test` as devDependency
  - Run `npx playwright install chromium` to install browser
  - Create `playwright.config.ts` in `src/DZarsky.TS3Viewer2.Web/` with:
    - `testDir: './e2e/specs'`
    - `fullyParallel: true`
    - `forbidOnly: !!process.env.CI`
    - `retries: process.env.CI ? 2 : 0`
    - `workers: process.env.CI ? 1 : undefined`
    - `reporter: [['html']]`
    - `use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry', screenshot: 'only-on-failure' }`
    - `projects`: single Chromium project
    - `webServer: { command: 'npm run start', url: 'http://localhost:5173', reuseExistingServer: true }`
  - Create directory structure: `e2e/specs/`, `e2e/pages/`, `e2e/fixtures/`
  - Add npm scripts: `"test:e2e": "playwright test"`, `"test:e2e:ui": "playwright test --ui"`, `"test:e2e:headed": "playwright test --headed"`
  - Add to `.gitignore`: `e2e/.auth/`, `playwright-report/`, `test-results/`
  - Create a minimal smoke test `e2e/specs/smoke.spec.ts` that just verifies the app loads

  **Must NOT do**:
  - Do NOT write full E2E tests yet (Tasks 21-23)
  - Do NOT add Playwright to CI/CD yet (that's Playwright local only per decision)
  - Do NOT install Firefox or WebKit browsers — Chromium only

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5, 7)
  - **Blocks**: Tasks 21, 22, 23
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/vite.config.ts` — Dev server config (port 5173, opens browser)
  - `src/DZarsky.TS3Viewer2.Web/.gitignore` — Add Playwright artifacts
  - Playwright docs: https://playwright.dev/docs/intro

  **Acceptance Criteria**:
  - [ ] `@playwright/test` in devDependencies
  - [ ] `playwright.config.ts` exists with correct webServer config
  - [ ] `e2e/specs/`, `e2e/pages/`, `e2e/fixtures/` directories exist
  - [ ] `npm run test:e2e` command exists in package.json
  - [ ] Smoke test file exists at `e2e/specs/smoke.spec.ts`

  **QA Scenarios:**
  ```
  Scenario: Playwright config is valid
    Tool: Bash
    Preconditions: @playwright/test installed, chromium downloaded
    Steps:
      1. Run `npx playwright test --list` in src/DZarsky.TS3Viewer2.Web/
      2. Verify it lists the smoke test without errors
      3. Verify playwright.config.ts is parseable
    Expected Result: Test listing succeeds, shows smoke.spec.ts
    Failure Indicators: Config parse errors, missing browser
    Evidence: .sisyphus/evidence/task-6-playwright-scaffold.txt
  ```

  **Commit**: YES
  - Message: `feat(web): scaffold Playwright E2E test infrastructure`
  - Files: `playwright.config.ts`, `e2e/**`, `package.json`, `.gitignore`
  - Pre-commit: `npx playwright test --list`

- [x] 7. Install react-hook-form + zod + sonner + lucide-react

  **What to do**:
  - Install dependencies:
    - `react-hook-form` — form state management
    - `@hookform/resolvers` (v3.9+) — zod integration for react-hook-form (verify React 19 compat)
    - `zod` — schema validation
    - `sonner` — toast notifications (shadcn-compatible)
    - `lucide-react` — icon library (shadcn default, Feather fork)
  - Verify all install successfully with `npm run build`
  - Do NOT use these deps yet — they'll be consumed in Waves 2-3

  **Must NOT do**:
  - Do NOT create any components using these deps yet
  - Do NOT remove react-hot-toast or react-icons yet (Task 20)
  - Do NOT install `validator` replacements — zod will handle validation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5, 6)
  - **Blocks**: Tasks 10, 11, 12-19
  - **Blocked By**: Task 4 (clean deps first to avoid conflicts)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/package.json` — Add new deps
  - react-hook-form docs: https://react-hook-form.com/
  - zod docs: https://zod.dev/
  - sonner docs: https://sonner.emilkowal.dev/

  **Acceptance Criteria**:
  - [ ] `react-hook-form`, `@hookform/resolvers` (>=3.9.0), `zod`, `sonner`, `lucide-react` in dependencies
  - [ ] `npm run build` succeeds with zero errors

  **QA Scenarios:**
  ```
  Scenario: All new deps install and build succeeds
    Tool: Bash
    Preconditions: Task 4 dep cleanup completed
    Steps:
      1. Run `npm ls react-hook-form @hookform/resolvers zod sonner lucide-react`
      2. Verify @hookform/resolvers is 3.9.0 or higher
      3. Run `npm run build`
    Expected Result: All deps present with correct versions, build succeeds
    Failure Indicators: Peer dep conflicts, version mismatches, build errors
    Evidence: .sisyphus/evidence/task-7-new-deps.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add react-hook-form, zod, sonner, lucide-react`
  - Files: `package.json`, `package-lock.json`
  - Pre-commit: `npm run build`

### Wave 2 — Core Infrastructure (depends on Wave 1)


- [x] 8. Add shadcn Base UI Components

  **What to do**:
  - Run `npx shadcn@latest add` for each component needed across the app:
    - `button` — replaces SubmitButton.tsx
    - `input` — replaces Input.tsx
    - `label` — replaces Label.tsx
    - `dialog` — replaces all modal/popup components (UserForm, SelectPopup, TextFieldPopup, InfoPopup)
    - `table` — replaces custom table markup in UserTable, ClientList, AudioBot
    - `card` — for page section containers
    - `badge` — replaces ServerGroup badge
    - `select` — replaces native select in SelectPopup
    - `skeleton` — replaces Loader component for loading states
    - `separator` — for visual dividers
    - `dropdown-menu` — for action menus (client actions, admin nav)
    - `form` — shadcn form component (integrates with react-hook-form)
    - `sonner` — toast component (adds Toaster)
    - `tooltip` — for icon button tooltips
    - `scroll-area` — for scrollable content areas
    - `checkbox` — replaces PermissionSelect checkboxes
  - Add `<Toaster />` from sonner to `src/App.tsx` (replaces `react-hot-toast` Toaster)
  - Verify all components are generated in `src/components/ui/`

  **Must NOT do**:
  - Do NOT modify existing page components yet
  - Do NOT remove old components yet
  - Do NOT add components not in the list above (add as needed in Wave 3)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 11, 12-19
  - **Blocked By**: Task 3 (needs shadcn init)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/components.json` — shadcn config (created by Task 3)
  - `src/DZarsky.TS3Viewer2.Web/src/components/forms/Input.tsx` — Current input (will be replaced by shadcn Input)
  - `src/DZarsky.TS3Viewer2.Web/src/components/forms/SubmitButton.tsx` — Current button
  - `src/DZarsky.TS3Viewer2.Web/src/components/UserTable.tsx` — Table pattern to replace
  - shadcn component docs: https://ui.shadcn.com/docs/components

  **Acceptance Criteria**:
  - [ ] All 16 shadcn components exist in `src/components/ui/`
  - [ ] `<Toaster />` from sonner added to App.tsx
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: All shadcn components generated
    Tool: Bash
    Preconditions: shadcn init completed (Task 3)
    Steps:
      1. Verify these files exist: src/components/ui/button.tsx, input.tsx, label.tsx, dialog.tsx, table.tsx, card.tsx, badge.tsx, select.tsx, skeleton.tsx, separator.tsx, dropdown-menu.tsx, form.tsx, sonner.tsx, tooltip.tsx, scroll-area.tsx, checkbox.tsx
      2. Run `npm run build`
    Expected Result: All component files present, build succeeds
    Failure Indicators: Missing component files, build errors from conflicting imports
    Evidence: .sisyphus/evidence/task-8-shadcn-components.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add shadcn base UI components`
  - Files: `src/components/ui/*`, `src/App.tsx`, `package.json`
  - Pre-commit: `npm run build`

- [x] 9. TanStack Query Key Factory + wrapCancelable Utility

  **What to do**:
  - Create `src/lib/queryKeys.ts` with query key factory functions for each API service:
    ```typescript
    export const serverKeys = {
      all: () => ["server"] as const,
      info: () => [...serverKeys.all(), "info"] as const,
      clients: (includeQuery?: boolean) => [...serverKeys.all(), "clients", { includeQuery }] as const,
      channels: () => [...serverKeys.all(), "channels"] as const,
      groups: () => [...serverKeys.all(), "groups"] as const,
    };
    export const userKeys = { all: () => ["users"] as const, list: () => [...userKeys.all(), "list"] as const };
    export const fileKeys = { all: () => ["files"] as const, list: () => [...fileKeys.all(), "list"] as const };
    export const audioBotKeys = {
      all: () => ["audiobot"] as const,
      song: () => [...audioBotKeys.all(), "song"] as const,
      volume: () => [...audioBotKeys.all(), "volume"] as const,
    };
    ```
  - Create `src/lib/api.ts` with `wrapCancelable` utility:
    ```typescript
    import type { CancelablePromise } from "@/api/core/CancelablePromise";
    export function wrapCancelable<T>(factory: () => CancelablePromise<T>, signal: AbortSignal): Promise<T> {
      const cancelable = factory();
      signal.addEventListener("abort", () => cancelable.cancel(), { once: true });
      return cancelable;
    }
    ```
  - This utility bridges TQ's AbortSignal to the OpenAPI client's CancelablePromise.cancel()

  **Must NOT do**:
  - Do NOT create hooks yet (Task 10)
  - Do NOT modify any page components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 10)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 5 (needs TQ installed)

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/api/core/CancelablePromise.ts` — The promise type to bridge
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/` — All service methods return CancelablePromise
  - `src/DZarsky.TS3Viewer2.Web/src/api/index.ts` — Re-exports all services and models

  **Acceptance Criteria**:
  - [ ] `src/lib/queryKeys.ts` exists with factory functions for server, user, file, audioBot
  - [ ] `src/lib/api.ts` exists with `wrapCancelable` function
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Query key factories and wrapCancelable compile
    Tool: Bash
    Preconditions: TanStack Query installed (Task 5)
    Steps:
      1. Verify `src/lib/queryKeys.ts` exports serverKeys, userKeys, fileKeys, audioBotKeys
      2. Verify `src/lib/api.ts` exports wrapCancelable
      3. Run `npm run build`
    Expected Result: Both files compile, types are correct
    Failure Indicators: Type errors with CancelablePromise, missing exports
    Evidence: .sisyphus/evidence/task-9-query-keys.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add query key factory and wrapCancelable utility`
  - Files: `src/lib/queryKeys.ts`, `src/lib/api.ts`
  - Pre-commit: `npm run build`

- [x] 10. TanStack Query Custom Hooks for All API Services

  **What to do**:
  - Create `src/hooks/` directory with custom hooks wrapping each API service:
  - `src/hooks/useServer.ts`:
    - `useServerInfo()` — wraps `ServerService.getApiV1ServerInfo`, refetchInterval: 60000, staleTime: 55000
    - `useServerGroups()` — wraps `ServerService.getApiV1ServerGroups`, staleTime: 5 min
    - `useSendGlobalMessage()` — mutation wrapping `ServerService.postApiV1ServerMessagesGlobal`
  - `src/hooks/useClients.ts`:
    - `useClients(includeQuery?: boolean)` — wraps `ClientService.getApiV1ServerClients`, refetchInterval: 5000, staleTime: 4000
    - `useKickClient()` — mutation, invalidates serverKeys.clients()
    - `useBanClient()` — mutation, invalidates serverKeys.clients()
    - `usePokeClient()` — mutation
    - `useClientPermissions()` — mutation for add/remove group, invalidates serverKeys.clients()
  - `src/hooks/useChannels.ts`:
    - `useChannels()` — wraps `ChannelService.getApiV1ServerChannels`, staleTime: 5 min
    - `useSendChannelMessage()` — mutation
  - `src/hooks/useUsers.ts`:
    - `useUsers()` — wraps `UserService.getApiV1Users`, staleTime: 5 min
    - `useCreateUser()` — mutation, invalidates userKeys.list()
    - `useUpdateUser()` — mutation, invalidates userKeys.list()
    - `useDeleteUser()` — mutation, invalidates userKeys.list()
  - `src/hooks/useFiles.ts`:
    - `useFiles()` — wraps `FileService.getApiV1Files`, staleTime: 5 min
    - `useUploadFile()` — mutation, invalidates fileKeys.list()
    - `useDeleteFile()` — mutation, invalidates fileKeys.list()
    - `useRenameFile()` — mutation, invalidates fileKeys.list()
  - `src/hooks/useAudioBot.ts`:
    - `useCurrentSong()` — wraps `AudioBotService.getApiV1AudiobotSong`, refetchInterval: 10000, staleTime: 9000
    - `useVolume()` — wraps `AudioBotService.getApiV1AudiobotVolume`, refetchInterval: 10000, staleTime: 9000
    - `usePlaySong()` — mutation, invalidates audioBotKeys.song()
    - `useStopSong()` — mutation, invalidates audioBotKeys.song()
    - `usePauseSong()` — mutation, invalidates audioBotKeys.song()
    - `useSetVolume()` — mutation, invalidates audioBotKeys.volume()
  - All query hooks use `wrapCancelable` from `@/lib/api`
  - All query hooks use keys from `@/lib/queryKeys`
  - All mutation hooks call `toast.success()`/`toast.error()` from sonner on completion

  **Must NOT do**:
  - Do NOT modify page components yet (Wave 3)
  - Do NOT use react-hot-toast — use `toast` from `sonner`
  - Do NOT cache in localStorage — TQ handles caching

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8, 9 if 9 finishes first)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 13-19
  - **Blocked By**: Tasks 5, 7, 9

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/ServerService.ts` — Server API methods
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/ClientService.ts` — Client API methods
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/UserService.ts` — User API methods
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/FileService.ts` — File API methods
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/AudioBotService.ts` — AudioBot API methods
  - `src/DZarsky.TS3Viewer2.Web/src/api/services/ChannelService.ts` — Channel API methods
  - `src/DZarsky.TS3Viewer2.Web/src/lib/queryKeys.ts` — Query key factories (Task 9)
  - `src/DZarsky.TS3Viewer2.Web/src/lib/api.ts` — wrapCancelable utility (Task 9)
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Status.tsx` — Example of current polling pattern (5s) to replicate with refetchInterval
  - `src/DZarsky.TS3Viewer2.Web/src/pages/AudioBot.tsx` — Example of current 10s polling
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Server.tsx` — Example of current 60s polling

  **Acceptance Criteria**:
  - [ ] 6 hook files created in `src/hooks/`
  - [ ] All query hooks use `wrapCancelable` and keys from `queryKeys.ts`
  - [ ] Polling hooks have correct refetchInterval and staleTime (90% rule)
  - [ ] All mutation hooks invalidate related queries on success
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: All hooks compile with correct types
    Tool: Bash
    Preconditions: Tasks 5, 7, 9 completed
    Steps:
      1. Verify 6 files in src/hooks/: useServer.ts, useClients.ts, useChannels.ts, useUsers.ts, useFiles.ts, useAudioBot.ts
      2. Run `npm run build`
      3. Verify no type errors related to CancelablePromise or query keys
    Expected Result: All hooks compile cleanly
    Failure Indicators: Type mismatches, missing imports, CancelablePromise errors
    Evidence: .sisyphus/evidence/task-10-tq-hooks.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add TanStack Query hooks for all API services`
  - Files: `src/hooks/*`
  - Pre-commit: `npm run build`

- [x] 11. Migrate Shared Components (Navbar, AdminSideNav, NavLink, Loader, Login)

  **What to do**:
  - **Navbar** (`src/components/navigation/Navbar.tsx`):
    - Replace inline Tailwind classes with shadcn component composition
    - Replace react-icons/fi icons with lucide-react equivalents (FiServer→Server, FiUser→User, FiFile→File, etc.)
    - Use shadcn Button for nav links, DropdownMenu for mobile menu
    - Keep existing route paths unchanged
  - **AdminSideNav** (`src/components/navigation/AdminSideNav.tsx`):
    - Restyle with shadcn Button variants, Separator between sections
    - Replace icons with lucide-react
    - Keep permission-based menu item visibility logic
  - **NavLink** (`src/components/navigation/NavLink.tsx`):
    - Restyle with shadcn Button `variant="ghost"` or `variant="link"`
    - Keep React Router NavLink integration for active state
  - **Loader** (`src/components/Loader.tsx`):
    - Replace SVG spinner with shadcn Skeleton or a simple Loader component using lucide-react Loader2 icon with `animate-spin`
  - **Login** (`src/components/Login.tsx`):
    - Rewrite using shadcn Card + Form (react-hook-form) + Input + Button
    - Add zod schema for login validation (login required, secret required)
    - Replace react-hot-toast calls with sonner `toast()`
    - Keep the registration modal toggle logic, use shadcn Dialog for modal

  **Must NOT do**:
  - Do NOT change routing logic or URL paths
  - Do NOT modify authentication logic (signIn, checkUser functions)
  - Do NOT remove the old component files yet (they may still be imported by unmigrated pages)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 10 if 8 finishes first)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 12-19
  - **Blocked By**: Tasks 3, 7, 8

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/components/navigation/Navbar.tsx` — Current navbar with Flowbite styling
  - `src/DZarsky.TS3Viewer2.Web/src/components/navigation/AdminSideNav.tsx` — Admin sidebar
  - `src/DZarsky.TS3Viewer2.Web/src/components/navigation/NavLink.tsx` — Nav link component
  - `src/DZarsky.TS3Viewer2.Web/src/components/Loader.tsx` — Current SVG spinner
  - `src/DZarsky.TS3Viewer2.Web/src/components/Login.tsx` — Login form with registration modal
  - `src/DZarsky.TS3Viewer2.Web/src/helpers/UserHelper.ts` — signIn/getCurrentUser functions (DO NOT modify)
  - Icons mapping: FiServer→Server, FiUser→User, FiUsers→Users, FiFile→File, FiLogOut→LogOut, FiEdit→Pencil, FiTrash→Trash2, FiPlus→Plus, FiX→X, FiInfo→Info, FiCheckCircle→CheckCircle, FiMoon→Moon, FiPhoneCall→Phone, FiUserCheck→UserCheck, FiChevronsUp→ChevronsUp

  **Acceptance Criteria**:
  - [ ] Navbar renders with lucide-react icons and shadcn styling
  - [ ] AdminSideNav renders with permission-based menu items
  - [ ] Login form uses react-hook-form + zod + shadcn components
  - [ ] Loader uses shadcn Skeleton or Loader2 icon
  - [ ] Zero react-icons imports in migrated components
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Shared components render correctly
    Tool: Playwright (playwright skill)
    Preconditions: App running on localhost:5173 via npm start
    Steps:
      1. Navigate to http://localhost:5173/
      2. Verify Navbar is visible with correct links (Status, Connect, Upload, Bot, Admin)
      3. Navigate to /status
      4. Verify Loader/Skeleton appears briefly then content loads
      5. Take screenshot
    Expected Result: Navbar renders, links work, styling is consistent dark theme
    Failure Indicators: Missing nav items, broken icons, unstyled components
    Evidence: .sisyphus/evidence/task-11-shared-components.png

  Scenario: Login form validates input
    Tool: Playwright (playwright skill)
    Preconditions: App running on localhost:5173
    Steps:
      1. Navigate to http://localhost:5173/admin
      2. Verify login form is displayed with Login and Password fields
      3. Click Submit without entering anything
      4. Verify validation errors appear
      5. Take screenshot of error state
    Expected Result: Form validation shows required field errors via zod
    Failure Indicators: No validation, form submits with empty fields
    Evidence: .sisyphus/evidence/task-11-login-validation.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate shared components to shadcn`
  - Files: `src/components/navigation/*`, `src/components/Loader.tsx`, `src/components/Login.tsx`
  - Pre-commit: `npm run build`

### Wave 3 — Page Migrations (MAX PARALLEL, depends on Wave 2)


- [x] 12. Migrate Main + Connect Pages (static, no data)

  **What to do**:
  - **Main page** (`src/pages/Main.tsx`): Restyle with shadcn Card, typography, lucide-react icons. This is the landing/home page.
  - **Connect page** (`src/pages/Connect.tsx`): Restyle the TS3 connection info display with shadcn Card + Input (read-only) + Button for copy-to-clipboard. Replace any react-icons with lucide-react.
  - Both pages are static (no data fetching) so no TQ changes needed.

  **Must NOT do**: Do NOT add data fetching. Do NOT change URL paths.

  **Recommended Agent Profile**: **Category**: `quick`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Task 20 | Blocked By: Tasks 8, 11

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Main.tsx` — Current landing page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Connect.tsx` — Current connect page with TS3 host info
  - `src/DZarsky.TS3Viewer2.Web/.env.development` — VITE_TS3_HOST env var used in Connect page

  **Acceptance Criteria**:
  - [ ] Both pages render with shadcn components
  - [ ] Zero react-icons imports in these files
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Main and Connect pages render
    Tool: Playwright (playwright skill)
    Preconditions: App running on localhost:5173
    Steps:
      1. Navigate to http://localhost:5173/
      2. Verify page loads without errors
      3. Navigate to http://localhost:5173/connect
      4. Verify TS3 connection info is visible
      5. Take screenshots of both pages
    Expected Result: Both pages render with shadcn styling
    Evidence: .sisyphus/evidence/task-12-main-connect.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Main and Connect pages to shadcn`
  - Files: `src/pages/Main.tsx`, `src/pages/Connect.tsx`
  - Pre-commit: `npm run build`

- [x] 13. Migrate Status Page (polling, channels+clients tree)

  **What to do**:
  - Replace all useState + useEffect + setInterval data fetching with TQ hooks:
    - `useServerInfo()` for server data
    - `useClients(true)` for client list (with query=true)
    - `useChannels()` for channel list
  - Restructure the channel/client tree display:
    - Use shadcn Card as container
    - Use proper list styling with shadcn typography
    - Replace FiCornerDownRight, FiServer icons with lucide-react equivalents
  - Replace Loader with shadcn Skeleton for loading states
  - Use TQ's `isLoading`/`isError` for proper loading/error state handling
  - Remove the manual `getAppToken()` call at component top — TQ's global 401 handler manages this
  - Add `data-testid` attributes to key elements (server name, client list) for Playwright

  **Must NOT do**: Do NOT change the polling intervals (keep 5s). Do NOT modify the ClientList component here (Task 18).

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 20, 22 | Blocked By: Tasks 8, 10, 11

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Status.tsx` — Current implementation with manual polling
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useServer.ts` — useServerInfo() hook (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useClients.ts` — useClients() hook (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useChannels.ts` — useChannels() hook (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/components/ClientList.tsx` — Client list component (migrated separately in Task 18)

  **Acceptance Criteria**:
  - [ ] Zero useState/useEffect for data fetching in Status.tsx
  - [ ] Uses TQ hooks with refetchInterval for polling
  - [ ] Shows Skeleton during loading, error message on failure
  - [ ] Has data-testid attributes on server name and client list
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Status page loads server data
    Tool: Playwright (playwright skill)
    Preconditions: App running with API available on localhost:20800
    Steps:
      1. Navigate to http://localhost:5173/status
      2. Wait for `[data-testid="server-name"]` to be visible (timeout: 10s)
      3. Verify server name text is not empty
      4. Verify channel list is visible
      5. Take screenshot
    Expected Result: Server info and channel tree displayed
    Evidence: .sisyphus/evidence/task-13-status-page.png

  Scenario: Status page shows skeleton during loading
    Tool: Playwright (playwright skill)
    Preconditions: App running, API available
    Steps:
      1. Intercept `/api/v1/server/info` with a 2s delay
      2. Navigate to http://localhost:5173/status
      3. Verify skeleton/loading indicators are visible
      4. Wait for data to load
      5. Verify skeleton is replaced with actual content
    Expected Result: Skeleton shown during load, replaced by content
    Evidence: .sisyphus/evidence/task-13-status-loading.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Status page to shadcn + TanStack Query`
  - Files: `src/pages/Status.tsx`
  - Pre-commit: `npm run build`

- [x] 14. Migrate AudioBot Page (polling, controls, file list)

  **What to do**:
  - Replace data fetching with TQ hooks: `useCurrentSong()`, `useVolume()`, `useFiles()`, `usePlaySong()`, `useStopSong()`, `usePauseSong()`, `useSetVolume()`
  - Restyle the page with shadcn components:
    - Card for main container
    - Table for song list
    - Button for playback controls (play, pause, stop, volume up/down)
    - Input for YouTube URL and filter
    - Form with zod validation for YouTube URL input (replace `validator.isURL` with zod `z.string().url()`)
    - Tooltip on volume/control buttons
  - Replace all react-icons with lucide-react: FiPlayCircle→Play, FiPauseCircle→Pause, FiStopCircle→Square, FiMinusCircle→Minus, FiPlusCircle→Plus, FiYoutube→Youtube
  - Remove `validator` import — replaced by zod schema
  - Replace react-hot-toast calls with sonner toast()
  - Add data-testid attributes for Playwright

  **Must NOT do**: Do NOT change polling intervals. Do NOT change API service calls.

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 20, 22 | Blocked By: Tasks 8, 10, 11

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/AudioBot.tsx` — Current implementation (238 lines)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useAudioBot.ts` — TQ hooks (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useFiles.ts` — useFiles() for song list (Task 10)

  **Acceptance Criteria**:
  - [ ] Zero useState/useEffect for data fetching
  - [ ] Zero `validator` imports
  - [ ] YouTube URL validated by zod schema
  - [ ] All icons from lucide-react
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: AudioBot page renders controls
    Tool: Playwright (playwright skill)
    Preconditions: App running with API available
    Steps:
      1. Navigate to http://localhost:5173/bot
      2. Verify playback controls (play, pause, stop) are visible
      3. Verify volume display is visible
      4. Verify song list table is visible
      5. Take screenshot
    Expected Result: AudioBot page fully styled with shadcn components
    Evidence: .sisyphus/evidence/task-14-audiobot-page.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate AudioBot page to shadcn + TanStack Query`
  - Files: `src/pages/AudioBot.tsx`
  - Pre-commit: `npm run build`

- [x] 15. Migrate Upload Page (file upload form)

  **What to do**:
  - Restyle with shadcn Card + Form (react-hook-form) + Input (file type) + Button
  - Add zod validation for file selection (required, max size if applicable)
  - Use `useUploadFile()` mutation from TQ hooks
  - Replace react-hot-toast with sonner for upload success/error
  - Replace icons with lucide-react

  **Must NOT do**: Do NOT change the upload API call structure.

  **Recommended Agent Profile**: **Category**: `quick`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Task 20 | Blocked By: Tasks 8, 10, 11

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Upload.tsx` — Current upload page
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useFiles.ts` — useUploadFile() mutation (Task 10)

  **Acceptance Criteria**:
  - [ ] Upload form uses react-hook-form + shadcn components
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Upload page renders form
    Tool: Playwright (playwright skill)
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:5173/upload
      2. Verify file input and upload button are visible
      3. Take screenshot
    Expected Result: Upload form renders with shadcn styling
    Evidence: .sisyphus/evidence/task-15-upload-page.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Upload page to shadcn + TanStack Query`
  - Files: `src/pages/Upload.tsx`
  - Pre-commit: `npm run build`

- [x] 16. Migrate Admin Layout + Login Form (auth flow)

  **What to do**:
  - **Admin.tsx** (`src/pages/Admin.tsx`):
    - Restyle the admin layout with shadcn Card as container
    - Keep the Outlet pattern for nested routes
    - Use TQ-powered hooks for `getAppToken()` and `getServerGroups()` calls
    - Clean up the auth check flow using the migrated Login component (Task 11)
  - Ensure auth state flows correctly through the admin section
  - Add data-testid attributes for Playwright auth testing

  **Must NOT do**: Do NOT change auth logic. Do NOT change admin routes.

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 17-19, 21 | Blocked By: Tasks 8, 10, 11

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Admin.tsx` — Current admin layout with auth check
  - `src/DZarsky.TS3Viewer2.Web/src/components/Login.tsx` — Login component (migrated in Task 11)
  - `src/DZarsky.TS3Viewer2.Web/src/helpers/UserHelper.ts` — signIn, getCurrentUser functions
  - `src/DZarsky.TS3Viewer2.Web/src/helpers/ServerHelpers.ts` — getServerGroups

  **Acceptance Criteria**:
  - [ ] Admin layout renders with shadcn styling
  - [ ] Login form works (auth flow unchanged)
  - [ ] Nested admin routes still work via Outlet
  - [ ] data-testid on login form and admin heading
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Admin auth flow works
    Tool: Playwright (playwright skill)
    Preconditions: App running with API available
    Steps:
      1. Navigate to http://localhost:5173/admin
      2. Verify login form is displayed
      3. Verify admin heading is present
      4. Take screenshot
    Expected Result: Login form renders, admin layout is styled
    Evidence: .sisyphus/evidence/task-16-admin-layout.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Admin layout to shadcn + TanStack Query`
  - Files: `src/pages/Admin.tsx`
  - Pre-commit: `npm run build`

- [x] 17. Migrate Users Admin Page (CRUD table + modal form)

  **What to do**:
  - Replace UserTable with shadcn Table component
  - Replace UserForm modal with shadcn Dialog + Form (react-hook-form + zod)
  - Use TQ hooks: `useUsers()`, `useCreateUser()`, `useUpdateUser()`, `useDeleteUser()`
  - Remove all manual useState for users list
  - Replace PermissionSelect with shadcn Checkbox group
  - Replace react-hot-toast with sonner
  - Replace icons with lucide-react
  - Add data-testid attributes

  **Must NOT do**: Do NOT change user permission model or API calls.

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 20, 23 | Blocked By: Tasks 8, 10, 11, 16

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Users.tsx` — Current users page
  - `src/DZarsky.TS3Viewer2.Web/src/components/UserTable.tsx` — Current user table
  - `src/DZarsky.TS3Viewer2.Web/src/components/forms/UserForm.tsx` — Current user form modal (131 lines)
  - `src/DZarsky.TS3Viewer2.Web/src/components/forms/PermissionSelect.tsx` — Current permission checkboxes
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useUsers.ts` — TQ hooks (Task 10)

  **Acceptance Criteria**:
  - [ ] User table uses shadcn Table
  - [ ] Create/Edit user modal uses shadcn Dialog + react-hook-form
  - [ ] All CRUD operations use TQ mutations
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Users page displays user list
    Tool: Playwright (playwright skill)
    Preconditions: App running, authenticated as admin
    Steps:
      1. Navigate to http://localhost:5173/admin/users
      2. Verify user table is visible with headers
      3. Verify action buttons (edit, delete) are present
      4. Take screenshot
    Expected Result: User table renders with shadcn styling
    Evidence: .sisyphus/evidence/task-17-users-page.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Users admin page to shadcn + TanStack Query`
  - Files: `src/pages/admin/Users.tsx`, `src/components/UserTable.tsx`, `src/components/forms/UserForm.tsx`, `src/components/forms/PermissionSelect.tsx`
  - Pre-commit: `npm run build`

- [x] 18. Migrate Clients Admin Page (list + actions + modals)

  **What to do**:
  - Replace ClientList with shadcn Table + DropdownMenu for actions
  - Use TQ hooks: `useClients()`, `useKickClient()`, `useBanClient()`, `usePokeClient()`, `useClientPermissions()`
  - Replace SelectPopup with shadcn Dialog + Select for server group assignment
  - Replace TextFieldPopup with shadcn Dialog + Input for poke/message
  - Replace InfoPopup with shadcn Dialog
  - Replace ServerGroup badge with shadcn Badge
  - Remove manual localStorage caching of server groups — TQ caches automatically
  - Replace icons with lucide-react
  - Replace react-hot-toast with sonner
  - Add data-testid attributes

  **Must NOT do**: Do NOT change client action API calls. Do NOT change permission logic.

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 20, 23 | Blocked By: Tasks 8, 10, 11, 16

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Clients.tsx` — Current clients page
  - `src/DZarsky.TS3Viewer2.Web/src/components/ClientList.tsx` — Client list with action buttons
  - `src/DZarsky.TS3Viewer2.Web/src/components/SelectPopup.tsx` — Server group selection modal
  - `src/DZarsky.TS3Viewer2.Web/src/components/TextFieldPopup.tsx` — Text input modal
  - `src/DZarsky.TS3Viewer2.Web/src/components/InfoPopup.tsx` — Info display modal
  - `src/DZarsky.TS3Viewer2.Web/src/components/ServerGroup.tsx` — Badge component
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useClients.ts` — TQ hooks (Task 10)

  **Acceptance Criteria**:
  - [ ] Client list uses shadcn Table + DropdownMenu for actions
  - [ ] All modals use shadcn Dialog
  - [ ] No localStorage caching of server groups
  - [ ] All actions use TQ mutations
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Clients page displays client list with actions
    Tool: Playwright (playwright skill)
    Preconditions: App running, authenticated as admin
    Steps:
      1. Navigate to http://localhost:5173/admin/clients
      2. Verify client table/list is visible
      3. Verify action buttons are accessible (kick, ban, message, etc.)
      4. Take screenshot
    Expected Result: Client list with action dropdown renders correctly
    Evidence: .sisyphus/evidence/task-18-clients-page.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Clients admin page to shadcn + TanStack Query`
  - Files: `src/pages/admin/Clients.tsx`, `src/components/ClientList.tsx`, `src/components/SelectPopup.tsx`, `src/components/TextFieldPopup.tsx`, `src/components/InfoPopup.tsx`, `src/components/ServerGroup.tsx`
  - Pre-commit: `npm run build`

- [x] 19. Migrate Channels + Files + Server Admin Pages

  **What to do**:
  - **Channels page** (`src/pages/admin/Channels.tsx`): Use `useChannels()` TQ hook, shadcn Table for channel list, shadcn Dialog for send message modal
  - **Files page** (`src/pages/admin/Files.tsx`): Use `useFiles()`, `useDeleteFile()`, `useRenameFile()` TQ hooks, shadcn Table for file list with action buttons
  - **Server page** (`src/pages/admin/Server.tsx`): Use `useServerInfo()` TQ hook (60s poll), shadcn Card for server info display, shadcn Dialog for global message
  - **Admin Main page** (`src/pages/admin/Main.tsx`): Restyle dashboard/landing with shadcn Card
  - Replace all icons with lucide-react, all toasts with sonner
  - Add data-testid attributes

  **Must NOT do**: Do NOT change API calls. Do NOT change admin routes.

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 3 | Blocks: Tasks 20, 23 | Blocked By: Tasks 8, 10, 11, 16

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Channels.tsx` — Current channels page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Files.tsx` — Current files page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Server.tsx` — Current server page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Main.tsx` — Admin dashboard
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useChannels.ts` — Channel TQ hooks (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useFiles.ts` — File TQ hooks (Task 10)
  - `src/DZarsky.TS3Viewer2.Web/src/hooks/useServer.ts` — Server TQ hooks (Task 10)

  **Acceptance Criteria**:
  - [ ] All 4 admin pages use TQ hooks for data fetching
  - [ ] All pages styled with shadcn components
  - [ ] Zero react-icons, react-hot-toast imports
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: Admin pages render with data
    Tool: Playwright (playwright skill)
    Preconditions: App running, authenticated as admin
    Steps:
      1. Navigate to each admin page: /admin/channels, /admin/files, /admin/server
      2. Verify each page loads without errors
      3. Verify data tables/cards are visible
      4. Take screenshots of all 3 pages
    Expected Result: All admin pages render with shadcn styling
    Evidence: .sisyphus/evidence/task-19-admin-pages.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate Channels, Files, Server admin pages to shadcn + TanStack Query`
  - Files: `src/pages/admin/Channels.tsx`, `src/pages/admin/Files.tsx`, `src/pages/admin/Server.tsx`, `src/pages/admin/Main.tsx`
  - Pre-commit: `npm run build`

- [ ] 20. Remove Flowbite + react-icons + react-hot-toast Completely

  **What to do**:
  - Run `npm uninstall flowbite react-icons react-hot-toast`
  - Also remove `validator` (now replaced by zod)
  - Remove `import 'flowbite'` from `src/index.tsx`
  - Remove any remaining `svg { display: inline !important }` from `src/index.css` (no longer needed without react-icons)
  - Verify ZERO imports of `flowbite`, `react-icons`, `react-hot-toast`, `validator` in any file
  - Run build to confirm nothing is broken
  - Delete any old component files that are no longer imported (check for dead files)

  **Must NOT do**: Do NOT remove packages that are still imported somewhere. Verify first.

  **Recommended Agent Profile**: **Category**: `quick`, **Skills**: []

  **Parallelization**: Can Run In Parallel: NO (sequential after Tasks 12-19) | Blocks: Tasks 21-24 | Blocked By: Tasks 12-19

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/index.tsx:5` — `import 'flowbite'` to remove
  - `src/DZarsky.TS3Viewer2.Web/src/index.css` — Remove svg hack if still present
  - `src/DZarsky.TS3Viewer2.Web/package.json` — Remove deps

  **Acceptance Criteria**:
  - [ ] `flowbite`, `react-icons`, `react-hot-toast`, `validator` not in package.json
  - [ ] `grep -r "flowbite" src/` returns no results
  - [ ] `grep -r "react-icons" src/` returns no results
  - [ ] `grep -r "react-hot-toast" src/` returns no results
  - [ ] `npm run build` succeeds

  **QA Scenarios:**
  ```
  Scenario: No old library references remain
    Tool: Bash
    Preconditions: All page migrations complete
    Steps:
      1. Run `grep -r "flowbite" src/ --include="*.tsx" --include="*.ts" --include="*.css"`
      2. Run `grep -r "react-icons" src/ --include="*.tsx" --include="*.ts"`
      3. Run `grep -r "react-hot-toast" src/ --include="*.tsx" --include="*.ts"`
      4. Run `grep -r "from.*validator" src/ --include="*.tsx" --include="*.ts"`
      5. Run `npm run build`
    Expected Result: All greps return 0 results, build succeeds
    Failure Indicators: Any remaining imports of old libraries
    Evidence: .sisyphus/evidence/task-20-cleanup.txt
  ```

  **Commit**: YES
  - Message: `chore(web): remove Flowbite, react-icons, react-hot-toast, validator`
  - Files: `src/index.tsx`, `src/index.css`, `package.json`, `package-lock.json`
  - Pre-commit: `npm run build`

### Wave 4 — Testing + Polish (depends on Wave 3)


- [ ] 21. Playwright E2E — Auth + Navigation Tests

  **What to do**:
  - Create `e2e/pages/login.page.ts` Page Object Model with locators for login form
  - Create `e2e/specs/auth.setup.ts` setup project that authenticates and saves storageState to `e2e/.auth/user.json`
  - Create `e2e/specs/navigation.spec.ts`:
    - Test: all navbar links navigate correctly (/, /status, /connect, /upload, /bot)
    - Test: unauthenticated user sees login on /admin
    - Test: app renders dark theme consistently
  - Create `e2e/specs/auth.spec.ts`:
    - Test: login with valid credentials succeeds
    - Test: login with empty fields shows validation errors
    - Test: admin sidebar shows correct menu items based on permissions
    - Test: logout works and returns to login form
  - Update `playwright.config.ts` with setup project if not already configured

  **Must NOT do**: Do NOT test CRUD operations (Task 23). Do NOT test page-specific data (Tasks 22).

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: [`playwright`]

  **Parallelization**: Can Run In Parallel: YES | Wave 4 (with Tasks 22, 23, 24) | Blocks: F1-F4 | Blocked By: Tasks 6, 16, 20

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/playwright.config.ts` — Config from Task 6
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Admin.tsx` — Auth flow to test
  - `src/DZarsky.TS3Viewer2.Web/src/components/Login.tsx` — Login form to interact with
  - `src/DZarsky.TS3Viewer2.Web/src/components/navigation/Navbar.tsx` — Navbar links

  **Acceptance Criteria**:
  - [ ] Auth setup project saves storageState
  - [ ] Navigation tests cover all main routes
  - [ ] Auth tests cover login/logout flow
  - [ ] `npx playwright test` passes all specs

  **QA Scenarios:**
  ```
  Scenario: Playwright auth + nav tests pass
    Tool: Bash
    Preconditions: App running on localhost:5173 with API on localhost:20800
    Steps:
      1. Run `npx playwright test e2e/specs/auth.spec.ts e2e/specs/navigation.spec.ts --reporter=list`
      2. Verify all tests pass
    Expected Result: All auth and navigation tests green
    Failure Indicators: Timeout errors, missing elements, auth failures
    Evidence: .sisyphus/evidence/task-21-auth-nav-tests.txt
  ```

  **Commit**: YES
  - Message: `test(web): add Playwright E2E tests for auth and navigation`
  - Files: `e2e/specs/auth.setup.ts`, `e2e/specs/auth.spec.ts`, `e2e/specs/navigation.spec.ts`, `e2e/pages/login.page.ts`
  - Pre-commit: `npx playwright test --reporter=list`

- [ ] 22. Playwright E2E — Status + AudioBot Pages

  **What to do**:
  - Create `e2e/pages/status.page.ts` POM with locators for server info, channel tree, client list
  - Create `e2e/specs/status.spec.ts`:
    - Test: status page loads and displays server name
    - Test: channel tree with clients is visible
    - Test: data refreshes (wait for second API call)
    - Test: loading skeleton appears before data
  - Create `e2e/pages/audiobot.page.ts` POM
  - Create `e2e/specs/audiobot.spec.ts`:
    - Test: audiobot page loads with controls
    - Test: volume display is visible
    - Test: song list table renders
    - Test: invalid YouTube URL shows validation error
  - Use `page.route()` mocking for error state tests

  **Must NOT do**: Do NOT test admin CRUD (Task 23).

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: [`playwright`]

  **Parallelization**: Can Run In Parallel: YES | Wave 4 (with Tasks 21, 23, 24) | Blocks: F1-F4 | Blocked By: Tasks 6, 13, 14, 20

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/Status.tsx` — Status page with data-testid attrs
  - `src/DZarsky.TS3Viewer2.Web/src/pages/AudioBot.tsx` — AudioBot page with data-testid attrs

  **Acceptance Criteria**:
  - [ ] Status page tests cover data loading + skeleton
  - [ ] AudioBot page tests cover controls + validation
  - [ ] `npx playwright test` passes

  **QA Scenarios:**
  ```
  Scenario: Status and AudioBot E2E tests pass
    Tool: Bash
    Preconditions: App running with API
    Steps:
      1. Run `npx playwright test e2e/specs/status.spec.ts e2e/specs/audiobot.spec.ts --reporter=list`
      2. Verify all tests pass
    Expected Result: All page tests green
    Evidence: .sisyphus/evidence/task-22-page-tests.txt
  ```

  **Commit**: YES
  - Message: `test(web): add Playwright E2E tests for Status and AudioBot pages`
  - Files: `e2e/specs/status.spec.ts`, `e2e/specs/audiobot.spec.ts`, `e2e/pages/status.page.ts`, `e2e/pages/audiobot.page.ts`
  - Pre-commit: `npx playwright test --reporter=list`

- [ ] 23. Playwright E2E — Admin CRUD Operations

  **What to do**:
  - Create `e2e/pages/admin/users.page.ts` POM
  - Create `e2e/pages/admin/clients.page.ts` POM
  - Create `e2e/specs/admin/users.spec.ts`:
    - Test: users table loads with data
    - Test: create user dialog opens and form validates
    - Test: edit user dialog opens with pre-filled data
    - Test: delete user shows confirmation
  - Create `e2e/specs/admin/clients.spec.ts`:
    - Test: client list loads
    - Test: action dropdown opens with correct options
    - Test: server group assignment dialog works
  - Create `e2e/specs/admin/pages.spec.ts`:
    - Test: channels page loads
    - Test: files page loads with file list
    - Test: server page loads with server info
  - All admin tests depend on auth setup project for authentication

  **Must NOT do**: Do NOT actually create/delete real users in tests (use mocking or verify UI only).

  **Recommended Agent Profile**: **Category**: `unspecified-high`, **Skills**: [`playwright`]

  **Parallelization**: Can Run In Parallel: YES | Wave 4 (with Tasks 21, 22, 24) | Blocks: F1-F4 | Blocked By: Tasks 6, 17, 18, 19, 20

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Users.tsx` — Users page with data-testid
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Clients.tsx` — Clients page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Channels.tsx` — Channels page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Files.tsx` — Files page
  - `src/DZarsky.TS3Viewer2.Web/src/pages/admin/Server.tsx` — Server page

  **Acceptance Criteria**:
  - [ ] Admin CRUD tests cover user table + dialogs
  - [ ] Client action tests cover dropdown + modals
  - [ ] All admin pages verified to load
  - [ ] `npx playwright test` passes

  **QA Scenarios:**
  ```
  Scenario: Admin E2E tests pass
    Tool: Bash
    Preconditions: App running with API, auth setup complete
    Steps:
      1. Run `npx playwright test e2e/specs/admin/ --reporter=list`
      2. Verify all tests pass
    Expected Result: All admin tests green
    Evidence: .sisyphus/evidence/task-23-admin-tests.txt
  ```

  **Commit**: YES
  - Message: `test(web): add Playwright E2E tests for admin CRUD operations`
  - Files: `e2e/specs/admin/*`, `e2e/pages/admin/*`
  - Pre-commit: `npx playwright test --reporter=list`

- [ ] 24. Biome Lint CI Step + Fix All Lint Issues

  **What to do**:
  - Run `npx biome check --fix src/` to auto-fix all formatting/lint issues across the codebase
  - Manually fix any issues Biome can't auto-fix (complex lint errors)
  - Run `npx biome ci src/ --skip-parse-diagnostics` and verify zero errors
  - Add Biome check to `azure-pipelines.yml`:
    - Add step after `npm install` and before `npm run build`
    - Command: `npx biome ci src/ --skip-parse-diagnostics`
    - Display name: `Lint (Biome)`
  - Verify the full CI pipeline still works (lint → build → artifacts)

  **Must NOT do**: Do NOT run Biome on `src/api/` (it's excluded in biome.json). Do NOT add Playwright to CI.

  **Recommended Agent Profile**: **Category**: `quick`, **Skills**: []

  **Parallelization**: Can Run In Parallel: YES | Wave 4 (with Tasks 21, 22, 23) | Blocks: F1-F4 | Blocked By: Tasks 2, 20

  **References**:
  - `src/DZarsky.TS3Viewer2.Web/biome.json` — Biome config (Task 2)
  - `azure-pipelines.yml` — CI/CD pipeline to update

  **Acceptance Criteria**:
  - [ ] `npx biome ci src/ --skip-parse-diagnostics` passes with zero errors
  - [ ] azure-pipelines.yml has Biome lint step
  - [ ] `npm run build` still succeeds after lint fixes

  **QA Scenarios:**
  ```
  Scenario: Biome passes with zero issues
    Tool: Bash
    Preconditions: All migrations complete, Biome fix applied
    Steps:
      1. Run `npx biome ci src/ --skip-parse-diagnostics`
      2. Verify exit code is 0
      3. Verify azure-pipelines.yml contains `biome ci` step
    Expected Result: Zero lint errors, CI config updated
    Failure Indicators: Lint errors, missing CI step
    Evidence: .sisyphus/evidence/task-24-biome-ci.txt
  ```

  **Commit**: YES
  - Message: `ci: add Biome lint check to Azure Pipelines`
  - Files: `azure-pipelines.yml`, all files modified by biome fix
  - Pre-commit: `npx biome ci src/ --skip-parse-diagnostics && npm run build`

---
## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` + `npx biome ci src/ --skip-parse-diagnostics`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` + `playwright` skill
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Wave 1**: One commit per task (foundation changes are independent)
  - T1: `feat(web): add path aliases for shadcn compatibility`
  - T2: `feat(web): add Biome linting and formatting configuration`
  - T3: `feat(web): initialize shadcn/ui with dark-only OKLCH theme`
  - T4: `chore(web): remove unused dependencies`
  - T5: `feat(web): add TanStack Query provider and QueryClient`
  - T6: `feat(web): scaffold Playwright E2E test infrastructure`
  - T7: `feat(web): add react-hook-form, zod, sonner, lucide-react`
- **Wave 2**: One commit per task
  - T8: `feat(web): add shadcn base UI components`
  - T9: `feat(web): add query key factory and wrapCancelable utility`
  - T10: `feat(web): add TanStack Query hooks for all API services`
  - T11: `refactor(web): migrate shared components to shadcn`
- **Wave 3**: One commit per page migration, one cleanup commit
  - T12-T19: `refactor(web): migrate [PageName] to shadcn + TanStack Query`
  - T20: `chore(web): remove Flowbite, react-icons, react-hot-toast`
- **Wave 4**: One commit per task
  - T21-T23: `test(web): add Playwright E2E tests for [scope]`
  - T24: `ci: add Biome lint check to Azure Pipelines`

---

## Success Criteria

### Verification Commands
```bash
cd src/DZarsky.TS3Viewer2.Web
npm run build                               # Expected: Build succeeds, zero errors
npx biome ci src/ --skip-parse-diagnostics  # Expected: No lint errors
npx playwright test                         # Expected: All E2E tests pass
grep -r "flowbite" src/ --include="*.tsx" --include="*.ts" --include="*.css"  # Expected: No results
grep -r "react-icons" src/ --include="*.tsx" --include="*.ts"                 # Expected: No results
grep -r "react-hot-toast" src/ --include="*.tsx" --include="*.ts"             # Expected: No results
```

### Final Checklist
- [ ] All "Must Have" features present and verified
- [ ] All "Must NOT Have" guardrails respected
- [ ] All Playwright E2E tests pass
- [ ] Biome lint passes with zero errors
- [ ] Build succeeds with zero TypeScript errors
- [ ] All pages render correctly (verified by Playwright screenshots)
- [ ] No Flowbite, react-icons, or react-hot-toast references remain
