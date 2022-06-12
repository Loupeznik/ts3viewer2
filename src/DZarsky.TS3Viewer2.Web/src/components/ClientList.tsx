import React from 'react';
import { FiUser } from 'react-icons/fi';
import { ClientDto, ClientType } from '../api';

type ClientListProps = {
    clients: ClientDto[],
}

export const ClientList = ({clients}: ClientListProps) => {
    const formattedList = clients.map(function (client) {
        if (client.type === ClientType._1) {
            return null
        }

        return <li className="ml-4"><FiUser className="mr-1" />{client.nickName}</li>
    });

    return (
            <ul>
                { formattedList }
            </ul>
    )
}
