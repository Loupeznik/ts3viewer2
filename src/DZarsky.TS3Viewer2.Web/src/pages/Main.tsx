import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServerInfo } from "@/hooks/useServer";

export const MainPage = () => {
  const { data: server } = useServerInfo();

  const clientsOnline = server ? (server.clientsOnline as number) - (server.queriesOnline as number) : 0;
  const maxClients = server?.maxClients ?? 0;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Current server status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold">Currently connected users</span>
            </div>
            <div className="text-3xl font-bold">
              {clientsOnline}/{maxClients}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
