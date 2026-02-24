import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ServerService } from "@/api/services/ServerService";
import { wrapCancelable } from "@/lib/api";
import { serverKeys } from "@/lib/queryKeys";

export function useServerInfo() {
  return useQuery({
    queryKey: serverKeys.info(),
    queryFn: ({ signal }) => wrapCancelable(() => ServerService.getApiV1ServerInfo(), signal),
    refetchInterval: 60000,
    staleTime: 54000,
  });
}

export function useServerGroups() {
  return useQuery({
    queryKey: serverKeys.groups(),
    queryFn: ({ signal }) => wrapCancelable(() => ServerService.getApiV1ServerGroups(), signal),
    staleTime: 300000,
  });
}

export function useSendGlobalMessage() {
  return useMutation({
    mutationFn: (message: string) => ServerService.postApiV1ServerMessagesGlobal({ message }),
    onSuccess: () => toast.success("Message sent"),
    onError: () => toast.error("Failed to send message"),
  });
}
