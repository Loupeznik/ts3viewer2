import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientService } from "@/api/services/ClientService";
import { wrapCancelable } from "@/lib/api";
import { serverKeys } from "@/lib/queryKeys";

export function useClients(getDetail?: boolean) {
  return useQuery({
    queryKey: serverKeys.clients(getDetail),
    queryFn: ({ signal }) =>
      wrapCancelable(() => ClientService.getApiV1ServerClients(getDetail), signal),
    refetchInterval: 5000,
    staleTime: 4500,
  });
}

export function useKickClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ClientService.getApiV1ServerClientsKick(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.clients() });
      toast.success("Client kicked");
    },
    onError: () => toast.error("Failed to kick client"),
  });
}

export function useBanClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      duration,
      reason,
    }: {
      id: number;
      duration?: number;
      reason?: string;
    }) => ClientService.postApiV1ServerClientsBan(id, { duration, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.clients() });
      toast.success("Client banned");
    },
    onError: () => toast.error("Failed to ban client"),
  });
}

export function usePokeClient() {
  return useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) =>
      ClientService.postApiV1ServerClientsPoke(id, { message }),
    onSuccess: () => toast.success("Client poked"),
    onError: () => toast.error("Failed to poke client"),
  });
}

export function useAddClientPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      databaseId,
      serverGroupId,
    }: {
      databaseId: number;
      serverGroupId: number;
    }) => ClientService.postApiV1ServerClientsPermissions(databaseId, { serverGroupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.clients() });
      toast.success("Permission added");
    },
    onError: () => toast.error("Failed to add permission"),
  });
}

export function useRemoveClientPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      databaseId,
      serverGroupId,
    }: {
      databaseId: number;
      serverGroupId: number;
    }) => ClientService.deleteApiV1ServerClientsPermissions(databaseId, { serverGroupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serverKeys.clients() });
      toast.success("Permission removed");
    },
    onError: () => toast.error("Failed to remove permission"),
  });
}
