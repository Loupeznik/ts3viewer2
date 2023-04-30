import React from 'react';
import { FiChevronsUp, FiMessageSquare, FiMicOff, FiMinusCircle, FiMoon, FiPhoneOff, FiPlus, FiTrash, FiUser, FiVolumeX, FiZapOff } from 'react-icons/fi';
import { ClientDto, ClientType, ServerGroupDto } from '../api';
import { ServerGroup } from './ServerGroup';

type ClientListProps = {
    clients: ClientDto[],
    isAdmin?: boolean,
    serverGroups?: ServerGroupDto[],
    kickAction?: (client: ClientDto) => void,
    banAction?: (client: ClientDto) => void,
    messageAction?: (client: ClientDto) => void
    deleteServerGroupAction?: (serverGroupId: number, clientDatabaseId: number) => void,
    addServerGroupAction?: (client: ClientDto) => void
}

export const ClientList = ({ clients, isAdmin = false, serverGroups, kickAction, banAction,
    messageAction, deleteServerGroupAction, addServerGroupAction }: ClientListProps) => {
    const formattedList = clients.map(function (client) {
        if (client.type === ClientType.QUERY) {
            return null
        }

        const getClientIcon = () => {
            if (client.detail?.away) {
                return <FiMoon className="mr-1" title="Away" />
            }
            else if (client.detail?.outputMuted) {
                return <FiVolumeX className="mr-1" title="Sound muted" />
            }
            else if (client.detail?.inputMuted) {
                return <FiMicOff className="mr-1" title="Microphone muted" />
            }

            return <FiUser className="mr-1" />
        }

        if (!isAdmin) {
            return (
                <li key={client.id} className="ml-4" title={client.detail?.description ?? ""}>
                    {getClientIcon()}

                    {client.nickName}
                </li>
            )
        }

        return (
            <li key={client.id} className="bg-gray-900 p-1 mt-1 rounded font-semibold md:text-lg text-base">
                <div className="flex justify-between md:p-2 p-1 align-middle">
                    <div className="flex flex-row items-center">
                        <FiUser className="mr-1" />
                        {client.nickName}
                        <div className="mx-2 text-sm px-2 py-1 bg-gray-800 rounded-md flex flex-row items-center space-x-1">
                            <FiChevronsUp />
                            {serverGroups && client.detail?.serverGroupIds?.map(function (serverGroup) {
                                return (
                                    <ServerGroup key={serverGroup} serverGroup={serverGroups?.find(x => x.id === serverGroup)!} clientdDatabaseId={client.databaseId!}
                                        onDelete={deleteServerGroupAction!} />
                                )
                            })}
                            <div className="relative inline-flex items-center justify-center md:w-6 md:h-6 w-4 h-4 overflow-hidden rounded-full bg-gray-600 cursor-pointer 
                                hover:bg-blue-400" title="Assign server group">
                                <FiPlus className="font-bold md:text-md text-xs text-gray-300"
                                    onClick={() => addServerGroupAction != undefined ? addServerGroupAction(client) : null} />
                            </div>
                        </div>
                    </div>
                    <div className="md:text-xl text-md">
                        <FiTrash className="mr-2 hover:text-red-400 cursor-pointer" title="Kick client"
                            onClick={() => kickAction != undefined ? kickAction(client) : null} />
                        <FiMinusCircle className="mr-2 hover:text-red-400 cursor-pointer" title="Ban client"
                            onClick={() => banAction != undefined ? banAction(client) : null} />
                        <FiMessageSquare className="mr-2 hover:text-blue-400 cursor-pointer" title="Poke a the client"
                            onClick={() => messageAction != undefined ? messageAction(client) : null} />
                    </div>
                </div>
            </li>
        )
    });

    return (
        <ul>
            {formattedList}
        </ul>
    )
}
