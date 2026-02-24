import { Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { ChannelDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useChannels, useSendChannelMessage } from "@/hooks/useChannels";

export const ChannelsPage = () => {
  const { data: channels, isLoading } = useChannels();
  const sendMessage = useSendChannelMessage();
  const [selectedChannel, setSelectedChannel] = useState<ChannelDto | null>(null);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setSelectedChannel(null);
    setMessage("");
  };

  const handleSend = () => {
    if (!selectedChannel || selectedChannel.id === undefined || !message) return;
    sendMessage.mutate({ id: selectedChannel.id, message }, { onSuccess: handleClose });
  };

  return (
    <div className="md:w-1/2 w-full m-auto">
      <h2 className="text-2xl font-bold m-4">Channel administration</h2>
      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ul data-testid="channels-list">
              {channels?.map((channel) => (
                <li key={channel.id} className="bg-gray-900 p-1 mt-1 rounded font-semibold text-lg">
                  <div className="flex justify-between p-2 align-middle">
                    <div>{channel.name}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Send a message to the channel"
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedChannel} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send message to channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="channel-message">Message</Label>
            <Input
              id="channel-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={sendMessage.isPending}>
              {sendMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
