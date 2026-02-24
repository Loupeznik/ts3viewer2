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

## Task 10 — TanStack Query Hooks
- Service method signatures differ significantly from the task template description
- ClientService: all methods use separate positional params (id, requestBody) not object destructuring
- BanClientDto uses `duration`/`reason` fields, NOT `banTime`
- UpdateClientServerGroupDto uses `serverGroupId` not `groupId`
- ChannelService.postApiV1ServerChannelsMessage takes (id, requestBody) separately
- UserService.putApiV1Users(userId, requestBody) and deleteApiV1Users(userId: number) — numeric ID, not string login
- FileService.postApiV1Files takes `{ files: Array<Blob> }` not `{ file, fileName }`
- FileService.deleteApiV1Files(fullFileName: string) — direct string param
- AudioBotService.postApiV1AudiobotSongPlay takes SongDto with `link` field (not `url`)
- AudioBotService.putApiV1AudiobotVolume takes VolumeDto `{ volume }` — matches expected
- `@/api/models` has no index.ts — use `@/api` for model type imports
## Task 11 - Migrate shared components to shadcn

### Components migrated
- `Loader.tsx`: SVG spinner → `Loader2` from lucide-react with `animate-spin`
- `NavLink.tsx`: Custom Link → shadcn `Button variant="ghost"` with `asChild` + React Router `Link`
- `Navbar.tsx`: Inline SVG menu/close → lucide `Menu`/`X` icons; dark bg-gray-900 styling
- `AdminSideNav.tsx`: All react-icons/fi → lucide equivalents; shadcn `Button variant="ghost"` for nav items; shadcn `Separator` between sections
- `Login.tsx`: react-hot-toast → sonner; custom form → react-hook-form + zod + shadcn Card/Form/Input/Button; UserForm modal → shadcn Dialog with inline registration form

### Key decisions
- Navbar.tsx had NO react-icons imports (used inline SVGs) — only the mobile menu SVGs needed replacing
- Login.tsx registration modal: replaced UserForm dependency with inline shadcn Dialog form (cleaner, no nested modal conflict)
- AdminSideNav uses `asChild` on Button to render as `<Link>` while keeping shadcn styling
- Dark theme: used `bg-gray-900`/`bg-gray-800`/`bg-gray-700` for dark-first consistency

### Build result: ✓ zero errors (4.00s)

## Task 12 - Migrate Main and Connect pages to shadcn

### Main.tsx
- **Before**: useState + useEffect for server info, inline Tailwind classes, no icons
- **After**: 
  - Kept useState/useEffect (static page, no TQ needed per task spec)
  - Replaced custom div styling with shadcn `Card` + `CardHeader` + `CardContent`
  - Added `Users` icon from lucide-react for visual enhancement
  - Centered layout with `flex items-center justify-center min-h-screen`
  - Cleaner typography using Card components

### Connect.tsx
- **Before**: Custom form with Input/Label/SubmitButton components, no icons, no copy functionality
- **After**:
  - Replaced custom Input/Label/SubmitButton with shadcn equivalents
  - Added `Headphones` icon in header for visual context
  - Added `Copy` icon button to copy server address to clipboard
  - Integrated sonner `toast()` for copy feedback
  - Fixed state type: `useState<string>('')` instead of `useState({})`
  - Improved form layout with `space-y-4` and proper spacing
  - Added placeholder text to username input

### Key changes
- Zero react-icons imports (used lucide-react instead)
- Both pages now use shadcn Card-based layout
- Improved UX with copy-to-clipboard and toast notifications
- Build: ✓ zero errors (4.28s)
- Commit: `refactor(web): migrate Main and Connect pages to shadcn`

## Task 14 - Migrate AudioBot page to shadcn + TanStack Query

### Changes
- Removed all useState/useEffect/setInterval for data fetching
- TQ hooks: useCurrentSong(), useVolume(), useFiles(), usePlaySong(), useStopSong(), usePauseSong(), useSetVolume()
- zod validation: `z.string().url("Invalid URL")` replaces validator.isURL
- react-hook-form + zodResolver for YouTube URL form
- shadcn: Card, Table, Button, Input, Form, Tooltip, TooltipProvider
- lucide-react: Play, Pause, Square, Plus, Minus, Youtube (all available in v0.575.0)
- data-testid: audiobot-controls (controls div), song-list (table wrapper)
- key={file.fullName} replaces index key (avoids biome noArrayIndexKey lint error)

### Gotchas
- biome auto-collapses multi-line imports and simple JSX expressions to single lines — run `npx biome check --write` after manual edits to fix formatting
- After edit tool runs, re-read file and run biome check before assuming clean
- The `noArrayIndexKey` biome rule fires on `.map((file, index) => ...)` even when `key` uses `file.fullName` — must remove the `index` param entirely from the map callback
- Build: ✓ zero errors (3.79s)


