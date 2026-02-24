import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Headphones } from 'lucide-react';
import { toast } from 'sonner';

export const ConnectPage = () => {
  const [username, setUsername] = useState('');
  const ts3Host = import.meta.env.VITE_TS3_HOST;

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    window.location.assign(`ts3server://${ts3Host}?nickname=${username}`);
  };

  const handleCopyHost = () => {
    navigator.clipboard.writeText(ts3Host);
    toast.success('Server address copied to clipboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Connect to the server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server">Server</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="server"
                  value={ts3Host}
                  disabled
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyHost}
                  title="Copy server address"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your username"
                value={username}
                onChange={onChangeInput}
              />
            </div>
            <Button type="submit" className="w-full">
              Connect
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
