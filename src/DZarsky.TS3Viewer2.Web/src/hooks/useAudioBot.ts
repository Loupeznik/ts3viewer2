import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AudioBotService } from "@/api/services/AudioBotService";
import { wrapCancelable } from "@/lib/api";
import { audioBotKeys } from "@/lib/queryKeys";

export function useCurrentSong() {
  return useQuery({
    queryKey: audioBotKeys.song(),
    queryFn: ({ signal }) => wrapCancelable(() => AudioBotService.getApiV1AudiobotSong(), signal),
    refetchInterval: 10000,
    staleTime: 9000,
  });
}

export function useVolume() {
  return useQuery({
    queryKey: audioBotKeys.volume(),
    queryFn: ({ signal }) => wrapCancelable(() => AudioBotService.getApiV1AudiobotVolume(), signal),
    refetchInterval: 10000,
    staleTime: 9000,
  });
}

export function usePlaySong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (link: string) => AudioBotService.postApiV1AudiobotSongPlay({ link }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audioBotKeys.song() });
      toast.success("Song playing");
    },
    onError: () => toast.error("Failed to play song"),
  });
}

export function useStopSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AudioBotService.putApiV1AudiobotSongStop(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audioBotKeys.song() });
      toast.success("Song stopped");
    },
    onError: () => toast.error("Failed to stop song"),
  });
}

export function usePauseSong() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AudioBotService.putApiV1AudiobotSongPause(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audioBotKeys.song() });
      toast.success("Song paused");
    },
    onError: () => toast.error("Failed to pause song"),
  });
}

export function useSetVolume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (volume: number) => AudioBotService.putApiV1AudiobotVolume({ volume }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audioBotKeys.volume() });
      toast.success("Volume updated");
    },
    onError: () => toast.error("Failed to update volume"),
  });
}
