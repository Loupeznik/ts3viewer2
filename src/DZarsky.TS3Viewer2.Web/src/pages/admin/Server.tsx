import { Circle, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSendGlobalMessage, useServerInfo } from "@/hooks/useServer";

type ServerPageProps = {
  showActions?: boolean;
};

export const ServerPage = ({ showActions = true }: ServerPageProps) => {
  const { data, isLoading } = useServerInfo();
  const sendGlobalMessage = useSendGlobalMessage();
  const [uptime, setUptime] = useState<string>();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data?.uptime) {
      setUptime(data.uptime);
    }
  }, [data]);

  useEffect(() => {
    if (uptime) {
      const timeParts = uptime.split(".");
      let days = 0;
      let time = uptime;

      if (timeParts.length === 2) {
        days = parseInt(timeParts[0], 10);
        time = timeParts[1];
      }

      let [hours, minutes, seconds] = time.split(":").map((part) => parseInt(part, 10));

      const interval = setInterval(() => {
        seconds++;

        if (seconds > 59) {
          seconds = 0;
          minutes++;
        }

        if (minutes > 59) {
          minutes = 0;
          hours++;
        }

        if (hours > 23) {
          hours = 0;
          days++;
        }

        let uptimeString = "";

        if (days > 0) {
          uptimeString += `${days}.`;
        }

        uptimeString += `${(`0${hours}`).slice(-2)}:${(`0${minutes}`).slice(-2)}:${(`0${seconds}`).slice(-2)}`;

        setUptime(uptimeString);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [uptime]);

  const handleMessageClose = () => {
    setIsMessageDialogOpen(false);
    setMessage("");
  };

  const handleSendMessage = () => {
    if (!message) return;
    sendGlobalMessage.mutate(message, { onSuccess: handleMessageClose });
  };

  return (
    <div className="md:w-1/2 m-auto">
      <h2 className="text-2xl font-bold m-4">Server administration</h2>
      <div className="bg-gray-600 p-4 md:my-4 w-full md:w-1/2 mx-auto gap-4 justify-center rounded-lg">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 p-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
        ) : (
          <Card data-testid="server-info" className="bg-gray-900 border-0">
            <CardContent className="flex flex-col items-center p-8 mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-semibold">{data?.name}</h2>
                <p className="text-gray-400">{data ? `Up ${uptime}` : "Down"}</p>
              </div>
              <Circle
                className={data?.status === "online" ? "w-32 h-32 p-6 text-green-400" : "w-32 h-32 p-6 text-red-400"}
              />
              {data && (
                <div className="mb-2 text-3xl font-semibold">
                  {data.clientsOnline} / {data.maxClients}
                  <span className="text-sm ml-2">({data.queriesOnline} query users)</span>
                </div>
              )}
              {showActions && (
                <div className="w-3/4">
                  <p className="text-gray-100 font-semibold">Available actions</p>
                  <div className="flex flex-row justify-between my-2 text-2xl">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Send global message"
                      onClick={() => setIsMessageDialogOpen(true)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={(open) => !open && handleMessageClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send global message</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="global-message">Message</Label>
            <Input
              id="global-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleMessageClose}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sendGlobalMessage.isPending}>
              {sendGlobalMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