## Task 16 — Admin layout migration
- Admin.tsx: replaced bg-gray-800/bg-gray-700/text-white with bg-background/Card/text-foreground
- Used shadcn Card + CardContent for the content area instead of raw div
- Added data-testid="admin-layout" to outer container
- Removed unused React/useEffect imports; split type-only imports with `import type`
- No react-icons usage was present in original; authentication logic unchanged
- Build: zero errors (chunk size warning only, pre-existing)
## Task 17 — Migrate Clients admin page to shadcn + TanStack Query

### Changes
- Replaced useState/useEffect/setInterval for data fetching with useClients(true) (5s refetchInterval built-in)
- Replaced localStorage server groups cache with useServerGroups() (5min staleTime)
- Removed react-hot-toast (Toaster) — mutations use sonner internally
- Replaced all react-icons/fi with lucide-react equivalents
- ClientList, SelectPopup, TextFieldPopup, ServerGroup logic inlined directly into Clients.tsx
- SelectPopup.tsx deleted (was only used by Clients.tsx)
- ClientList.tsx, TextFieldPopup.tsx, ServerGroup.tsx kept — still used by Status.tsx, Server.tsx, Channels.tsx
- shadcn: Table (with data-testid="clients-table"), DropdownMenu for kick/ban/poke actions, three Dialogs (poke, add-group, confirm-remove)
- window.confirm() replaced with shadcn Dialog confirmation for group removal
- data-testid="clients-table" on table wrapper div

### Gotchas
- Lucide icons do NOT accept `title` prop — TypeScript TS2322 error; remove title from icon JSX
- ClientList.tsx and TextFieldPopup.tsx cannot be deleted yet — still imported by non-migrated pages (Status.tsx, Server.tsx, Channels.tsx); ONLY delete when those pages are also migrated
- The noArrayIndexKey biome rule: using key={client.id} and key={groupId} (numeric IDs) is fine; the rule only fires when using the array index variable
- Build: ✓ zero errors (3.92s)

## Task 17 — Migrate Channels, Files, Server admin pages to shadcn + TanStack Query

### Changes per file
- **Channels.tsx**: `useChannels()` + `useSendChannelMessage()`, shadcn Card/Dialog/Input, `MessageSquare` lucide icon, `data-testid="channels-list"` on `<ul>`
- **Files.tsx**: `useFiles()` + `useDeleteFile()` + `useRenameFile()`, shadcn Table/Dialog, `Pencil`/`Trash2` lucide icons, `data-testid="files-table"` on table wrapper div, delete uses a confirmation Dialog (no `window.confirm`)
- **Server.tsx**: `useServerInfo()` (polls at 60s via TQ) + `useSendGlobalMessage()`, shadcn Card/Dialog, `Circle`/`MessageSquare` lucide icons, `data-testid="server-info"` on Card
- **Main.tsx**: formatting + fragment cleanup only (logic unchanged)

### Key decisions
- `useSendGlobalMessage()` mutationFn takes `(message: string)` directly — NOT `({ message })`
- Delete confirmation uses shadcn Dialog (task MUST NOT: no `window.confirm`)
- Uptime timer in Server.tsx: two `useEffect` blocks preserved exactly; first syncs from `data?.uptime`, second ticks every second
- `parseInt` calls require radix 10 (`parseInt(x, 10)`) — biome `useParseIntRadix` rule
- `"0" + n` string padding triggers `useTemplate` — replaced with template literals: `` `0${n}` ``
- `noUselessFragments` info on Main.tsx fragment — applied `--unsafe` fix to remove it

### Build result: ✓ zero errors (3.67s)

## Task 20 — Remove legacy dependencies (Flowbite, react-icons, react-hot-toast, validator)

### Changes
- Removed `import 'flowbite'` from `src/index.tsx`
- Removed `svg { display: inline !important; vertical-align: middle; }` from `src/index.css`
- Deleted dead component files:
  - `src/components/ClientList.tsx`
  - `src/components/InfoPopup.tsx`
  - `src/components/ServerGroup.tsx`
  - `src/components/TextFieldPopup.tsx`
  - `src/components/forms/Input.tsx`
  - `src/components/forms/Label.tsx`
  - `src/components/forms/SubmitButton.tsx`
- Removed empty `src/components/forms/` directory
- Uninstalled packages: `flowbite`, `react-icons`, `react-hot-toast`, `validator`
- Migrated `Status.tsx` ClientList usage: inlined client rendering with lucide icons (Moon, VolumeOff, MicOff, User)

### Key decisions
- ClientList was only used by Status.tsx in a simple way (just filtering and rendering clients)
- Inlined the client list rendering directly into Status.tsx to avoid creating a new component
- Used lucide-react icons (Moon, VolumeOff, MicOff, User) instead of react-icons/fi equivalents
- Lucide icons do NOT accept `title` prop — removed from icon JSX, kept on `<li>` wrapper

### Build result: ✓ zero errors (3.50s)
### Verification: ✓ zero grep results for flowbite, react-icons, react-hot-toast, validator in src/
### Commit: `chore(web): remove Flowbite, react-icons, react-hot-toast, validator`
