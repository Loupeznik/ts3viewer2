import {
  ChevronsUp,
  Loader2,
  MessageSquare,
  MicOff,
  MinusCircle,
  Moon,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
  VolumeX,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ClientDto } from "@/api/models/ClientDto";
import { ClientType } from "@/api/models/ClientType";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAddClientPermission,
  useBanClient,
  useClients,
  useKickClient,
  usePokeClient,
  useRemoveClientPermission,
} from "@/hooks/useClients";
import { useServerGroups } from "@/hooks/useServer";

export const ClientsPage = () => {
  const { data: clients, isLoading } = useClients(true);
  const { data: serverGroups } = useServerGroups();

  const kickClient = useKickClient();
  const banClient = useBanClient();
  const pokeClient = usePokeClient();
  const addPermission = useAddClientPermission();
  const removePermission = useRemoveClientPermission();

  const [pokeTarget, setPokeTarget] = useState<ClientDto | null>(null);
  const [pokeMessage, setPokeMessage] = useState("");
  const [addGroupTarget, setAddGroupTarget] = useState<ClientDto | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [removeGroupTarget, setRemoveGroupTarget] = useState<{
    databaseId: number;
    serverGroupId: number;
  } | null>(null);

  const fullClients = clients
    ?.filter((c) => c.type === ClientType.FULL_CLIENT)
    .sort((a, b) => (a.nickName ?? "").localeCompare(b.nickName ?? ""));

  const getClientIcon = (client: ClientDto) => {
    if (client.detail?.away) return <Moon className="h-4 w-4" />;
    if (client.detail?.outputMuted) return <VolumeX className="h-4 w-4" />;
    if (client.detail?.inputMuted) return <MicOff className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const handlePoke = () => {
    if (!pokeTarget?.id || !pokeMessage.trim()) return;
    pokeClient.mutate(
      { id: pokeTarget.id, message: pokeMessage },
      {
        onSuccess: () => {
          setPokeTarget(null);
          setPokeMessage("");
        },
      },
    );
  };

  const handleAddGroup = () => {
    if (!addGroupTarget?.databaseId || !selectedGroupId) return;
    addPermission.mutate(
      { databaseId: addGroupTarget.databaseId, serverGroupId: parseInt(selectedGroupId, 10) },
      {
        onSuccess: () => {
          setAddGroupTarget(null);
          setSelectedGroupId("");
        },
      },
    );
  };

  const handleRemoveGroup = () => {
    if (!removeGroupTarget) return;
    removePermission.mutate(removeGroupTarget, {
      onSuccess: () => setRemoveGroupTarget(null),
    });
  };

  return (
    <div className="md:w-1/2 w-full m-auto">
      <h2 className="text-2xl font-bold m-4">Client administration</h2>
      <p className="text-lg">Connected clients</p>

      {isLoading ? (
        <div className="m-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : !fullClients?.length ? (
        <div className="m-4">
          <p>No clients connected</p>
        </div>
      ) : (
        <div data-testid="clients-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {fullClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getClientIcon(client)}
                      <span className="font-semibold">{client.nickName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center flex-wrap gap-1">
                      <ChevronsUp className="h-4 w-4 text-muted-foreground" />
                      {client.detail?.serverGroupIds?.map((groupId) => {
                        const group = serverGroups?.find((g) => g.id === groupId);
                        if (!group) return null;
                        return (
                          <Badge key={groupId} variant="secondary" className="gap-1 pr-1">
                            {group.name}
                            {group.name !== "Guest" && (
                              <button
                                type="button"
                                className="ml-0.5 rounded-full hover:text-destructive"
                                title={`Remove from ${group.name}`}
                                onClick={() =>
                                  client.databaseId !== undefined &&
                                  setRemoveGroupTarget({
                                    databaseId: client.databaseId,
                                    serverGroupId: groupId,
                                  })
                                }
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-5 w-5"
                        title="Add to server group"
                        onClick={() => setAddGroupTarget(client)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => client.id !== undefined && kickClient.mutate(client.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Kick
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => client.id !== undefined && banClient.mutate({ id: client.id })}
                        >
                          <MinusCircle className="mr-2 h-4 w-4" />
                          Ban
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPokeTarget(client)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Poke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={pokeTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPokeTarget(null);
            setPokeMessage("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Poke client</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Send a message via a Poke</p>
          <Input placeholder="Message" value={pokeMessage} onChange={(e) => setPokeMessage(e.target.value)} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPokeTarget(null);
                setPokeMessage("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePoke} disabled={!pokeMessage.trim() || pokeClient.isPending}>
              {pokeClient.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addGroupTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAddGroupTarget(null);
            setSelectedGroupId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add server group</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Add client to server group</p>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {serverGroups?.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddGroupTarget(null);
                setSelectedGroupId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddGroup} disabled={!selectedGroupId || addPermission.isPending}>
              {addPermission.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeGroupTarget !== null} onOpenChange={(open) => !open && setRemoveGroupTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from group</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this client from the server group?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveGroupTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveGroup} disabled={removePermission.isPending}>
              {removePermission.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
