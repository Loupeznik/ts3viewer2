import React from 'react';
import { FiMessageCircle, FiMessageSquare, FiMicOff, FiMinusCircle, FiTrash, FiUser } from 'react-icons/fi';
import { ClientDto, ClientType } from '../api';

type ClientListProps = {
    clients: ClientDto[],
    isAdmin?: boolean,
    kickAction?: (client: ClientDto) => void,
    banAction?: (client: ClientDto) => void,
    messageAction?: (client: ClientDto) => void
}

export const ClientList = ({ clients, isAdmin = false, kickAction, banAction, messageAction }: ClientListProps) => {
    const formattedList = clients.map(function (client) {
        if (client.type === ClientType._1) {
            return null
        }

        if (!isAdmin) {
            return (
                <li key={client.id} className="ml-4" title={client.detail?.description ?? ""}>
                    {client.detail?.inputMuted ? <FiMicOff className="mr-1" /> : <FiUser className="mr-1" />}

                    {client.nickName}
                </li>
            )
        }

        return (
            <li key={client.id} className="bg-gray-900 p-1 mt-1 rounded font-semibold text-lg">
                <div className="flex justify-between p-2 align-middle">
                    <div>
                        <FiUser className="mr-1" />
                        {client.nickName}
                    </div>
                    <div className="text-xl">
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
