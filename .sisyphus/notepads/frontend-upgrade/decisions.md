# Decisions — frontend-upgrade

## Wave 1 Started: 2026-02-24
- Icons: lucide-react (replaces react-icons/fi)
- Dark mode: dark-only, :root CSS vars (no toggle, no .dark block)
- Forms: react-hook-form + zod
- Toasts: sonner (replaces react-hot-toast)
- Biome: double quotes, semicolons, 2-space indent, line width 120
- CI/CD: Biome in Azure Pipelines, Playwright local only
- Playwright: Chromium only, E2E only (no component testing)
