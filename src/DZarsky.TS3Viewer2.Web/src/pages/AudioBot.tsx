import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Pause, Play, Plus, Square, Youtube } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCurrentSong, usePauseSong, usePlaySong, useSetVolume, useStopSong, useVolume } from "@/hooks/useAudioBot";
import { useFiles } from "@/hooks/useFiles";
import { getAppToken } from "../helpers/TokenProvider";

const ytbSchema = z.object({
  url: z.string().url("Invalid URL"),
});

type YtbFormValues = z.infer<typeof ytbSchema>;

export const AudioBotPage = () => {
  getAppToken();

  const [filter, setFilter] = useState("");

  const { data: currentSong } = useCurrentSong();
  const { data: volumeData } = useVolume();
  const { data: files } = useFiles();

  const playSong = usePlaySong();
  const stopSong = useStopSong();
  const pauseSong = usePauseSong();
  const setVolumeMutation = useSetVolume();

  const currentVolume = volumeData?.volume ?? 0;

  const form = useForm<YtbFormValues>({
    resolver: zodResolver(ytbSchema),
    defaultValues: { url: "" },
  });

  const onSubmitYtb = (values: YtbFormValues) => {
    playSong.mutate(values.url);
    form.reset();
  };

  const filteredSongs = files?.filter((file) =>
    filter ? file.name?.toLowerCase().includes(filter.toLowerCase()) : true,
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Audiobot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold">
            {currentSong?.title ? `Currently playing: ${currentSong.title}` : "Currently not playing any song"}
          </p>

          <TooltipProvider>
            <div data-testid="audiobot-controls" className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => pauseSong.mutate()}
                    disabled={pauseSong.isPending}
                  >
                    {currentSong && !currentSong.paused ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{currentSong && !currentSong.paused ? "Pause" : "Play"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => stopSong.mutate()} disabled={stopSong.isPending}>
                    <Square className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-2 ml-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setVolumeMutation.mutate(currentVolume - 10)}
                      disabled={setVolumeMutation.isPending}
                    >
                      <Minus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Decrease volume by 10%</TooltipContent>
                </Tooltip>

                <span className="text-sm font-mono w-12 text-center">{currentVolume.toFixed(0)}</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setVolumeMutation.mutate(currentVolume + 10)}
                      disabled={setVolumeMutation.isPending}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Increase volume by 10%</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>

          <div className="space-y-2">
            <p className="text-sm font-medium">Play music from YouTube</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitYtb)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="https://www.youtube.com/watch?v=wjRWpwOTsUo"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={playSong.isPending}>
                  Play
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Filter songs</p>
            <Input placeholder="Search songs..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>

          <div data-testid="song-list">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Song name</TableHead>
                  <TableHead className="w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs?.map((file) => (
                  <TableRow key={file.fullName}>
                    <TableCell className="font-medium uppercase">{file.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => playSong.mutate(file.fullName ?? "")}
                        disabled={playSong.isPending}
                      >
                        <Play className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
