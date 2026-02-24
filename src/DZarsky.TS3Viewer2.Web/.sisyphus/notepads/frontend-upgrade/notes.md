
## Task 13 — Status page migration (Status.tsx)

- Replaced useState/useEffect/setInterval with useServerInfo(), useClients(true), useChannels() from TQ hooks
- Removed getAppToken() call — handled globally
- Replaced react-icons (FiServer, FiCornerDownRight) with lucide-react equivalents (Server, CornerDownRight)
- Replaced Loader with shadcn Skeleton (multiple skeleton rows during loading)
- Used shadcn Card/CardHeader/CardTitle/CardContent as container
- Added data-testid="server-name" on CardTitle, data-testid="client-list" on ul
- Used channel.id (not array index) as React key to satisfy biome's noArrayIndexKey rule
- Build passes, zero TS/lint errors

## Users admin page migration (task)

- `z.enum(Permission)` works with Zod v4 to validate TypeScript enum values — `z.nativeEnum` is deprecated in v4 but still works as an alias
- For checkbox groups with react-hook-form: use a single `FormField` with `name="permissions"`, access `field.value` (the array), and call `field.onChange(newArray)` directly — no need for nested FormField per checkbox
- Delete confirmation dialogs: use a `deleteUserId: number | null` state variable; Dialog `open={deleteUserId !== null}`, `onOpenChange={(open) => { if (!open) setDeleteUserId(null); }}`
- Edit dialog with react-hook-form: call `editForm.reset({...})` inside `openEditDialog()` to repopulate form with the selected user's data
- `UserTable.tsx`, `UserForm.tsx`, `PermissionSelect.tsx` deleted — all logic inlined into `Users.tsx`
- Input, Label, SubmitButton form components are still used by SelectPopup.tsx and TextFieldPopup.tsx — do NOT delete them
- `Permission` is exported as a regular value (not type) from `@/api` — import it as a value for runtime use
- `UserInfoDto` is exported as `export type` from `@/api` — use `import type { UserInfoDto }`
