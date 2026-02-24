# Learnings — frontend-upgrade

## Project Context
- Working dir: src/DZarsky.TS3Viewer2.Web/
- Stack: React 19, Vite 6, Tailwind v4.2.0 (already on v4, no migration needed)
- OpenAPI client: src/api/ — auto-generated, Fetch-based (NOT Axios), uses CancelablePromise
- Dark mode: class-based currently, migrating to :root-only (dark values in :root, no .dark block)

## Key Technical Decisions
- shadcn/ui: "new-york" style, Neutral color, dark-only (:root IS dark, no .dark block)
- shadcn init: use `npx shadcn@latest` (NOT shadcn-ui@latest — deprecated)
- TW v4: uses `@import "tailwindcss"` + @tailwindcss/vite plugin (no tailwind.config.js)
- tw-animate-css: the correct TW v4 animate package (NOT tailwindcss-animate)
- TanStack Query: wrapCancelable bridge for CancelablePromise AbortSignal integration
- staleTime: set to 90% of refetchInterval to prevent double-fetches
- Biome: EXCLUDE src/api/ (has /* eslint-disable */ directives), build/, node_modules/
- @hookform/resolvers: must be v3.9+ for React 19 compat
- radix-ui: use unified package (NOT @radix-ui/react-* individual packages)

## Gotchas
- shadcn init WILL overwrite src/index.css — must re-add `svg { display: inline !important }` after
- After shadcn init: remove @custom-variant dark, remove .dark block, put dark values in :root
- App.tsx root div has `dark` class — remove it after Task 3 (CSS vars handle darkness)
- src/api/ has `/* eslint-disable */` directives — these are fine, Biome excludes this dir
- @types/node needed for path.resolve() in vite.config.ts
- Task 3 depends on Task 1 (path aliases needed first)
- Task 5 depends on Task 1 (path aliases needed for @/ imports)
- Task 7 depends on Task 4 (clean deps first to avoid conflicts)

## [Task 5] TanStack Query
- queryClient.ts: QueryCache with 401 handler (revokeToken + redirect to /admin)
- index.tsx: wrapped with QueryClientProvider + ReactQueryDevtools
- ReactQueryDevtools added with initialIsOpen={false}
- Build passes with zero errors
- Packages: @tanstack/react-query, @tanstack/react-query-devtools

## [Task 4] Dep cleanup
- Removed: @testing-library/*, @types/jest, axios, web-vitals
- Build: OK

## [Task 6] Playwright E2E Infrastructure
- **Config**: playwright.config.ts with webServer pointing to localhost:5173
- **Browser**: Chromium only (no Firefox/WebKit)
- **Smoke test**: e2e/specs/smoke.spec.ts — validates app loads and title matches /TS3Viewer/
- **Scripts**: test:e2e, test:e2e:ui, test:e2e:headed
- **Artifacts**: .gitignore updated for playwright-report/, test-results/, e2e/.auth/
- **Local-only**: Playwright NOT in CI/CD (Azure Pipelines) — development tool only
- **Directory structure**: e2e/specs/, e2e/pages/, e2e/fixtures/ created


## [Task 7] Form & Validation Dependencies
- **Installed**: react-hook-form@7.71.2, @hookform/resolvers@5.2.2, zod@4.3.6, sonner@2.0.7, lucide-react@0.575.0
- **@hookform/resolvers**: v5.2.2 (well above required v3.9+ for React 19 compat)
- **lucide-react**: already present from shadcn init (Task 3), verified in tree
- **zod**: v4.3.6 (latest, replaces validator in Wave 3)
- **sonner**: v2.0.7 (shadcn-compatible toast, replaces react-hot-toast in Wave 3)
- **Build**: passes with zero errors, chunk size warning only (expected)