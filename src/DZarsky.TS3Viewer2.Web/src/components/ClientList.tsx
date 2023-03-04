import React from 'react';
import { FiMicOff, FiUser } from 'react-icons/fi';
import { ClientDto, ClientType } from '../api';

type ClientListProps = {
    clients: ClientDto[],
}

export const ClientList = ({ clients }: ClientListProps) => {
    const formattedList = clients.map(function (client) {
        if (client.type === ClientType._1) {
            return null
        }

        return (
            <li key={client.id} className="ml-4" title={client.detail?.description ?? ""}>
                {client.detail?.inputMuted ? <FiMicOff className="mr-1" /> : <FiUser className="mr-1" />}
                
                {client.nickName}
            </li>
        )
    });

    return (
        <ul>
            {formattedList}
        </ul>
    )
}
