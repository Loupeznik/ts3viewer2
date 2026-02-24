# Issues — frontend-upgrade

## Open Issues

### [F2 Review] Login.tsx manual loading state (non-blocking)
- File: `src/components/Login.tsx:51-64`
- `handleRegistration` manually manages `isLoading` state and calls `UserService.postApiV1Users()` directly instead of using the `useCreateUser()` TQ mutation from `useUsers.ts`.
- Functionally correct but bypasses TQ (no cache invalidation, no retry, no 401 handling from QueryCache).
- Severity: Minor / non-blocking. Login page doesn't need to invalidate any list query.

### [F2 Review] biome ci src/ shows warnings from src/api/ (non-blocking)
- `experimentalScannerIgnores` in biome.json does not fully prevent Biome from emitting warnings when `src/` is explicitly targeted on CLI.
- All warnings are from auto-generated `src/api/core/` files (`ApiError`, `CancelablePromise`, etc.) — expected and exempt.
- `npx biome ci src/hooks src/pages src/components src/lib` returns exit 0 with 43 files checked, 0 issues.
- Severity: Configuration cosmetic. Non-blocking.

## Resolved Issues
(none yet)

## F1 — Plan Compliance Audit Findings (2026-02-24)

### [F1 BLOCKER] biome ci src/ exits with code 1
- Command: `npx biome ci src/` → exit code 1
- Command: `npm run lint` (= `biome check src/`) → exit code 1
- Root cause 1: CSS parse errors in `src/index.css` (lines 18, 96, 99) — Tailwind `@theme inline {}` and `@apply` directives not supported by Biome v2 CSS parser without `tailwindDirectives` option enabled.
- Root cause 2: `experimentalScannerIgnores` in biome.json does not fully exclude `src/api/` when running `biome ci src/` — auto-generated code emits `suppressions/unused` errors AND `noExplicitAny` warnings, some counted as errors.
- Root cause 3: `--skip-parse-diagnostics` flag from plan specification was removed in Biome v2 (implemented as v2.4.4); it does not exist and cannot be used.
- Plan Task 24 acceptance: `npx biome ci src/ --skip-parse-diagnostics` passes with zero errors → FAILS (flag missing, CSS errors remain)
- Azure Pipelines lint step (`npm run lint`) would fail in CI.
- Severity: **BLOCKING** — plan requires biome CI to pass.
- Fix: Add `"css": { "parser": { "cssModules": false }, "formatter": { "enabled": false }, "linter": { "enabled": false } }` to biome.json to skip CSS files, OR add `tailwindcss` CSS parser option in biome.json to enable `@apply`/`@theme` support.

### [F1 INFO] Minor deviations (non-blocking)
- `@types/validator` in devDependencies (leftover from removed `validator` package — not imported anywhere)
- `next-themes` in dependencies (installed transitively by shadcn sonner component; no ThemeProvider wrapping app → no actual theme toggle)
- `body`/`code` font-family overrides still in `src/index.css` (plan Task 3 said to remove them; minor cosmetic deviation, doesn't affect functionality)

## F3 — Final QA (Manual Browser) Findings (2026-02-24)

### VERDICT: APPROVE

### All Scenarios Passed
- Scenario 1 (App loads): PASS — Title "TS3Viewer2", navbar with all links visible
- Scenario 2 (Navigation): PASS — All 5 nav links navigate without errors
- Scenario 3 (Status): PASS — Page renders with "Failed to load server information." (expected, no API)
- Scenario 4 (Connect): PASS — Server address, copy button, username, Connect button visible
- Scenario 5 (Upload): PASS — File input ("Choose files") and Upload button visible
- Scenario 6 (AudioBot): PASS — 3 playback controls + volume + YouTube URL form + song list table
- Scenario 7 (Admin login form): PASS — "Sign in" heading, Username/Password fields, Login+Register buttons
- Scenario 8 (Login validation): PASS — "Username is required" + "Password is required" on empty submit
- Scenario 9 (Dark theme): PASS — oklch(0.145 0 0) background, zero white elements, no .dark class needed
- Scenario 10 (Console errors): PARTIAL — only ERR_CONNECTION_REFUSED (expected, no API) + pre-existing "Uncaught (in promise)" anti-pattern

### Integration Tests
- data-testid="audiobot-controls": present ✓
- data-testid="song-list": present ✓
- admin-layout hidden when unauthenticated (correct), shown when authenticated ✓

### Edge Cases Tested (3)
1. AudioBot invalid URL → shows "Invalid URL" error ✓
2. Login form empty submit → shows field-level validation errors ✓
3. Rapid navigation through all routes → no crashes, React Router stable ✓

### Pre-existing Issues Found (non-blocking)
- `Login.tsx` line 33: `getAppToken()` called directly in component body (side effect in render, React anti-pattern)
  - Causes "Uncaught (in promise)" when API unavailable (ERR_CONNECTION_REFUSED)
  - Pre-existing pattern, not introduced by shadcn migration
  - Fix: wrap in `useEffect(() => { getAppToken(); }, [])`
  - Severity: Minor / cosmetic — does not break UI

### Evidence
- Screenshots saved to .sisyphus/evidence/final-qa/ (01-home through 09-dark-theme)
