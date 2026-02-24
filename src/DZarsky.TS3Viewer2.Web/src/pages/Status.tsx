import { CornerDownRight, Server } from 'lucide-react';
import { ClientList } from '@/components/ClientList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useChannels } from '@/hooks/useChannels';
import { useClients } from '@/hooks/useClients';
import { useServerInfo } from '@/hooks/useServer';

export const StatusPage = () => {
  const { data: server, isLoading: serverLoading, isError: serverError } = useServerInfo();
  const { data: clients = [], isLoading: clientsLoading } = useClients(true);
  const { data: channels = [], isLoading: channelsLoading } = useChannels();

  const isLoading = serverLoading || clientsLoading || channelsLoading;

  if (isLoading) {
    return (
      <div className="p-4 w-full text-center">
        <h1 className="mb-4 text-3xl font-bold">Detailed status page</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="p-4 w-full text-center">
        <h1 className="mb-4 text-3xl font-bold">Detailed status page</h1>
        <p className="text-destructive">Failed to load server information.</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full text-center">
      <h1 className="mb-4 text-3xl font-bold">Detailed status page</h1>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl text-left">
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-lg"
              data-testid="server-name"
            >
              <Server className="h-5 w-5" />
              {server?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul data-testid="client-list">
              {channels.map((channel) => (
                <li key={channel.id} className="border-b py-2 last:border-b-0">
                  <ul>
                    <li className="ml-2 font-semibold flex items-center gap-1">
                      <CornerDownRight className="h-4 w-4 shrink-0" />
                      {channel.name}
                    </li>
                    <ul className="ml-2">
                      <ClientList
                        clients={clients.filter((c) => c.channelId === channel.id)}
                      />
                    </ul>
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
