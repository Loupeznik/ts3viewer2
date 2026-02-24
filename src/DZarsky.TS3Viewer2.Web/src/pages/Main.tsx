import React, { useEffect, useState } from 'react';
import { ServerInfoDto, ServerService } from '@/api';
import { getAppToken } from '@/helpers/TokenProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const MainPage = () => {
  getAppToken();
  const [server, setServer] = useState<ServerInfoDto>({});

  const getServerInfo = async () => {
    try {
      const info = await ServerService.getApiV1ServerInfo();
      setServer(info);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getServerInfo();
  }, []);

  function renderServerInfo(info: ServerInfoDto) {
    const clientsOnline = (info.clientsOnline as number) - (info.queriesOnline as number);
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-5 h-5" />
          <span className="text-sm font-semibold">Currently connected users</span>
        </div>
        <div className="text-3xl font-bold">
          {!clientsOnline ? '0' : clientsOnline}/{!info.maxClients ? '0' : info.maxClients}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Current server status</CardTitle>
        </CardHeader>
        <CardContent>
          {renderServerInfo(server)}
        </CardContent>
      </Card>
    </div>
  );
};
