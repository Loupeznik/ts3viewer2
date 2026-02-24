# Task 15: Upload Page Migration

## Completed
- Migrated Upload.tsx to use shadcn/ui components (Card, Button, Input)
- Replaced manual file upload logic with useUploadFile() TQ mutation hook
- Removed react-icons imports, using lucide-react (CheckCircle2, XCircle, Upload)
- Removed unused react-hot-toast import (sonner toast handled by useUploadFile hook)
- Improved UX: centered card layout, loading state on button, file input ref for programmatic click
- Fixed all biome linting issues (imports sorted, no unused params, proper formatting)
- Build passes with zero errors
- Committed: `refactor(web): migrate Upload page to shadcn`

## Key Changes
- Removed: FileService direct calls, manual error handling, empty useEffect
- Added: useUploadFile mutation, proper loading states, lucide icons
- Simplified: 122 lines → 98 lines, cleaner component structure
- Better UX: visual feedback with icons, centered card, disabled state during upload

## Evidence
- Build output: .sisyphus/evidence/task-15-upload-page.txt
