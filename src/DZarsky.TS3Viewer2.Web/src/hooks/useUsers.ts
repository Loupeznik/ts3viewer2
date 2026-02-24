import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserDto, UserInfoDto } from "@/api";
import { UserService } from "@/api/services/UserService";
import { wrapCancelable } from "@/lib/api";
import { userKeys } from "@/lib/queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: ({ signal }) => wrapCancelable(() => UserService.getApiV1Users(), signal),
    staleTime: 300000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserDto) => UserService.postApiV1Users(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User created");
    },
    onError: () => toast.error("Failed to create user"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserInfoDto }) => UserService.putApiV1Users(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => UserService.deleteApiV1Users(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });
}
