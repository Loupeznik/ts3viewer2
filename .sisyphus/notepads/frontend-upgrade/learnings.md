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
