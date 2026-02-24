import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChannelService } from "@/api/services/ChannelService";
import { wrapCancelable } from "@/lib/api";
import { serverKeys } from "@/lib/queryKeys";

export function useChannels() {
  return useQuery({
    queryKey: serverKeys.channels(),
    queryFn: ({ signal }) => wrapCancelable(() => ChannelService.getApiV1ServerChannels(), signal),
    staleTime: 300000,
  });
}

export function useSendChannelMessage() {
  return useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) =>
      ChannelService.postApiV1ServerChannelsMessage(id, { message }),
    onSuccess: () => toast.success("Message sent"),
    onError: () => toast.error("Failed to send message"),
  });
}
