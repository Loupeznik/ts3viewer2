import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FileDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteFile, useFiles, useRenameFile } from "@/hooks/useFiles";

export const FilesPage = () => {
  const { data: files, isLoading } = useFiles();
  const deleteFile = useDeleteFile();
  const renameFile = useRenameFile();
  const [renameTarget, setRenameTarget] = useState<FileDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileDto | null>(null);
  const [newName, setNewName] = useState("");

  const handleRenameClose = () => {
    setRenameTarget(null);
    setNewName("");
  };

  const handleRename = () => {
    if (!renameTarget?.fullName || !newName) return;
    renameFile.mutate({ fullFileName: renameTarget.fullName, newFileName: newName }, { onSuccess: handleRenameClose });
  };

  const handleDelete = () => {
    if (!deleteTarget?.fullName) return;
    deleteFile.mutate(deleteTarget.fullName, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="md:w-3/4 w-full m-auto">
      <h2 className="text-2xl font-bold m-4">Files administration</h2>
      <div className="bg-gray-600 p-4 my-4 w-full md:w-1/2 mx-auto gap-4 justify-center rounded-lg">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div data-testid="files-table" className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Song name</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files?.map((file) => (
                  <TableRow key={file.fullName}>
                    <TableCell className="font-semibold uppercase">{file.fullName}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Rename file"
                        onClick={() => {
                          setRenameTarget(file);
                          setNewName(file.name ?? "");
                        }}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete file" onClick={() => setDeleteTarget(file)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && handleRenameClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set new file name for {renameTarget?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-name">New name</Label>
            <p className="text-sm text-gray-400">Set new file name (with suffix)</p>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleRenameClose}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={renameFile.isPending}>
              {renameFile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <span className="font-semibold">{deleteTarget?.fullName}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteFile.isPending}>
              {deleteFile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
