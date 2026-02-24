import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UserInfoDto } from "@/api";
import { Permission } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "@/hooks/useUsers";

const createSchema = z.object({
  login: z.string().min(1, "Login is required"),
  secret: z.string().min(1, "Password is required"),
  permissions: z.array(z.enum(Permission)).min(1, "At least one permission is required"),
});

const editSchema = z.object({
  permissions: z.array(z.enum(Permission)),
  isActive: z.boolean(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

export const UsersPage = () => {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [editUser, setEditUser] = useState<UserInfoDto | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { login: "", secret: "", permissions: [] },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { permissions: [], isActive: false },
  });

  const openEditDialog = (user: UserInfoDto) => {
    setEditUser(user);
    editForm.reset({
      permissions: user.roles?.map((r) => r.permission).filter((p): p is Permission => p !== undefined) ?? [],
      isActive: user.isActive ?? false,
    });
  };

  const openCreateDialog = () => {
    createForm.reset();
    setIsCreateOpen(true);
  };

  const onCreateSubmit = (values: CreateFormValues) => {
    createUser.mutate({ login: values.login, secret: values.secret, permissions: values.permissions });
    setIsCreateOpen(false);
  };

  const onEditSubmit = (values: EditFormValues) => {
    if (!editUser?.id) return;
    const updatedUser: UserInfoDto = {
      ...editUser,
      roles: values.permissions.map((p) => {
        const existing = editUser.roles?.find((r) => r.permission === p);
        return existing ?? { permission: p };
      }),
      isActive: values.isActive,
    };
    updateUser.mutate({ userId: editUser.id, data: updatedUser });
    setEditUser(null);
  };

  const onDeleteConfirm = () => {
    if (deleteUserId === null) return;
    deleteUser.mutate(deleteUserId);
    setDeleteUserId(null);
  };

  const deleteUserName = users?.find((u) => u.id === deleteUserId)?.login ?? "";

  return (
    <div className="md:w-3/4 w-full m-auto">
      <h2 className="text-2xl font-bold m-4">User administration</h2>
      <div className="m-4">
        <Button data-testid="add-user-btn" variant="outline" onClick={openCreateDialog} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add user
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center m-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div data-testid="users-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {user.roles?.map((role) => (
                        <li key={role.permission} className="flex items-center gap-1 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {role.permission}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteUserId(user.id ?? null)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-2">
                      {Object.values(Permission).map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <Checkbox
                            id={`create-${permission}`}
                            checked={field.value.includes(permission)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked ? [...field.value, permission] : field.value.filter((p) => p !== permission),
                              );
                            }}
                          />
                          <label htmlFor={`create-${permission}`} className="text-sm cursor-pointer">
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update user</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Login</Label>
            <Input value={editUser?.login ?? ""} disabled />
          </div>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <div className="space-y-2">
                      {Object.values(Permission).map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <Checkbox
                            id={`edit-${permission}`}
                            checked={field.value.includes(permission)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked ? [...field.value, permission] : field.value.filter((p) => p !== permission),
                              );
                            }}
                          />
                          <label htmlFor={`edit-${permission}`} className="text-sm cursor-pointer">
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Is active</FormLabel>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUser.isPending}>
                  {updateUser.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                  Update
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteUserId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteUserId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete user <span className="font-medium text-foreground">{deleteUserName}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={deleteUser.isPending}>
              {deleteUser.isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
