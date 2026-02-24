import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileService } from "@/api/services/FileService";
import { wrapCancelable } from "@/lib/api";
import { fileKeys } from "@/lib/queryKeys";

export function useFiles() {
  return useQuery({
    queryKey: fileKeys.list(),
    queryFn: ({ signal }) => wrapCancelable(() => FileService.getApiV1Files(), signal),
    staleTime: 300000,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: Array<Blob>) => FileService.postApiV1Files({ files }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list() });
      toast.success("File uploaded");
    },
    onError: () => toast.error("Failed to upload file"),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fullFileName: string) => FileService.deleteApiV1Files(fullFileName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list() });
      toast.success("File deleted");
    },
    onError: () => toast.error("Failed to delete file"),
  });
}

export function useRenameFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fullFileName,
      newFileName,
    }: {
      fullFileName: string;
      newFileName: string;
    }) => FileService.putApiV1FilesRename(fullFileName, newFileName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list() });
      toast.success("File renamed");
    },
    onError: () => toast.error("Failed to rename file"),
  });
}
